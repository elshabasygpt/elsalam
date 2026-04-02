"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Percent, X, Save, Calendar, Package, Upload } from "lucide-react";

interface Product {
    id: number;
    name_ar: string;
    name_en: string;
}

interface Promotion {
    id: number;
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    discount_type: string;
    discount_value: number;
    original_price?: number;
    promo_price?: number;
    badge_ar?: string;
    badge_en?: string;
    featured_image?: string;
    starts_at?: string;
    ends_at: string;
    productId?: number;
    product?: Product;
}

const EMPTY_FORM = {
    title_ar: "", title_en: "", description_ar: "", description_en: "",
    discount_type: "percentage", discount_value: "",
    original_price: "", promo_price: "",
    badge_ar: "", badge_en: "", featured_image: "",
    starts_at: "", ends_at: "", productId: "",
};

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageUploading, setImageUploading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [promRes, prodRes] = await Promise.all([
                fetch("/api/admin/promotions"),
                fetch("/api/admin/products"),
            ]);
            if (promRes.ok) setPromotions(await promRes.json());
            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(Array.isArray(data) ? data : []);
            }
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (p: Promotion) => {
        setForm({
            title_ar: p.title_ar, title_en: p.title_en,
            description_ar: p.description_ar || "", description_en: p.description_en || "",
            discount_type: p.discount_type, discount_value: p.discount_value.toString(),
            original_price: p.original_price?.toString() || "", promo_price: p.promo_price?.toString() || "",
            badge_ar: p.badge_ar || "", badge_en: p.badge_en || "",
            featured_image: p.featured_image || "",
            starts_at: p.starts_at ? new Date(p.starts_at).toISOString().slice(0, 16) : "",
            ends_at: new Date(p.ends_at).toISOString().slice(0, 16),
            productId: p.productId?.toString() || "",
        });
        setEditingId(p.id);
        setShowForm(true);
        setError("");
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setForm(prev => ({ ...prev, featured_image: data.url }));
            }
        } catch { }
        setImageUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title_ar || !form.title_en || !form.discount_value || !form.ends_at) {
            setError("يرجى ملء الحقول المطلوبة (العنوان، قيمة الخصم، تاريخ الانتهاء)");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const url = editingId ? `/api/admin/promotions/${editingId}` : "/api/admin/promotions";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                resetForm();
                fetchData();
            } else {
                const data = await res.json();
                setError(data.error || "حدث خطأ");
            }
        } catch {
            setError("حدث خطأ في الاتصال");
        }
        setSaving(false);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف العرض "${name}"؟`)) return;
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
            else alert("حدث خطأ أثناء الحذف");
        } catch {
            alert("حدث خطأ في الاتصال");
        }
    };

    const isActive = (p: Promotion) => {
        const now = new Date();
        const end = new Date(p.ends_at);
        const start = p.starts_at ? new Date(p.starts_at) : null;
        return end > now && (!start || start <= now);
    };

    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">إدارة العروض والتخفيضات</h1>
                    <p className="text-slate-400 text-sm mt-1">إنشاء عروض وتخفيضات على المنتجات</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 active:scale-[0.97]"
                >
                    <Plus className="w-5 h-5" />
                    إضافة عرض جديد
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Percent className="w-4.5 h-4.5 text-amber-600" />
                            </div>
                            <h2 className="font-bold text-sm text-slate-800">
                                {editingId ? "تعديل العرض" : "إضافة عرض جديد"}
                            </h2>
                        </div>
                        <button onClick={resetForm} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">❌ {error}</div>
                        )}

                        {/* Titles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">عنوان العرض (عربي) <span className="text-red-400">*</span></label>
                                <input type="text" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputCls} placeholder="مثال: خصم 20% على زيت الصويا" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Offer Title (English) <span className="text-red-400">*</span></label>
                                <input type="text" dir="ltr" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={`${inputCls} text-left`} placeholder="e.g. 20% Off Soybean Oil" />
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">وصف العرض (عربي)</label>
                                <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="تفاصيل العرض..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Description (English)</label>
                                <textarea dir="ltr" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={3} className={`${inputCls} resize-none text-left`} placeholder="Offer details..." />
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">نوع الخصم <span className="text-red-400">*</span></label>
                                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className={inputCls}>
                                    <option value="percentage">نسبة مئوية (%)</option>
                                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">قيمة الخصم <span className="text-red-400">*</span></label>
                                <input type="number" step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} className={inputCls} placeholder={form.discount_type === "percentage" ? "20" : "500"} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">المنتج المرتبط</label>
                                <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className={inputCls}>
                                    <option value="">— جميع المنتجات —</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name_ar}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">السعر الأصلي</label>
                                <input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className={inputCls} placeholder="مثال: 1000" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">سعر العرض</label>
                                <input type="number" step="0.01" value={form.promo_price} onChange={(e) => setForm({ ...form, promo_price: e.target.value })} className={inputCls} placeholder="مثال: 800" />
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">شارة العرض (عربي)</label>
                                <input type="text" value={form.badge_ar} onChange={(e) => setForm({ ...form, badge_ar: e.target.value })} className={inputCls} placeholder="مثال: عرض محدود 🔥" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Badge (English)</label>
                                <input type="text" dir="ltr" value={form.badge_en} onChange={(e) => setForm({ ...form, badge_en: e.target.value })} className={`${inputCls} text-left`} placeholder="e.g. Limited Offer 🔥" />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">تاريخ البدء</label>
                                <input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">تاريخ الانتهاء <span className="text-red-400">*</span></label>
                                <input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} className={inputCls} />
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">صورة العرض</label>
                            {form.featured_image ? (
                                <div className="relative group inline-block">
                                    <img src={form.featured_image} alt="Preview" className="h-24 rounded-xl object-cover" />
                                    <button type="button" onClick={() => setForm({ ...form, featured_image: "" })} className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
                                    {imageUploading ? <Loader2 className="w-5 h-5 text-green-500 animate-spin" /> : <Upload className="w-5 h-5 text-slate-400" />}
                                    <span className="text-sm text-slate-500">اضغط لرفع صورة العرض</span>
                                </label>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50">
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingId ? "حفظ التعديلات" : "إضافة العرض"}
                            </button>
                            <button type="button" onClick={resetForm} className="px-4 py-2.5 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Promotions List */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            ) : promotions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <Percent className="w-10 h-10 text-amber-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">لا توجد عروض بعد</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">ابدأ بإضافة أول عرض أو تخفيض على المنتجات.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-gray-50">
                        <span className="text-sm text-slate-500 font-medium">
                            إجمالي: <span className="font-bold text-slate-700">{promotions.length}</span> عرض
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-gray-100">
                                    <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">العرض</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">الخصم</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">المنتج</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">الحالة</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">ينتهي</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {promotions.map((p) => (
                                    <tr key={p.id} className="group hover:bg-amber-50/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {p.featured_image ? (
                                                    <img src={p.featured_image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100/50">
                                                        <Percent className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{p.title_ar}</div>
                                                    <div className="text-[11px] text-slate-400">{p.title_en}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg">
                                                {p.discount_type === "percentage" ? `${p.discount_value}%` : `${p.discount_value} ج.م`}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            {p.product ? (
                                                <span className="text-[11px] font-medium text-slate-600">{p.product.name_ar}</span>
                                            ) : (
                                                <span className="text-[11px] text-slate-300">الكل</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            {isActive(p) ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    نشط
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg">
                                                    منتهي
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="text-[11px] text-slate-500">
                                                {new Date(p.ends_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric", year: "numeric" })}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="تعديل">
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(p.id, p.title_ar)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="حذف">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
