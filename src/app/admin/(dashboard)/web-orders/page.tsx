"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, Trash2, ShoppingBag, Eye, Calendar, User, MapPin, Phone, RefreshCw, Edit, Plus, X, Box, Search } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type BaseOrder = {
    id: number;
    customerName: string;
    customerPhone: string;
    governorate: string;
    shippingAddress: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

function SearchableSelect({ value, onChange, options, placeholder }: { value: any, onChange: (val: any) => void, options: {id: any, label: string}[], placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    
    const selectedOption = options.find(o => o.id.toString() === value?.toString());
    const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative w-full">
            <div 
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <span className="text-gray-400 text-[10px] mr-2">▼</span>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[105]" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 right-0 z-[110] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 flex flex-col overflow-hidden">
                        <div className="p-2 border-b bg-gray-50">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    className="w-full pr-8 pl-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="ابحث عن منتج..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {filteredOptions.length === 0 ? (
                                <div className="p-3 text-center text-sm text-gray-500">لا توجد نتائج</div>
                            ) : (
                                filteredOptions.map(opt => (
                                    <div 
                                        key={opt.id}
                                        className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
                                        onClick={() => {
                                            onChange(opt.id);
                                            setIsOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {opt.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function WebOrdersPage() {
    const [orders, setOrders] = useState<BaseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    
    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        if (!searchQuery) return matchesStatus;

        const q = searchQuery.toLowerCase();
        const matchesSearch = (
            order.id.toString().includes(q) ||
            order.customerName.toLowerCase().includes(q) ||
            order.customerPhone.includes(q) ||
            order.governorate.toLowerCase().includes(q)
        );

        return matchesStatus && matchesSearch;
    });
    const fetchOrdersAndProducts = async () => {
        setRefreshing(true);
        try {
            const [oRes, pRes] = await Promise.all([
                fetch("/api/admin/web-orders"),
                fetch("/api/admin/products")
            ]);
            
            const oData = await oRes.json();
            if (oData.success) setOrders(oData.data);
            
            if (pRes.ok) {
                const pData = await pRes.json();
                setProducts(pData.products || pData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrdersAndProducts();
    }, []);

    const openEditModal = (order: BaseOrder) => {
        setEditForm({
            id: order.id,
            customerName: order.customerName || "",
            customerPhone: order.customerPhone || "",
            governorate: order.governorate || "",
            shippingAddress: order.shippingAddress || "",
            shippingFee: (order as any).shippingFee || 0,
            discountAmount: (order as any).discountAmount || 0,
            notes: (order as any).notes || "",
            items: order.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.unitPrice,
                productName: i.product?.name_ar || ""
            }))
        });
        setShowEditModal(true);
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/web-orders/${editForm.id}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                setOrders(orders.map(o => o.id === data.data.id ? data.data : o));
                setShowEditModal(false);
            } else {
                alert("حدث خطأ أثناء حفظ التعديلات");
            }
        } catch (e) {
            alert("حدث خطأ في الاتصال");
        } finally {
            setSaving(false);
        }
    };

    const updateEditItem = (index: number, field: string, value: any) => {
        const updated = [...editForm.items];
        if (field === 'productId') {
            const prod = products.find(p => p.id.toString() === value.toString());
            updated[index].productId = value;
            if (prod) {
                updated[index].price = prod.price || 0;
                updated[index].productName = prod.name_ar;
            }
        } else {
            updated[index][field] = value;
        }
        setEditForm({ ...editForm, items: updated });
    };

    const addEditItem = () => {
        setEditForm({ ...editForm, items: [...editForm.items, { productId: "", quantity: 1, price: 0, productName: "" }] });
    };

    const removeEditItem = (index: number) => {
        const updated = [...editForm.items];
        updated.splice(index, 1);
        setEditForm({ ...editForm, items: updated });
    };

    const sendWhatsApp = (order: BaseOrder) => {
        let phone = order.customerPhone.trim();
        // Assume Egyptian number if it starts with 01
        if (phone.startsWith("01") && phone.length === 11) {
            phone = "+2" + phone;
        }
        const invoiceUrl = `${window.location.origin}/invoice/${order.id}`;
        const msg = encodeURIComponent(`مرحباً ${order.customerName}،\nشكراً لطلبك من مصنع السلام للزيوت النباتية.\n\nيمكنك الإطلاع على فاتورتك وتحميلها من الرابط التالي:\n${invoiceUrl}`);
        window.open(`https://wa.me/${phone.replace(/[^0-9+]/g, '')}?text=${msg}`, '_blank');
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/web-orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            }
        } catch (e) {
            alert("حدث خطأ أثناء تحديث الحالة");
        }
    };

    const deleteOrder = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
        try {
            const res = await fetch(`/api/admin/web-orders/${id}`, { method: "DELETE" });
            if (res.ok) {
                setOrders(orders.filter(o => o.id !== id));
            }
        } catch (e) {
            alert("حدث خطأ أثناء الحذف");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "PROCESSING": return "bg-blue-100 text-blue-800 border-blue-200";
            case "SHIPPED": return "bg-purple-100 text-purple-800 border-purple-200";
            case "DELIVERED": return "bg-green-100 text-green-800 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "قيد الانتظار";
            case "PROCESSING": return "جاري التجهيز";
            case "SHIPPED": return "مشحون";
            case "DELIVERED": return "مكتمل";
            case "CANCELLED": return "ملغي";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="w-10 h-10 animate-spin text-green-700" />
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl" style={{ fontFamily: "var(--font-arabic)" }}>
            <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                        <ShoppingBag className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">طلبات المتجر (B2C)</h1>
                        <p className="text-gray-500 text-sm mt-1">إدارة أوردرات التجارة الإلكترونية الخاصة بالزوار</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-700 w-full sm:w-auto outline-none transition-shadow"
                    >
                        <option value="ALL">جميع الحالات</option>
                        <option value="PENDING">قيد الانتظار</option>
                        <option value="PROCESSING">جاري التجهيز</option>
                        <option value="SHIPPED">مشحون</option>
                        <option value="DELIVERED">مكتمل</option>
                        <option value="CANCELLED">ملغي</option>
                    </select>

                    <div className="relative w-full sm:w-72">
                        <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="ابحث بالاسم، الهاتف، أو رقم الفاتورة..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>
                    <button 
                        onClick={fetchOrdersAndProducts}
                        className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors font-bold text-sm w-full sm:w-auto"
                    >
                        <RefreshCw className={`shrink-0 w-5 h-5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
                        تحديث
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">لا توجد طلبات מתطابقة مع بحثك</h2>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-english font-bold text-gray-400">#{order.id}</span>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusStyle(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                        <Calendar className="w-5 h-5 shrink-0" />
                                        {format(new Date(order.createdAt), "dd MMMM yyyy, hh:mm a", { locale: ar })}
                                    </div>
                                </div>
                                <div className="text-left">
                                    <span className="text-xs text-gray-500 block mb-0.5 font-medium">الإجمالي</span>
                                    <span className="text-lg font-black text-green-700">{order.totalAmount.toLocaleString()} ج.م</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-4">
                                {/* Customer Info */}
                                <div className="space-y-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600 font-english font-medium" dir="ltr">{order.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{order.governorate}</p>
                                            <p className="text-xs text-gray-500 leading-tight mt-1 truncate" title={order.shippingAddress}>{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Summary */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-2">المنتجات المطلوبة ({order.items.length})</p>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm bg-white border border-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center gap-2 w-2/3">
                                                    <span className="w-5 h-5 bg-green-50 text-green-700 rounded text-[10px] font-black flex items-center justify-center shrink-0">x{item.quantity}</span>
                                                    <span className="text-gray-700 truncate font-bold text-xs" title={item.product?.name_ar}>{item.product?.name_ar}</span>
                                                </div>
                                                <span className="font-bold text-gray-900 text-xs shrink-0">{item.subtotal.toLocaleString()} ج.م</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex-1">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
                                    >
                                        <option value="PENDING">قيد الانتظار</option>
                                        <option value="PROCESSING">جاري التجهيز</option>
                                        <option value="SHIPPED">تم الشحن / مخرج للتوصيل</option>
                                        <option value="DELIVERED">مكتمل وتم التسليم</option>
                                        <option value="CANCELLED">ملغي</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={() => fetchOrdersAndProducts()}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 hidden"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => sendWhatsApp(order)}
                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100 flex items-center gap-1.5 text-sm font-bold"
                                    title="إرسال الفاتورة عبر واتساب"
                                >
                                    <Phone className="w-5 h-5" />
                                    واتساب
                                </button>
                                <button 
                                    onClick={() => openEditModal(order)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 flex items-center gap-1.5 text-sm font-bold"
                                    title="تعديل الطلب"
                                >
                                    <Edit className="w-5 h-5" />
                                    تعديل
                                </button>
                                <button 
                                    onClick={() => deleteOrder(order.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    title="حذف الطلب"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Order Modal */}
            {showEditModal && editForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800">تعديل الطلب #{editForm.id}</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="editOrderForm" onSubmit={handleEditSave} className="space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">بيانات العميل</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">الاسم</label>
                                            <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={editForm.customerName || ""} onChange={e => setEditForm({...editForm, customerName: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">رقم الهاتف</label>
                                            <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm text-left" dir="ltr" value={editForm.customerPhone || ""} onChange={e => setEditForm({...editForm, customerPhone: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">المحافظة</label>
                                            <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={editForm.governorate || ""} onChange={e => setEditForm({...editForm, governorate: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">العنوان بالتفصيل</label>
                                            <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={editForm.shippingAddress || ""} onChange={e => setEditForm({...editForm, shippingAddress: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                {/* Financials */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">الماليات</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">مصاريف الشحن</label>
                                            <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" value={editForm.shippingFee ?? 0} onChange={e => setEditForm({...editForm, shippingFee: parseFloat(e.target.value) || 0})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">الخصم (رقم ثابت)</label>
                                            <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" value={editForm.discountAmount ?? 0} onChange={e => setEditForm({...editForm, discountAmount: parseFloat(e.target.value) || 0})} />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">ملاحظات على الطلب / الفاتورة</label>
                                        <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="اكتب أي ملاحظات للعميل أو للسائق..."></textarea>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                                        <h3 className="text-sm font-bold text-slate-800">المنتجات والكميات</h3>
                                        <button type="button" onClick={addEditItem} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100"><Plus className="w-5 h-5 shrink-0" /> إضافة منتج</button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {editForm.items.map((item: any, index: number) => (
                                            <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
                                                <div className="flex-[2]">
                                                    <SearchableSelect 
                                                        value={item.productId || ""}
                                                        onChange={(val) => updateEditItem(index, 'productId', val)}
                                                        options={products.map(p => ({ id: p.id, label: p.name_ar }))}
                                                        placeholder="اختر المنتج..."
                                                    />
                                                </div>
                                                <div className="flex-[1]">
                                                    <input required type="number" min="1" className="w-full px-3 py-2 border rounded-lg text-sm" value={item.quantity ?? 1} onChange={e => updateEditItem(index, 'quantity', parseInt(e.target.value) || 1)} placeholder="الكمية" />
                                                </div>
                                                <div className="flex-[1]">
                                                    <input required type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100" value={item.price ?? 0} onChange={e => updateEditItem(index, 'price', parseFloat(e.target.value) || 0)} placeholder="السعر" />
                                                </div>
                                                <button type="button" onClick={() => removeEditItem(index)} className="p-2 text-red-400 hover:text-red-600 bg-white rounded-lg border hover:border-red-200 shadow-sm"><X className="w-5 h-5"/></button>
                                            </div>
                                        ))}
                                        {editForm.items.length === 0 && (
                                            <p className="text-sm text-red-500 text-center py-4">يجب إضافة منتج واحد على الأقل</p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 rounded-b-3xl">
                            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 flex-1">إلغاء</button>
                            <a href={`/invoice/${editForm.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-bold hover:bg-blue-100 flex-1 transition-colors">
                                <ExternalLink className="w-5 h-5" />
                                معاينة الفاتورة
                            </a>
                            <button onClick={handleEditSave} disabled={saving || editForm.items.length === 0} className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all">
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ التعديلات"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
