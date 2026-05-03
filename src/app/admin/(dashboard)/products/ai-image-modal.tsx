"use client";

import { useState, useRef } from "react";
import { X, Loader2, Sparkles, Image as ImageIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface AiImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (url: string) => void;
}

export function AiImageModal({ isOpen, onClose, onAccept }: AiImageModalProps) {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error("يرجى إدخال وصف للصورة المطلوبة");
            return;
        }

        setIsGenerating(true);
        setResultUrl("");

        try {
            const formData = new FormData();
            formData.append("prompt", prompt);
            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("/api/admin/generate-image", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setResultUrl(data.url);
                toast.success("تم توليد الصورة بنجاح ✨");
            } else {
                const data = await res.json();
                toast.error(data.error || "حدث خطأ أثناء توليد الصورة");
            }
        } catch (error) {
            toast.error("فشل الاتصال بخادم الذكاء الاصطناعي");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (resultUrl) {
            onAccept(resultUrl);
            handleClose();
        }
    };

    const handleClose = () => {
        setPrompt("");
        setImage(null);
        setImagePreview("");
        setResultUrl("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg text-slate-800">استوديو الصور 🪄</h2>
                            <p className="text-xs text-slate-500">توليد وتعديل الصور بالذكاء الاصطناعي</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Control Panel */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">وصف الصورة (Prompt) <span className="text-red-500">*</span></label>
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                dir="ltr"
                                placeholder="A professional studio photo of..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-left resize-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">يُفضل كتابة الوصف باللغة الإنجليزية للحصول على أفضل نتيجة</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">صورة مرجعية للتعديل (اختياري)</label>
                            {imagePreview ? (
                                <div className="relative group">
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                                        <img src={imagePreview} alt="Reference" className="w-full h-32 object-contain rounded-lg" />
                                    </div>
                                    <button 
                                        onClick={() => { setImage(null); setImagePreview(""); }} 
                                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                                >
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-500">ارفع صورة للتعديل عليها</p>
                                    <p className="text-xs text-slate-400 mt-1">سيقوم الذكاء الاصطناعي بتطبيق الوصف بناءً على هذه الصورة</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isGenerating ? "جاري التوليد (قد يستغرق بعض الوقت)..." : "توليد الصورة"}
                        </button>
                    </div>

                    {/* Result Panel */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-bold text-slate-700 mb-2">النتيجة</label>
                        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                            {isGenerating ? (
                                <div className="text-center">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
                                        <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 animate-pulse">يتم الآن رسم الصورة...</p>
                                </div>
                            ) : resultUrl ? (
                                <img src={resultUrl} alt="Generated" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">الصورة المولدة ستظهر هنا</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                {resultUrl && !isGenerating && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setResultUrl("")} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">
                            رفض (إعادة المحاولة)
                        </button>
                        <button type="button" onClick={handleAccept} className="px-6 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                            اعتماد وإضافة للمنتج
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
