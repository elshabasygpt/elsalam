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

        const order = await prisma.clientOrder.findUnique({
            where: { id: parseInt(id) },
            include: { items: true }
        });
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const updatedOrder = await prisma.$transaction(async (tx) => {
            const updateData: any = {};
            if (status) updateData.status = status;
            if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
            if (notes !== undefined) updateData.notes = notes;

            // ✅ Deduct stock when B2B order moves to DELIVERING/DELIVERED
            const isShipping = (status === "DELIVERING" || status === "DELIVERED") &&
                order.status !== "DELIVERING" && order.status !== "DELIVERED";

            if (isShipping) {
                for (const item of order.items) {
                    const product = await tx.product.findUnique({ where: { id: item.productId } });
                    if (product && product.stock < item.quantity) {
                        throw new Error(`لا يوجد مخزون كافٍ لـ: ${product.name_ar}`);
                    }
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            // ✅ Restore stock & reduce outstanding balance if order is REJECTED/CANCELLED
            const isCancelling = (status === "REJECTED" || status === "CANCELLED") &&
                order.status !== "REJECTED" && order.status !== "CANCELLED";

            if (isCancelling) {
                // If stock was already deducted (was shipping), restore it
                if (order.status === "DELIVERING" || order.status === "DELIVERED") {
                    for (const item of order.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { increment: item.quantity } }
                        });
                    }
                }
                // Reduce outstanding balance since order is cancelled
                await tx.client.update({
                    where: { id: order.clientId },
                    data: { outstandingBalance: { decrement: order.totalAmount } }
                });
            }

            return tx.clientOrder.update({
                where: { id: parseInt(id) },
                data: updateData
            });
        });

        return NextResponse.json(updatedOrder);

    } catch (e: any) {
        return NextResponse.json({ error: "Failed to update order", details: e.message }, { status: 500 });
    }
}
