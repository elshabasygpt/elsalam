import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/crm");
        
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        await fs.writeFile(path.join(uploadDir, filename), buffer);

        // Return the public URL
        return NextResponse.json({ url: `/uploads/crm/${filename}` });
    } catch (e: any) {
        return handleApiError(e, "File upload failed.");
    }
}
