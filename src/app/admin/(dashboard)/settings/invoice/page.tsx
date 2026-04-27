"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/atoms/Container";
import { Save, Loader2, FileText, LayoutTemplate, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function InvoiceSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        invoiceShowLogo: true,
        invoiceNotesAr: "",
        invoiceNotesEn: "",
        invoiceLogoUrl: "",
        invoiceLogoSize: 64,
        invoiceColor: "#15803d",
        invoiceSubtitle: "Industrial High-Quality Oils & Fats",
        invoiceWebsiteUrl: "www.elsalamoils.com",
        invoiceCompanyDetails: ""
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings/invoice", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    invoiceShowLogo: data.invoiceShowLogo !== undefined ? data.invoiceShowLogo : true,
                    invoiceNotesAr: data.invoiceNotesAr || "",
                    invoiceNotesEn: data.invoiceNotesEn || "",
                    invoiceLogoUrl: data.invoiceLogoUrl || "",
                    invoiceLogoSize: data.invoiceLogoSize || 64,
                    invoiceColor: data.invoiceColor || "#15803d",
                    invoiceSubtitle: data.invoiceSubtitle !== null && data.invoiceSubtitle !== undefined ? data.invoiceSubtitle : "Industrial High-Quality Oils & Fats",
                    invoiceWebsiteUrl: data.invoiceWebsiteUrl !== null && data.invoiceWebsiteUrl !== undefined ? data.invoiceWebsiteUrl : "www.elsalamoils.com",
                    invoiceCompanyDetails: data.invoiceCompanyDetails || ""
                });
            }
        } catch (error) {
            toast.error("حدث خطأ في تحميل الإعدادات");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings/invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("تم حفظ إعدادات الفاتورة بنجاح");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);

        setUploading(true);
        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: data,
            });

            if (res.ok) {
                const result = await res.json();
                setFormData({ ...formData, invoiceLogoUrl: result.url });
                toast.success("تم رفع الشعار بنجاح");
            } else {
                const err = await res.json();
                toast.error(err.error || "فشل في رفع الصورة");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء رفع الصورة");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl font-arabic" dir="rtl">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">إعدادات الفاتورة</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">تخصيص شكل وبيانات الفواتير المطبوعة</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>حفظ التعديلات</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Visual Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <LayoutTemplate className="w-6 h-6 text-slate-600" />
                        <h2 className="font-bold text-slate-800 text-lg">إعدادات المظهر</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Show Logo Toggle */}
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.invoiceShowLogo}
                                    onChange={(e) => setFormData({ ...formData, invoiceShowLogo: e.target.checked })}
                                    className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.invoiceShowLogo ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                <div className={`absolute w-4 h-4 bg-white rounded-full transition-transform top-1 ${formData.invoiceShowLogo ? 'left-1' : 'right-1'}`}></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-green-600 transition-colors">عرض شعار الموقع في الفاتورة</h3>
                                <p className="text-sm text-slate-500 mt-1">إذا تم تفعيل هذا الخيار، سيظهر الشعار الخاص بالموقع في رأس الفاتورة بدلاً من اسم الموقع النصي.</p>
                            </div>
                        </label>

                        {/* Invoice Specific Logo */}
                        <div className={`pt-4 border-t border-slate-100 transition-all ${!formData.invoiceShowLogo ? "opacity-50 pointer-events-none" : ""}`}>
                            <label className="block font-bold text-slate-700 mb-2">شعار الفاتورة المخصص (اختياري)</label>
                            <p className="text-sm text-slate-500 mb-4">اذا أردت عرض شعار مختلف في الفاتورة عن شعار الموقع الأساسي، يمكنك رفعه هنا.</p>
                            <div className="flex items-end gap-6">
                                <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden relative group">
                                    {formData.invoiceLogoUrl ? (
                                        <>
                                            <img src={formData.invoiceLogoUrl} alt="Invoice Logo" className="max-w-full max-h-full object-contain p-2" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => setFormData({ ...formData, invoiceLogoUrl: "" })} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">إزالة</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <span className="text-xs font-bold text-slate-400">لا يوجد شعار</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <input type="file" id="invoiceLogoUpload" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                                    <label htmlFor="invoiceLogoUpload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-2.5">
                                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                                        <span>{formData.invoiceLogoUrl ? "تغيير الشعار" : "رفع شعار جديد"}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Logo Size Control */}
                            <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="block font-bold text-slate-700 mb-2 flex justify-between items-center">
                                    <span>حجم الشعار في الفاتورة</span>
                                    <span className="text-green-600 font-mono text-sm bg-green-50 px-2 py-1 rounded-md">{formData.invoiceLogoSize}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="32"
                                    max="200"
                                    step="4"
                                    value={formData.invoiceLogoSize}
                                    onChange={(e) => setFormData({ ...formData, invoiceLogoSize: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                    <span>صغير جداً</span>
                                    <span>متوسط</span>
                                    <span>كبير جداً</span>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Color Picker */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block font-bold text-slate-700 mb-2">اللون الأساسي للفاتورة</label>
                            <p className="text-sm text-slate-500 mb-4">يُستخدم هذا اللون لتميز العناوين والإجماليات في الفاتورة.</p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={formData.invoiceColor}
                                    onChange={(e) => setFormData({ ...formData, invoiceColor: e.target.value })}
                                    className="w-12 h-12 p-1 rounded-lg border-none cursor-pointer bg-slate-100"
                                />
                                <input
                                    type="text"
                                    value={formData.invoiceColor}
                                    onChange={(e) => setFormData({ ...formData, invoiceColor: e.target.value })}
                                    className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 uppercase font-mono text-slate-700"
                                    placeholder="#15803d"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* Subtitle / Slogan */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block font-bold text-slate-700 mb-2">النص الفرعي للشعار (Slogan / Subtitle)</label>
                            <p className="text-sm text-slate-500 mb-3">هذا هو النص الذي يظهر بجوار أو أسفل اسم الموقع في الفاتورة (مثل: Industrial High-Quality Oils & Fats).</p>
                            <input
                                type="text"
                                value={formData.invoiceSubtitle}
                                onChange={(e) => setFormData({ ...formData, invoiceSubtitle: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                placeholder="مثال: زيوت ودهون نباتية عالية الجودة"
                            />
                        </div>

                        {/* Website URL */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block font-bold text-slate-700 mb-2">رابط الموقع في التذييل (Website URL)</label>
                            <p className="text-sm text-slate-500 mb-3">رابط الموقع الذي يظهر في أسفل الفاتورة (يُمكن تركه فارغاً لإخفائه).</p>
                            <input
                                type="text"
                                value={formData.invoiceWebsiteUrl}
                                onChange={(e) => setFormData({ ...formData, invoiceWebsiteUrl: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                placeholder="www.elsalamoils.com"
                                dir="ltr"
                            />
                        </div>

                        {/* Company Details (Tax Info) */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block font-bold text-slate-700 mb-2">البيانات الرسمية للشركة (تظهر أعلى الفاتورة)</label>
                            <p className="text-sm text-slate-500 mb-3">أضف هنا السجل التجاري، البطاقة الضريبية، أو أي تفاصيل رسمية تريد ظهورها تحت اسم الشركة في الفاتورة.</p>
                            <textarea
                                value={formData.invoiceCompanyDetails}
                                onChange={(e) => setFormData({ ...formData, invoiceCompanyDetails: e.target.value })}
                                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-y"
                                placeholder="مثال: س.ت: 12345 | ب.ض: 987-654-321&#10;العنوان: المنطقة الصناعية..."
                            />
                        </div>
                    </div>
                </div>

                {/* Notes Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-slate-600" />
                        <h2 className="font-bold text-slate-800 text-lg">ملاحظات الفاتورة الثابتة</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block font-bold text-slate-700 mb-2">ملاحظات وتذييل الفاتورة (عربي)</label>
                            <p className="text-sm text-slate-500 mb-3">النص الذي سيظهر في أسفل الفاتورة للعملاء (مثل: شروط الاسترجاع، عبارة شكر، أرقام تواصل...)</p>
                            <textarea
                                value={formData.invoiceNotesAr}
                                onChange={(e) => setFormData({ ...formData, invoiceNotesAr: e.target.value })}
                                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-y"
                                placeholder="مثال: البضاعة المباعة لا ترد ولا تستبدل إلا خلال 14 يوماً..."
                            />
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                            <label className="block font-bold text-slate-700 mb-2">ملاحظات وتذييل الفاتورة (إنجليزي)</label>
                            <textarea
                                value={formData.invoiceNotesEn}
                                onChange={(e) => setFormData({ ...formData, invoiceNotesEn: e.target.value })}
                                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-y"
                                placeholder="Example: Goods sold are not refundable except within 14 days..."
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
