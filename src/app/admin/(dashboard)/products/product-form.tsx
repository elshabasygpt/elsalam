"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Save, Loader2, ArrowRight, Tag, ImageIcon, Info, Upload, X,
    Plus, Trash2, Award, Ruler, Package, Zap, Sparkles, Wand2
} from "lucide-react";
import Link from "next/link";
import { AiImageModal } from "./ai-image-modal";

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
interface ImageItem { url: string }

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
        price: number | null;
        price_unit_ar: string | null;
        price_unit_en: string | null;
        features?: FeatureItem[];
        technical_specs?: SpecItem[];
        packagings?: PackagingItem[];
        certifications?: CertItem[];
        images?: ImageItem[];
    };
}

function FormSection({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                )}
                <h2 className="font-bold text-base text-slate-800">{title}</h2>
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
    const [galleryUploading, setGalleryUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

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
        price: initialData?.price?.toString() || "",
        price_unit_ar: initialData?.price_unit_ar || "",
        price_unit_en: initialData?.price_unit_en || "",
    });

    // Related data arrays
    const [features, setFeatures] = useState<FeatureItem[]>(initialData?.features || []);
    const [specs, setSpecs] = useState<SpecItem[]>(initialData?.technical_specs || []);
    const [packagings, setPackagings] = useState<PackagingItem[]>(initialData?.packagings || []);
    const [certifications, setCertifications] = useState<CertItem[]>(initialData?.certifications || []);
    const [images, setImages] = useState<ImageItem[]>(initialData?.images || []);

    const isEditing = !!initialData?.id;

    // Draft Recovery
    const [showDraftBanner, setShowDraftBanner] = useState(false);
    const initialRender = useRef(true);
    
    useEffect(() => {
        if (!isEditing && typeof window !== 'undefined') {
            const draft = localStorage.getItem('product-draft');
            if (draft) {
                setShowDraftBanner(true);
            }
        }
    }, [isEditing]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        if (!isEditing && typeof window !== 'undefined') {
            const draftObj = {
                form, features, specs, packagings, certifications, images
            };
            localStorage.setItem('product-draft', JSON.stringify(draftObj));
            setShowDraftBanner(false);
        }
    }, [form, features, specs, packagings, certifications, images, isEditing]);

    const restoreDraft = () => {
        try {
            const draft = localStorage.getItem('product-draft');
            if (draft) {
                const parsed = JSON.parse(draft);
                if (parsed.form) setForm(parsed.form);
                if (parsed.features) setFeatures(parsed.features);
                if (parsed.specs) setSpecs(parsed.specs);
                if (parsed.packagings) setPackagings(parsed.packagings);
                if (parsed.certifications) setCertifications(parsed.certifications);
                if (parsed.images) setImages(parsed.images);
                setShowDraftBanner(false);
                toast.success("تم استعادة المسودة بنجاح");
            }
        } catch (error) {
            toast.error("فشل استعادة المسودة");
        }
    };

    const discardDraft = () => {
        localStorage.removeItem('product-draft');
        setShowDraftBanner(false);
    };

    const [isTranslating, setIsTranslating] = useState<string | null>(null);
    const [aiProvider, setAiProvider] = useState<"gemini" | "huggingface">("huggingface");

    const translateField = async (text: string, targetLang: string, onTranslate: (translated: string) => void, fieldId: string) => {
        if (!text) {
            toast.error("لا يوجد نص لترجمته");
            return;
        }
        setIsTranslating(fieldId);
        try {
            const res = await fetch("/api/admin/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, targetLang, provider: aiProvider })
            });
            if (res.ok) {
                const data = await res.json();
                onTranslate(data.translation);
                toast.success("تمت الترجمة بنجاح ✨");
            } else {
                const err = await res.json();
                toast.error(err.error || "فشل الترجمة");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الاتصال بخدمة الترجمة");
        } finally {
            setIsTranslating(null);
        }
    };

    const generateWithAI = async () => {
        if (!form.name_ar && !form.name_en) {
            toast.error("يرجى إدخال اسم المنتج أولاً لتوليد الوصف");
            return;
        }
        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName: form.name_ar || form.name_en,
                    category: categories.find(c => c.id.toString() === form.categoryId)?.name_ar,
                    features: features.map(f => f.feature_ar).join(", "),
                    provider: aiProvider
                })
            });
            if (res.ok) {
                const data = await res.json();
                setForm(prev => ({
                    ...prev,
                    name_en: data.name_en || prev.name_en,
                    short_description_ar: data.short_ar || prev.short_description_ar,
                    short_description_en: data.short_en || prev.short_description_en,
                    description_ar: data.long_ar || prev.description_ar,
                    description_en: data.long_en || prev.description_en,
                }));
                
                if (data.generated_features && Array.isArray(data.generated_features)) {
                    setFeatures(data.generated_features);
                }
                
                if (data.generated_specifications && Array.isArray(data.generated_specifications)) {
                    const mappedSpecs = data.generated_specifications.map((s: any) => ({
                        property_ar: s.spec_key_ar || "",
                        property_en: s.spec_key_en || "",
                        value_ar: s.spec_value_ar || "",
                        value_en: s.spec_value_en || ""
                    }));
                    setSpecs(mappedSpecs);
                }
                
                if (data.generated_certifications && Array.isArray(data.generated_certifications)) {
                    const mappedCerts = data.generated_certifications.map((c: any) => ({
                        name: c.cert_name || c.cert_name_en || c.cert_name_ar || ""
                    })).filter((c: any) => c.name.trim() !== "");
                    setCertifications(mappedCerts);
                }

                toast.success("تم التوليد بنجاح ✨");
            } else {
                const err = await res.json();
                toast.error(err.error || "فشل توليد الوصف");
            }
        } catch (e) {
            toast.error("خطأ في الاتصال بالذكاء الاصطناعي");
        } finally {
            setIsGenerating(false);
        }
    };

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

    const handleGalleryUpload = async (file: File) => {
        if (!file) return;
        setGalleryUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setImages(prev => [...prev, { url: data.url }]);
            } else {
                setError("فشل رفع الصورة الإضافية");
            }
        } catch { setError("حدث خطأ أثناء الرفع"); }
        finally { setGalleryUploading(false); }
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
                price: form.price ? parseFloat(form.price) : null,
                price_unit_ar: form.price_unit_ar || null,
                price_unit_en: form.price_unit_en || null,
                categoryId: form.categoryId ? parseInt(form.categoryId) : null,
                features: features.filter(f => f.feature_ar || f.feature_en),
                technical_specs: specs.filter(s => s.property_ar || s.value_ar),
                packagings: packagings.filter(p => p.size_ar || p.size_en),
                certifications: certifications.filter(c => c.name),
                images: images.filter(i => i.url),
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                if (!isEditing) localStorage.removeItem('product-draft');
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
            {showDraftBanner && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <div>
                        <h3 className="text-amber-800 font-bold text-sm">يوجد مسودة غير محفوظة!</h3>
                        <p className="text-amber-700/80 text-xs mt-1">لقد قمت بإدخال بيانات سابقاً ولم يتم حفظها. هل تريد استعادتها؟</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={discardDraft} className="px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 rounded-lg transition-colors">إلغاء المسودة</button>
                        <button type="button" onClick={restoreDraft} className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors">استعادة البيانات</button>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">
                    <span>❌</span> {error}
                </div>
            )}

            {/* AI Provider Toggle */}
            <div className="flex items-center justify-end mb-4">
                <div className="bg-white border border-gray-200 rounded-xl p-1 inline-flex items-center shadow-sm">
                    <div className="text-xs font-bold text-gray-500 mr-4 ml-2">محرك الذكاء الاصطناعي:</div>
                    <button type="button" onClick={() => setAiProvider("huggingface")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${aiProvider === "huggingface" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>🤗 Hugging Face</button>
                    <button type="button" onClick={() => setAiProvider("gemini")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${aiProvider === "gemini" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>✨ Google Gemini</button>
                </div>
            </div>

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

                <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
                    <h3 className="font-bold text-sm text-slate-800">الوصف التسويقي</h3>
                    <button 
                        type="button" 
                        onClick={generateWithAI}
                        disabled={isGenerating || (!form.name_ar && !form.name_en)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {isGenerating ? "جاري التوليد..." : "توليد الوصف بالذكاء الاصطناعي"}
                    </button>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100 pt-5 mt-2">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">السعر الأساسي (ج.م)</label>
                        <input type="number" step="0.01" dir="ltr" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={`${inputCls} text-left`} placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">وحدة السعر (عربي)</label>
                        <input type="text" value={form.price_unit_ar} onChange={(e) => setForm({ ...form, price_unit_ar: e.target.value })} className={inputCls} placeholder="مثال: للجركن" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Price Unit (English)</label>
                        <div className="relative">
                            <input type="text" dir="ltr" value={form.price_unit_en} onChange={(e) => setForm({ ...form, price_unit_en: e.target.value })} className={`${inputCls} text-left pr-8`} placeholder="e.g. per jerry can" />
                            <button
                                type="button"
                                onClick={() => translateField(form.price_unit_ar, 'en', (val) => setForm({ ...form, price_unit_en: val }), 'price_unit_en')}
                                disabled={isTranslating === 'price_unit_en' || !form.price_unit_ar}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50"
                                title="Translate from Arabic using AI"
                            >
                                {isTranslating === 'price_unit_en' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                            </button>
                        </div>
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
                        <button type="button" onClick={() => setForm({ ...form, featured_image: "" })} className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
                            <X className="w-6 h-6" />
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
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-slate-400" />
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

            {/* ── Image Gallery (معرض الصور) ── */}
            <FormSection title="معرض الصور" icon={ImageIcon}>
                <div className="flex items-center justify-between -mt-2 mb-4">
                    <p className="text-xs text-slate-400">أضف صور إضافية للمنتج (تظهر بجوار الصورة الرئيسية)</p>
                    <button
                        type="button"
                        onClick={() => setIsAiModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors border border-purple-100"
                    >
                        <Wand2 className="w-4 h-4" />
                        استوديو الذكاء الاصطناعي
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="relative group p-2 bg-slate-50 border border-slate-100 rounded-xl aspect-square flex flex-col justify-center">
                            {img.url ? (
                                <img src={img.url} className="w-full h-full object-contain mix-blend-multiply" alt="Gallery item" />
                            ) : (
                                <input
                                    type="text" dir="ltr"
                                    value={img.url}
                                    onChange={(e) => { const arr = [...images]; arr[i].url = e.target.value; setImages(arr); }}
                                    className={`${miniInputCls} text-left mt-auto`}
                                    placeholder="/images/example.jpg"
                                />
                            )}
                            <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    
                    <div 
                        onClick={() => !galleryUploading && galleryInputRef.current?.click()} 
                        className={`aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-green-300 hover:bg-green-50/50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${galleryUploading ? "opacity-50 pointer-events-none" : "text-slate-400 hover:text-green-600"}`}
                    >
                        <input 
                            ref={galleryInputRef} 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp,image/svg+xml" 
                            className="hidden" 
                            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleGalleryUpload(file); e.target.value = ""; }} 
                        />
                        {galleryUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                        ) : (
                            <>
                                <Plus className="w-8 h-8" />
                                <span className="text-sm font-bold font-arabic">إضافة صورة</span>
                            </>
                        )}
                    </div>
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
                        <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-6 h-6" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setFeatures([...features, { feature_ar: "", feature_en: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-6 h-6" /> إضافة ميزة
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
                        <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-6 h-6" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setSpecs([...specs, { property_ar: "", property_en: "", value_ar: "", value_en: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-6 h-6" /> إضافة مواصفة
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
                            <div className="relative">
                                <input
                                    type="text" dir="ltr"
                                    value={pkg.size_en}
                                    onChange={(e) => { const arr = [...packagings]; arr[i].size_en = e.target.value; setPackagings(arr); }}
                                    className={`${miniInputCls} text-left pr-8`}
                                    placeholder="Size (EN) — e.g. 1 Liter"
                                />
                                <button
                                    type="button"
                                    onClick={() => translateField(pkg.size_ar, 'en', (val) => { const arr = [...packagings]; arr[i].size_en = val; setPackagings(arr); }, `pkg_${i}`)}
                                    disabled={isTranslating === `pkg_${i}` || !pkg.size_ar}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-50"
                                    title="Translate from Arabic using AI"
                                >
                                    {isTranslating === `pkg_${i}` ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                                </button>
                            </div>
                            <input
                                type="number" step="0.01" dir="ltr"
                                value={pkg.price}
                                onChange={(e) => { const arr = [...packagings]; arr[i].price = e.target.value; setPackagings(arr); }}
                                className={`${miniInputCls} text-left`}
                                placeholder="السعر (ج.م)"
                            />
                        </div>
                        <button type="button" onClick={() => setPackagings(packagings.filter((_, j) => j !== i))} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 mt-0.5">
                            <Trash2 className="w-6 h-6" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => setPackagings([...packagings, { size_ar: "", size_en: "", price: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-6 h-6" /> إضافة حجم تعبئة
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
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => setCertifications([...certifications, { name: "" }])} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <Plus className="w-6 h-6" /> إضافة شهادة
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

            <AiImageModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                onAccept={(url) => {
                    setImages([...images, { url }]);
                }} 
            />
        </form>
    );
}
