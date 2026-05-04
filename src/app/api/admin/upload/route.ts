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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Security: Validate Magic Bytes to ensure real file type
        const header = buffer.toString("hex", 0, 4).toUpperCase();
        const isJPEG = header.startsWith("FFD8FF");
        const isPNG = header.startsWith("89504E47");
        const isGIF = header.startsWith("47494638");
        const isPDF = header.startsWith("25504446");
        const isWEBP = buffer.toString("hex", 8, 12).toUpperCase() === "57454250"; // WEBP
        const isSVG = buffer.toString("utf8", 0, 100).includes("<svg");

        if (!isJPEG && !isPNG && !isGIF && !isPDF && !isWEBP && !isSVG) {
            return NextResponse.json(
                { error: "محتوى الملف غير صالح. يرجى رفع ملفات صحيحة فقط." },
                { status: 400 }
            );
        }

        if (isSVG) {
            const svgContent = buffer.toString("utf8").toLowerCase();
            const xssPatterns = [/<script/i, /javascript:/i, /on[a-z]+\s*=/i, /<iframe/i, /<object/i, /<embed/i];
            const hasXss = xssPatterns.some(pattern => pattern.test(svgContent));
            if (hasXss) {
                return NextResponse.json(
                    { error: "محتوى الملف غير صالح. يحتوي الـ SVG على أكواد ضارة." },
                    { status: 400 }
                );
            }
        }

        // ✅ SECURITY: Enforce extension based on verified Magic Bytes, ignore user input
        let ext = "bin";
        if (isJPEG) ext = "jpg";
        else if (isPNG) ext = "png";
        else if (isGIF) ext = "gif";
        else if (isPDF) ext = "pdf";
        else if (isWEBP) ext = "webp";
        else if (isSVG) ext = "svg";

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `upload_${timestamp}_${randomStr}.${ext}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Write file
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
