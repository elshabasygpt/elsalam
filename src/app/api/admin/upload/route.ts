import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    // Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP, SVG, GIF, PDF" },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `upload_${timestamp}_${randomStr}.${ext}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({
            url,
            filename,
            size: file.size,
            type: file.type,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء رفع الملف" },
            { status: 500 }
        );
    }
}
