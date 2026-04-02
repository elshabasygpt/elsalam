import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const id = parseInt(params.id);
        const {
            title_ar, title_en, description_ar, description_en,
            discount_type, discount_value, original_price, promo_price,
            badge_ar, badge_en, featured_image, starts_at, ends_at, productId,
        } = body;

        const promotion = await prisma.promotion.update({
            where: { id },
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
        return NextResponse.json(promotion);
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء تعديل العرض" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const id = parseInt(params.id);
        await prisma.promotion.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء حذف العرض" }, { status: 500 });
    }
}
