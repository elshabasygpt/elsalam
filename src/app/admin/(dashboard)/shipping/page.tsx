"use client";

import React, { useState, useEffect } from "react";
import { Plus, MapPin, Loader2, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminShippingPage() {
    const [zones, setZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name_ar: "",
        name_en: "",
        fee: 0,
        isActive: true
    });

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const res = await fetch("/api/admin/shipping");
            if (res.ok) {
                const data = await res.json();
                setZones(data);
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
            const url = editId ? `/api/admin/shipping/${editId}` : `/api/admin/shipping`;
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                await fetchZones();
                setShowModal(false);
            } else {
                alert("فشل في حفظ البيانات");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف نطاق الشحن؟")) return;
        try {
            const res = await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
            if (res.ok) fetchZones();
        } catch (e) {
            console.error(e);
        }
    };

    const openEdit = (zone: any) => {
        setEditId(zone.id);
        setForm({ name_ar: zone.name_ar, name_en: zone.name_en, fee: zone.fee, isActive: zone.isActive });
        setShowModal(true);
    };

    const toggleStatus = async (zone: any) => {
        try {
            // Optimistic
            setZones(zones.map(z => z.id === zone.id ? { ...z, isActive: !zone.isActive } : z));
            await fetch(`/api/admin/shipping/${zone.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...zone, isActive: !zone.isActive })
            });
        } catch (e) {
            fetchZones(); // revert
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">مناطق الشحن</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">إدارة تسعير الشحن لكل محافظة لضمان الأمان في الدفع</p>
                </div>
                <button 
                    onClick={() => { setEditId(null); setForm({ name_ar: "", name_en: "", fee: 0, isActive: true }); setShowModal(true); }} 
                    className="flex w-full sm:w-auto justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5"/> منطقة جديدة
                </button>
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-500"/></div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto p-1">
                        <table className="w-full text-right divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 rounded-tr-2xl">المحافظة</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500">الاسم بنظام الدفع (EN)</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 text-center">تكلفة الشحن</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 text-center">الحالة</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 text-center rounded-tl-2xl">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {zones.map(zone => (
                                    <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-slate-800">{zone.name_ar}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-500" dir="ltr">{zone.name_en}</td>
                                        <td className="px-6 py-4 text-center text-green-600 font-black text-lg">{zone.fee.toLocaleString()} EGP</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => toggleStatus(zone)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${zone.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                {zone.isActive ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                                                {zone.isActive ? "متاح" : "معطل"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEdit(zone)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(zone.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800">{editId ? "تعديل المنطقة" : "إضافة منطقة شحن"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">اسم المحافظة (عربي)</label>
                                <input required type="text" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-semibold" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} placeholder="مثال: القاهرة" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">الاسم التقني (إنجليزي) لمطابقة بوابة الدفع</label>
                                <input required type="text" dir="ltr" className="w-full text-left px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-semibold" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} placeholder="e.g. Cairo" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">تكلفة الشحن (EGP)</label>
                                <input required type="number" min="0" step="0.1" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-green-500 font-black text-green-600 text-lg" value={form.fee} onChange={e => setForm({...form, fee: Number(e.target.value)})} />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center gap-2">
                                    {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
