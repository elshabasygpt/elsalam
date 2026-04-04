import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 12;

    const where: any = { is_published: true };
    if (category && category !== "all") where.category = category;
    if (featured === "1") where.is_featured = true;

    const [news, total] = await Promise.all([
        prisma.news.findMany({
            where,
            orderBy: [{ is_featured: "desc" }, { published_at: "desc" }, { createdAt: "desc" }],
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.news.count({ where }),
    ]);

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
        meta: {
            current_page: page,
            last_page: Math.ceil(total / perPage),
            per_page: perPage,
            total,
        },
    });
}
