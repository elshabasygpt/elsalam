"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Server Action to fetch deep quotation data (including products and variants)
 * specifically for generating the Proforma Invoice PDF.
 */
export async function fetchQuotationForPdf(quotationId: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
        return { success: false, error: "Unauthorized access" };
    }

    try {
        const quote = await (prisma as any).quotation.findUnique({
            where: { id: quotationId },
            include: {
                user: { select: { email: true, name: true, phone: true } },
                items: { 
                    include: { 
                        product: { select: { name_ar: true, name_en: true, sku: true } } 
                    } 
                }
            }
        });

        if (!quote) throw new Error("لم يتم العثور على عرض السعر المرجعي.");

        return { success: true, data: quote };
    } catch (error: any) {
        console.error("[PDF_FETCH_ERROR]", error);
        return { success: false, error: error.message || "فشل في جلب بيانات الفاتورة." };
    }
}
