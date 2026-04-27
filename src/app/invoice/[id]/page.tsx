import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Leaf } from "lucide-react";
import PrintButton from "./PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const order = await prisma.webOrder.findUnique({
        where: { id: parseInt(id) },
        include: {
            items: {
                include: { 
                    product: {
                        include: { images: true }
                    } 
                }
            }
        }
    });

    const settingsList = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "SiteSettings" LIMIT 1');
    const siteSettings = settingsList?.[0] || null;

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-100 flex py-10 print:py-0 print:bg-white justify-center items-start font-sans" dir="ltr">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
                }
            `}} />
            <div className="flex flex-col w-full max-w-[210mm] min-h-[297mm] bg-white rounded-xl shadow-2xl print:shadow-none print:rounded-none print:w-[210mm] print:min-h-[297mm] p-10 md:p-14 relative mx-4 print:mx-auto print:p-12 overflow-hidden">
                {/* Print Button Wrapper */}
                <div className="absolute top-6 right-6 print:hidden">
                    <PrintButton />
                </div>

                <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
                    <div>
                        {siteSettings?.invoiceShowLogo ? (
                            (siteSettings?.invoiceLogoUrl || siteSettings?.logoUrl) ? (
                                <img src={siteSettings.invoiceLogoUrl || siteSettings.logoUrl} alt="Logo" className="object-contain mb-2" crossOrigin="anonymous" style={{ height: `${siteSettings?.invoiceLogoSize || 64}px` }} />
                            ) : (
                                <div className="rounded-xl flex items-center justify-center mb-3 shadow-md print:shadow-none print:border print:border-green-800" style={{ backgroundImage: siteSettings?.invoiceColor ? 'none' : 'linear-gradient(to bottom right, #16a34a, #047857)', backgroundColor: siteSettings?.invoiceColor || '#16a34a', width: `${siteSettings?.invoiceLogoSize || 64}px`, height: `${siteSettings?.invoiceLogoSize || 64}px` }}>
                                    <Leaf className="text-white" style={{ width: `${(siteSettings?.invoiceLogoSize || 64) * 0.6}px`, height: `${(siteSettings?.invoiceLogoSize || 64) * 0.6}px` }} />
                                </div>
                            )
                        ) : (
                            <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: siteSettings?.invoiceColor || '#0f172a' }}>{siteSettings?.siteNameEn || "ELSALAM"}</h1>
                        )}
                        {siteSettings?.invoiceSubtitle && (
                            <p className="text-slate-500 text-[13px] font-medium tracking-wide">{siteSettings.invoiceSubtitle}</p>
                        )}
                        {siteSettings?.invoiceCompanyDetails && (
                            <p className="text-slate-500 text-xs mt-2 whitespace-pre-wrap leading-relaxed">{siteSettings.invoiceCompanyDetails}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black tracking-widest uppercase mb-1" style={{ color: siteSettings?.invoiceColor || '#15803d' }}>INVOICE</h2>
                        <p className="text-slate-600 font-mono text-lg font-bold mb-1">#{order.id.toString().padStart(6, '0')}</p>
                        <p className="text-slate-500 text-sm font-medium">{format(order.createdAt, "PPP p")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div>
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">Billed To</h3>
                        <p className="font-bold text-lg text-slate-800 mb-1">{order.customerName}</p>
                        <p className="text-slate-600 font-medium text-[15px] mb-1">{order.customerPhone}</p>
                        {order.customerEmail && <p className="text-slate-600 font-medium text-[15px]">{order.customerEmail}</p>}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-3">Shipping Infomation</h3>
                        <p className="font-bold text-lg text-slate-800 mb-1">{order.governorate}</p>
                        <p className="text-slate-600 font-medium text-[15px] leading-relaxed max-w-[250px]">{order.shippingAddress}</p>
                    </div>
                </div>

                <table className="w-full mb-10 text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-700">
                            <th className="py-4 font-black text-[13px] uppercase tracking-wider text-slate-400">Description</th>
                            <th className="py-4 font-black text-[13px] uppercase tracking-wider text-slate-400 text-center">Qty</th>
                            <th className="py-4 font-black text-[13px] uppercase tracking-wider text-slate-400 text-right">Unit Price</th>
                            <th className="py-4 font-black text-[13px] uppercase tracking-wider text-slate-400 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item: any) => (
                            <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                                <td className="py-5 pr-4">
                                    <div className="flex items-center gap-4">
                                        {item.product.images && item.product.images.length > 0 && (
                                            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 print:border-slate-300">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.product.images[0].url} alt={item.product.name_en} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-800">{item.product.name_en}</p>
                                            <p className="text-slate-500 text-[13px] font-medium" dir="rtl">{item.product.name_ar}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 text-center font-bold text-slate-700">{item.quantity}</td>
                                <td className="py-5 text-right font-semibold text-slate-600">{item.unitPrice.toLocaleString()} EGP</td>
                                <td className="py-5 text-right font-black text-slate-800">{item.subtotal.toLocaleString()} EGP</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end pt-4">
                    <div className="w-[320px] pt-2 border-t-2 border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 font-bold text-[15px]">Subtotal:</span>
                            <span className="font-bold text-slate-800">{(order.totalAmount - order.shippingFee + order.discountAmount).toLocaleString()} EGP</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 font-bold text-[15px]">Shipping Fee:</span>
                            <span className="font-bold text-slate-800">{order.shippingFee.toLocaleString()} EGP</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-rose-500 font-bold text-[15px]">Discount {order.promoCode ? `(${order.promoCode})` : ''}:</span>
                                <span className="font-bold text-rose-500">- {order.discountAmount.toLocaleString()} EGP</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-lg font-black text-slate-800 uppercase tracking-wide">Total:</span>
                            <span className="text-xl font-black" style={{ color: siteSettings?.invoiceColor || '#15803d' }}>{order.totalAmount.toLocaleString()} EGP</span>
                        </div>
                    </div>
                </div>


                {/* Notes Section */}
                {(order as any).notes && (
                    <div className="mt-8 bg-amber-50 border border-amber-100 rounded-xl p-5 mb-8 print:border-gray-200 print:bg-transparent text-right" dir="rtl">
                        <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2 print:text-gray-800">
                            ملاحظات الطلب:
                        </h4>
                        <p className="text-amber-900 text-sm whitespace-pre-wrap leading-relaxed print:text-gray-600 font-medium">{(order as any).notes}</p>
                    </div>
                )}
                <div className="mt-auto pt-8 border-t-2 border-slate-100 text-center text-slate-500 text-sm font-medium print:break-inside-avoid">
                    <p className="whitespace-pre-wrap">{siteSettings?.invoiceNotesEn || "Thank you for choosing Elsalam Oils & Fats"}</p>
                    {siteSettings?.invoiceWebsiteUrl && (
                        <p className="mt-2 font-mono text-xs text-slate-400">{siteSettings.invoiceWebsiteUrl}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
