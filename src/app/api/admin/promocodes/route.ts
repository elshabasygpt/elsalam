import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const codes = await prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(codes);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { code, type, value, minOrderValue, maxUses, expiresAt } = body;

        const promo = await prisma.promoCode.create({
            data: {
                code: code.toUpperCase(),
                type,
                value: Number(value),
                minOrderValue: minOrderValue ? Number(minOrderValue) : null,
                maxUses: maxUses ? Number(maxUses) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: true
            }
        });
        return NextResponse.json(promo);
    } catch (e: any) {
        if (e.code === 'P2002') return NextResponse.json({ error: "الكود موجود مسبقاً" }, { status: 400 });
        return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
    }
}
