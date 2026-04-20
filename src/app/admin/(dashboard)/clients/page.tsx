"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, MapPin, Camera, Building2, Store, Phone, PhoneCall, Loader2, Link2, X, Trash2, Edit, Eye, Mail, Send } from "lucide-react";

export default function CRMClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [locating, setLocating] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [viewClient, setViewClient] = useState<any | null>(null);

    const [form, setForm] = useState({
        name: "",
        company: "",
        storeType: "سوبرماركت",
        mainPhone: "",
        secondaryPhone: "",
        storeImage: "" as string | null,
        lat: null as number | null,
        lng: null as number | null,
        locationUrl: "",
        notes: "",
        contacts: [] as { personName: string, department: string, email: string, phone: string }[]
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            // Add cache bust parameter to prevent stale local fetch caching in Next.js
            const res = await fetch(`/api/admin/crm/clients?t=${Date.now()}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const captureLocation = () => {
        if (!navigator.geolocation) {
            alert("خدمة تحديد الموقع غير مدعومة في جهازك.");
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setForm(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                    locationUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
                }));
                setLocating(false);
            },
            (error) => {
                alert("تعذر الحصول على الموقع الجغرافي. تأكد من تفعيل إذن الـ GPS.");
                setLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/crm/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setForm(prev => ({ ...prev, storeImage: data.url }));
            } else {
                alert("فشل رفع الصورة.");
            }
        } catch (err) {
            alert("فشل التخاطب مع الخادم لرفع الصورة.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editId ? `/api/admin/crm/clients/${editId}` : `/api/admin/crm/clients`;
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                await fetchClients();
                setShowModal(false);
                setEditId(null);
                setForm({
                    name: "", company: "", storeType: "سوبرماركت",
                    mainPhone: "", secondaryPhone: "", storeImage: null,
                    mainPhone: "", secondaryPhone: "", storeImage: null,
                    lat: null, lng: null, locationUrl: "", notes: "", contacts: []
                });
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (e) {
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا العميل نهائياً؟ لا يمكن التراجع عن هذه الخطوة.")) return;
        try {
            const res = await fetch(`/api/admin/crm/clients/${id}`, { method: "DELETE" });
            if (res.ok) fetchClients();
            else alert("فشل الحذف");
        } catch (e) { alert("حدث خطأ"); }
    };

    const openEditModal = (client: any) => {
        setEditId(client.id);
        setForm({
            name: client.name || "",
            company: client.company || "",
            storeType: client.storeType || "سوبرماركت",
            mainPhone: client.mainPhone || "",
            secondaryPhone: client.secondaryPhone || "",
            storeImage: client.storeImage || null,
            lat: client.lat || null,
            lng: client.lng || null,
            locationUrl: client.locationUrl || "",
            notes: client.notes || "",
            contacts: client.contacts || []
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditId(null);
        setForm({
            name: "", company: "", storeType: "سوبرماركت", mainPhone: "", secondaryPhone: "", storeImage: null, lat: null, lng: null, locationUrl: "", notes: "", contacts: []
        });
        setShowModal(true);
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.mainPhone?.includes(searchTerm) ||
        (c.rep?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">قائمة العملاء والمنافذ</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">سجل عملاءك الميدانيين لتسهيل إنشاء الطلبيات لاحقاً</p>
                </div>
                <button onClick={openAddModal} className="flex w-full sm:w-auto justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all">
                    <Plus className="w-5 h-5"/> إضافة منفذ جديد
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="ابحث بالاسم، المندوب، أو رقم الجوال..." 
                    className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
            ) : filteredClients.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                    <Store className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-700">لا يوجد بيانات حتى الآن</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">اضغط على زر الإضافة لتسجيل العميل الأول</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                        <div key={client.id} className="bg-white rounded-[24px] border border-slate-100/80 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1 hover:border-green-200/60 group relative">
                            {/* Card Extras / Actions menu */}
                            <div className="absolute top-4 left-4 z-40 flex flex-row-reverse items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => setViewClient(client)} className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all transform hover:scale-105" title="التفاصيل">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button onClick={() => openEditModal(client)} className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur shadow-sm border border-slate-100 flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all transform hover:scale-105" title="تعديل">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur shadow-sm border border-slate-100 flex items-center justify-center text-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all transform hover:scale-105" title="حذف">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Card Image / Header */}
                            <div className="h-60 w-full relative overflow-hidden bg-slate-900 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent z-10 transition-opacity duration-300 group-hover:from-slate-900/90" />
                                <img src={client.storeImage || "https://images.unsplash.com/photo-1604719312566-8fa2065b2167?w=600&q=80"} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1604719312566-8fa2065b2167?w=600&q=80" }} alt={client.name} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
                                        {client.storeType}
                                    </span>
                                </div>
                                <div className="absolute bottom-5 right-5 left-5 z-20 text-white transform transition-all duration-300">
                                    <h3 className="text-xl font-black drop-shadow-md truncate">{client.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5 opacity-90 text-slate-200">
                                        <Building2 className="w-3.5 h-3.5" />
                                        <p className="text-xs font-medium drop-shadow-sm truncate">{client.company || "عميل ميداني"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-1 flex flex-col bg-white relative z-10">
                                
                                <div className="space-y-3.5 mt-auto">
                                    {/* Contact Block */}
                                    {client.mainPhone && (
                                        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100/50 hover:bg-green-50/50 hover:border-green-100 transition-colors duration-300">
                                            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-200/50 shrink-0">
                                                <Phone className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-xs text-slate-400 font-bold mb-0.5">رقم التواصل</span>
                                                <span className="text-[15px] font-bold text-slate-700 leading-none" dir="ltr">{client.mainPhone}</span>
                                            </div>
                                            
                                            <a href={`tel:${client.mainPhone}`} title="اتصال مباشر" className="w-11 h-11 rounded-full bg-slate-100 hover:bg-green-500 hover:text-white text-slate-400 flex flex-col items-center justify-center transition-all shadow-sm">
                                                 <PhoneCall className="w-5 h-5" />
                                            </a>
                                        </div>
                                    )}
                                    
                                    {/* Actions Block */}
                                    <div className="flex items-stretch gap-2 pt-3 border-t border-dashed border-slate-100">
                                        {client.locationUrl ? (
                                            <a href={client.locationUrl} target="_blank" className="flex items-center justify-center flex-[2] gap-2.5 bg-slate-900 hover:bg-green-600 text-white px-4 py-3.5 rounded-[14px] text-sm font-bold transition-all shadow-md shadow-slate-900/10 hover:shadow-green-500/25">
                                                <MapPin className="w-5 h-5" /> عرض الخريطة
                                            </a>
                                        ) : (
                                            <div className="flex items-center justify-center flex-[2] gap-2.5 bg-slate-50 text-slate-400 px-4 py-3.5 rounded-[14px] text-sm font-bold cursor-not-allowed border border-slate-100/50">
                                                <MapPin className="w-5 h-5 opacity-50" /> بدون خريطة
                                            </div>
                                        )}
                                        
                                        {client.rep && (
                                            <div className="flex-[1] flex flex-col justify-center items-center px-1 py-2 bg-slate-50 rounded-[14px] border border-slate-100/50">
                                                <span className="text-[9px] text-slate-400 font-bold mb-1">المندوب</span>
                                                <span className="text-[11px] font-extrabold text-slate-700 line-clamp-1 w-full text-center px-1">{client.rep.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PWA Friendly Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10 rounded-t-3xl">
                            <h2 className="text-xl font-black text-slate-800">{editId ? "تعديل بيانات المنفذ" : "تسجيل منفذ جديد"}</h2>
                            <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-500 hover:text-red-500 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                        </div>
                        
                        <div className="overflow-y-auto p-5 hover-scrollbar pb-24 sm:pb-6">
                            <form id="mobileForm" onSubmit={handleSubmit} className="space-y-5">
                                {/* Image Capture */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">صورة لافتة / واجهة المحل</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full aspect-[21/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden bg-slate-50 ${form.storeImage ? "border-green-500" : "border-slate-300 hover:bg-slate-100 hover:border-slate-400"}`}
                                    >
                                        {uploadingImage ? (
                                            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                                        ) : form.storeImage ? (
                                            <img src={form.storeImage} className="w-full h-full object-cover" alt="Store Front" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <Camera className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500">التقاط صورة بالكاميرا</span>
                                            </>
                                        )}
                                    </div>
                                    {/* hidden file input allowing camera capture on mobile */}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
                                </div>

                                {/* Location */}
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                                        الموقع الجغرافي (GPS)
                                        {form.lat && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">تم الالتقاط ✓</span>}
                                    </label>
                                    <button type="button" onClick={captureLocation} disabled={locating} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                                        {locating ? <Loader2 className="w-5 h-5 animate-spin"/> : <MapPin className="w-5 h-5" />}
                                        {form.lat ? "تحديث الموقع الجغرافي" : "التقاط موقع المحل الحالي"}
                                    </button>
                                    {form.lat && <a href={form.locationUrl} target="_blank" className="block text-center text-xs text-blue-600 mt-2 font-semibold hover:underline">معاينة على خريطة جوجل</a>}
                                </div>

                                {/* Details */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">أسم المحل / العميل *</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="مثال: سوبرماركت زمزم" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">تصنيف المنفذ *</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-green-500" value={form.storeType} onChange={e => setForm({...form, storeType: e.target.value})}>
                                        <option value="سوبرماركت">سوبرماركت</option>
                                        <option value="بقالة ومحل غذائي">بقالة ومحل غذائي</option>
                                        <option value="عطارة">عطارة</option>
                                        <option value="مطعم">مطعم</option>
                                        <option value="جملة">تاجر جملة</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف (الأساسي) *</label>
                                    <input required type="tel" dir="ltr" className="w-full text-right px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all" value={form.mainPhone} onChange={e => setForm({...form, mainPhone: e.target.value})} placeholder="01xxxxxxxxx" />
                                </div>

                                {/* Emails / Departments */}
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-700">البريد الإلكتروني للجهات المختلفة</label>
                                        <button type="button" onClick={() => setForm({...form, contacts: [...form.contacts, {personName: "", department: "المشتريات", email: "", phone: ""}]})} className="text-[11px] font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 border border-green-200 transition-colors shadow-sm">+ إضافة بريد</button>
                                    </div>
                                    <div className="space-y-2">
                                        {form.contacts.map((c, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-[16px] border border-slate-200 shadow-sm relative group transition-all hover:border-green-300">
                                                <button type="button" onClick={() => {
                                                    const a = [...form.contacts];
                                                    a.splice(i, 1);
                                                    setForm({...form, contacts: a});
                                                }} className="absolute -top-2 -left-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5"/></button>
                                                <div className="flex-1 space-y-2">
                                                    <input required type="email" placeholder="البريد الإلكتروني *" value={c.email} onChange={e => {
                                                        const a = [...form.contacts]; a[i].email = e.target.value; setForm({...form, contacts: a});
                                                    }} className="w-full text-xs font-medium px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-green-500 transition-colors"/>
                                                    <div className="flex gap-2">
                                                        <select className="flex-[1.5] text-xs font-bold px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-green-500 transition-colors text-slate-700" value={c.department} onChange={e => {
                                                            const a = [...form.contacts]; a[i].department = e.target.value; setForm({...form, contacts: a});
                                                        }}>
                                                            <option value="المشتريات">المشتريات</option>
                                                            <option value="الإدارة">الإدارة</option>
                                                            <option value="المالية">المالية</option>
                                                            <option value="المبيعات">المبيعات</option>
                                                            <option value="الإستقبال">الإستقبال</option>
                                                            <option value="عام">عام</option>
                                                        </select>
                                                        <input type="text" placeholder="الاسم (اختياري)" value={c.personName} onChange={e => {
                                                            const a = [...form.contacts]; a[i].personName = e.target.value; setForm({...form, contacts: a});
                                                        }} className="flex-[2] text-xs font-medium px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-green-500 transition-colors"/>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">إلغاء</button>
                                    <button type="submit" disabled={saving || uploadingImage} className="flex-[2] flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-l from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 disabled:opacity-50">
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ بيانات العميل"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewClient && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-50 w-full sm:max-w-xl sm:rounded-[36px] rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        
                        {/* Huge Header Image */}
                        <div className="relative w-full h-[320px] bg-slate-900 shrink-0">
                            <img src={viewClient.storeImage || "https://images.unsplash.com/photo-1604719312566-8fa2065b2167?w=1000&q=80"} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1604719312566-8fa2065b2167?w=1000&q=80" }} alt={viewClient.name} className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />
                            
                            {/* Close Button */}
                            <button onClick={() => setViewClient(null)} className="absolute top-5 left-5 bg-white/10 hover:bg-red-500 hover:text-white border border-white/20 text-white backdrop-blur-md p-3 rounded-full transition-all z-20 shadow-lg">
                                <X className="w-6 h-6"/>
                            </button>

                            {/* Header Info Over Image */}
                            <div className="absolute bottom-6 right-6 left-6 z-20 text-white">
                                <div className="flex gap-2 mb-3">
                                    <span className="bg-green-500 text-white text-xs font-black px-4 py-1.5 rounded-xl shadow-sm border border-green-400">
                                        {viewClient.storeType}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black drop-shadow-xl">{viewClient.name}</h2>
                                {viewClient.company && (
                                    <div className="flex items-center gap-2 mt-2 opacity-90 text-green-100">
                                        <Building2 className="w-5 h-5" />
                                        <p className="text-sm font-bold drop-shadow-md">{viewClient.company}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Highly Organized Data Body */}
                        <div className="overflow-y-auto p-5 sm:p-7 pb-12 sm:pb-8 hover-scrollbar">
                            
                            {/* Call Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white p-5 rounded-[28px] border border-slate-100/80 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:border-green-200">
                                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-bold mb-1">الرقم الأساسي</div>
                                    <div className="text-[17px] font-black text-slate-800 tracking-wide" dir="ltr">{viewClient.mainPhone || "-"}</div>
                                </div>

                                <div className="bg-white p-5 rounded-[28px] border border-slate-100/80 shadow-sm flex flex-col items-center justify-center text-center transition-all hover:border-slate-300">
                                    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3 shadow-inner">
                                        <PhoneCall className="w-7 h-7" />
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-bold mb-1">رقم إضافي</div>
                                    <div className="text-[17px] font-black text-slate-800 tracking-wide" dir="ltr">{viewClient.secondaryPhone || "-"}</div>
                                </div>
                            </div>

                            {/* Emails Section */}
                            {viewClient.contacts && viewClient.contacts.length > 0 && (
                                <div className="bg-slate-900 rounded-[28px] p-5 mb-6 shadow-md shadow-slate-900/10">
                                    <div className="text-white text-sm font-black mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-green-400"/> البريد الإلكتروني للمراسلة
                                    </div>
                                    <div className="space-y-3">
                                        {viewClient.contacts.map((c: any, i: number) => (
                                            <div key={i} className="bg-white/10 p-4 rounded-[20px] flex sm:items-center flex-col sm:flex-row justify-between gap-3 group hover:bg-white/15 transition-colors border border-white/5">
                                                <div>
                                                    <div className="text-green-300 text-[11px] font-bold mb-1 flex items-center gap-1.5">
                                                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-md">{c.department}</span>
                                                        {c.personName && <span className="text-slate-300">/ {c.personName}</span>}
                                                    </div>
                                                    <div className="text-white font-medium text-sm tracking-wide mt-1.5">{c.email}</div>
                                                </div>
                                                <a href={`mailto:${c.email}`} className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/50">
                                                    إرسال رسالة <Send className="w-3.5 h-3.5"/>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Location Section */}
                            {viewClient.locationUrl && (
                                <a href={viewClient.locationUrl} target="_blank" className="flex items-center justify-between bg-slate-900 group hover:bg-green-600 transition-colors p-5 rounded-[24px] mb-6 shadow-md shadow-slate-900/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                                            <MapPin className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">الموقع الجغرافي</div>
                                            <div className="text-green-300 group-hover:text-green-100 text-xs font-bold mt-0.5">فتح في خرائط جوجل</div>
                                        </div>
                                    </div>
                                    <Link2 className="w-6 h-6 text-white opacity-50 group-hover:opacity-100" />
                                </a>
                            )}

                            {/* Notes Section */}
                            {viewClient.notes && (
                                <div className="bg-amber-50 p-6 rounded-[24px] border border-amber-100/60 mb-6 relative overflow-hidden">
                                    <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
                                    <div className="text-amber-800 font-black text-sm mb-3 flex items-center gap-2 relative z-10">
                                        ملاحظات مسجلة
                                    </div>
                                    <p className="text-slate-700 text-[15px] whitespace-pre-wrap font-medium leading-relaxed relative z-10">
                                        {viewClient.notes}
                                    </p>
                                </div>
                            )}

                            {/* Representative Info */}
                            <div className="bg-white px-5 py-4 rounded-[20px] flex items-center justify-between border border-slate-100 shadow-sm mt-auto">
                                <span className="text-xs text-slate-400 font-bold">مُسجل المنفذ (المندوب)</span>
                                <span className="text-base font-black text-slate-800 bg-slate-50 px-3 py-1 rounded-lg">{viewClient.rep?.name || "غير محدد"}</span>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
