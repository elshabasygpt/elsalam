import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const promotions = await prisma.promotion.findMany({
        where: { ends_at: { gte: new Date() } },
        include: {
            product: {
                select: { slug: true, name_ar: true, name_en: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
        data: promotions.map((p) => ({
            id: p.id,
            product_id: p.productId,
            title_ar: p.title_ar,
            title_en: p.title_en,
            description_ar: p.description_ar,
            description_en: p.description_en,
            discount_type: p.discount_type,
            discount_value: p.discount_value,
            original_price: p.original_price,
            promo_price: p.promo_price,
            badge_ar: p.badge_ar,
            badge_en: p.badge_en,
            featured_image: p.featured_image,
            starts_at: p.starts_at?.toISOString() ?? null,
            ends_at: p.ends_at.toISOString(),
            product: p.product,
        })),
    });
}
