import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const p = await params;
    const article = await prisma.news.findUnique({
        where: { slug: p.slug, is_published: true },
    });

    if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
        data: {
            ...article,
            published_at: article.published_at?.toISOString() ?? null,
            scheduled_at: article.scheduled_at?.toISOString() ?? null,
            media_type: "image",
            youtube_url: null,
            reading_time: null,
        },
    });
}
