import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const p = await params;
    const product = await prisma.product.findUnique({
        where: { slug: p.slug },
        include: {
            category: true,
            features: true,
            certifications: true,
            specs: true,
            technical_specs: true,
            images: true,
            packagings: true,
            promotions: {
                where: { ends_at: { gte: new Date() } },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
        data: {
            ...product,
            features_ar: product.features.map((f) => f.feature_ar),
            features_en: product.features.map((f) => f.feature_en),
            certifications: product.certifications.map((c) => c.name),
            active_promotion: product.promotions[0]
                ? {
                      id: product.promotions[0].id,
                      badge_ar: product.promotions[0].badge_ar,
                      badge_en: product.promotions[0].badge_en,
                      promo_price: product.promotions[0].promo_price,
                      original_price: product.promotions[0].original_price,
                      discount_type: product.promotions[0].discount_type,
                      discount_value: product.promotions[0].discount_value,
                      ends_at: product.promotions[0].ends_at.toISOString(),
                  }
                : null,
        },
    });
}
