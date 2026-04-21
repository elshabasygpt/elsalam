import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const zoneId = parseInt(id);

    try {
        const body = await req.json();
        const { name_ar, name_en, fee, isActive } = body;

        const zone = await prisma.shippingZone.update({
            where: { id: zoneId },
            data: {
                name_ar,
                name_en,
                fee: Number(fee),
                isActive
            }
        });
        return NextResponse.json(zone);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to update shipping zone" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    try {
        await prisma.shippingZone.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to delete shipping zone" }, { status: 500 });
    }
}
