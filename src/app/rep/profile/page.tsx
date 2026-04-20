"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Key, Loader2, PackageCheck, Users } from "lucide-react";
import { signOut } from "next-auth/react";

export default function RepProfile() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ clients: 0, orders: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sRes, cRes, oRes] = await Promise.all([
                fetch("/api/auth/session"),
                fetch("/api/admin/crm/clients"),
                fetch("/api/admin/crm/orders"),
            ]);
            
            const sessionData = await sRes.json();
            const clientsData = await cRes.json();
            const ordersData = await oRes.json();

            if (sessionData?.user) setUser(sessionData.user);
            
            setStats({
                clients: Array.isArray(clientsData) ? clientsData.length : 0,
                orders: Array.isArray(ordersData) ? ordersData.length : 0
            });
        } catch (error) {
            console.error("Error loading profile data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        </div>
    );

    const initials = (user?.name ?? "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            {/* Header / Avatar Section */}
            <div className="relative overflow-hidden rounded-[2rem] p-8 sm:p-10
                            bg-gradient-to-br from-[#131d30] to-[#0b1120] border border-white/[0.08] shadow-2xl flex flex-col items-center sm:flex-row sm:items-start gap-8">
                {/* Bg effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute inset-0 opacity-[0.2]"
                     style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize:"24px 24px" }} />
                
                <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl ring-4 ring-white/10 shadow-2xl flex-shrink-0">
                    {initials}
                </div>

                <div className="relative z-10 flex-1 text-center sm:text-right flex flex-col justify-center h-full sm:pt-2 w-full">
                    <h1 className="text-3xl font-black text-white mb-2">{user?.name}</h1>
                    <p className="text-emerald-400 font-bold mb-6 flex items-center justify-center sm:justify-start gap-2">
                        <Shield className="w-5 h-5" />
                        {user?.role === "ADMIN" || user?.role === "SALES_MANAGER" ? "مشرف مبيعات" : "مندوب مبيعات متجول"}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start">
                        <div className="flex items-center justify-center sm:justify-start gap-3 bg-white/5 px-5 py-3 rounded-xl border border-white/10 w-full sm:w-auto">
                            <Mail className="w-5 h-5 text-white/40" />
                            <span className="text-white/80 font-bold tracking-wide text-sm">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Stats Performance */}
                <div className="bg-[#131d30]/50 backdrop-blur-xl border border-white/[0.06] rounded-[2rem] p-8 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06]">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                            <User className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-white/90">أداء المندوب</h2>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="text-white/80 font-bold text-[15px]">المنافذ المسجلة</span>
                            </div>
                            <span className="text-3xl font-black text-white">{stats.clients}</span>
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                                    <PackageCheck className="w-6 h-6" />
                                </div>
                                <span className="text-white/80 font-bold text-[15px]">إجمالي الطلبيات</span>
                            </div>
                            <span className="text-3xl font-black text-white">{stats.orders}</span>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-[#131d30]/50 backdrop-blur-xl border border-white/[0.06] rounded-[2rem] p-8 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06]">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <Key className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-white/90">إعدادات الحساب</h2>
                    </div>
                    
                    <div className="flex-1">
                        <div className="text-white/70 text-[15px] font-bold bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
                           <Shield className="w-8 h-8 text-amber-500 flex-shrink-0" />
                           <p className="leading-relaxed">
                               لتعديل كلمة المرور أو تحديث البريد الإلكتروني الخاص بك، يرجى الرجوع لمدير النظام لتطبيق التعديلات؛ وذلك بناءً على خطة الصلاحيات والحماية.
                           </p>
                        </div>
                    </div>

                    <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[15px] font-bold
                                   bg-red-500/10 text-red-400 hover:bg-red-500 border border-red-500/30 hover:border-red-500 hover:text-white transition-all duration-300 shadow-lg">
                        تسجيل الخروج من الحساب
                    </button>
                </div>
            </div>
        </div>
    );
}
