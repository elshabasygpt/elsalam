import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    // Rate limit: 5 checkout attempts per minute per IP
    const limited = rateLimit(req, { limit: 5, windowMs: 60_000 });
    if (limited) return limited;

    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        const body = await req.json();
        const { customerName, customerPhone, customerEmail, governorate, city, shippingAddress, items } = body;

        if (!customerName || !customerPhone || !governorate || !shippingAddress || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Fetch valid shipping zone and fee directly from DB to prevent client spoofing
        const zone = await prisma.shippingZone.findFirst({
            where: {
                OR: [
                    { name_ar: governorate },
                    { name_en: governorate }
                ],
                isActive: true
            }
        });
        
        const secureShippingFee = zone ? zone.fee : 100; // Default fallback to 100 if zone not explicitly found

        const newOrder = await prisma.$transaction(async (tx) => {
            let totalAmount = secureShippingFee;
            const validItems = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: parseInt(item.productId) },
                    include: {
                        packagings: true,
                        promotions: {
                            where: { isActive: true, ends_at: { gte: new Date() } },
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                });

                if (!product) {
                    throw new Error(`Product not found`);
                }

                if (product.stock < Number(item.quantity)) {
                    throw new Error(`Out of stock: ${product.name_ar}`);
                }

                // ✅ SECURITY: Always use DB price — never trust client-supplied price
                let serverPrice: number;
                if (item.packagingId) {
                    const packaging = product.packagings.find(p => p.id === parseInt(item.packagingId));
                    serverPrice = packaging?.price ?? product.price ?? 0;
                } else {
                    // Use promo price if active, else base price
                    serverPrice = product.promotions[0]?.promo_price ?? product.price ?? 0;
                }

                // Deduct stock
                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: { decrement: Number(item.quantity) } }
                });

                const subtotal = serverPrice * Number(item.quantity);
                totalAmount += subtotal;

                validItems.push({
                    productId: product.id,
                    quantity: Number(item.quantity),
                    unitPrice: serverPrice,
                    subtotal: subtotal
                });
            }

            if (validItems.length === 0) {
                throw new Error("No valid products found");
            }
            
            // Subtotal for the products only
            const productsSubtotal = validItems.reduce((acc, item) => acc + item.subtotal, 0);

            // Re-validate Promo Code Security
            let appliedDiscount = 0;
            let usedPromo = null;

            if (body.promoCode) {
                const promo = await tx.promoCode.findUnique({ where: { code: body.promoCode.toUpperCase() } });
                if (promo && promo.isActive && (!promo.expiresAt || new Date() <= promo.expiresAt) && (!promo.maxUses || promo.usedCount < promo.maxUses) && (!promo.minOrderValue || productsSubtotal >= promo.minOrderValue)) {
                    if (promo.type === "PERCENTAGE") {
                        appliedDiscount = (productsSubtotal * promo.value) / 100;
                    } else if (promo.type === "FIXED") {
                        appliedDiscount = promo.value;
                    }
                    if (appliedDiscount > productsSubtotal) appliedDiscount = productsSubtotal;
                    
                    // Increment usage
                    await tx.promoCode.update({
                        where: { id: promo.id },
                        data: { usedCount: { increment: 1 } }
                    });
                    usedPromo = promo.code;
                }
            }

            // Secure Total = Products Subtotal - Discount + Shipping
            totalAmount = productsSubtotal - appliedDiscount + secureShippingFee;

            return await tx.webOrder.create({
                data: {
                    userId,
                    customerName,
                    customerPhone,
                    customerEmail: customerEmail || null,
                    governorate,
                    city: city || null,
                    shippingAddress,
                    shippingFee: secureShippingFee,
                    promoCode: usedPromo,
                    discountAmount: appliedDiscount,
                    totalAmount,
                    status: "PENDING",
                    items: {
                        create: validItems
                    }
                }
            });
        });

        return NextResponse.json({ success: true, orderId: newOrder.id });

    } catch (error: any) {
        console.error("[WEB_ORDER_POST]", error);
        if (error.message.includes('Out of stock') || error.message.includes('Product not found')) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
