"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag, Loader2, Trash2, CheckCircle2, XCircle, Percent, Hash } from "lucide-react";

export default function AdminPromoCodesPage() {
    const [codes, setCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        minOrderValue: "",
        maxUses: "",
        expiresAt: ""
    });

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const res = await fetch("/api/admin/promocodes");
            if (res.ok) {
                const data = await res.json();
                setCodes(data);
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
            const res = await fetch(`/api/admin/promocodes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                await fetchCodes();
                setShowModal(false);
            } else {
                const err = await res.json();
                alert(err.error || "فشل في حفظ البيانات");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف الكوبون؟")) return;
        try {
            const res = await fetch(`/api/admin/promocodes/${id}`, { method: "DELETE" });
            if (res.ok) fetchCodes();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleStatus = async (promo: any) => {
        try {
            setCodes(codes.map(c => c.id === promo.id ? { ...c, isActive: !promo.isActive } : c));
            await fetch(`/api/admin/promocodes/${promo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !promo.isActive })
            });
        } catch (e) {
            fetchCodes(); // revert
        }
    };

    return (
        <div className="space-y-6 lg:font-arabic" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">كوبونات الخصم</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">إدارة الحملات الترويجية وأكواد الخصم</p>
                </div>
                <button 
                    onClick={() => { setForm({ code: "", type: "PERCENTAGE", value: 0, minOrderValue: "", maxUses: "", expiresAt: "" }); setShowModal(true); }} 
                    className="flex w-full sm:w-auto justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5"/> نشر كوبون جديد
                </button>
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-500"/></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {codes.map(promo => (
                        <div key={promo.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => toggleStatus(promo)} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${promo.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                    {promo.isActive ? <CheckCircle2 className="w-3.5 h-3.5"/> : <XCircle className="w-3.5 h-3.5"/>}
                                    {promo.isActive ? "نشط" : "معطل"}
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${promo.type === 'PERCENTAGE' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {promo.type === 'PERCENTAGE' ? <Percent className="w-7 h-7" /> : <Hash className="w-7 h-7" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-800 tracking-wider" dir="ltr">{promo.code}</h3>
                                    <p className="text-sm font-bold text-slate-500">
                                        خصم {promo.value} {promo.type === 'PERCENTAGE' ? '%' : 'ج.م'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">عدد الاستخدامات:</span>
                                    <span className="font-bold text-slate-800">{promo.usedCount} /{promo.maxUses || '∞'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">الحد الأدنى للطلب:</span>
                                    <span className="font-bold text-slate-800">{promo.minOrderValue ? `${promo.minOrderValue} ج.م` : 'بلا حد'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3 mt-1">
                                    <span className="text-slate-500 font-medium">تاريخ الانتهاء:</span>
                                    <span className={`font-bold ${promo.expiresAt && new Date() > new Date(promo.expiresAt) ? 'text-red-500' : 'text-slate-800'}`}>
                                        {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString('ar-EG') : 'مفتوح'}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => handleDelete(promo.id)} className="w-full py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" /> حذف الكوبون
                            </button>
                        </div>
                    ))}
                    
                    {codes.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Tag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold mb-2">لا توجد كوبونات حالياً</h3>
                            <p className="text-sm">أنشئ كوبون خصم جديد لجذب المزيد من المبيعات</p>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Tag className="w-5 h-5 text-green-600"/> إصدار كوبون جديد</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-2">الكود (مثال: WELCOME24) *</label>
                                    <input required type="text" dir="ltr" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-black tracking-widest text-lg uppercase" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">نوع الخصم *</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-bold" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                        <option value="PERCENTAGE">نسبة مئوية (%)</option>
                                        <option value="FIXED">مبلغ ثابت (ج.م)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">قيمة الخصم *</label>
                                    <input required type="number" min="1" step="0.1" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-bold" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">الحد الأدنى للطلبية (اختياري)</label>
                                    <input type="number" min="0" placeholder="0" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-bold text-sm" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">حد الاستخدام الأقصى (اختياري)</label>
                                    <input type="number" min="1" placeholder="بلا حد" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-bold text-sm" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-2">تاريخ الانتهاء (اختياري)</label>
                                    <input type="date" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-bold text-sm" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t border-slate-100">
                                <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center gap-2">
                                    {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {saving ? "جاري الإصدار..." : "إصدار الكوبون"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
