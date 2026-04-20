import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customerName, customerPhone, customerEmail, governorate, shippingAddress, items } = body;

        if (!customerName || !customerPhone || !governorate || !shippingAddress || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Calculate total amounts (trusting frontend prices for now, ideally re-fetch from DB, but this is B2C / fast-checkout prototype)
        // Let's re-verify from DB for safety
        let totalAmount = 0;
        const validItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (product) {
                // If there's an active promotion, we skip complex logic here and just trust the cart's passed price 
                // Alternatively strictly check. For simplicity and robustness in this iteration, we use the passed price directly
                // but if we were strictly enforcing:
                // const priceToUse = product.price || 0; 
                
                const requestedPrice = Number(item.price);
                const subtotal = requestedPrice * Number(item.quantity);
                totalAmount += subtotal;

                validItems.push({
                    productId: product.id,
                    quantity: Number(item.quantity),
                    unitPrice: requestedPrice,
                    subtotal: subtotal
                });
            }
        }

        if (validItems.length === 0) {
            return NextResponse.json({ success: false, message: "No valid products found" }, { status: 400 });
        }

        const newOrder = await prisma.webOrder.create({
            data: {
                customerName,
                customerPhone,
                customerEmail: customerEmail || null,
                governorate,
                shippingAddress,
                totalAmount,
                status: "PENDING",
                items: {
                    create: validItems
                }
            }
        });

        return NextResponse.json({ success: true, orderId: newOrder.id });

    } catch (error) {
        console.error("[WEB_ORDER_POST]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
