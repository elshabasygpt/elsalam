import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    // Rate limit: 10 promo checks per minute per IP (prevent brute force)
    const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    try {
        const body = await req.json();
        const { code, totalAmount } = body;

        if (!code) return NextResponse.json({ valid: false, message: "Code is required" }, { status: 400 });

        const promo = await prisma.promoCode.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!promo || !promo.isActive) {
            return NextResponse.json({ valid: false, message: "الكود غير صحيح أو غير مفعل" });
        }

        if (promo.expiresAt && new Date() > promo.expiresAt) {
            return NextResponse.json({ valid: false, message: "عذراً، هذا الكود منتهي الصلاحية" });
        }

        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return NextResponse.json({ valid: false, message: "عذراً، لقد تم تجاوز الحد الأقصى لاستخدام هذا الكود" });
        }

        if (promo.minOrderValue && totalAmount < promo.minOrderValue) {
            return NextResponse.json({ valid: false, message: `عذراً، هذا الكود متاح للطلبات التي تتجاوز ${promo.minOrderValue} ج.م` });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.type === "PERCENTAGE") {
            discountAmount = (totalAmount * promo.value) / 100;
        } else if (promo.type === "FIXED") {
            discountAmount = promo.value;
        }

        // Do not discount more than the order total!
        if (discountAmount > totalAmount) {
            discountAmount = totalAmount;
        }

        return NextResponse.json({
            valid: true,
            code: promo.code,
            type: promo.type,
            value: promo.value,
            discountAmount,
            message: "تم تفعيل الكود بنجاح!"
        });
    } catch (e: any) {
        return NextResponse.json({ valid: false, message: "حدث خطأ أثناء فحص الكود" }, { status: 500 });
    }
}
