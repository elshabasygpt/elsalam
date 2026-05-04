import { NextRequest, NextResponse } from "next/server";
import { restoreService } from "@/lib/backup/restore.service";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("backup") as File;
        const confirm = formData.get("confirm") as string;

        if (!file || confirm !== "true") {
            return NextResponse.json({ error: "File and confirmation are required." }, { status: 400 });
        }

        const tempPath = path.join("/tmp", `upload_${Date.now()}.zip`);
        
        // CRITICAL FIX: Handle Backpressure. Using pipe instead of manual chunks prevents OOM.
        const writeStream = fs.createWriteStream(tempPath);
        // @ts-ignore
        const readable = require("stream").Readable.fromWeb(file.stream());
        
        await new Promise((resolve, reject) => {
            readable.pipe(writeStream)
                .on("finish", resolve)
                .on("error", reject);
        });

        const success = await restoreService.restoreBackup(tempPath);

        return NextResponse.json({ success }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
