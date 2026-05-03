"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, FileText, Settings, Newspaper,
    LogOut, Home, ExternalLink, Menu, X, ChevronLeft, ChevronDown,
    Leaf, Tag, Percent, Mail, Users, PackageOpen, BadgeCheck, ShoppingBag, MapPin, TicketPercent, Key
} from "lucide-react";

type NavItem = {
    id: string; label: string; href: string; icon: any; exact?: boolean;
    children?: { id: string; label: string; href: string; icon: any }[];
    roles?: string[]; // Array of roles allowed to see this item
};

const NAV_ITEMS: NavItem[] = [
    { id: "home", label: "الرئيسية", href: "/admin", icon: Home, exact: true, roles: ["ADMIN", "SALES_MANAGER"] },
    { id: "web_orders", label: "طلبات المتجر العام", href: "/admin/web-orders", icon: ShoppingBag, roles: ["ADMIN", "SALES_MANAGER"] },
    { id: "orders", label: "طلبات البيع الميدانية", href: "/admin/orders", icon: PackageOpen, roles: ["ADMIN", "SALES_MANAGER"] },
    {
        id: "clients", label: "العملاء والمنافذ", href: "/admin/clients", icon: Users, roles: ["ADMIN", "SALES_MANAGER"],
        children: [
            { id: "clients_list", label: "قائمة العملاء", href: "/admin/clients", icon: Users },
            { id: "pipeline", label: "مسار المبيعات", href: "/admin/clients/pipeline", icon: Tag },
        ]
    },
    { id: "pages", label: "محتوى الصفحات", href: "/admin/pages", icon: FileText, roles: ["ADMIN"] },
    {
        id: "products", label: "المنتجات", href: "/admin/products", icon: Package, roles: ["ADMIN"],
        children: [
            { id: "categories", label: "التصنيفات", href: "/admin/categories", icon: Tag },
            { id: "promotions", label: "العروض", href: "/admin/promotions", icon: Percent },
        ],
    },
    { id: "news", label: "الأخبار", href: "/admin/news", icon: Newspaper, roles: ["ADMIN"] },
    { id: "users", label: "فريق الإدارة والمبيعات", href: "/admin/users", icon: BadgeCheck, roles: ["ADMIN"] },
    { id: "inbox", label: "البريد الوارد", href: "/admin/inbox", icon: Mail, roles: ["ADMIN"] },
    { id: "shipping", label: "مناطق الشحن", href: "/admin/shipping", icon: MapPin, roles: ["ADMIN"] },
    { id: "promos", label: "كوبونات الخصم", href: "/admin/promocodes", icon: TicketPercent, roles: ["ADMIN"] },
    {
        id: "settings", label: "إعدادات النظام", href: "/admin/settings", icon: Settings, roles: ["ADMIN"],
        children: [
            { id: "general_settings", label: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
            { id: "invoice_settings", label: "إعدادات الفاتورة", href: "/admin/settings/invoice", icon: FileText },
            { id: "api_settings", label: "مفاتيح الذكاء الاصطناعي", href: "/admin/settings/apis", icon: Key },
        ]
    },
];

export function AdminShell({ children, userName, userRole = "USER", pendingOrdersCount = 0, newMessagesCount = 0 }: { children: ReactNode; userName: string; userRole?: string; pendingOrdersCount?: number; newMessagesCount?: number; }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const filteredNavItems = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(userRole));

    // Auto-expand relevant dropdowns based on current path
    const isProductsSection = pathname.startsWith("/admin/products") || pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/promotions");
    const isSettingsSection = pathname.startsWith("/admin/settings");
    const isClientsSection = pathname.startsWith("/admin/clients");
    
    const [productsOpen, setProductsOpen] = useState(isProductsSection);
    const [settingsOpen, setSettingsOpen] = useState(isSettingsSection);
    const [clientsOpen, setClientsOpen] = useState(isClientsSection);

    // Sync dropdown state when navigating
    useEffect(() => {
        if (isProductsSection) setProductsOpen(true);
        if (isSettingsSection) setSettingsOpen(true);
        if (isClientsSection) setClientsOpen(true);
    }, [pathname, isProductsSection, isSettingsSection, isClientsSection]);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    const getPageTitle = () => {
        if (pathname === "/admin") return "نظرة عامة";
        // Check children too
        for (const item of NAV_ITEMS) {
            if (item.children) {
                const child = item.children.find(c => pathname.startsWith(c.href));
                if (child) return child.label;
            }
            if (!item.exact && pathname.startsWith(item.href)) return item.label;
        }
        return "لوحة التحكم";
    };

    /* ─── Desktop Nav Item ─── */
    const renderDesktopNavItem = (item: NavItem) => {
        const hasChildren = item.children && item.children.length > 0;
        const active = isActive(item.href, item.exact);
        const childActive = item.children?.some(c => isActive(c.href));
        const isHighlighted = active || childActive;
        const isOpen = item.id === "settings" ? settingsOpen : item.id === "clients" ? clientsOpen : productsOpen;

        let badgeCount = 0;
        if (item.id === "web_orders") badgeCount = pendingOrdersCount;
        if (item.id === "inbox") badgeCount = newMessagesCount;

        if (hasChildren) {
            return (
                <div key={item.id} className="flex flex-col">
                    {/* Parent with dropdown toggle */}
                    <div className={`
                        flex items-center rounded-xl transition-all duration-300 group cursor-pointer
                        ${isHighlighted
                            ? "bg-emerald-500/10 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.03)]"
                            : "hover:bg-slate-800/40"
                        }
                    `}>
                        <Link
                            href={item.href}
                            className={`
                                flex-1 flex items-center gap-3.5 px-4 py-3 text-[13px] font-bold transition-all duration-300 relative rounded-r-xl
                                ${isHighlighted ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}
                            `}
                        >
                            {isHighlighted && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />}
                            <item.icon className={`w-5 h-5 transition-all duration-300 ${isHighlighted ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={isHighlighted ? 2.5 : 2} />
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.id === "settings") setSettingsOpen(!settingsOpen);
                                else if (item.id === "clients") setClientsOpen(!clientsOpen);
                                else setProductsOpen(!productsOpen);
                            }}
                            className={`p-3 rounded-l-xl transition-all duration-300 flex items-center justify-center ${
                                isHighlighted ? "text-emerald-400 hover:text-emerald-300" : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    {/* Children dropdown */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-56 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}>
                        <div className="mr-[22px] pr-4 border-r-2 border-slate-800/50 space-y-1 py-1">
                            {item.children!.map((child) => {
                                const cActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200
                                            ${cActive
                                                ? "bg-slate-800/60 text-emerald-400"
                                                : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300"
                                            }
                                        `}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${cActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-125" : "bg-slate-600"}`} />
                                        <span>{child.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.id}
                href={item.href}
                className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 group relative
                    ${active
                        ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.03)]"
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                    }
                `}
            >
                <div className="flex items-center gap-3.5">
                    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />}
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${active ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={active ? 2.5 : 2} />
                    <span className="tracking-wide">{item.label}</span>
                </div>
                {badgeCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black shadow-sm transition-colors ${active ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300 group-hover:bg-slate-600"}`}>
                        {badgeCount}
                    </span>
                )}
            </Link>
        );
    };

    /* ─── Mobile Nav Item ─── */
    const renderMobileNavItem = (item: NavItem) => {
        const hasChildren = item.children && item.children.length > 0;
        const active = isActive(item.href, item.exact);
        const childActive = item.children?.some(c => isActive(c.href));
        const isHighlighted = active || childActive;
        const isOpen = item.id === "settings" ? settingsOpen : item.id === "clients" ? clientsOpen : productsOpen;

        let badgeCount = 0;
        if (item.id === "web_orders") badgeCount = pendingOrdersCount;
        if (item.id === "inbox") badgeCount = newMessagesCount;

        if (hasChildren) {
            return (
                <div key={item.id} className="flex flex-col">
                    <div className={`
                        flex items-center rounded-xl transition-all duration-300 group relative
                        ${isHighlighted ? "bg-emerald-500/10" : "hover:bg-slate-800/40"}
                    `}>
                        <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex-1 flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold transition-all relative rounded-r-xl
                                ${isHighlighted ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHighlighted && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />}
                            <item.icon className={`w-5 h-5 ${isHighlighted ? "text-emerald-400" : "text-slate-500"}`} strokeWidth={isHighlighted ? 2.5 : 2} />
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.id === "settings") setSettingsOpen(!settingsOpen);
                                else if (item.id === "clients") setClientsOpen(!clientsOpen);
                                else setProductsOpen(!productsOpen);
                            }}
                            className={`p-3.5 px-4 rounded-l-xl transition-all duration-300 flex items-center justify-center ${
                                isHighlighted ? "text-emerald-400" : "text-slate-500"
                            }`}
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-56 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}>
                        <div className="mr-[22px] pr-4 border-r-2 border-slate-800/50 space-y-1 py-1">
                            {item.children!.map((child) => {
                                const cActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all
                                            ${cActive ? "bg-slate-800/60 text-emerald-400" : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300"}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${cActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] scale-125" : "bg-slate-600"}`} />
                                        <span>{child.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all relative
                    ${active ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
                <div className="flex items-center gap-3.5">
                    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />}
                    <item.icon className={`w-5 h-5 ${active ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-500"}`} strokeWidth={active ? 2.5 : 2} />
                    <span className="tracking-wide">{item.label}</span>
                </div>
                {badgeCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black shadow-sm ${active ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"}`}>
                        {badgeCount}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen bg-[#f8f9fc] flex-col md:flex-row" dir="rtl">
            {/* ─── Desktop Sidebar ─── */}
            <aside className="hidden md:flex md:flex-col md:w-[260px] md:fixed md:inset-y-0 md:right-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-400 shadow-2xl z-30 border-l border-slate-800/50">
                {/* Brand */}
                <div className="flex items-center gap-3 h-[72px] px-6 border-b border-slate-800/60">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-[15px] font-bold text-white tracking-tight">لوحة التحكم</span>
                        <span className="block text-[10px] text-slate-500 font-medium -mt-0.5">مصنع السلام</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {filteredNavItems.map(item => renderDesktopNavItem(item))}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-slate-800/60 space-y-1">
                    <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-all">
                        <ExternalLink className="w-[18px] h-[18px]" /> <span>عرض الموقع</span>
                    </a>
                    <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <LogOut className="w-[18px] h-[18px]" /> <span>تسجيل خروج</span>
                    </a>
                </div>
            </aside>

            {/* ─── Mobile Overlay ─── */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* ─── Mobile Drawer ─── */}
            <aside className={`fixed top-0 right-0 h-full w-[280px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-400 z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between h-[72px] px-5 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[15px] font-bold text-white">لوحة التحكم</span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-72px-80px)]">
                    {filteredNavItems.map(item => renderMobileNavItem(item))}
                </nav>
                <div className="p-3 border-t border-slate-800/60">
                    <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400/80 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-5 h-5" /> <span>تسجيل خروج</span>
                    </a>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 md:mr-[260px] w-full min-w-0">
                {/* Top Header Bar */}
                <header className="h-[72px] bg-white/80 backdrop-blur-xl flex items-center justify-between px-5 md:px-8 sticky top-0 z-20 border-b border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -mr-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                            <LayoutDashboard className="w-5 h-5 text-slate-400 hidden sm:block" />
                            <span className="text-slate-400 hidden sm:block">لوحة التحكم</span>
                            <ChevronLeft className="w-5 h-5 text-slate-300 hidden sm:block" />
                            <span className="text-slate-700 font-bold">{getPageTitle()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-green-50">
                            <ExternalLink className="w-5 h-5" /> عرض الموقع
                        </a>
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                <span className="text-white text-base font-black">{userName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[14px] font-bold text-slate-800 leading-none mb-1">{userName}</div>
                                <div className="text-[11px] text-slate-400 font-bold leading-none">مدير النظام</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-5 md:p-8 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
