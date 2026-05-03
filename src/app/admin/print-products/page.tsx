import { prisma } from "@/lib/prisma";
import { PrintTrigger } from "./print-trigger";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default async function PrintProductsPage() {
    // 1. Fetch site settings for logo and name
    const settings = await prisma.siteSettings.findFirst();

    // 2. Fetch all products ordered by category name then product name
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: [
            { category: { name_ar: 'asc' } },
            { name_ar: 'asc' }
        ]
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Global CSS to hide the root layout widgets during print */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    /* Hide root layout widgets by searching for their common classes or IDs */
                    nav.fixed.bottom-0, button.fixed.bottom-4, div.fixed.bottom-6, #quick-contact { display: none !important; }
                    
                    @page {
                        margin: 1cm;
                        size: A4 portrait;
                    }
                }
            `}} />

            {/* Print Trigger Component */}
            <PrintTrigger />

            <div className="max-w-[21cm] mx-auto bg-white p-8">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-green-700 pb-6 mb-8">
                    <div className="flex items-center gap-6">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-28 w-auto object-contain" />
                        ) : (
                            <div className="w-24 h-24 bg-green-700 text-white flex items-center justify-center font-bold rounded-xl text-2xl">
                                السلام
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-black text-green-800">قائمة أسعار المنتجات</h1>
                            <p className="text-base font-bold text-gray-500 mt-2">مصنع السلام لعصر واستخلاص الزيوت النباتية</p>
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-600">تاريخ الإصدار</p>
                        <p className="text-lg font-black text-gray-900" dir="ltr">{format(new Date(), 'dd MMMM yyyy', { locale: ar })}</p>
                    </div>
                </div>

                {/* Products Table */}
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-green-50 border-y-2 border-green-200">
                            <th className="py-3 px-4 font-black text-green-800 text-sm w-16 text-center">صورة</th>
                            <th className="py-3 px-4 font-black text-green-800 text-sm">اسم المنتج</th>
                            <th className="py-3 px-4 font-black text-green-800 text-sm w-36 text-center">التصنيف</th>
                            <th className="py-3 px-4 font-black text-green-800 text-sm w-40 text-center">السعر</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product, index) => (
                            <tr key={product.id} className="page-break-inside-avoid">
                                <td className="py-3 px-4 text-center">
                                    {product.featured_image ? (
                                        <img src={product.featured_image} alt={product.name_ar} className="w-12 h-12 object-contain mx-auto mix-blend-multiply" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center text-gray-300 mx-auto border border-gray-100">
                                            صورة
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="font-bold text-gray-900 text-sm">{product.name_ar}</div>
                                    <div className="text-[11px] text-gray-500 font-medium mt-0.5" dir="ltr">{product.name_en}</div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="inline-block px-3 py-1.5 bg-gray-50 rounded-lg text-[13px] font-bold text-gray-700 border border-gray-200 whitespace-nowrap">
                                        {product.category?.name_ar || 'بدون تصنيف'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {product.price ? (
                                        <div className="font-black text-green-700 text-lg flex items-center justify-center gap-1">
                                            <span className="text-sm font-bold text-green-600">ج.م</span>
                                            <span>{product.price.toLocaleString('en-US')}</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-400">غير مسجل</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer Notes */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm font-bold text-gray-500 page-break-inside-avoid">
                    <p>هذه الأسعار خاضعة للتغيير دون إشعار مسبق حسب أسعار السوق.</p>
                    <p className="mt-1">للتواصل وطلب الكميات: {settings?.invoiceWebsiteUrl || 'www.elsalamoils.com'}</p>
                </div>
            </div>

            {/* Print action buttons for manual printing if auto-print fails or is cancelled */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 no-print flex gap-4">
                <button 
                    id="manual-print-btn"
                    className="bg-green-700 text-white px-8 py-3 rounded-full font-black shadow-xl hover:bg-green-800 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    طباعة أو حفظ كـ PDF
                </button>
                <button 
                    id="manual-close-btn"
                    className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-full font-black shadow-lg hover:bg-gray-50 transition-all"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
}
