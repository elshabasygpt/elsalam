import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const p = await params;
        const id = parseInt(p.id);
        const {
            title_ar, title_en, description_ar, description_en,
            discount_type, discount_value, original_price, promo_price,
            badge_ar, badge_en, featured_image, starts_at, ends_at, productId,
            isActive
        } = body;

        const updateData: any = {};
        if (title_ar !== undefined) updateData.title_ar = title_ar;
        if (title_en !== undefined) updateData.title_en = title_en;
        if (description_ar !== undefined) updateData.description_ar = description_ar;
        if (description_en !== undefined) updateData.description_en = description_en;
        if (discount_type !== undefined) updateData.discount_type = discount_type;
        if (discount_value !== undefined) updateData.discount_value = parseFloat(discount_value);
        if (original_price !== undefined) updateData.original_price = original_price ? parseFloat(original_price) : null;
        if (promo_price !== undefined) updateData.promo_price = promo_price ? parseFloat(promo_price) : null;
        if (badge_ar !== undefined) updateData.badge_ar = badge_ar;
        if (badge_en !== undefined) updateData.badge_en = badge_en;
        if (featured_image !== undefined) updateData.featured_image = featured_image;
        if (starts_at !== undefined) updateData.starts_at = starts_at ? new Date(starts_at) : null;
        if (ends_at !== undefined) updateData.ends_at = new Date(ends_at);
        if (productId !== undefined) updateData.productId = productId ? parseInt(productId) : null;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        const promotion = await prisma.promotion.update({
            where: { id },
            data: updateData,
        });
        return NextResponse.json(promotion);
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء تعديل العرض" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const p = await params;
        const id = parseInt(p.id);
        await prisma.promotion.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء حذف العرض" }, { status: 500 });
    }
}
