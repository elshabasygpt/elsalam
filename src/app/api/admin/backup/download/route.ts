import { NextRequest, NextResponse } from "next/server";
import { backupService } from "@/lib/backup/backup.service";
import fs from "fs";
import { Readable } from "stream";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { lockManager } from "@/lib/reliability/distributed-lock";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // CRITICAL FIX 1: Lock the ENTIRE operation (creation + download)
    // If we release the lock before download finishes, multiple admins can exhaust Server Disk Space.
    const lockToken = await lockManager.acquire("global_backup_operation", 600); // 10 minutes lock
    
    if (!lockToken) {
        return NextResponse.json({ 
            error: "A system backup is currently in progress. Please try again later." 
        }, { status: 429 });
    }

    let zipPath: string | null = null;

    try {
        zipPath = await backupService.createBackup();

        if (!fs.existsSync(zipPath)) {
            await lockManager.release("global_backup_operation", lockToken);
            return NextResponse.json({ error: "Backup file not found" }, { status: 404 });
        }

        const stat = fs.statSync(zipPath);
        const fileName = zipPath.split("/").pop() || "backup.zip";

        const fileStream = fs.createReadStream(zipPath);

        // CRITICAL FIX 2: Bulletproof, re-entrant cleanup logic
        let isCleanedUp = false;
        const cleanup = () => {
            if (isCleanedUp) return;
            isCleanedUp = true;
            
            try {
                // Destroy stream safely to release File Descriptor immediately
                if (!fileStream.destroyed) fileStream.destroy(); 
                
                // Use unlinkSync for single files (safer than rmSync against EBUSY OS errors)
                if (zipPath && fs.existsSync(zipPath)) {
                    fs.unlinkSync(zipPath); 
                }
            } catch (e) {
                // Silent catch: throwing in async event listeners crashes the entire Node process
            } finally {
                // Fire and forget Redis lock release
                lockManager.release("global_backup_operation", lockToken).catch(() => {});
            }
        };

        // Bind cleanup to all possible stream termination scenarios
        fileStream.on("close", cleanup);
        fileStream.on("error", cleanup);
        req.signal.addEventListener("abort", cleanup);

        // @ts-ignore
        const webStream = Readable.toWeb(fileStream);

        return new NextResponse(webStream as any, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Length": stat.size.toString(),
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch (error: any) {
        await lockManager.release("global_backup_operation", lockToken);
        if (zipPath && fs.existsSync(zipPath)) {
            try { fs.unlinkSync(zipPath); } catch (e) { /* ignore */ }
        }
        return NextResponse.json({ error: "Failed to generate backup stream" }, { status: 500 });
    }
}
