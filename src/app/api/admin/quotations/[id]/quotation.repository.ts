import { prisma } from "@/lib/prisma";
import { QuotationStatus } from "./types";
import { WebOrder, Prisma } from "@prisma/client";

export class QuotationRepository {
    // Reusable selection to ensure DTO mapper always gets what it needs
    private readonly quotationSelect = {
        id: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        status: true,
        createdAt: true,
    } satisfies Prisma.WebOrderSelect;

    async findQuotationById(id: number) {
        return await prisma.webOrder.findFirst({
            where: { id, isQuotation: true },
            select: this.quotationSelect
        });
    }

    async updateQuotationStatusTx(tx: Prisma.TransactionClient, id: number, status: QuotationStatus) {
        return await tx.webOrder.update({
            where: { id },
            data: { status },
            select: this.quotationSelect
        });
    }
}

export const quotationRepository = new QuotationRepository();
