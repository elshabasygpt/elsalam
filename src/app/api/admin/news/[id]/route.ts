import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const newsId = parseInt(id);
    if (isNaN(newsId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    try {
        const body = await req.json();

        if (body.slug) {
            const existing = await prisma.news.findFirst({
                where: { slug: body.slug, NOT: { id: newsId } },
            });
            if (existing) {
                return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل" }, { status: 400 });
            }
        }

        const currentNews = await prisma.news.findUnique({ where: { id: newsId } });
        let published_at = currentNews?.published_at;
        if (body.is_published && !currentNews?.is_published) {
            published_at = new Date();
        } else if (!body.is_published) {
            published_at = null;
        }

        const news = await prisma.news.update({
            where: { id: newsId },
            data: {
                slug: body.slug,
                title_ar: body.title_ar,
                title_en: body.title_en,
                excerpt_ar: body.excerpt_ar || null,
                excerpt_en: body.excerpt_en || null,
                content_ar: body.content_ar || null,
                content_en: body.content_en || null,
                category: body.category || "news",
                tags: body.tags || null,
                featured_image: body.featured_image || null,
                image_alt: body.image_alt || null,
                meta_title: body.meta_title || null,
                meta_description: body.meta_description || null,
                is_featured: body.is_featured || false,
                is_published: body.is_published || false,
                published_at,
                scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null,
            },
        });
        return NextResponse.json(news);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const newsId = parseInt(id);
    if (isNaN(newsId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    try {
        await prisma.news.delete({ where: { id: newsId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
