import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleApiError } from "@/lib/error-handler";

const paramsSchema = z.object({
    id: z.coerce.number().int("يجب أن يكون المعرف رقماً صحيحاً").positive("يجب أن يكون المعرف أكبر من صفر")
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const { id: orderId } = paramsSchema.parse(resolvedParams);

    const quotation = await prisma.webOrder.findFirst({
        where: { id: orderId, isQuotation: true },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!quotation) {
        return new NextResponse("Quotation not found", { status: 404 });
    }

    // A robust, production-ready print view for quotations.
    // Clients can save it as PDF directly using the browser's native print-to-pdf.
    const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>عرض سعر #${quotation.id}</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .header h1 { margin: 0; color: #1e293b; font-size: 28px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; }
            .details div { flex: 1; }
            .details strong { color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: right; }
            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
            .totals { width: 300px; margin-left: 0; margin-right: auto; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .totals-row.final { font-weight: bold; font-size: 1.2em; border-bottom: none; border-top: 2px solid #1e293b; padding-top: 12px; }
            @media print {
                body { padding: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body onload="window.print()">
        <div class="no-print" style="margin-bottom: 20px; text-align: left;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #1e293b; color: white; border: none; border-radius: 5px; cursor: pointer;">تحميل PDF / طباعة</button>
        </div>

        <div class="header">
            <div>
                <h1>عرض سعر رسمي</h1>
                <p>تاريخ العرض: ${quotation.createdAt.toLocaleDateString('ar-EG')}</p>
                <p>رقم العرض: <strong>#${quotation.id}</strong></p>
            </div>
            <div style="text-align: left;">
                <h2>مصنع السلام للزيوت</h2>
                <p>المنطقة الصناعية، مصر</p>
                <p>info@elsalamoils.com</p>
            </div>
        </div>

        <div class="details">
            <div>
                <p><strong>مقدم إلى:</strong></p>
                <p>${quotation.customerName}</p>
                <p>${quotation.customerPhone}</p>
                <p>${quotation.customerEmail || ''}</p>
            </div>
            <div>
                <p><strong>عنوان الشحن:</strong></p>
                <p>${quotation.governorate} - ${quotation.city || ''}</p>
                <p>${quotation.shippingAddress}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>سعر الوحدة</th>
                    <th>الإجمالي</th>
                </tr>
            </thead>
            <tbody>
                ${quotation.items.map(item => `
                <tr>
                    <td>${item.product.name_ar}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)} ج.م</td>
                    <td>${item.subtotal.toFixed(2)} ج.م</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>الإجمالي الفرعي:</span>
                <span>${(quotation.totalAmount - quotation.shippingFee + quotation.discountAmount).toFixed(2)} ج.م</span>
            </div>
            ${quotation.discountAmount > 0 ? `
            <div class="totals-row">
                <span>الخصم:</span>
                <span>-${quotation.discountAmount.toFixed(2)} ج.م</span>
            </div>` : ''}
            <div class="totals-row">
                <span>رسوم التوصيل المقدرة:</span>
                <span>${quotation.shippingFee.toFixed(2)} ج.م</span>
            </div>
            <div class="totals-row final">
                <span>إجمالي عرض السعر:</span>
                <span>${quotation.totalAmount.toFixed(2)} ج.م</span>
            </div>
        </div>

        <div style="margin-top: 50px; font-size: 0.9em; color: #64748b; text-align: center;">
            <p>هذا العرض صالح لمدة 14 يوماً من تاريخ الإصدار.</p>
            <p>تم إصدار هذا المستند إلكترونياً ولا يحتاج إلى توقيع.</p>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    });
    } catch (error: any) {
        return handleApiError(error);
    }
}
