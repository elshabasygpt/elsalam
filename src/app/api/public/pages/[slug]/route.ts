import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint — read page CMS content by slug (no auth required)
export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const page = await prisma.pageContent.findUnique({
            where: { pageSlug: slug },
        });

        if (!page) {
            return NextResponse.json({ data: {} });
        }

        const content = JSON.parse(page.content || "{}");
        return NextResponse.json({ data: content });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
