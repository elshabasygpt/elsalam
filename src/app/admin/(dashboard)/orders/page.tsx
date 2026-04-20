"use client";

import React, { useState, useEffect } from "react";
import { Plus, PackageOpen, Loader2, Store, Clock, CheckCircle2, Truck, Check, X, Box } from "lucide-react";

export default function CRMOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("USER");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        clientId: "",
        notes: "",
        items: [] as { productId: string, quantity: number }[]
    });

    useEffect(() => {
        fetchData();
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const res = await fetch("/api/auth/session");
            const data = await res.json();
            if (data?.user?.role) setUserRole(data.user.role);
        } catch(e) {}
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Orders
            const oRes = await fetch("/api/admin/crm/orders");
            if (oRes.ok) setOrders(await oRes.json());
            
            // Fetch Clients (for dropdown)
            const cRes = await fetch("/api/admin/crm/clients");
            if (cRes.ok) setClients(await cRes.json());

            // Fetch Products (for order selection)
            // Wait, we need a public or admin products endpoint. We have /api/admin/products
            const pRes = await fetch("/api/admin/products");
            if (pRes.ok) {
                const data = await pRes.json();
                setProducts(data.products || data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setForm(prev => ({ ...prev, items: [...prev.items, { productId: "", quantity: 1 }] }));
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        const updated = [...form.items];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, items: updated });
    };

    const removeItem = (index: number) => {
        const updated = [...form.items];
        updated.splice(index, 1);
        setForm({ ...form, items: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!form.clientId) return alert("لم تقم بتحديد المحل/العميل.");
        if (form.items.length === 0) return alert("لا يمكن إرسال أوردر فارغ.");
        for (const item of form.items) {
            if (!item.productId || item.quantity < 1) return alert("تأكد من اختيار جميع المنتجات وتحديد كمية صحيحة.");
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/crm/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                await fetchData();
                setShowModal(false);
                setForm({ clientId: "", notes: "", items: [] });
            } else {
                const err = await res.json();
                alert(err.error || "حدث خطأ إرسال الأوردر");
            }
        } catch (e) {
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        if (!confirm("هل أنت متأكد من تغيير حالة هذا الأوردر؟")) return;
        try {
            const res = await fetch(`/api/admin/crm/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const map: any = {
            "NEW": { label: "جديد", css: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
            "REVIEW": { label: "قيد المراجعة", css: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
            "APPROVED": { label: "معتمد (قيد التحضير)", css: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", icon: CheckCircle2 },
            "DELIVERING": { label: "في الطريق (توصيل)", css: "bg-orange-100 text-orange-700 border-orange-200", icon: Truck },
            "DELIVERED": { label: "تم التسليم", css: "bg-green-100 text-green-700 border-green-200", icon: Check },
            "REJECTED": { label: "مرفوض", css: "bg-red-100 text-red-700 border-red-200", icon: X },
        };
        const config = map[status] || map["NEW"];
        const Icon = config.icon;
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${config.css}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        )
    };

    const isManager = userRole === "ADMIN" || userRole === "SALES_MANAGER";

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">أوامر البيع الميدانية</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{isManager ? "متابعة طلبيات المناديب وإدارتها" : "قم بإنشاء طلبية جديدة لمحلاتك"}</p>
                </div>
                {!isManager && (
                   <button onClick={() => setShowModal(true)} className="flex w-full sm:w-auto justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                       <Plus className="w-5 h-5"/> إنشاء أوردر جديد
                   </button>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                    <PackageOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-700">لا يوجد أوردرات حتى الآن</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">قم بإنشاء الأوردر الأول لعميلك ليبدأ التنفيذ</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-stretch group">
                            
                            {/* Order Info */}
                            <div className="p-5 flex-1 relative border-b md:border-b-0 md:border-l border-slate-100">
                                <div className="absolute top-5 left-5">
                                    <StatusBadge status={order.status} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-500 mb-1">معرف الطلبية #{order.id}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <Store className="w-5 h-5 text-blue-500" />
                                    <span className="text-xl font-black text-slate-800">{order.client?.name || "عميل محذوف"}</span>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md">{order.client?.storeType}</span>
                                </div>
                                
                                {isManager && (
                                   <div className="text-sm font-bold text-slate-500 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100 mt-2 mb-4">
                                       المندوب: <span className="text-slate-800">{order.rep?.name}</span>
                                   </div>
                                )}

                                <p className="text-xs font-semibold text-slate-400 mt-4 h-full align-bottom">
                                    تاريخ الطلب: <span dir="ltr">{new Date(order.createdAt).toLocaleString()}</span>
                                </p>
                            </div>

                            {/* Order Details/Items */}
                            <div className="p-5 flex-[1.5] bg-slate-50/50 flex flex-col">
                                <h4 className="text-[11px] font-black tracking-wide text-slate-400 uppercase mb-3">تفاصيل المنتجات ({order.items.length})</h4>
                                <div className="space-y-2 mb-4 flex-1">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                                    <Box className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{item.product?.name_ar || "منتج محذوف"}</span>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">الكمية: {item.quantity}</span>
                                                {isManager && (
                                                    <span className="text-sm font-black text-slate-800" dir="ltr">{item.subtotal.toFixed(2)} EGP</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 mt-auto">
                                    <div className="text-sm font-bold text-slate-500">ملاحظات: <span className="text-slate-800">{order.notes || "لا يوجد"}</span></div>
                                    {isManager && (
                                        <div className="text-left">
                                            <span className="block text-[10px] font-bold text-slate-400 mb-0.5">الإجمالي الكلي</span>
                                            <span className="text-lg font-black text-green-600" dir="ltr">{order.totalAmount.toFixed(2)} EGP</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Manager Actions */}
                                {isManager && (
                                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap gap-2">
                                        <span className="text-xs font-bold text-slate-500 w-full mb-1">تحديث الحالة:</span>
                                        <button onClick={() => updateOrderStatus(order.id, "REVIEW")} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100">قيد المراجعة</button>
                                        <button onClick={() => updateOrderStatus(order.id, "APPROVED")} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100">مدفوع / معتمد</button>
                                        <button onClick={() => updateOrderStatus(order.id, "DELIVERING")} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100">جاري التوصيل</button>
                                        <button onClick={() => updateOrderStatus(order.id, "DELIVERED")} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100">تم التسليم</button>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}

            {/* Rep Mobile PWA Add Order Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] sm:h-[80vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10 rounded-t-3xl shadow-sm">
                            <h2 className="text-xl font-black text-slate-800">طلب بضاعة للمنفذ</h2>
                            <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-500 hover:text-red-500 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                        </div>
                        
                        <div className="overflow-y-auto p-5 hover-scrollbar flex-1 pb-32 sm:pb-5">
                            <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">اختر نافذة التوزيع (العميل) *</label>
                                    {clients.length === 0 ? (
                                        <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg font-bold border border-red-100">لا تملك أي عملاء حتى الآن. قم بتسجيل المنفذ أولاً.</div>
                                    ) : (
                                        <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 transition-all shadow-inner" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
                                            <option value="">-- اختر المحل من قائمتك --</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.mainPhone}</option>)}
                                        </select>
                                    )}
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-slate-800">الأصناف والكميات المطلوبة</h3>
                                    </div>

                                    {form.items.length === 0 ? (
                                        <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-slate-500">أضف المنتجات التي طلبها العميل</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {form.items.map((item, index) => (
                                                <div key={index} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
                                                    <button type="button" onClick={() => removeItem(index)} className="absolute top-2 left-2 p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
                                                    <div className="flex-[2]">
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">المنتج *</label>
                                                        <select required className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-blue-500" value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)}>
                                                            <option value="">اختر المنتج...</option>
                                                            {products.map(p => <option key={p.id} value={p.id}>{p.name_ar}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex-[1]">
                                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">الكمية *</label>
                                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                                                            <input required type="number" min="1" className="w-full px-3 py-2.5 bg-transparent text-sm font-bold text-center outline-none" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <button type="button" onClick={handleAddItem} className="w-full mt-3 flex justify-center items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold border border-blue-100 transition-all">
                                        <Plus className="w-4 h-4" /> إضافة صنف آخر
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">ملاحظات للمدير (اختياري)</label>
                                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 min-h-[80px]" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="مثال: التوصيل يوم الإثنين بالليل.." />
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer sticky for mobile */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white/90 backdrop-blur z-20 flex gap-3 pb-8 sm:pb-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-[1] px-4 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">إلغاء</button>
                            <button onClick={handleSubmit} disabled={saving} className="flex-[2] flex justify-center items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95 transition-all">
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال الأوردر للإدارة"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
