import { QuotationStatus, QuotationResponse } from "./types";
import { WebOrder } from "@prisma/client";

export class QuotationMapper {
    static toResponseDTO(order: Partial<WebOrder>): QuotationResponse {
        return {
            id: order.id!,
            customerName: order.customerName || "Unknown",
            customerEmail: order.customerEmail || null,
            totalAmount: order.totalAmount || 0,
            status: order.status as QuotationStatus,
            createdAt: order.createdAt || new Date(),
        };
    }
}
