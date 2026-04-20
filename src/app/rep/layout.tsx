"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, PackageCheck, CircleUser, ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
    { id: "home",    label: "الرئيسية",  href: "/rep",         Icon: LayoutGrid   },
    { id: "clients", label: "المنافذ",   href: "/rep/clients", Icon: Users         },
    { id: "orders",  label: "الطلبيات",  href: "/rep/orders",  Icon: PackageCheck  },
    { id: "profile", label: "حسابي",     href: "/rep/profile", Icon: CircleUser    },
];

export default function RepShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router   = useRouter();
    const [user,    setUser]    = useState<any>(null);
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        fetch("/api/auth/session")
            .then(r => r.json())
            .then(d => {
                if (!d?.user) { router.replace("/admin/login"); return; }
                setUser(d.user);
            })
            .catch(() => router.replace("/admin/login"))
            .finally(() => setBooting(false));
    }, [router]);

    /* ── Loading skeleton ── */
    if (booting) return (
        <div className="fixed inset-0 bg-[#0b1120] flex items-center justify-center z-50" dir="rtl">
            <div className="flex flex-col items-center gap-4">
                <span className="relative flex h-14 w-14">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-14 w-14 bg-emerald-500/20 border border-emerald-400/30">
                        <PackageCheck className="h-7 w-7 text-emerald-400" />
                    </span>
                </span>
                <p className="text-white/60 text-sm font-medium tracking-wide">جاري تحميل البيانات…</p>
            </div>
        </div>
    );

    if (!user) return null;

    const initials = (user.name ?? "?").split(" ").map((w: string) => w[0]).join("").slice(0,2).toUpperCase();

    return (
        <div className="min-h-screen bg-[#0b1120] text-white" dir="rtl" style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}>

            {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════ */}
            <aside className="hidden sm:flex fixed right-0 top-0 h-full w-[260px] flex-col z-50
                              bg-[#0d1526]/80 backdrop-blur-xl border-l border-white/[0.06]">

                {/* Logo / Brand */}
                <div className="px-5 pt-8 pb-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600
                                        flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                            <PackageCheck className="w-[26px] h-[26px] text-white" />
                        </div>
                        <div className="text-right overflow-hidden flex-1">
                            <p className="font-black text-white text-[15px] leading-tight whitespace-nowrap">Elsalam Sales</p>
                            <p className="text-[11px] text-white/40 font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap">Field Portal</p>
                        </div>
                    </div>
                </div>

                {/* Avatar */}
                <div className="px-5 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600
                                        flex items-center justify-center text-white font-black text-base
                                        ring-2 ring-white/10 shadow-lg flex-shrink-0">
                            {initials}
                        </div>
                        <div className="text-right overflow-hidden flex-1">
                            <p className="text-[15px] font-bold text-white/90 leading-tight truncate">{user.name}</p>
                            <p className="text-[11px] text-emerald-400 font-bold mt-0.5">مندوب ميداني</p>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 w-full px-3 py-5 space-y-2 flex flex-col">
                    {NAV.map(({ id, label, href, Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link key={id} href={href}
                                className={`group w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[15px] font-bold transition-all duration-200
                                    ${active ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-inner"
                                             : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}
                            >
                                <Icon className={`w-6 h-6 flex-shrink-0 transition-colors ${active ? "text-emerald-400" : "text-white/30 group-hover:text-white/50"}`} strokeWidth={active ? 2.5 : 2.2} />
                                <span className="flex-1 text-right truncate tracking-wide">{label}</span>
                                {active && <ArrowRight className="w-4 h-4 text-emerald-400/60 rotate-180 flex-shrink-0" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin Link + Sign Out */}
                <div className="w-full px-4 py-5 border-t border-white/[0.06] space-y-2 mt-auto">
                    {(user.role === "ADMIN" || user.role === "SALES_MANAGER") && (
                        <Link href="/admin"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold
                                       bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all border border-transparent hover:border-white/10">
                            لوحة الإدارة
                        </Link>
                    )}
                    <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold
                                   bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20">
                        تسجيل الخروج
                    </button>
                </div>
            </aside>

            {/* ══ MOBILE TOP BAR ═══════════════════════════════════════════ */}
            <header className="sm:hidden fixed top-0 left-0 right-0 z-40
                               bg-[#0b1120]/80 backdrop-blur-xl border-b border-white/[0.06]
                               px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600
                                    flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <PackageCheck className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-white leading-tight">Elsalam Sales</p>
                        <p className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase">Field Rep</p>
                    </div>
                </div>

                {/* User bubble */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600
                                flex items-center justify-center text-white font-black text-xs
                                ring-2 ring-white/10">
                    {initials}
                </div>
            </header>

            {/* ══ MAIN CONTENT ═════════════════════════════════════════════ */}
            <main className="sm:pr-64 pt-[60px] sm:pt-0 pb-28 sm:pb-0 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
                    {children}
                </div>
            </main>

            {/* ══ MOBILE BOTTOM TAB BAR ════════════════════════════════════ */}
            <nav className="sm:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center
                            bg-[#131d30]/90 backdrop-blur-xl border border-white/[0.08]
                            rounded-[28px] px-3 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {NAV.map(({ id, label, href, Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link key={id} href={href}
                            className="flex flex-col items-center justify-center w-16 py-1.5 relative group">
                            {active && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2
                                                 w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
                            )}
                            <div className={`relative z-10 p-2 rounded-xl transition-all duration-300
                                            ${active ? "bg-emerald-500/20" : "group-hover:bg-white/5"}`}>
                                <Icon className={`w-5 h-5 transition-all duration-300
                                                 ${active ? "text-emerald-400 scale-110" : "text-white/30 group-hover:text-white/50"}`}
                                     strokeWidth={active ? 2.5 : 1.8} />
                            </div>
                            <span className={`text-[9px] mt-0.5 font-bold tracking-wide transition-all duration-300
                                             ${active ? "text-emerald-400" : "text-white/25"}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
