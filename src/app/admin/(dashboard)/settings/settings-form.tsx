"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Loader2, Building2, Phone, Globe, CheckCircle2,
    Users, Shield, Plus, Pencil, Trash2, X, Eye, EyeOff,
    Settings, UserPlus, Crown, User, Lock, Mail, KeyRound,
    AlertTriangle, Upload, ImageIcon
} from "lucide-react";

interface SettingsData {
    id: string; siteNameAr: string; siteNameEn: string;
    siteDescriptionAr: string; siteDescriptionEn: string;
    contactEmail: string; contactPhone: string;
    addressAr: string; addressEn: string;
    facebookUrl: string; twitterUrl: string; instagramUrl: string; linkedinUrl: string;
    smtpHost: string; smtpPort: number; smtpUser: string; smtpPass: string;
    smtpFrom: string; smtpFromName: string; smtpSecure: string;
    imapHost: string; imapPort: number; imapSecure: string; imapUser: string; imapPass: string;
    logoUrl: string; googleAnalyticsId: string;
}

interface UserItem {
    id: string; name: string; email: string; role: string;
    image?: string; createdAt: string; updatedAt?: string;
}

const ROLES = [
    { value: "ADMIN", label: "مدير", labelEn: "Admin", icon: Crown, color: "bg-red-50 text-red-700 border-red-100", desc: "صلاحيات كاملة لكل الأقسام" },
    { value: "EDITOR", label: "محرر", labelEn: "Editor", icon: Pencil, color: "bg-blue-50 text-blue-700 border-blue-100", desc: "تعديل المحتوى والأخبار" },
    { value: "USER", label: "مشاهد", labelEn: "Viewer", icon: Eye, color: "bg-slate-50 text-slate-600 border-slate-100", desc: "عرض لوحة التحكم فقط" },
];

const PERMISSIONS = [
    { key: "dashboard", label: "لوحة التحكم الرئيسية", admin: true, editor: true, user: true },
    { key: "pages", label: "محتوى الصفحات", admin: true, editor: true, user: false },
    { key: "products", label: "المنتجات", admin: true, editor: true, user: false },
    { key: "news", label: "الأخبار", admin: true, editor: true, user: false },
    { key: "categories", label: "التصنيفات", admin: true, editor: false, user: false },
    { key: "promotions", label: "العروض", admin: true, editor: false, user: false },
    { key: "settings", label: "الإعدادات العامة", admin: true, editor: false, user: false },
    { key: "users", label: "إدارة المستخدمين", admin: true, editor: false, user: false },
];

/* ─── Shared Components ─── */
function FormSection({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
                {Icon && (<div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><Icon className="w-6 h-6 text-slate-500" /></div>)}
                <h2 className="font-bold text-base text-slate-800">{title}</h2>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

function InputField({ label, dir, value, onChange, type, placeholder, icon: Icon }: {
    label: string; dir?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; icon?: any;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />}
                <input
                    type={type || "text"} dir={dir || "rtl"} value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${Icon ? "pr-12" : "px-4"} pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300 ${dir === 'ltr' ? 'text-left' : ''}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function TextareaField({ label, dir, value, onChange, placeholder }: {
    label: string; dir?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">{label}</label>
            <textarea dir={dir || "rtl"} value={value} onChange={(e) => onChange(e.target.value)} rows={3}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none text-sm font-medium placeholder:text-slate-300 ${dir === 'ltr' ? 'text-left' : ''}`}
                placeholder={placeholder} />
        </div>
    );
}

/* ─── Tab: Site Settings ─── */
function SiteSettingsTab({ initialData }: { initialData: SettingsData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState(initialData);
    const set = (key: string) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError(""); setSuccess(false);
        try {
            const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (res.ok) { setSuccess(true); router.refresh(); setTimeout(() => setSuccess(false), 4000); }
            else { const d = await res.json(); setError(d.error || "حدث خطأ"); }
        } catch { setError("حدث خطأ في الاتصال"); }
        setLoading(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleLogoUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) { setError("يرجى اختيار ملف صورة فقط"); return; }
        if (file.size > 5 * 1024 * 1024) { setError("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت"); return; }
        setUploading(true); setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setForm((prev) => ({ ...prev, logoUrl: data.url }));
            } else {
                const data = await res.json();
                setError(data.error || "فشل رفع اللوجو");
            }
        } catch { setError("حدث خطأ أثناء رفع اللوجو"); }
        setUploading(false);
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleLogoUpload(file);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">❌ {error}</div>}
            {success && <div className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm border border-green-100"><CheckCircle2 className="w-5 h-5" /> تم حفظ الإعدادات بنجاح</div>}

            <FormSection title="هوية الموقع" icon={Building2}>
                {/* Logo Upload */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-3">لوجو الموقع</label>
                    <div className="flex items-start gap-6">
                        {/* Preview */}
                        <div className="shrink-0">
                            {form.logoUrl ? (
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-2xl border-2 border-green-200 bg-white shadow-sm overflow-hidden flex items-center justify-center p-2">
                                        <img src={form.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                                        className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="إزالة اللوجو"
                                    >
                                        <X className="w-5 h-5 shrink-0" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon className="w-10 h-10 mb-1" />
                                    <span className="text-[10px] font-bold">لا يوجد لوجو</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Area */}
                        <div className="flex-1">
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                                    dragOver
                                        ? "border-green-400 bg-green-50"
                                        : "border-slate-200 bg-slate-50/50 hover:border-green-300 hover:bg-green-50/50"
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleLogoUpload(file);
                                        e.target.value = "";
                                    }}
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                                        <span className="text-sm font-bold text-green-600">جاري الرفع...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-slate-300" />
                                        <div>
                                            <span className="text-sm font-bold text-slate-600">اسحب الصورة هنا</span>
                                            <span className="text-sm text-slate-400"> أو </span>
                                            <span className="text-sm font-bold text-green-600 hover:text-green-700">اختر ملف</span>
                                        </div>
                                        <span className="text-[11px] text-slate-400">PNG, JPG, SVG, WebP — الحد الأقصى 5 ميجابايت</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="اسم الموقع (عربي)" value={form.siteNameAr} onChange={set("siteNameAr")} />
                    <InputField label="Site Name (English)" dir="ltr" value={form.siteNameEn} onChange={set("siteNameEn")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextareaField label="وصف الموقع (عربي)" value={form.siteDescriptionAr} onChange={set("siteDescriptionAr")} />
                    <TextareaField label="Site Description (English)" dir="ltr" value={form.siteDescriptionEn} onChange={set("siteDescriptionEn")} />
                </div>
            </FormSection>

            <FormSection title="معلومات الاتصال" icon={Phone}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="البريد الإلكتروني" dir="ltr" type="email" value={form.contactEmail} onChange={set("contactEmail")} icon={Mail} />
                    <InputField label="رقم الهاتف" dir="ltr" value={form.contactPhone} onChange={set("contactPhone")} icon={Phone} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="العنوان (عربي)" value={form.addressAr} onChange={set("addressAr")} />
                    <InputField label="Address (English)" dir="ltr" value={form.addressEn} onChange={set("addressEn")} />
                </div>
            </FormSection>

            <FormSection title="روابط التواصل الاجتماعي" icon={Globe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Facebook" dir="ltr" value={form.facebookUrl} onChange={set("facebookUrl")} placeholder="https://facebook.com/..." />
                    <InputField label="Instagram" dir="ltr" value={form.instagramUrl} onChange={set("instagramUrl")} placeholder="https://instagram.com/..." />
                    <InputField label="Twitter / X" dir="ltr" value={form.twitterUrl} onChange={set("twitterUrl")} placeholder="https://x.com/..." />
                    <InputField label="LinkedIn" dir="ltr" value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/company/..." />
                </div>
            </FormSection>

            <FormSection title="أدوات تحليل البيانات" icon={Globe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="معرف Google Analytics (G-XXXXXX / GTM-XXXXX)" dir="ltr" value={form.googleAnalyticsId} onChange={set("googleAnalyticsId")} placeholder="G-123456789" />
                </div>
            </FormSection>

            <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50 active:scale-[0.97]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ الإعدادات
                </button>
            </div>
        </form>
    );
}

/* ─── Tab: User Management ─── */
function UsersTab() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });

    const fetchUsers = async () => {
        setLoading(true);
        try { const res = await fetch("/api/admin/users"); if (res.ok) setUsers(await res.json()); } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const resetForm = () => { setForm({ name: "", email: "", password: "", role: "EDITOR" }); setEditingId(null); setShowForm(false); setError(""); };

    const startEdit = (user: UserItem) => {
        setForm({ name: user.name, email: user.email, password: "", role: user.role });
        setEditingId(user.id); setShowForm(true); setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email) { setError("الاسم والبريد مطلوبان"); return; }
        if (!editingId && !form.password) { setError("كلمة المرور مطلوبة للمستخدم الجديد"); return; }
        if (form.password && form.password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
        setSaving(true); setError("");
        try {
            const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (res.ok) {
                resetForm(); fetchUsers();
                setSuccess(editingId ? "تم تحديث المستخدم بنجاح" : "تم إضافة المستخدم بنجاح");
                setTimeout(() => setSuccess(""), 3000);
            } else { const d = await res.json(); setError(d.error || "حدث خطأ"); }
        } catch { setError("حدث خطأ في الاتصال"); }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟`)) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) { fetchUsers(); setSuccess("تم حذف المستخدم"); setTimeout(() => setSuccess(""), 3000); }
            else { const d = await res.json(); setError(d.error); }
        } catch { }
    };

    const getRoleInfo = (role: string) => ROLES.find(r => r.value === role) || ROLES[2];

    return (
        <div className="space-y-6">
            {success && <div className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm border border-green-100"><CheckCircle2 className="w-5 h-5" /> {success}</div>}
            {error && !showForm && <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">❌ {error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "إجمالي", count: users.length, icon: Users, color: "text-blue-600 bg-blue-50" },
                    { label: "مدير", count: users.filter(u => u.role === "ADMIN").length, icon: Crown, color: "text-red-600 bg-red-50" },
                    { label: "محرر", count: users.filter(u => u.role === "EDITOR").length, icon: Pencil, color: "text-purple-600 bg-purple-50" },
                    { label: "مشاهد", count: users.filter(u => u.role === "USER").length, icon: Eye, color: "text-slate-500 bg-slate-50" },
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

            {/* Add User Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0"><UserPlus className="w-6 h-6 text-green-600" /></div>
                            <h2 className="font-bold text-base text-slate-800">{editingId ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h2>
                        </div>
                        <button type="button" onClick={resetForm} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && showForm && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">❌ {error}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="الاسم الكامل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="اسم المستخدم" icon={User} />
                            <InputField label="البريد الإلكتروني" dir="ltr" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="user@example.com" icon={Mail} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">{editingId ? "كلمة مرور جديدة (اتركها فارغة للإبقاء)" : "كلمة المرور"}</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type={showPassword ? "text" : "password"} dir="ltr"
                                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full pr-10 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300 text-left"
                                    placeholder={editingId ? "••••••••" : "أدخل كلمة المرور (6 أحرف على الأقل)"}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3">الصلاحية</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {ROLES.map((role) => (
                                    <button key={role.value} type="button"
                                        onClick={() => setForm({ ...form, role: role.value })}
                                        className={`relative p-4 rounded-xl border-2 text-right transition-all ${form.role === role.value ? `${role.color} ring-2 ring-offset-1 ring-green-500/30 border-current` : "bg-white border-slate-100 hover:border-slate-200"}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <role.icon className="w-5 h-5" />
                                            <span className="font-bold text-sm">{role.label}</span>
                                            <span className="text-[10px] text-slate-400">({role.labelEn})</span>
                                        </div>
                                        <p className="text-[11px] text-slate-400">{role.desc}</p>
                                        {form.role === role.value && (
                                            <div className="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">إلغاء</button>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50">
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingId ? "حفظ التعديلات" : "إضافة المستخدم"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Users className="w-6 h-6 text-slate-500" /></div>
                            <h2 className="font-bold text-base text-slate-800">المستخدمون ({users.length})</h2>
                        </div>
                        {!showForm && (
                            <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-all">
                                <Plus className="w-5 h-5" /> إضافة مستخدم
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-gray-100">
                                    <th className="text-right px-6 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">المستخدم</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">الصلاحية</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                                    <th className="text-center px-5 py-3.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => {
                                    const roleInfo = getRoleInfo(user.role);
                                    return (
                                        <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                        <div className="text-[11px] text-slate-400 truncate" dir="ltr">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border ${roleInfo.color}`}>
                                                    <roleInfo.icon className="w-5 h-5 shrink-0" /> {roleInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="text-[11px] text-slate-400">
                                                    {new Date(user.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => startEdit(user)} className="p-2.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-100 shrink-0" title="تعديل">
                                                        <Pencil className="w-5 h-5 shrink-0" />
                                                    </button>
                                                    <button onClick={() => handleDelete(user.id, user.name)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-100 shrink-0" title="حذف">
                                                        <Trash2 className="w-5 h-5 shrink-0" />
                                                    </button>
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

            {/* Permissions Matrix */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button type="button" onClick={() => setShowPermissions(!showPermissions)} className="w-full px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Shield className="w-6 h-6 text-amber-600" /></div>
                        <h2 className="font-bold text-base text-slate-800">مصفوفة الصلاحيات</h2>
                    </div>
                    <span className="text-xs text-slate-400">{showPermissions ? "إخفاء ▲" : "عرض ▼"}</span>
                </button>
                {showPermissions && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-gray-100">
                                    <th className="text-right px-6 py-3 font-bold text-[11px] text-slate-500 uppercase tracking-wider">القسم</th>
                                    <th className="text-center px-4 py-3 font-bold text-[11px] text-red-500 uppercase tracking-wider">👑 مدير</th>
                                    <th className="text-center px-4 py-3 font-bold text-[11px] text-blue-500 uppercase tracking-wider">✏️ محرر</th>
                                    <th className="text-center px-4 py-3 font-bold text-[11px] text-slate-400 uppercase tracking-wider">👁️ مشاهد</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {PERMISSIONS.map((perm) => (
                                    <tr key={perm.key} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-700 text-sm">{perm.label}</td>
                                        <td className="px-4 py-3 text-center">{perm.admin ? <span className="text-green-500 text-lg">✓</span> : <span className="text-red-300 text-lg">✗</span>}</td>
                                        <td className="px-4 py-3 text-center">{perm.editor ? <span className="text-green-500 text-lg">✓</span> : <span className="text-red-300 text-lg">✗</span>}</td>
                                        <td className="px-4 py-3 text-center">{perm.user ? <span className="text-green-500 text-lg">✓</span> : <span className="text-red-300 text-lg">✗</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
interface SettingsFormProps {
    initialData: SettingsData;
}

const TABS = [
    { id: "general", label: "الإعدادات العامة", icon: Settings },
    { id: "users", label: "المستخدمون والصلاحيات", icon: Shield },
    { id: "smtp", label: "إعدادات البريد", icon: Mail },
];

export function SettingsForm({ initialData }: SettingsFormProps) {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-xl border border-gray-100 p-1 gap-1 shadow-sm">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id ? "bg-gradient-to-l from-green-600 to-green-700 text-white shadow-lg shadow-green-600/15" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "general" && <SiteSettingsTab initialData={initialData} />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "smtp" && <SmtpSettingsTab initialData={initialData} />}
        </div>
    );
}

/* ─── Tab: SMTP Email Settings ─── */
function SmtpSettingsTab({ initialData }: { initialData: SettingsData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({
        smtpHost: initialData.smtpHost || "",
        smtpPort: initialData.smtpPort || 587,
        smtpUser: initialData.smtpUser || "",
        smtpPass: initialData.smtpPass || "",
        smtpFrom: initialData.smtpFrom || "",
        smtpFromName: initialData.smtpFromName || "",
        smtpSecure: initialData.smtpSecure || "tls",
        imapHost: initialData.imapHost || "",
        imapPort: initialData.imapPort || 993,
        imapSecure: initialData.imapSecure || "tls",
        imapUser: initialData.imapUser || "",
        imapPass: initialData.imapPass || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError(""); setSuccess(false);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...initialData, ...form }),
            });
            if (res.ok) { setSuccess(true); router.refresh(); setTimeout(() => setSuccess(false), 4000); }
            else { const d = await res.json(); setError(d.error || "حدث خطأ"); }
        } catch { setError("حدث خطأ في الاتصال"); }
        setLoading(false);
    };

    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

    const handleTestConnection = async () => {
        setTesting(true); setTestResult(null); setError(""); setSuccess(false);
        try {
            const res = await fetch("/api/admin/settings/test-smtp", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setTestResult({ success: true, msg: data.message });
            } else {
                setTestResult({ success: false, msg: data.error || data.details || "فشل الاتصال" });
            }
        } catch {
            setTestResult({ success: false, msg: "خطأ في الشبكة أثناء الاتصال بالخادم." });
        }
        setTesting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">❌ {error}</div>}
            {success && <div className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm border border-green-100"><CheckCircle2 className="w-5 h-5" /> تم حفظ إعدادات البريد بنجاح</div>}

            {/* Info Banner */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-blue-800 mb-1">ربط البريد الإلكتروني الاحترافي</p>
                    <p className="text-xs text-blue-600 leading-relaxed">قم بإدخال بيانات خادم البريد SMTP لإرسال الردود من بريد info@elsalamoil.com مباشرة من لوحة التحكم، وإعدادات خادم الاستقبال IMAP لقرأة الرسائل الواردة بداخل قسم البريد الوارد المدمج.</p>
                </div>
            </div>

            <FormSection title="خادم استقبال البريد الوارد (IMAP Webmail)" icon={Mail}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="عنوان خادم الاستقبال (IMAP Host)" dir="ltr" value={form.imapHost} onChange={(v) => setForm({ ...form, imapHost: v })} placeholder="imap.elsalamoil.com" />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">منفذ الاستقبال (Port)</label>
                        <input type="number" dir="ltr" value={form.imapPort} onChange={(e) => setForm({ ...form, imapPort: parseInt(e.target.value) || 993 })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-left" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="مستخدم الاستقبال (عادة نفس البريد)" dir="ltr" value={form.imapUser} onChange={(v) => setForm({ ...form, imapUser: v })} placeholder="info@elsalamoil.com" />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">كلمة المرور المشتركة (Password)</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} dir="ltr" value={form.imapPass} onChange={(e) => setForm({ ...form, imapPass: e.target.value })}
                                className="w-full px-4 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-left" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </FormSection>

            <FormSection title="خادم إرسال البريد (SMTP Send)" icon={Mail}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="عنوان الخادم (SMTP Host)" dir="ltr" value={form.smtpHost} onChange={(v) => setForm({ ...form, smtpHost: v })} placeholder="mail.elsalamoil.com" />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">المنفذ (Port)</label>
                        <input type="number" dir="ltr" value={form.smtpPort} onChange={(e) => setForm({ ...form, smtpPort: parseInt(e.target.value) || 587 })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-left" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="اسم المستخدم (Username)" dir="ltr" value={form.smtpUser} onChange={(v) => setForm({ ...form, smtpUser: v })} placeholder="info@elsalamoil.com" />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">كلمة المرور (Password)</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} dir="ltr" value={form.smtpPass} onChange={(e) => setForm({ ...form, smtpPass: e.target.value })}
                                className="w-full px-4 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-left" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">نوع التشفير</label>
                    <div className="flex gap-3">
                        {["tls", "ssl", "none"].map((opt) => (
                            <button key={opt} type="button" onClick={() => setForm({ ...form, smtpSecure: opt })}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${form.smtpSecure === opt ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}>
                                {opt.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </FormSection>

            <FormSection title="بيانات المرسل" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="بريد الإرسال (From Email)" dir="ltr" value={form.smtpFrom} onChange={(v) => setForm({ ...form, smtpFrom: v })} placeholder="info@elsalamoil.com" />
                    <InputField label="اسم المرسل (From Name)" value={form.smtpFromName} onChange={(v) => setForm({ ...form, smtpFromName: v })} placeholder="مصنع السلام للزيوت النباتية" />
                </div>
            </FormSection>

            <div className="flex justify-between items-center pt-2">
                <div>
                    {testResult && (
                        <div className={`text-xs font-bold px-4 py-2 rounded-lg ${testResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {testResult.msg}
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleTestConnection} disabled={testing} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all disabled:opacity-50 active:scale-[0.97]">
                        {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />} اختبار الاتصال بالخادم
                    </button>
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/15 disabled:opacity-50 active:scale-[0.97]">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ الإعدادات
                    </button>
                </div>
            </div>
        </form>
    );
}
