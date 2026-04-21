import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 20;

    const where: any = {};
    if (category) where.category = { slug: category };
    if (featured === "1") where.is_featured = true;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: true,
                promotions: {
                    where: { ends_at: { gte: new Date() } },
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.product.count({ where }),
    ]);

    const data = products.map((p) => ({
        id: p.id,
        name_ar: p.name_ar,
        name_en: p.name_en,
        slug: p.slug,
        short_description_ar: p.short_description_ar,
        short_description_en: p.short_description_en,
        featured_image: p.featured_image,
        price: p.price,
        price_unit_ar: p.price_unit_ar,
        price_unit_en: p.price_unit_en,
        is_exportable: p.is_exportable,
        is_featured: p.is_featured,
        stock: p.stock,
        icon: p.icon,
        gradient_from: p.gradient_from,
        gradient_to: p.gradient_to,
        category: p.category,
        active_promotion: p.promotions[0]
            ? {
                  id: p.promotions[0].id,
                  badge_ar: p.promotions[0].badge_ar,
                  badge_en: p.promotions[0].badge_en,
                  promo_price: p.promotions[0].promo_price,
                  original_price: p.promotions[0].original_price,
                  discount_type: p.promotions[0].discount_type,
                  discount_value: p.promotions[0].discount_value,
                  ends_at: p.promotions[0].ends_at.toISOString(),
              }
            : null,
    }));

    return NextResponse.json({
        data,
        meta: {
            current_page: page,
            last_page: Math.ceil(total / perPage),
            total,
        },
    });
}
