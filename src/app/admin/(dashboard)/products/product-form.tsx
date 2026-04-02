"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Loader2, ArrowRight, Tag, ImageIcon, Info, Upload, X,
    Plus, Trash2, Award, Ruler, Package, Zap
} from "lucide-react";
import Link from "next/link";

interface Category {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
}

interface FeatureItem { feature_ar: string; feature_en: string }
interface SpecItem { property_ar: string; property_en: string; value_ar: string; value_en: string }
interface PackagingItem { size_ar: string; size_en: string; price: string }
interface CertItem { name: string }

interface ProductFormProps {
    categories: Category[];
    initialData?: {
        id?: number;
        name_ar: string;
        name_en: string;
        slug: string;
        short_description_ar: string;
        short_description_en: string;
        description_ar: string;
        description_en: string;
        categoryId: number | null;
        is_featured: boolean;
        is_exportable: boolean;
        featured_image: string;
        features?: FeatureItem[];
        technical_specs?: SpecItem[];
        packagings?: PackagingItem[];
        certifications?: CertItem[];
    };
}

function FormSection({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-slate-500" />
                    </div>
                )}
                <h2 className="font-bold text-sm text-slate-800">{title}</h2>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name_ar: initialData?.name_ar || "",
        name_en: initialData?.name_en || "",
        slug: initialData?.slug || "",
        short_description_ar: initialData?.short_description_ar || "",
        short_description_en: initialData?.short_description_en || "",
        description_ar: initialData?.description_ar || "",
        description_en: initialData?.description_en || "",
        categoryId: initialData?.categoryId?.toString() || "",
        is_featured: initialData?.is_featured || false,
        is_exportable: initialData?.is_exportable || false,
        featured_image: initialData?.featured_image || "",
    });

    // Related data arrays
    const [features, setFeatures] = useState<FeatureItem[]>(initialData?.features || []);
    const [specs, setSpecs] = useState<SpecItem[]>(initialData?.technical_specs || []);
    const [packagings, setPackagings] = useState<PackagingItem[]>(initialData?.packagings || []);
    const [certifications, setCertifications] = useState<CertItem[]>(initialData?.certifications || []);

    const isEditing = !!initialData?.id;

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

    const handleNameEnChange = (value: string) => {
        setForm(prev => ({ ...prev, name_en: value, slug: prev.slug || generateSlug(value) }));
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            setError("نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, SVG");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("حجم الملف يتجاوز 10MB");
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
                setForm(prev => ({ ...prev, featured_image: data.url }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isEditing ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
            const method = isEditing ? "PUT" : "POST";

            const payload = {
                ...form,
                categoryId: form.categoryId ? parseInt(form.categoryId) : null,
                features: features.filter(f => f.feature_ar || f.feature_en),
                technical_specs: specs.filter(s => s.property_ar || s.value_ar),
                packagings: packagings.filter(p => p.size_ar || p.size_en),
                certifications: certifications.filter(c => c.name),
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "حدث خطأ أثناء حفظ المنتج");
            }
        } catch { setError("حدث خطأ في الاتصال"); }
        finally { setLoading(false); }
    };

    const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300";
    const miniInputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm placeholder:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">
                    <span>❌</span> {error}
                </div>
            )}

            {/* ── Basic Info ── */}
            <FormSection title="المعلومات الأساسية" icon={Info}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">اسم المنتج (عربي) <span className="text-red-400">*</span></label>
                        <input type="text" required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className={inputCls} placeholder="مثال: زيت صويا مكرر" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Product Name (English) <span className="text-red-400">*</span></label>
                        <input type="text" required dir="ltr" value={form.name_en} onChange={(e) => handleNameEnChange(e.target.value)} className={`${inputCls} text-left`} placeholder="e.g. Refined Soybean Oil" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">
                        الرابط (Slug) <span className="text-red-400">*</span>
                        <span className="text-slate-400 font-normal mr-2">— يُستخدم في عنوان URL</span>
                    </label>
                    <input type="text" required dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={`${inputCls} text-left font-mono text-xs`} placeholder="refined-soybean-oil" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">وصف مختصر (عربي)</label>
                        <textarea value={form.short_description_ar} onChange={(e) => setForm({ ...form, short_description_ar: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="وصف مختصر للمنتج..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Short Description (English)</label>
                        <textarea dir="ltr" value={form.short_description_en} onChange={(e) => setForm({ ...form, short_description_en: e.target.value })} rows={3} className={`${inputCls} resize-none text-left`} placeholder="Short product description..." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">وصف تفصيلي (عربي)</label>
                        <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={5} className={`${inputCls} resize-none`} placeholder="وصف تفصيلي للمنتج..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Description (English)</label>
                        <textarea dir="ltr" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={5} className={`${inputCls} resize-none text-left`} placeholder="Detailed product description..." />
                    </div>
                </div>
            </FormSection>

            {/* ── Category & Options ── */}
            <FormSection title="التصنيف والخيارات" icon={Tag}>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">التصنيف</label>
                    <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={`${inputCls} bg-slate-50`}>
                        <option value="">— بدون تصنيف —</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name_ar} ({cat.name_en})</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="sr-only peer" />
                            <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-green-500 transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">منتج مميز</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" checked={form.is_exportable} onChange={(e) => setForm({ ...form, is_exportable: e.target.checked })} className="sr-only peer" />
                            <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-green-500 transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">متاح للتصدير</span>
                    </label>
                </div>
            </FormSection>

            {/* ── Image Upload ── */}
            <FormSection title="الصورة الرئيسية" icon={ImageIcon}>
                {form.featured_image ? (
                    <div className="relative group">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <img src={form.featured_image} alt="Preview" className="w-full max-h-52 rounded-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                        </div>
                        <button type="button" onClick={() => setForm({ ...form, featured_image: "" })} className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
                            <X className="w-5 h-5" />
                        </button>
                        <p className="text-[10px] text-slate-400 mt-2 text-center truncate" dir="ltr">{form.featured_image}</p>
                    </div>
                ) : (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver ? "border-green-400 bg-green-50/50" : "border-slate-200 hover:border-green-300 hover:bg-green-50/30"} ${imageUploading ? "pointer-events-none opacity-60" : ""}`}
                    >
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); e.target.value = ""; }} />
                        {imageUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                                <p className="text-sm font-bold text-green-600">جاري رفع الصورة...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-600">اضغط أو اسحب صورة هنا</p>
                                    <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, WebP, SVG — الحد الأقصى 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">أو أدخل الرابط مباشرة</label>
                    <input type="text" dir="ltr" value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} className={`${inputCls} text-left text-xs`} placeholder="/images/products/product.jpg" />
                </div>
            </FormSection>

            {/* ── Features (المميزات) ── */}
            <FormSection title="المميزات" icon={Zap}>
                <p className="text-xs text-slate-400 -mt-2">مميزات المنتج مثل: خالي من الكولسترول، معتمد دولياً</p>
                {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={feat.feature_ar}
                                onChange={(e) => { const arr = [...features]; arr[i].feature_ar = e.target.value; setFeatures(arr); }}
                                className={miniInputCls}
                                placeholder="الميزة (عربي)"
                            />
                            <input
                                type="text" dir="ltr"
                                value={feat.feature_en}
                                onChange={(e) => { const arr = [...features]; arr[i].feature_en = e.target.value; setFeatures(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="Feature (English)"
                            />
                        </div>
                        <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setFeatures([...features, { feature_ar: "", feature_en: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-5 h-5" /> إضافة ميزة
                </button>
            </FormSection>

            {/* ── Technical Specs (المواصفات الفنية) ── */}
            <FormSection title="المواصفات الفنية" icon={Ruler}>
                <p className="text-xs text-slate-400 -mt-2">المواصفات الفنية مثل: نسبة الحموضة، اللون، نقطة الدخان</p>
                {specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <input
                                type="text"
                                value={spec.property_ar}
                                onChange={(e) => { const arr = [...specs]; arr[i].property_ar = e.target.value; setSpecs(arr); }}
                                className={miniInputCls}
                                placeholder="الخاصية (عربي)"
                            />
                            <input
                                type="text" dir="ltr"
                                value={spec.property_en}
                                onChange={(e) => { const arr = [...specs]; arr[i].property_en = e.target.value; setSpecs(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="Property (EN)"
                            />
                            <input
                                type="text"
                                value={spec.value_ar}
                                onChange={(e) => { const arr = [...specs]; arr[i].value_ar = e.target.value; setSpecs(arr); }}
                                className={miniInputCls}
                                placeholder="القيمة (عربي)"
                            />
                            <input
                                type="text" dir="ltr"
                                value={spec.value_en}
                                onChange={(e) => { const arr = [...specs]; arr[i].value_en = e.target.value; setSpecs(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="Value (EN)"
                            />
                        </div>
                        <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setSpecs([...specs, { property_ar: "", property_en: "", value_ar: "", value_en: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-5 h-5" /> إضافة مواصفة
                </button>
            </FormSection>

            {/* ── Packaging & Prices (التعبئات والأسعار) ── */}
            <FormSection title="التعبئات والأسعار" icon={Package}>
                <p className="text-xs text-slate-400 -mt-2">أحجام التعبئة المتاحة مع الأسعار</p>
                {packagings.map((pkg, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                value={pkg.size_ar}
                                onChange={(e) => { const arr = [...packagings]; arr[i].size_ar = e.target.value; setPackagings(arr); }}
                                className={miniInputCls}
                                placeholder="الحجم (عربي) — مثال: 1 لتر"
                            />
                            <input
                                type="text" dir="ltr"
                                value={pkg.size_en}
                                onChange={(e) => { const arr = [...packagings]; arr[i].size_en = e.target.value; setPackagings(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="Size (EN) — e.g. 1 Liter"
                            />
                            <input
                                type="number" step="0.01" dir="ltr"
                                value={pkg.price}
                                onChange={(e) => { const arr = [...packagings]; arr[i].price = e.target.value; setPackagings(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="السعر (ج.م)"
                            />
                        </div>
                        <button type="button" onClick={() => setPackagings(packagings.filter((_, j) => j !== i))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setPackagings([...packagings, { size_ar: "", size_en: "", price: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-5 h-5" /> إضافة حجم تعبئة
                </button>
            </FormSection>

            {/* ── Certifications (شهادات الجودة) ── */}
            <FormSection title="شهادات الجودة" icon={Award}>
                <p className="text-xs text-slate-400 -mt-2">شهادات الجودة مثل: ISO 9001, ISO 22000, HACCP, Halal</p>
                <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, i) => (
                        <div key={i} className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <input
                                type="text" dir="ltr"
                                value={cert.name}
                                onChange={(e) => { const arr = [...certifications]; arr[i].name = e.target.value; setCertifications(arr); }}
                                className="bg-transparent text-sm font-bold text-green-700 outline-none w-24 text-center placeholder:text-green-300"
                                placeholder="ISO ..."
                            />
                            <button type="button" onClick={() => setCertifications(certifications.filter((_, j) => j !== i))} className="text-green-400 hover:text-red-500 transition-colors">
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => setCertifications([...certifications, { name: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-5 h-5" /> إضافة شهادة
                </button>
            </FormSection>

            {/* ── Actions ── */}
            <div className="flex items-center justify-between pt-2">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
                    <ArrowRight className="w-5 h-5" />
                    العودة للمنتجات
                </Link>
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50 active:scale-[0.97]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
                </button>
            </div>
        </form>
    );
}
