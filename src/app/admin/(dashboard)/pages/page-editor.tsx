"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageEditorProps {
    slug: string;
    pageNameAr: string;
    initialContent: string;
}

export function PageEditor({ slug, pageNameAr, initialContent }: PageEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState(initialContent);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // Validate JSON
            JSON.parse(content);

            const res = await fetch(`/api/admin/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                setSuccess(true);
                router.refresh();
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || "حدث خطأ أثناء حفظ المحتوى");
            }
        } catch (err: any) {
            if (err instanceof SyntaxError) {
                setError("صيغة JSON غير صحيحة. يرجى التأكد من صحة البيانات.");
            } else {
                setError("حدث خطأ في الاتصال");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold text-sm border border-red-100">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl font-bold text-sm border border-green-100">
                    ✅ تم حفظ المحتوى بنجاح
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
                    <h2 className="font-bold text-lg text-slate-800">محتوى الصفحة (JSON)</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        يمكنك تعديل محتوى الصفحة بتعديل البيانات أدناه بصيغة JSON
                    </p>
                </div>
                <div className="p-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                        dir="ltr"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-sm resize-y text-left bg-slate-50"
                        placeholder='{"sections": [...]}'
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Link
                    href="/admin/pages"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-bold transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                    العودة لقائمة الصفحات
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-md disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    حفظ المحتوى
                </button>
            </div>
        </form>
    );
}
