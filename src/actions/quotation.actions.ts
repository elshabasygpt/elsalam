"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Converts a user's active Cart into a formal B2B Request for Quotation (RFQ).
 * Empties the cart safely using a Prisma Transaction.
 */
export async function submitCartAsQuotation(clientNotes?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { email: session.user.email as string },
                include: { cart: { include: { items: { include: { product: true } } } } } as any // Temporary cast until Prisma generates
            });

            if (!user) throw new Error("User not found");
            
            const cart = (user as any).cart;
            if (!cart || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            // Calculate initial total amount from cart based on base prices
            const totalAmount = cart.items.reduce((sum: number, item: any) => {
                // In a real system, you might fetch specific variant prices here. 
                // For simplicity, we fallback to product base price.
                return sum + ((item.product.price || 0) * item.quantity);
            }, 0);

            // 1. Create Quotation and its Items
            const quotation = await (tx as any).quotation.create({
                data: {
                    userId: user.id,
                    status: "PENDING",
                    totalAmount,
                    clientNotes,
                    items: {
                        create: cart.items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price || 0, // Snapshot current price
                            weightVariant: item.weightVariant
                        }))
                    }
                }
            });

            // 2. Clear the user's cart safely
            await (tx as any).cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return { success: true, quotationId: quotation.id };
        });
    } catch (error: any) {
        console.error("[SUBMIT_QUOTATION_ERROR]", error);
        return { success: false, error: error.message || "Failed to submit quotation." };
    }
}

/**
 * ADMIN ONLY: Approves a quotation and applies a custom B2B discount.
 */
export async function approveQuotation(quotationId: string, discountAmount: number, adminNotes?: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        return await prisma.$transaction(async (tx) => {
            const quotation = await (tx as any).quotation.findUnique({
                where: { id: quotationId }
            });

            if (!quotation) throw new Error("Quotation not found");

            if (discountAmount < 0 || discountAmount > quotation.totalAmount) {
                throw new Error("Invalid discount amount. Must be between 0 and total amount.");
            }

            const updatedQuotation = await (tx as any).quotation.update({
                where: { id: quotationId },
                data: {
                    status: "APPROVED",
                    discountAmount,
                    adminNotes
                }
            });

            // SRE Note: In a production system, trigger an email/notification to the client here
            // e.g., await sendQuotationApprovedEmail(quotation.userId, quotation.id);
            
            return { success: true, quotation: updatedQuotation };
        });
    } catch (error: any) {
        console.error("[APPROVE_QUOTATION_ERROR]", error);
        return { success: false, error: error.message || "Failed to approve quotation." };
    }
}

/**
 * ADMIN ONLY: Rejects a quotation with notes.
 */
export async function rejectQuotation(quotationId: string, adminNotes: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const updatedQuotation = await (prisma as any).quotation.update({
            where: { id: quotationId },
            data: {
                status: "REJECTED",
                adminNotes
            }
        });
        
        return { success: true, quotation: updatedQuotation };
    } catch (error: any) {
        console.error("[REJECT_QUOTATION_ERROR]", error);
        return { success: false, error: "Failed to reject quotation." };
    }
}
