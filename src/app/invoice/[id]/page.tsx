import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import PrintButton from "./PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const order = await prisma.webOrder.findUnique({
        where: { id: parseInt(id) },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-100 flex py-10 print:py-0 print:bg-white justify-center items-start font-sans" dir="ltr">
            <div className="w-full max-w-[800px] bg-white rounded-xl shadow-2xl print:shadow-none print:w-full p-10 md:p-14 relative mx-4 print:mx-0 print:p-0">
                {/* Print Button Wrapper */}
                <div className="absolute top-6 right-6 print:hidden">
                    <PrintButton />
                </div>

                <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">ELSALAM</h1>
                        <p className="text-slate-500 text-[13px] font-medium tracking-wide">Industrial High-Quality Oils & Fats</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black text-slate-800 mb-1 tracking-widest text-[#15803d]">INVOICE</h2>
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
                                    <p className="font-bold text-slate-800">{item.product.name_en}</p>
                                    <p className="text-slate-500 text-[13px] font-medium" dir="rtl">{item.product.name_ar}</p>
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
                            <span className="text-xl font-black text-[#15803d]">{order.totalAmount.toLocaleString()} EGP</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-200 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-500 font-medium italic mb-1">Thank you for your business. We appreciate your trust.</p>
                    <p className="font-bold text-slate-700 tracking-wide text-sm">www.elsalamoils.com</p>
                </div>
            </div>
        </div>
    );
}
