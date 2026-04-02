"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Plus, Pencil, Trash2, Loader2, Newspaper, X, Save, Calendar,
    Star, Tag, Upload, Eye, EyeOff, Search, Clock, Globe,
    Bold, Italic, Heading1, Heading2, List, ListOrdered, Link2, Quote,
    Minus, ChevronDown, ChevronUp, ImageIcon, FileText, Send, Timer
} from "lucide-react";

/* ─── Types ─── */
interface NewsItem {
    id: number; slug: string; title_ar: string; title_en: string;
    excerpt_ar?: string; excerpt_en?: string; content_ar?: string; content_en?: string;
    category: string; tags?: string; featured_image?: string; image_alt?: string;
    meta_title?: string; meta_description?: string;
    is_featured: boolean; is_published: boolean;
    published_at?: string; scheduled_at?: string; createdAt: string;
}

const CATEGORIES = [
    { value: "news", label: "أخبار", icon: "📰", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { value: "interviews", label: "لقاءات", icon: "🎤", color: "bg-purple-50 text-purple-700 border-purple-100" },
    { value: "factory_tours", label: "جولات المصنع", icon: "🏭", color: "bg-green-50 text-green-700 border-green-100" },
    { value: "exhibitions", label: "معارض", icon: "🎪", color: "bg-amber-50 text-amber-700 border-amber-100" },
];

const EMPTY_FORM = {
    title_ar: "", title_en: "", slug: "",
    excerpt_ar: "", excerpt_en: "",
    content_ar: "", content_en: "",
    category: "news", tags: "", featured_image: "", image_alt: "",
    meta_title: "", meta_description: "",
    is_featured: false, is_published: false, scheduled_at: "",
};

/* ─── Rich Text Toolbar Component ─── */
function RichToolbar({ textareaRef }: { textareaRef: React.RefObject<HTMLTextAreaElement | null> }) {
    const wrap = (before: string, after: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.substring(start, end) || "نص";
        const newValue = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")!.set!;
        nativeSetter.call(ta, newValue);
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.focus();
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
    };

    const insertLine = (prefix: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
        const newValue = ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart);
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")!.set!;
        nativeSetter.call(ta, newValue);
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.focus();
    };

    const btn = "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all";

    return (
        <div className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-slate-100 bg-slate-50/50">
            <button type="button" onClick={() => wrap("**", "**")} className={btn} title="غامق"><Bold className="w-5 h-5" /></button>
            <button type="button" onClick={() => wrap("*", "*")} className={btn} title="مائل"><Italic className="w-5 h-5" /></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button type="button" onClick={() => insertLine("# ")} className={btn} title="عنوان رئيسي"><Heading1 className="w-5 h-5" /></button>
            <button type="button" onClick={() => insertLine("## ")} className={btn} title="عنوان فرعي"><Heading2 className="w-5 h-5" /></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button type="button" onClick={() => insertLine("- ")} className={btn} title="قائمة"><List className="w-5 h-5" /></button>
            <button type="button" onClick={() => insertLine("1. ")} className={btn} title="قائمة مرقمة"><ListOrdered className="w-5 h-5" /></button>
            <button type="button" onClick={() => insertLine("> ")} className={btn} title="اقتباس"><Quote className="w-5 h-5" /></button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button type="button" onClick={() => wrap("[", "](https://)")} className={btn} title="رابط"><Link2 className="w-5 h-5" /></button>
            <button type="button" onClick={() => insertLine("---\n")} className={btn} title="فاصل"><Minus className="w-5 h-5" /></button>
        </div>
    );
}

/* ─── Collapsible Panel ─── */
function SidebarPanel({ title, icon: Icon, defaultOpen = true, children }: {
    title: string; icon: any; defaultOpen?: boolean; children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <button type="button" onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{title}</span>
                </div>
                {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {open && <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">{children}</div>}
        </div>
    );
}

/* ─── Reading Time Estimator ─── */
function estimateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

/* ─── Main Component ─── */
export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageUploading, setImageUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [activeContentTab, setActiveContentTab] = useState<"ar" | "en">("ar");
    const [tagInput, setTagInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const contentArRef = useRef<HTMLTextAreaElement>(null);
    const contentEnRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/news");
            if (res.ok) setNews(await res.json());
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchNews(); }, []);

    const generateSlug = (name: string) =>
        name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setShowEditor(false); setError(""); setShowPreview(false); };

    const startEdit = (item: NewsItem) => {
        setForm({
            title_ar: item.title_ar, title_en: item.title_en, slug: item.slug,
            excerpt_ar: item.excerpt_ar || "", excerpt_en: item.excerpt_en || "",
            content_ar: item.content_ar || "", content_en: item.content_en || "",
            category: item.category, tags: item.tags || "",
            featured_image: item.featured_image || "", image_alt: item.image_alt || "",
            meta_title: item.meta_title || "", meta_description: item.meta_description || "",
            is_featured: item.is_featured, is_published: item.is_published,
            scheduled_at: item.scheduled_at ? new Date(item.scheduled_at).toISOString().slice(0, 16) : "",
        });
        setEditingId(item.id);
        setShowEditor(true);
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) { setError("حجم الملف يتجاوز 10MB"); return; }
        setImageUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
            if (res.ok) {
                const data = await res.json();
                setForm(prev => ({ ...prev, featured_image: data.url }));
            }
        } catch { }
        setImageUploading(false);
    };

    const addTag = (tag: string) => {
        const t = tag.trim();
        if (!t) return;
        const current = form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [];
        if (!current.includes(t)) {
            setForm(prev => ({ ...prev, tags: [...current, t].join(", ") }));
        }
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        const current = form.tags.split(",").map(s => s.trim()).filter(Boolean);
        setForm(prev => ({ ...prev, tags: current.filter(t => t !== tagToRemove).join(", ") }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title_ar || !form.title_en || !form.slug) { setError("العنوان والرابط مطلوبان"); return; }
        setSaving(true); setError("");
        try {
            const url = editingId ? `/api/admin/news/${editingId}` : "/api/admin/news";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method, headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) { resetForm(); fetchNews(); }
            else { const d = await res.json(); setError(d.error || "حدث خطأ"); }
        } catch { setError("حدث خطأ في الاتصال"); }
        setSaving(false);
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
        try {
            const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
            if (res.ok) fetchNews();
        } catch { }
    };

    const togglePublish = async (item: NewsItem) => {
        try {
            await fetch(`/api/admin/news/${item.id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...item, is_published: !item.is_published }),
            });
            fetchNews();
        } catch { }
    };

    const getCatInfo = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];

    const filteredNews = news.filter(item => {
        const matchSearch = !searchQuery || item.title_ar.includes(searchQuery) || item.title_en.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = !filterCategory || item.category === filterCategory;
        return matchSearch && matchCat;
    });

    const stats = { total: news.length, published: news.filter(n => n.is_published).length, featured: news.filter(n => n.is_featured).length, draft: news.filter(n => !n.is_published).length };
    const readingTime = estimateReadingTime((form.content_ar || "") + " " + (form.content_en || ""));
    const wordCount = ((form.content_ar || "") + " " + (form.content_en || "")).trim().split(/\s+/).filter(Boolean).length;
    const tags = form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [];

    const inputCls = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm placeholder:text-slate-300";

    /* ─── EDITOR VIEW ─── */
    if (showEditor) {
        return (
            <form onSubmit={handleSubmit} className="min-h-[80vh]">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">
                                {editingId ? "تعديل المقال" : "مقال جديد"}
                            </h1>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Timer className="w-5 h-5" /> {readingTime} دقيقة قراءة
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    {wordCount} كلمة
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${showPreview ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                            <Eye className="w-5 h-5" /> معاينة
                        </button>
                        <button type="button" onClick={() => setForm({ ...form, is_published: false })} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                            <FileText className="w-5 h-5" /> حفظ مسودة
                        </button>
                        <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-l from-green-600 to-green-700 text-white rounded-lg text-xs font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {editingId ? "حفظ التعديلات" : "نشر المقال"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">❌ {error}</div>
                )}

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    {/* ━━ LEFT: Content ━━ */}
                    <div className="space-y-5">
                        {/* Title AR */}
                        <input
                            type="text"
                            value={form.title_ar}
                            onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                            className="w-full px-0 py-3 text-2xl font-black text-slate-800 border-0 border-b-2 border-transparent focus:border-green-500 bg-transparent outline-none placeholder:text-slate-200 transition-colors"
                            placeholder="عنوان المقال بالعربية..."
                        />
                        {/* Title EN */}
                        <input
                            type="text" dir="ltr"
                            value={form.title_en}
                            onChange={(e) => {
                                setForm({ ...form, title_en: e.target.value, slug: form.slug || generateSlug(e.target.value) });
                            }}
                            className="w-full px-0 py-2 text-lg font-bold text-slate-500 border-0 border-b border-transparent focus:border-green-400 bg-transparent outline-none placeholder:text-slate-200 text-left transition-colors"
                            placeholder="Article title in English..."
                        />

                        {/* Slug */}
                        <div className="flex items-center gap-2 py-1">
                            <span className="text-[11px] font-bold text-slate-400 shrink-0">🔗 الرابط:</span>
                            <input
                                type="text" dir="ltr"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="flex-1 px-2 py-1 bg-slate-50 rounded-md border border-slate-100 text-[11px] font-mono text-slate-500 outline-none focus:ring-1 focus:ring-green-500/30 text-left"
                                placeholder="article-slug"
                            />
                        </div>

                        {/* Excerpts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المقتطف (عربي)</label>
                                <textarea
                                    value={form.excerpt_ar}
                                    onChange={(e) => setForm({ ...form, excerpt_ar: e.target.value })}
                                    rows={2} className={`${inputCls} resize-none`}
                                    placeholder="ملخص قصير يظهر في قوائم الأخبار..."
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">Excerpt (English)</label>
                                <textarea dir="ltr"
                                    value={form.excerpt_en}
                                    onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })}
                                    rows={2} className={`${inputCls} resize-none text-left`}
                                    placeholder="Short summary for news listings..."
                                />
                            </div>
                        </div>

                        {/* Content Tab Switcher */}
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="flex items-center border-b border-gray-100">
                                <button type="button" onClick={() => setActiveContentTab("ar")} className={`flex-1 px-4 py-2.5 text-sm font-bold transition-all ${activeContentTab === "ar" ? "text-green-700 bg-green-50 border-b-2 border-green-500" : "text-slate-400 hover:text-slate-600"}`}>
                                    المحتوى (عربي)
                                </button>
                                <button type="button" onClick={() => setActiveContentTab("en")} className={`flex-1 px-4 py-2.5 text-sm font-bold transition-all ${activeContentTab === "en" ? "text-green-700 bg-green-50 border-b-2 border-green-500" : "text-slate-400 hover:text-slate-600"}`}>
                                    Content (English)
                                </button>
                            </div>

                            {activeContentTab === "ar" ? (
                                <>
                                    <RichToolbar textareaRef={contentArRef} />
                                    {showPreview ? (
                                        <div className="p-5 prose prose-sm max-w-none min-h-[320px] text-slate-700 leading-loose" style={{ direction: "rtl" }}>
                                            {form.content_ar.split("\n").map((line, i) => {
                                                if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-black mb-2">{line.slice(2)}</h1>;
                                                if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mb-2">{line.slice(3)}</h2>;
                                                if (line.startsWith("> ")) return <blockquote key={i} className="border-r-4 border-green-400 pr-4 my-2 text-slate-500 italic">{line.slice(2)}</blockquote>;
                                                if (line.startsWith("- ")) return <li key={i} className="mr-4">{line.slice(2)}</li>;
                                                if (line === "---") return <hr key={i} className="my-4" />;
                                                if (!line.trim()) return <br key={i} />;
                                                return <p key={i} className="mb-1">{line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>;
                                            })}
                                        </div>
                                    ) : (
                                        <textarea
                                            ref={contentArRef}
                                            value={form.content_ar}
                                            onChange={(e) => setForm({ ...form, content_ar: e.target.value })}
                                            rows={15}
                                            className="w-full px-5 py-4 bg-white outline-none text-sm text-slate-700 resize-none placeholder:text-slate-300 leading-loose"
                                            placeholder="اكتب محتوى المقال هنا...

يمكنك استخدام تنسيقات Markdown:
**نص غامق** أو *نص مائل*
# عنوان رئيسي
## عنوان فرعي
- نقطة في قائمة
> اقتباس"
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <RichToolbar textareaRef={contentEnRef} />
                                    {showPreview ? (
                                        <div className="p-5 prose prose-sm max-w-none min-h-[320px] text-slate-700 leading-relaxed" dir="ltr">
                                            {form.content_en.split("\n").map((line, i) => {
                                                if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-black mb-2">{line.slice(2)}</h1>;
                                                if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mb-2">{line.slice(3)}</h2>;
                                                if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-green-400 pl-4 my-2 text-slate-500 italic">{line.slice(2)}</blockquote>;
                                                if (line.startsWith("- ")) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                                                if (line === "---") return <hr key={i} className="my-4" />;
                                                if (!line.trim()) return <br key={i} />;
                                                return <p key={i} className="mb-1">{line}</p>;
                                            })}
                                        </div>
                                    ) : (
                                        <textarea
                                            ref={contentEnRef} dir="ltr"
                                            value={form.content_en}
                                            onChange={(e) => setForm({ ...form, content_en: e.target.value })}
                                            rows={15}
                                            className="w-full px-5 py-4 bg-white outline-none text-sm text-slate-700 resize-none placeholder:text-slate-300 leading-relaxed text-left"
                                            placeholder="Write your article content here...

You can use Markdown formatting:
**bold text** or *italic text*
# Main heading
## Sub heading
- Bullet point
> Quote"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* ━━ RIGHT: Sidebar Settings ━━ */}
                    <div className="space-y-4">
                        {/* Publish Panel */}
                        <SidebarPanel title="النشر" icon={Send} defaultOpen={true}>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between gap-3 cursor-pointer">
                                    <span className="text-xs font-bold text-slate-600">حالة النشر</span>
                                    <div className="relative">
                                        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-green-500 transition-colors" />
                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                                    </div>
                                </label>
                                <div className={`text-[10px] px-2 py-1 rounded-md font-bold text-center ${form.is_published ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}`}>
                                    {form.is_published ? "🟢 سيتم النشر فوراً" : "📝 مسودة — غير منشور"}
                                </div>

                                <label className="flex items-center justify-between gap-3 cursor-pointer">
                                    <span className="text-xs font-bold text-slate-600">خبر مميز ⭐</span>
                                    <div className="relative">
                                        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-amber-500 transition-colors" />
                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                                    </div>
                                </label>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">جدولة النشر</label>
                                    <input
                                        type="datetime-local"
                                        value={form.scheduled_at}
                                        onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                                        className={`${inputCls} text-xs`}
                                    />
                                    {form.scheduled_at && (
                                        <p className="text-[10px] text-blue-500 mt-1 font-bold">⏰ سيتم النشر تلقائياً في {new Date(form.scheduled_at).toLocaleDateString("ar-EG", { dateStyle: "long" })}</p>
                                    )}
                                </div>
                            </div>
                        </SidebarPanel>

                        {/* Category */}
                        <SidebarPanel title="التصنيف" icon={Tag} defaultOpen={true}>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, category: cat.value })}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${form.category === cat.value ? `${cat.color} ring-2 ring-offset-1 ring-green-500/30` : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"}`}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </SidebarPanel>

                        {/* Tags */}
                        <SidebarPanel title="الوسوم" icon={Tag} defaultOpen={true}>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold border border-blue-100">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-blue-400 hover:text-red-500 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1.5">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                                    className={`${inputCls} text-xs`}
                                    placeholder="أضف وسم + Enter"
                                />
                                <button type="button" onClick={() => addTag(tagInput)} className="px-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all shrink-0">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </SidebarPanel>

                        {/* Featured Image */}
                        <SidebarPanel title="صورة الغلاف" icon={ImageIcon} defaultOpen={true}>
                            {form.featured_image ? (
                                <div className="relative group">
                                    <img src={form.featured_image} alt="Preview" className="w-full rounded-lg object-cover max-h-40" />
                                    <button type="button" onClick={() => setForm({ ...form, featured_image: "" })} className="absolute top-1.5 left-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${dragOver ? "border-green-400 bg-green-50/50" : "border-slate-200 hover:border-green-300"} ${imageUploading ? "pointer-events-none opacity-50" : ""}`}
                                >
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
                                    {imageUploading ? (
                                        <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                            <p className="text-[11px] text-slate-400 font-medium">اسحب صورة أو اضغط للرفع</p>
                                        </>
                                    )}
                                </div>
                            )}
                            <input
                                type="text"
                                value={form.image_alt}
                                onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
                                className={`${inputCls} text-xs`}
                                placeholder="النص البديل للصورة (Alt)"
                            />
                        </SidebarPanel>

                        {/* SEO */}
                        <SidebarPanel title="تحسين محركات البحث (SEO)" icon={Globe} defaultOpen={false}>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">عنوان Meta</label>
                                    <input type="text" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className={`${inputCls} text-xs`} placeholder={form.title_ar || "عنوان الصفحة في محركات البحث"} />
                                    <div className={`text-[10px] mt-1 ${(form.meta_title || form.title_ar).length > 60 ? "text-red-400" : "text-slate-300"}`}>
                                        {(form.meta_title || form.title_ar).length}/60 حرف
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">وصف Meta</label>
                                    <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={3} className={`${inputCls} text-xs resize-none`} placeholder={form.excerpt_ar || "وصف يظهر في نتائج البحث..."} />
                                    <div className={`text-[10px] mt-1 ${(form.meta_description || form.excerpt_ar || "").length > 160 ? "text-red-400" : "text-slate-300"}`}>
                                        {(form.meta_description || form.excerpt_ar || "").length}/160 حرف
                                    </div>
                                </div>
                                {/* SEO Preview */}
                                <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-300 mb-1 font-bold">معاينة Google</p>
                                    <p className="text-blue-700 text-xs font-bold truncate">{form.meta_title || form.title_ar || "عنوان المقال"}</p>
                                    <p className="text-green-700 text-[10px] font-mono truncate" dir="ltr">elsalam.com/news/{form.slug || "article-slug"}</p>
                                    <p className="text-slate-500 text-[10px] line-clamp-2 mt-0.5">{form.meta_description || form.excerpt_ar || "وصف المقال..."}</p>
                                </div>
                            </div>
                        </SidebarPanel>
                    </div>
                </div>
            </form>
        );
    }

    /* ─── LIST VIEW ─── */
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">إدارة الأخبار</h1>
                    <p className="text-slate-400 text-sm mt-1">الأخبار والمقالات المعروضة في المركز الإعلامي</p>
                </div>
                <button onClick={() => { resetForm(); setShowEditor(true); }} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 active:scale-[0.97]">
                    <Plus className="w-5 h-5" /> إضافة خبر جديد
                </button>
            </div>

            {!loading && news.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "إجمالي", count: stats.total, icon: Newspaper, color: "text-blue-600 bg-blue-50" },
                        { label: "منشور", count: stats.published, icon: Eye, color: "text-green-600 bg-green-50" },
                        { label: "مسودة", count: stats.draft, icon: EyeOff, color: "text-slate-500 bg-slate-50" },
                        { label: "مميز", count: stats.featured, icon: Star, color: "text-amber-600 bg-amber-50" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
                            <div>
                                <div className="text-xl font-black text-slate-800">{s.count}</div>
                                <div className="text-[11px] text-slate-400 font-medium">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && news.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none" placeholder="بحث في الأخبار..." />
                    </div>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none">
                        <option value="">— جميع التصنيفات —</option>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                    </select>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>
            ) : news.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="mx-auto mb-5 w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center"><Newspaper className="w-10 h-10 text-blue-300" /></div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">لا توجد أخبار بعد</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">ابدأ بإضافة أول خبر أو مقال للمركز الإعلامي.</p>
                    <button onClick={() => { resetForm(); setShowEditor(true); }} className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                        <Plus className="w-5 h-5" /> إضافة خبر جديد
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-gray-50">
                        <span className="text-sm text-slate-500 font-medium">عرض: <span className="font-bold text-slate-700">{filteredNews.length}</span> من أصل {news.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-gray-100">
                                    <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">الصورة</th>
                                    <th className="text-right px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">العنوان</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">التصنيف</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">الحالة</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">التاريخ</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredNews.map((item) => {
                                    const cat = getCatInfo(item.category);
                                    return (
                                        <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-5 py-3">
                                                {item.featured_image ? (
                                                    <img src={item.featured_image} alt="" className="w-16 h-12 rounded-lg object-cover border border-slate-100" />
                                                ) : (
                                                    <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center"><Newspaper className="w-6 h-6 text-slate-300" /></div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="min-w-0 max-w-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="font-bold text-slate-800 text-sm truncate">{item.title_ar}</div>
                                                        {item.is_featured && <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 truncate">{item.title_en}</div>
                                                    {item.tags && (
                                                        <div className="flex gap-1 mt-1">
                                                            {item.tags.split(",").slice(0, 3).map((tag, i) => (
                                                                <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">{tag.trim()}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border ${cat.color}`}>
                                                    {cat.icon} {cat.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <button onClick={() => togglePublish(item)} className="transition-all">
                                                    {item.is_published ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100 hover:bg-green-100">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                            منشور
                                                        </span>
                                                    ) : item.scheduled_at ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100 hover:bg-blue-100">
                                                            <Clock className="w-5 h-5" /> مجدول
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 hover:bg-slate-100">
                                                            مسودة
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className="text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => startEdit(item)} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-100" title="تعديل"><Pencil className="w-5 h-5" /></button>
                                                    <button onClick={() => handleDelete(item.id, item.title_ar)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-100" title="حذف"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
