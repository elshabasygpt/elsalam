import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const role = session.user.role;
        if (role !== "ADMIN" && role !== "SALES_MANAGER" && role !== "SALES_REP") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const repId = session.user.id;

        // Perform efficient database aggregations instead of fetching all records
        const [
            totalClients,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            recentOrders
        ] = await Promise.all([
            prisma.client.count({ where: { repId } }),
            prisma.clientOrder.count({ where: { repId } }),
            prisma.clientOrder.count({ 
                where: { 
                    repId, 
                    status: { in: ["NEW", "REVIEW", "APPROVED"] } 
                } 
            }),
            prisma.clientOrder.count({ 
                where: { 
                    repId, 
                    status: "DELIVERED" 
                } 
            }),
            prisma.clientOrder.findMany({
                where: { repId },
                take: 4,
                orderBy: { createdAt: "desc" },
                include: { client: { select: { name: true } } }
            })
        ]);

        return NextResponse.json({
            stats: {
                clients: totalClients,
                orders: totalOrders,
                pending: pendingOrders,
                delivered: deliveredOrders
            },
            recent: recentOrders
        });
    } catch (e: any) {
        return handleApiError(e, "Failed to load dashboard data");
    }
}
