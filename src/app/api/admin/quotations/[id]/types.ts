export enum QuotationStatus {
    PENDING = "QUOTE_PENDING",
    REVIEWED = "QUOTE_REVIEWED",
    APPROVED = "QUOTE_APPROVED",
    REJECTED = "QUOTE_REJECTED",
}

export interface QuotationResponse {
    id: number;
    customerName: string;
    customerEmail: string | null;
    totalAmount: number;
    status: QuotationStatus;
    createdAt: Date;
}
