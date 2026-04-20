import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const orders = await prisma.webOrder.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name_ar: true,
                                name_en: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("[ADMIN_WEB_ORDERS_GET]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
