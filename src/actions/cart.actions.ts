"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CartItem } from "@/lib/store/useCartStore";

export async function syncCartWithDb(localItems: CartItem[]): Promise<{ success: boolean; items?: CartItem[]; error?: string }> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return { success: false, error: "User not found" };

        let cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: { items: { include: { product: true } } }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id },
                include: { items: { include: { product: true } } }
            });
        }

        // Upsert all local items into the DB
        for (const localItem of localItems) {
            const variant = localItem.weightVariant || "";
            
            await prisma.cartItem.upsert({
                where: {
                    cartId_productId_weightVariant: {
                        cartId: cart.id,
                        productId: localItem.productId,
                        weightVariant: variant,
                    }
                },
                update: {
                    quantity: localItem.quantity,
                },
                create: {
                    cartId: cart.id,
                    productId: localItem.productId,
                    quantity: localItem.quantity,
                    weightVariant: variant,
                }
            });
        }

        // Fetch the fresh merged cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        const mergedItems: CartItem[] = updatedCart?.items.map((item: any) => ({
            id: `${item.productId}-${item.weightVariant}`,
            productId: item.productId,
            name_ar: item.product.name_ar,
            name_en: item.product.name_en,
            price: item.product.price || 0,
            quantity: item.quantity,
            image: item.product.featured_image || "/images/placeholder.jpg",
            slug: item.product.slug,
            weightVariant: item.weightVariant === "" ? undefined : item.weightVariant,
        })) || [];

        return { success: true, items: mergedItems };
    } catch (error: any) {
        console.error("[CART_SYNC_ERROR]", error);
        return { success: false, error: "Failed to sync cart with database." };
    }
}
