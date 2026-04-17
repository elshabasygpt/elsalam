import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            where: { is_published: true, is_featured: true },
            orderBy: [
                { published_at: "desc" },
                { createdAt: "desc" }
            ],
            take: 6,
        });

        return NextResponse.json({
            data: news.map((n) => ({
                id: n.id,
                slug: n.slug,
                title_ar: n.title_ar,
                title_en: n.title_en,
                excerpt_ar: n.excerpt_ar,
                excerpt_en: n.excerpt_en,
                featured_image: n.featured_image,
                category: n.category,
                is_featured: n.is_featured,
                published_at: n.published_at?.toISOString() ?? null,
                media_type: "image",
                reading_time: null,
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
