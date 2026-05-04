import { handleApiError } from "@/lib/error-handler";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const id = parseInt((await params).id);
        const { status } = await req.json();

        if (isNaN(id) || !status) {
            return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        }

        // ✅ Restore or re-deduct stock based on status transition
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.webOrder.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!order) throw new Error("Order not found");

            const previousStatus = order.status;
            const isCancelling = status === "CANCELLED" && previousStatus !== "CANCELLED";
            const isUncancelling = previousStatus === "CANCELLED" && status !== "CANCELLED";

            // Restore stock if cancelling a non-cancelled order
            if (isCancelling) {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });
                }
            }

            // Re-deduct stock if reverting a cancellation
            if (isUncancelling) {
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

            return tx.webOrder.update({
                where: { id },
                data: { status }
            });
        });

        return NextResponse.json({ success: true, order: result });
    } catch (error: any) {
        console.error("[ADMIN_WEB_ORDERS_PUT]", error);
        return handleApiError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const id = parseInt((await params).id);

        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
        }

        // Restore stock before deleting the order
        await prisma.$transaction(async (tx) => {
            const order = await tx.webOrder.findUnique({
                where: { id },
                include: { items: true }
            });
            if (order && order.status !== "CANCELLED" && order.status !== "DELIVERED") {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } }
                    });
                }
            }
            await tx.webOrder.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN_WEB_ORDERS_DELETE]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
