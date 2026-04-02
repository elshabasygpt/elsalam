import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const news = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        if (!body.title_ar || !body.title_en || !body.slug) {
            return NextResponse.json({ error: "العنوان والرابط مطلوبان" }, { status: 400 });
        }

        const existing = await prisma.news.findUnique({ where: { slug: body.slug } });
        if (existing) {
            return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل" }, { status: 400 });
        }

        const news = await prisma.news.create({
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
                published_at: body.is_published ? new Date() : null,
                scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null,
            },
        });
        return NextResponse.json(news, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
