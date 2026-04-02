import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT update page content
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;

    try {
        const body = await req.json();

        // Validate JSON content
        try {
            JSON.parse(body.content);
        } catch {
            return NextResponse.json({ error: "صيغة JSON غير صحيحة" }, { status: 400 });
        }

        const pageContent = await prisma.pageContent.upsert({
            where: { pageSlug: slug },
            update: { content: body.content },
            create: { pageSlug: slug, content: body.content },
        });

        return NextResponse.json({ data: pageContent });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
