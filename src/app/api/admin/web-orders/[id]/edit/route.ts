import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { id } = await params;
        const orderId = parseInt(id);
        const body = await req.json();

        const {
            customerName,
            customerPhone,
            governorate,
            shippingAddress,
            shippingFee,
            discountAmount,
            notes,
            items
        } = body;

        // Basic validation
        if (!customerName || !customerPhone || !governorate || !shippingAddress || !items || !items.length) {
            return NextResponse.json({ success: false, error: "Missing required fields or items" }, { status: 400 });
        }

        // Calculate totals
        let itemsTotal = 0;
        const formattedItems = items.map((item: any) => {
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            const subtotal = quantity * price;
            itemsTotal += subtotal;
            return {
                productId: parseInt(item.productId),
                quantity,
                unitPrice: price,
                subtotal
            };
        });

        const parsedShippingFee = parseFloat(shippingFee) || 0;
        const parsedDiscountAmount = parseFloat(discountAmount) || 0;
        const finalTotalAmount = itemsTotal + parsedShippingFee - parsedDiscountAmount;

        // Transaction to update order and items safely
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // 1. Delete all existing items
            await tx.webOrderItem.deleteMany({
                where: { orderId }
            });

            // 2. Create new items
            await tx.webOrderItem.createMany({
                data: formattedItems.map((item: any) => ({
                    orderId,
                    ...item
                }))
            });

            // 3. Update main order
            return await tx.webOrder.update({
                where: { id: orderId },
                data: {
                    customerName,
                    customerPhone,
                    governorate,
                    shippingAddress,
                    shippingFee: parsedShippingFee,
                    discountAmount: parsedDiscountAmount,
                    totalAmount: finalTotalAmount,
                    notes: notes || null
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        });

        return NextResponse.json({ success: true, data: updatedOrder });

    } catch (error: any) {
        console.error("[WEB_ORDER_EDIT]", error);
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
    }
}
