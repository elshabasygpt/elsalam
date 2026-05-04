import { quotationRepository } from "./quotation.repository";
import { QuotationStatus, QuotationResponse } from "./types";
import { QuotationMapper } from "./quotation.dto";
import { NotFoundError } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma";

export class QuotationService {
    async updateStatus(id: number, status: QuotationStatus): Promise<QuotationResponse> {
        // Wrap in transaction for enterprise atomicity (even if simple here, pattern scales)
        const updatedQuote = await prisma.$transaction(async (tx) => {
            const quotation = await quotationRepository.findQuotationById(id);
            
            if (!quotation) {
                throw new NotFoundError(`Quotation with ID ${id} not found.`);
            }

            return await quotationRepository.updateQuotationStatusTx(tx, id, status);
        });

        // Outside transaction to prevent blocking DB connections on slow 3rd party calls
        await this.sendNotificationAsync(updatedQuote.id, updatedQuote.status, updatedQuote.customerEmail);

        return QuotationMapper.toResponseDTO(updatedQuote);
    }

    private async sendNotificationAsync(id: number, status: string, email: string | null) {
        // Mocking an async notification like Email/SMS
        console.log(`[NOTIFICATION] Quotation #${id} status updated to: ${status}. Sent to ${email || 'Admin'}.`);
    }
}

export const quotationService = new QuotationService();
