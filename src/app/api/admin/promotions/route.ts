import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const promotions = await prisma.promotion.findMany({
        include: { product: { select: { id: true, name_ar: true, name_en: true } } },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(promotions);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const {
            title_ar, title_en, description_ar, description_en,
            discount_type, discount_value, original_price, promo_price,
            badge_ar, badge_en, featured_image, starts_at, ends_at, productId,
        } = body;

        if (!title_ar || !title_en || !discount_type || discount_value == null || !ends_at) {
            return NextResponse.json({ error: "يرجى ملء الحقول المطلوبة" }, { status: 400 });
        }

        const promotion = await prisma.promotion.create({
            data: {
                title_ar, title_en, description_ar, description_en,
                discount_type, discount_value: parseFloat(discount_value),
                original_price: original_price ? parseFloat(original_price) : null,
                promo_price: promo_price ? parseFloat(promo_price) : null,
                badge_ar, badge_en, featured_image,
                starts_at: starts_at ? new Date(starts_at) : null,
                ends_at: new Date(ends_at),
                productId: productId ? parseInt(productId) : null,
            },
        });
        return NextResponse.json(promotion, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء إنشاء العرض" }, { status: 500 });
    }
}
