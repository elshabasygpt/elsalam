"use client";

import { useState, useEffect } from "react";
import { Key, Save, AlertCircle, RefreshCw, Eye, EyeOff, Bot, ImageIcon, Settings2, Cpu } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ApiKeysPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showGemini, setShowGemini] = useState(false);
    const [showStability, setShowStability] = useState(false);
    const [showHuggingFace, setShowHuggingFace] = useState(false);

    const [form, setForm] = useState({
        geminiApiKey: "",
        stabilityApiKey: "",
        huggingFaceApiKey: "",
        textAiProvider: "gemini",
        imageAiProvider: "pollinations"
    });

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const res = await fetch("/api/admin/settings/apis");
                if (res.ok) {
                    const data = await res.json();
                    setForm({
                        geminiApiKey: data.geminiApiKey || "",
                        stabilityApiKey: data.stabilityApiKey || "",
                        huggingFaceApiKey: data.huggingFaceApiKey || "",
                        textAiProvider: data.textAiProvider || "gemini",
                        imageAiProvider: data.imageAiProvider || "pollinations"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch API keys", error);
                toast.error("فشل تحميل إعدادات الـ API");
            } finally {
                setLoading(false);
            }
        };
        fetchKeys();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings/apis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success("تم تحديث إعدادات الذكاء الاصطناعي بنجاح");
            } else {
                const err = await res.json();
                toast.error(err.error || "فشل التحديث");
            }
        } catch (error) {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const inputCls = "w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium font-mono placeholder:font-sans placeholder:text-slate-300";
    const selectCls = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer";

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">إدارة الذكاء الاصطناعي 🧠</h1>
                    <p className="text-slate-500 text-sm mt-1">تكوين وتحديث الموديلات ومفاتيح الخدمات الخارجية المستخدمة في المنصة.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* AI Providers Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">مزودو خدمات الذكاء الاصطناعي</h2>
                            <p className="text-xs text-slate-500 mt-0.5">اختر الموديلات والشركات التي ترغب في استخدامها.</p>
                        </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Text Provider */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Bot className="w-4 h-4 text-emerald-500" />
                                مزود توليد النصوص والأوصاف
                            </label>
                            <select 
                                value={form.textAiProvider}
                                onChange={(e) => setForm({...form, textAiProvider: e.target.value})}
                                className={selectCls}
                            >
                                <option value="gemini">Google Gemini (ينصح به)</option>
                                <option value="huggingface">Hugging Face (Qwen 2.5)</option>
                            </select>
                            <p className="text-xs text-slate-500">لإنشاء المميزات والمواصفات الفنية بشكل آلي.</p>
                        </div>

                        {/* Image Provider */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <ImageIcon className="w-4 h-4 text-purple-500" />
                                مزود توليد وتعديل الصور
                            </label>
                            <select 
                                value={form.imageAiProvider}
                                onChange={(e) => setForm({...form, imageAiProvider: e.target.value})}
                                className={selectCls}
                            >
                                <option value="pollinations">Pollinations AI (مجاني وسريع)</option>
                                <option value="stability">Stability AI (مدفوع - يدعم تعديل الصور)</option>
                                <option value="imagen">Imagen 3 (متاح فقط للحسابات المدفوعة في جوجل)</option>
                            </select>
                            <p className="text-xs text-slate-500">يستخدم في "استوديو الصور" لمنتجاتك.</p>
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Key className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">مفاتيح الربط (API Keys)</h2>
                            <p className="text-xs text-slate-500 mt-0.5">في حال ترك الحقل فارغاً، سيتم استخدام المفتاح الافتراضي المخزن في السيرفر.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Gemini API Key */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Bot className="w-4 h-4 text-emerald-500" />
                                    Google Gemini API Key
                                </label>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                                    الحصول على المفتاح ↗
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showGemini ? "text" : "password"}
                                    value={form.geminiApiKey}
                                    onChange={(e) => setForm({ ...form, geminiApiKey: e.target.value })}
                                    className={inputCls}
                                    placeholder="AIzaSy..................."
                                    dir="ltr"
                                />
                                <div className="absolute top-0 left-0 h-full w-12 flex items-center justify-center text-slate-400">
                                    <Key className="w-5 h-5" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowGemini(!showGemini)}
                                    className="absolute top-0 right-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">مطلوب لاستخدام Gemini في النصوص، أو Imagen 3 في الصور.</p>
                        </div>

                        {/* Stability API Key */}
                        {form.imageAiProvider === 'stability' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <ImageIcon className="w-4 h-4 text-purple-500" />
                                        Stability AI Key
                                    </label>
                                    <a href="https://platform.stability.ai/account/keys" target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                                        الحصول على المفتاح ↗
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showStability ? "text" : "password"}
                                        value={form.stabilityApiKey}
                                        onChange={(e) => setForm({ ...form, stabilityApiKey: e.target.value })}
                                        className={inputCls}
                                        placeholder="sk-......................"
                                        dir="ltr"
                                    />
                                    <div className="absolute top-0 left-0 h-full w-12 flex items-center justify-center text-slate-400">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowStability(!showStability)}
                                        className="absolute top-0 right-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showStability ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">يُستخدم حصرياً إذا اخترت Stability كمزود للصور.</p>
                            </div>
                        )}

                        {/* Hugging Face API Key */}
                        {form.textAiProvider === 'huggingface' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Cpu className="w-4 h-4 text-yellow-500" />
                                        Hugging Face Token
                                    </label>
                                    <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
                                        الحصول على المفتاح ↗
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showHuggingFace ? "text" : "password"}
                                        value={form.huggingFaceApiKey}
                                        onChange={(e) => setForm({ ...form, huggingFaceApiKey: e.target.value })}
                                        className={inputCls}
                                        placeholder="hf_......................"
                                        dir="ltr"
                                    />
                                    <div className="absolute top-0 left-0 h-full w-12 flex items-center justify-center text-slate-400">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowHuggingFace(!showHuggingFace)}
                                        className="absolute top-0 right-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showHuggingFace ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">يُستخدم إذا اخترت استخدام موديلات Hugging Face للنصوص.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                        >
                            {saving ? (
                                <><RefreshCw className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
                            ) : (
                                <><Save className="w-4 h-4" /> حفظ التغييرات</>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {form.imageAiProvider === 'imagen' && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-orange-800 text-sm">تنبيه بخصوص Imagen 3</h3>
                        <p className="text-orange-700/80 text-xs mt-1 leading-relaxed">
                            موديل Imagen 3 متاح فقط للحسابات التي قامت بتفعيل الفوترة (Paid Plan) في Google AI Studio. إذا كان حسابك مجانياً بالكامل، فلن يتمكن النظام من توليد الصور.
                        </p>
                    </div>
                </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-blue-800 text-sm">ملاحظة حول أمان البيانات</h3>
                    <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">
                        يتم تخزين هذه المفاتيح وتفضيلات الموديلات بشكل آمن في قاعدة البيانات وسيتم تفعيلها فوراً في جميع أنحاء النظام.
                    </p>
                </div>
            </div>
        </div>
    );
}
