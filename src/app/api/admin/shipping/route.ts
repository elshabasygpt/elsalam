import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const zones = await prisma.shippingZone.findMany({
            orderBy: { name_ar: 'asc' }
        });
        return NextResponse.json(zones);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to fetch shipping zones" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name_ar, name_en, fee, isActive } = body;

        const zone = await prisma.shippingZone.create({
            data: {
                name_ar,
                name_en,
                fee: Number(fee),
                isActive: isActive ?? true
            }
        });
        return NextResponse.json(zone);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to create shipping zone" }, { status: 500 });
    }
}
