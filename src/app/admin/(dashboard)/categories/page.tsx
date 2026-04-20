"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Loader2, Tag, Package, X, Save, Upload, ImageIcon, ArrowUpDown, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

interface Category {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    imageUrl?: string;
    sortOrder?: number;
    _count?: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name_ar: "", name_en: "", slug: "", imageUrl: "", sortOrder: 0 });
    const [imageUploading, setImageUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category | "products_count", direction: "asc" | "desc" } | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const isDragEnabled = !sortConfig || (sortConfig.key === "sortOrder" && sortConfig.direction === "asc");

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (!isDragEnabled) return;
        dragItem.current = index;
        setTimeout(() => {
            if (e.target instanceof HTMLElement) {
                e.target.classList.add("opacity-50", "bg-slate-50");
            }
        }, 0);
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        if (!isDragEnabled) return;
        dragOverItem.current = index;
    };

    const handleDragEnd = async (e: React.DragEvent) => {
        if (!isDragEnabled) return;
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove("opacity-50", "bg-slate-50");
        }

        if (dragItem.current === null || dragOverItem.current === null) return;
        if (dragItem.current === dragOverItem.current) return;

        const copyListItems = [...sortedCategories];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;

        const updated = copyListItems.map((cat, index) => ({ ...cat, sortOrder: index + 1 }));
        setCategories(updated);
        
        setIsSavingOrder(true);
        try {
            await fetch("/api/admin/categories/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: updated.map(cat => ({ id: cat.id, sortOrder: cat.sortOrder })) }),
            });
        } catch {
            alert("حدث خطأ أثناء حفظ الترتيب الجديد");
        }
        setIsSavingOrder(false);
    };

    const handleSort = (key: keyof Category | "products_count") => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (!sortConfig) return 0;
        
        let aValue: any = a[sortConfig.key as keyof Category];
        let bValue: any = b[sortConfig.key as keyof Category];

        if (sortConfig.key === "products_count") {
            aValue = a._count?.products || 0;
            bValue = b._count?.products || 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) setCategories(await res.json());
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

    const handleNameEnChange = (value: string) => {
        setForm(prev => ({ ...prev, name_en: value, slug: prev.slug || generateSlug(value) }));
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            setError("نوع الملف غير مدعوم أو حجمه كبير");
            return;
        }
        setImageUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setForm(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                const data = await res.json();
                setError(data.error || "فشل رفع الصورة");
            }
        } catch { setError("حدث خطأ أثناء رفع الصورة"); }
        finally { setImageUploading(false); }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const resetForm = () => {
        setForm({ name_ar: "", name_en: "", slug: "", imageUrl: "", sortOrder: 0 });
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (cat: Category) => {
        setForm({ name_ar: cat.name_ar, name_en: cat.name_en, slug: cat.slug, imageUrl: cat.imageUrl || "", sortOrder: cat.sortOrder || 0 });
        setEditingId(cat.id);
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name_ar || !form.name_en || !form.slug) {
            setError("جميع الحقول مطلوبة");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                resetForm();
                fetchCategories();
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
        if (!confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) fetchCategories();
            else {
                const data = await res.json();
                alert(data.error || "حدث خطأ أثناء الحذف");
            }
        } catch {
            alert("حدث خطأ في الاتصال");
        }
    };

    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">إدارة التصنيفات</h1>
                    <p className="text-slate-400 text-sm mt-1">إنشاء وتعديل تصنيفات المنتجات</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 active:scale-[0.97]"
                >
                    <Plus className="w-5 h-5" />
                    إضافة تصنيف جديد
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                                <Tag className="w-4.5 h-4.5 text-green-600" />
                            </div>
                            <h2 className="font-bold text-sm text-slate-800">
                                {editingId ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                            </h2>
                        </div>
                        <button onClick={resetForm} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                ❌ {error}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">اسم التصنيف (عربي) <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={form.name_ar}
                                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                    className={inputCls}
                                    placeholder="مثال: زيوت نباتية"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Category Name (English) <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    dir="ltr"
                                    value={form.name_en}
                                    onChange={(e) => handleNameEnChange(e.target.value)}
                                    className={`${inputCls} text-left`}
                                    placeholder="e.g. Vegetable Oils"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                    الرابط (Slug) <span className="text-red-400">*</span>
                                    <span className="text-slate-400 font-normal mr-2">— يُستخدم في عنوان URL</span>
                                </label>
                                <input
                                    type="text"
                                    dir="ltr"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className={`${inputCls} text-left font-mono text-xs`}
                                    placeholder="vegetable-oils"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">
                                    ترتيب العرض (Sort Order)
                                    <span className="text-slate-400 font-normal mr-2">— 1، 2، 3...</span>
                                </label>
                                <input
                                    type="number"
                                    dir="ltr"
                                    value={form.sortOrder}
                                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                                    className={`${inputCls} text-left font-mono text-xs`}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">صورة أو أيقونة التصنيف</label>
                            {form.imageUrl ? (
                                <div className="relative group w-32 h-32">
                                    <img src={form.imageUrl} alt="Category" className="w-full h-full object-contain rounded-xl border border-gray-200 p-2" />
                                    <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-all" title="تغيير">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all" title="حذف">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); e.target.value = ""; }} />
                                </div>
                            ) : (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all w-full
${dragOver ? "border-green-400 bg-green-50/50" : "border-slate-200 hover:border-green-300 hover:bg-green-50/30"} 
${imageUploading ? "pointer-events-none opacity-60" : ""}`}
                                >
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); e.target.value = ""; }} />
                                    {imageUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                                            <p className="text-xs font-bold text-green-600">جاري الرفع...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-600">اضغط أو اسحب صورة هنا</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingId ? "حفظ التعديلات" : "إضافة التصنيف"}
                            </button>
                            <button type="button" onClick={resetForm} className="px-4 py-2.5 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Tag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">لا توجد تصنيفات بعد</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">ابدأ بإضافة أول تصنيف لتنظيم المنتجات.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">
                            إجمالي: <span className="font-bold text-slate-700">{categories.length}</span> تصنيف
                        </span>
                        {isSavingOrder ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                جاري تحديث الترتيب...
                            </div>
                        ) : !isDragEnabled ? (
                            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">الفرز بالسحب معطل مؤقتاً أثناء استخدام ترتيب مختلف عن الترتيب الافتراضي</span>
                        ) : null}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-gray-100">
                                    <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort("name_ar")}>
                                        <div className="flex items-center gap-1">التصنيف {sortConfig?.key === "name_ar" ? (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}</div>
                                    </th>
                                    <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => handleSort("slug")}>
                                        <div className="flex items-center gap-1">الرابط {sortConfig?.key === "slug" ? (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}</div>
                                    </th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none" onClick={() => handleSort("sortOrder")}>
                                        <div className="flex items-center justify-center gap-1">الترتيب {sortConfig?.key === "sortOrder" ? (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}</div>
                                    </th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none" onClick={() => handleSort("products_count")}>
                                        <div className="flex items-center justify-center gap-1">المنتجات {sortConfig?.key === "products_count" ? (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}</div>
                                    </th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sortedCategories.map((cat, index) => (
                                    <tr 
                                        key={cat.id} 
                                        draggable={isDragEnabled}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`group hover:bg-green-50/30 transition-colors ${isDragEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {isDragEnabled ? (
                                                    <div className="text-slate-300 hover:text-slate-500 transition-colors hidden sm:block">
                                                        <GripVertical className="w-5 h-5 cursor-grab active:cursor-grabbing" />
                                                    </div>
                                                ) : <div className="w-5 hidden sm:block" />}
                                                {cat.imageUrl ? (
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100 p-1">
                                                        <img src={cat.imageUrl} alt={cat.name_ar} className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                                        <Tag className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{cat.name_ar}</div>
                                                    <div className="text-[11px] text-slate-400">{cat.name_en}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <code className="text-[11px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-mono">{cat.slug}</code>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="text-[12px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">{cat.sortOrder || 0}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-lg">
                                                <Package className="w-4.5 h-4.5 text-slate-400" />
                                                <span className="text-[11px] font-bold text-slate-600">{cat._count?.products || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => startEdit(cat)}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="تعديل"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name_ar)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="حذف"
                                                >
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
