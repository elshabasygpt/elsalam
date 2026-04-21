import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const zones = await prisma.shippingZone.findMany({
            where: { isActive: true },
            orderBy: { name_ar: 'asc' }
        });
        return NextResponse.json(zones);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to fetch shipping zones" }, { status: 500 });
    }
}
