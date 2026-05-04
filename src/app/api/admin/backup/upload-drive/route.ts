import { NextRequest, NextResponse } from "next/server";
import { backupService } from "@/lib/backup/backup.service";
import { googleDriveService } from "@/lib/backup/google-drive.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const zipPath = await backupService.createBackup();
        const fileName = zipPath.split("/").pop() || "backup.zip";
        
        const link = await googleDriveService.uploadBackup(zipPath, fileName);

        return NextResponse.json({ success: true, link }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
