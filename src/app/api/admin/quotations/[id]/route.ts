import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
        return NextResponse.json({ error: "Invalid quotation ID" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { status } = body;

        const validStatuses = ["QUOTE_PENDING", "QUOTE_REVIEWED", "QUOTE_APPROVED", "QUOTE_REJECTED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const quotation = await prisma.webOrder.findFirst({
            where: { id: orderId, isQuotation: true }
        });

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

        const updatedQuote = await prisma.webOrder.update({
            where: { id: orderId },
            data: { status }
        });

        // 6. Send notification (Mock)
        console.log(`[NOTIFICATION] Quotation #${orderId} status updated to: ${status}. Notification sent to ${quotation.customerEmail || 'Customer'}.`);

        return NextResponse.json({ success: true, data: updatedQuote });
    } catch (error: any) {
        return handleApiError(error);
    }
}
