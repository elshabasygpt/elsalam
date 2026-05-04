import { handleApiError } from "@/lib/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { quotationService } from "./quotation.service";
import { QuotationStatus } from "./types";


// 1. Strict Zod Schemas map to Enums
const paramsSchema = z.object({
    id: z.coerce.number().int().positive()
});

const bodySchema = z.object({
    status: z.nativeEnum(QuotationStatus)
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Controller Validation
        const resolvedParams = await params;
        const { id: orderId } = paramsSchema.parse(resolvedParams);
        
        const body = await req.json();
        const { status } = bodySchema.parse(body);

        // 3. Delegation (Zero logic in Controller)
        const updatedQuoteDTO = await quotationService.updateStatus(orderId, status);

        // 4. Return Normalized DTO
        return NextResponse.json({ success: true, data: updatedQuoteDTO });
    } catch (error: any) {
        // 5. Global Exception Interceptor
        return handleApiError(error);
    }
}
