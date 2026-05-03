import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
