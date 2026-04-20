import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SALES_MANAGER") {
        return NextResponse.json({ error: "Forbidden. Only managers can update order status." }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        
        const { status, rejectionReason, notes } = body;
        
        // Ensure order exists
        const order = await prisma.clientOrder.findUnique({ where: { id: parseInt(id) } });
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const updateData: any = {};
        if (status) updateData.status = status;
        if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
        if (notes !== undefined) updateData.notes = notes;

        const updatedOrder = await prisma.clientOrder.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json(updatedOrder);

    } catch (e: any) {
        return NextResponse.json({ error: "Failed to update order", details: e.message }, { status: 500 });
    }
}
