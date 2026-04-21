"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { User, Package, Clock, ShieldCheck, MapPin, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function MyAccountPage() {
    return (
        <AuthProvider>
            <MyAccountContent />
        </AuthProvider>
    );
}

function MyAccountContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { locale, isRTL } = useLanguage();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/user/orders");
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!session?.user) return null;

    const translateStatus = (st: string) => {
        if (locale !== "ar") return st;
        const mp: any = {
            "PENDING": "قيد المراجعة",
            "PROCESSING": "قيد التجهيز",
            "SHIPPED": "تم الشحن",
            "DELIVERED": "تم التوصيل",
            "CANCELLED": "ملغي"
        };
        return mp[st] || st;
    };

    const getStatusColor = (st: string) => {
        switch (st) {
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "PROCESSING": return "bg-blue-100 text-blue-700 border-blue-200";
            case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
            case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className={`min-h-screen bg-slate-50 font-arabic flex flex-col ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />
            
            <main className="flex-1 pt-32 pb-20">
                <Container>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/20">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800">{locale === "ar" ? "حسابي" : "My Account"}</h1>
                            <p className="text-slate-500 font-medium">{session.user.name}</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Info */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-600" />
                                    {locale === "ar" ? "بيانات الحساب" : "Account Details"}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">{locale === "ar" ? "الاسم" : "Name"}</p>
                                        <p className="font-bold text-slate-800">{session.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                                        <p className="font-bold text-slate-800" dir="ltr">{session.user.email}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => router.push("/checkout")}
                                            className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors"
                                        >
                                            {locale === "ar" ? "الذهاب للتسوق" : "Go Shopping"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders History */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px]">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-green-600" />
                                    {locale === "ar" ? "طلباتي السابقة" : "My Orders"}
                                </h3>

                                {orders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                            <Package className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-bold">{locale === "ar" ? "لا توجد طلبات سابقة" : "No previous orders"}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <div key={order.id} className="border border-slate-100 rounded-2xl p-5 hover:border-green-200 transition-all hover:shadow-lg hover:shadow-green-50/50">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-black text-lg text-slate-800">#{order.id}</span>
                                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                                {translateStatus(order.status)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-2">
                                                        <div>
                                                            <p className="font-black text-xl text-green-700">{order.totalAmount} <span className="text-xs">{locale === "ar" ? "ج.م" : "EGP"}</span></p>
                                                            <p className="text-xs text-slate-400">{order.paymentMethod === "COD" ? (locale === "ar" ? "الدفع عند الاستلام" : "COD") : order.paymentMethod}</p>
                                                        </div>
                                                        <Link href={`/invoice/${order.id}`} target="_blank" className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 flex items-center gap-1.5 transition-colors">
                                                            {locale === "ar" ? "عرض الفاتورة وطباعتها" : "View & Print Invoice"}
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 overflow-x-auto custom-scrollbar">
                                                    {order.items.map((item: any) => (
                                                        <div key={item.id} className="flex-shrink-0 flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2 pr-4 min-w-[200px]">
                                                            {item.product?.featured_image ? (
                                                                <img src={item.product.featured_image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center"><Package className="w-5 h-5 text-slate-400"/></div>
                                                            )}
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-700 line-clamp-1">{locale === "ar" ? item.product?.name_ar : item.product?.name_en}</p>
                                                                <p className="text-[10px] text-slate-400">{item.quantity} x {item.unitPrice}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
            
            <Footer />
        </div>
    );
}
