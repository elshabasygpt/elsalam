"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, Trash2, ShoppingBag, Eye, Calendar, User, MapPin, Phone, RefreshCw } from "lucide-react";
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

export default function WebOrdersPage() {
    const [orders, setOrders] = useState<BaseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        setRefreshing(true);
        try {
            const res = await fetch("/api/admin/web-orders");
            const d = await res.json();
            if (d.success) setOrders(d.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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
                <button 
                    onClick={fetchOrders}
                    className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors font-bold text-sm"
                >
                    <RefreshCw className={`shrink-0 w-5 h-5 ${refreshing ? "animate-spin" : ""}`} strokeWidth={2.5} />
                    تحديث
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">لا توجد طلبات متجر حتى الآن</h2>
                    </div>
                ) : (
                    orders.map((order) => (
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
                                        <Calendar className="w-3.5 h-3.5" />
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
                                        <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-600 font-english font-medium" dir="ltr">{order.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
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
                                    onClick={() => deleteOrder(order.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    title="حذف الطلب"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
