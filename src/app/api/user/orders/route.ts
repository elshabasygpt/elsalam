import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.webOrder.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name_ar: true,
                                name_en: true,
                                featured_image: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, data: orders });

    } catch (error) {
        console.error("[USER_ORDERS_GET]", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
