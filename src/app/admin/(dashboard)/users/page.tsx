"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, ShieldCheck, Mail, ShieldAlert, UserCog, UserCheck, X } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "SALES_REP"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                await fetchUsers();
                setShowModal(false);
                setForm({ name: "", email: "", password: "", role: "SALES_REP" });
            } else {
                const err = await res.json();
                alert(err.error || "حدث خطأ أثناء الحفظ");
            }
        } catch (e) {
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    const RoleBadge = ({ role }: { role: string }) => {
        const map: any = {
            "ADMIN": { label: "المدير العام", css: "bg-red-100 text-red-700 border-red-200", icon: ShieldAlert },
            "SALES_MANAGER": { label: "مدير المبيعات", css: "bg-blue-100 text-blue-700 border-blue-200", icon: ShieldCheck },
            "SALES_REP": { label: "مندوب مبيعات", css: "bg-green-100 text-green-700 border-green-200", icon: UserCheck },
            "USER": { label: "مستخدم", css: "bg-slate-100 text-slate-700 border-slate-200", icon: UserCog },
        };
        const config = map[role] || map["USER"];
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.css}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        )
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">إدارة فريق العمل (Staff)</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">قم بإضافة وتوزيع الصلاحيات على فريق الإدارة ومناديب المبيعات.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex w-full sm:w-auto justify-center items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                    <Plus className="w-5 h-5"/> إضافة عضو جديد
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.map((user) => (
                        <div key={user.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                            {/* Role Label */}
                            <div className="mb-4">
                                <RoleBadge role={user.role} />
                            </div>
                            
                            <h3 className="text-lg font-black text-slate-800">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1 mb-4 text-sm font-bold text-slate-500">
                                <Mail className="w-4 h-4" /> <span dir="ltr">{user.email}</span>
                            </div>

                            {user.role === "SALES_REP" && (
                                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                                    <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <div className="text-xs font-bold text-slate-400 mb-1">العملاء للمندوب</div>
                                        <div className="text-lg font-black text-slate-700">{user._count?.repClients || 0}</div>
                                    </div>
                                    <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <div className="text-xs font-bold text-slate-400 mb-1">الأوردرات المسجلة</div>
                                        <div className="text-lg font-black text-slate-700">{user._count?.repOrders || 0}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Compose Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col mb-0 sm:mb-auto">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800">إضافة عضو فريق</h2>
                            <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-500 hover:text-red-500 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                        </div>
                        
                        <div className="p-5 pb-8 sm:pb-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم كاملاً *</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-slate-500 transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني (لتسجيل الدخول) *</label>
                                    <input required type="email" dir="ltr" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-slate-500 transition-all text-right" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور *</label>
                                    <input required type="text" dir="ltr" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-slate-500 transition-all text-right" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">الصلاحية (الدور الوظيفي) *</label>
                                    <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-slate-500 transition-all" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                        <option value="SALES_REP">مندوب مبيعات ميداني (SALES_REP)</option>
                                        <option value="SALES_MANAGER">مدير مبيعات (SALES_MANAGER)</option>
                                        <option value="ADMIN">مدير عام (ADMIN)</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="submit" disabled={saving} className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 transition-all">
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء الحساب الان"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
