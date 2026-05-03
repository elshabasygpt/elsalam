import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, Pencil, Star, Globe, Search, Filter, Eye, Copy } from "lucide-react";
import { DeleteProductButton } from "./delete-button";

import { ProductImportButton } from "./product-import-button";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">إدارة المنتجات</h1>
                    <p className="text-slate-400 text-sm mt-1">إضافة وتعديل وحذف المنتجات المعروضة على الموقع</p>
                </div>
                <div className="flex items-center gap-3">
                    <ProductImportButton />
                    <Link
                        href="/admin/print-products"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.97]"
                        title="طباعة قائمة الأسعار (PDF)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                        تصدير PDF
                    </Link>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 active:scale-[0.97]"
                    >
                        <Plus className="w-5 h-5" />
                        إضافة منتج جديد
                    </Link>
                </div>
            </div>

            {products.length === 0 ? (
                /* ── Empty State ── */
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Package className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">لا توجد منتجات بعد</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">ابدأ بإضافة أول منتج للموقع. يمكنك إضافة الاسم والوصف بالعربي والإنجليزي.</p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15"
                    >
                        <Plus className="w-5 h-5" />
                        إضافة أول منتج
                    </Link>
                </div>
            ) : (
                <>
                    {/* ── Info Bar ── */}
                    <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-gray-100">
                        <span className="text-sm text-slate-500 font-medium">
                            إجمالي: <span className="font-bold text-slate-700">{products.length}</span> منتج
                        </span>
                    </div>

                    {/* ── Product Table ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-gray-100">
                                        <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">المنتج</th>
                                        <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">التصنيف</th>
                                        <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">مميز</th>
                                        <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">تصدير</th>
                                        <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map((product, i) => (
                                        <tr key={product.id} className="group hover:bg-green-50/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {product.featured_image ? (
                                                        <img src={product.featured_image} alt={product.name_ar} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100 group-hover:border-green-200 transition-colors" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0 border border-green-100/50 group-hover:border-green-200 transition-colors">
                                                            <Package className="w-5 h-5 text-green-600" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-800 text-sm truncate">{product.name_ar}</div>
                                                        <div className="text-[11px] text-slate-400 truncate">{product.name_en}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {product.category ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg">
                                                        {product.category.name_ar}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">بدون تصنيف</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {product.is_featured ? (
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-lg">
                                                        <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                                                        <span className="text-[10px] font-bold text-amber-600">مميز</span>
                                                    </div>
                                                ) : (
                                                    <Star className="w-5 h-5 text-slate-200 mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {product.is_exportable ? (
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-lg">
                                                        <Globe className="w-4.5 h-4.5 text-green-500" />
                                                        <span className="text-[10px] font-bold text-green-600">متاح</span>
                                                    </div>
                                                ) : (
                                                    <Globe className="w-5 h-5 text-slate-200 mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        href={`/products/${product.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="معاينة"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                        title="تعديل"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/new?clone=${product.id}`}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="تكرار المنتج"
                                                    >
                                                        <Copy className="w-5 h-5" />
                                                    </Link>
                                                    <DeleteProductButton productId={product.id} productName={product.name_ar} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
