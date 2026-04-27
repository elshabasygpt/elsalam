"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users, PackageCheck, TrendingUp, Plus,
    ChevronLeft, Loader2, Clock, CheckCircle2, Truck, Activity
} from "lucide-react";

interface Stats { clients: number; orders: number; pending: number; delivered: number; }

const STATUS_MAP: Record<string, { label: string; color: string; Icon: any }> = {
    NEW:        { label: "جديد",          color: "text-sky-400   bg-sky-400/10   border-sky-400/20",     Icon: Clock         },
    REVIEW:     { label: "قيد المراجعة",  color: "text-amber-400  bg-amber-400/10  border-amber-400/20",  Icon: TrendingUp    },
    APPROVED:   { label: "معتمد",         color: "text-violet-400 bg-violet-400/10 border-violet-400/20", Icon: CheckCircle2  },
    DELIVERING: { label: "في الطريق",     color: "text-orange-400 bg-orange-400/10 border-orange-400/20", Icon: Truck         },
    DELIVERED:  { label: "تم التسليم",    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", Icon: CheckCircle2 },
};

export default function RepDashboard() {
    const [stats,   setStats]   = useState<Stats>({ clients: 0, orders: 0, pending: 0, delivered: 0 });
    const [recent,  setRecent]  = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [name,    setName]    = useState("المندوب");

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const [sRes, dRes] = await Promise.all([
                fetch("/api/auth/session"),
                fetch("/api/rep/dashboard"),
            ]);
            
            const session = await sRes.json();
            const data = await dRes.json();

            setName(session?.user?.name?.split(" ")[0] ?? "المندوب");

            if (data && data.stats) {
                setStats(data.stats);
                setRecent(data.recent || []);
            } else if (data && data.error) {
                setError(data.error);
            } else {
                setError("حدث خطأ غير معروف أثناء تحميل البيانات");
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "حدث خطأ في الاتصال بالخادم");
        } finally {
            setLoading(false);
        }
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "مساء النور";

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center py-32">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl max-w-md text-center font-bold">
                {error}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* ── Main Area ─────────────────────────────────────────────── */}
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
                
                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 min-h-[220px] flex flex-col justify-center
                                bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400
                                shadow-[0_20px_60px_rgba(16,185,129,0.25)] border border-emerald-400/30">
                    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.15]"
                         style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"24px 24px" }} />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <p className="text-emerald-50 font-medium text-sm sm:text-base mb-1.5 flex items-center gap-2">
                                {greeting}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3 tracking-tight">
                                {name} 👋
                            </h1>
                            <p className="text-emerald-50 max-w-sm text-sm sm:text-base leading-relaxed opacity-90">
                                لديك <span className="text-white font-black px-1 text-xl">{stats.pending}</span> 
                                طلب{stats.pending === 1 ? "" : "ات"} مسجل بانتظار المتابعة اليوم، نتمنى لك يوماً مثمراً!
                            </p>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-3 min-w-[160px]">
                            <Link href="/rep/orders"
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-emerald-700 px-5 py-3.5
                                           rounded-2xl text-sm font-black shadow-xl shadow-black/10
                                           hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
                                <Plus className="w-5 h-5" strokeWidth={3} />
                                أوردر جديد
                            </Link>
                            <Link href="/rep/clients"
                                className="flex-1 flex items-center justify-center gap-2 bg-black/20 backdrop-blur text-white px-5 py-3.5
                                           rounded-2xl text-sm font-bold border border-white/20
                                           hover:bg-black/30 hover:border-white/30 active:scale-95 transition-all duration-300">
                                <Users className="w-5 h-5" />
                                العملاء
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                    {[
                        { label: "المنافذ",   value: stats.clients,   color: "from-sky-500/20 to-sky-500/5",       border: "border-sky-500/20",   text: "text-sky-400",   Icon: Users },
                        { label: "الأوردرات",   value: stats.orders,    color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400", Icon: PackageCheck },
                        { label: "قيد التنفيذ",     value: stats.pending,   color: "from-amber-500/20 to-amber-500/5",   border: "border-amber-500/20", text: "text-amber-400", Icon: Activity },
                        { label: "تم التسليم",      value: stats.delivered, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", Icon: CheckCircle2 },
                    ].map((s, i) => (
                        <div key={i}
                             className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${s.color}
                                         border ${s.border} p-5 flex flex-col justify-center
                                         hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
                            <s.Icon className={`absolute -left-2 -top-2 w-20 h-20 opacity-[0.07] ${s.text} -scale-x-100`} />
                            <div className="relative z-10 flex flex-col">
                                <span className="text-white/50 text-[11px] font-bold tracking-wider uppercase mb-1.5">{s.label}</span>
                                <span className={`text-3xl sm:text-4xl font-black ${s.text} leading-none tracking-tight`}>{s.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* ── Side Panel Area ───────────────────────────────────────────── */}
            <div className="xl:col-span-1">
                <div className="bg-[#131d30]/50 backdrop-blur-xl border border-white/[0.06] rounded-[2rem] p-6 h-full flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 
                                            flex items-center justify-center border border-violet-500/20">
                                <Clock className="w-6 h-6 text-violet-400 shrink-0" />
                            </div>
                            <h2 className="text-white/90 font-black text-base tracking-wide">أحدث الطلبيات</h2>
                        </div>
                        <Link href="/rep/orders"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50
                                       hover:bg-white/10 hover:text-white transition-all">
                            <ChevronLeft className="w-6 h-6 shrink-0" />
                        </Link>
                    </div>

                    {recent.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                            <div className="w-20 h-20 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <PackageCheck className="w-12 h-12 text-white/20 shrink-0" />
                            </div>
                            <h3 className="text-white/80 text-base font-bold mb-1">لا توجد طلبيات</h3>
                            <p className="text-white/40 text-xs mb-6 max-w-[200px]">لم تقم بإنشاء أي طلبيات جديدة حتى الآن.</p>
                            <Link href="/rep/orders"
                                className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-6 py-3
                                           rounded-2xl text-sm font-bold border border-emerald-500/20
                                           hover:bg-emerald-500/20 transition-all">
                                <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                                إنشاء أول طلبية
                            </Link>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col gap-4">
                            {recent.map((order: any) => {
                                const s = STATUS_MAP[order.status] ?? STATUS_MAP.NEW;
                                return (
                                    <div key={order.id} className="group relative flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer">
                                        {/* Status Icon */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${s.color.split(" ").slice(-2).join(" ")} group-hover:scale-110 transition-transform duration-300`}>
                                            <s.Icon className={`w-6 h-6 ${s.color.split(" ")[0]}`} strokeWidth={2} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 pb-0.5">
                                            <p className="text-white/95 font-bold text-[13px] truncate mb-1">
                                                {order.client?.name ?? "عميل محذوف"}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold tracking-wide ${s.color.split(" ")[0]}`}>
                                                    {s.label}
                                                </span>
                                                <span className="text-white/20 text-[10px]">•</span>
                                                <span className="text-white/40 text-[10px] font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Right Arrow */}
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-white/10 group-hover:text-white transition-all">
                                            <ChevronLeft className="w-5 h-5 shrink-0" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
