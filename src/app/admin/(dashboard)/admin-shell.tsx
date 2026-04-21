"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, FileText, Settings, Newspaper,
    LogOut, Home, ExternalLink, Menu, X, ChevronLeft, ChevronDown,
    Leaf, Tag, Percent, Mail, Users, PackageOpen, BadgeCheck, ShoppingBag, MapPin, TicketPercent
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
    { id: "settings", label: "إعدادات عامة", href: "/admin/settings", icon: Settings, roles: ["ADMIN"] },
];

export function AdminShell({ children, userName, userRole = "USER", pendingOrdersCount = 0, newMessagesCount = 0 }: { children: ReactNode; userName: string; userRole?: string; pendingOrdersCount?: number; newMessagesCount?: number; }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const filteredNavItems = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(userRole));

    // Auto-expand Products dropdown if on sub-pages
    const isProductsSection = pathname.startsWith("/admin/products") || pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/promotions");
    const [productsOpen, setProductsOpen] = useState(isProductsSection);

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
    const DesktopNavItem = ({ item }: { item: NavItem }) => {
        const hasChildren = item.children && item.children.length > 0;
        const active = isActive(item.href, item.exact);
        const childActive = item.children?.some(c => isActive(c.href));
        const isHighlighted = active || childActive;
        let badgeCount = 0;
        if (item.id === "web_orders") badgeCount = pendingOrdersCount;
        if (item.id === "inbox") badgeCount = newMessagesCount;

        if (hasChildren) {
            return (
                <div>
                    {/* Parent with dropdown toggle */}
                    <div className="flex items-center gap-0.5">
                        <Link
                            href={item.href}
                            className={`
                                flex-1 flex items-center gap-3 px-4 py-2.5 rounded-r-xl text-[13px] font-bold transition-all duration-200 group relative
                                ${isHighlighted
                                    ? "bg-gradient-to-l from-green-500/15 to-green-500/5 text-white shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                }
                            `}
                        >
                            {isHighlighted && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-500 rounded-l-full" />}
                            <item.icon className={`w-[18px] h-[18px] transition-colors ${isHighlighted ? "text-green-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                            <span>{item.label}</span>
                        </Link>
                        <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className={`p-2 rounded-l-xl transition-all duration-200 ${isHighlighted ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"}`}
                        >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    {/* Children dropdown */}
                    <div className={`overflow-hidden transition-all duration-200 ease-out ${productsOpen ? "max-h-40 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}>
                        <div className="mr-4 pr-3 border-r border-slate-800/50 space-y-0.5">
                            {item.children!.map((child) => {
                                const cActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        className={`
                                            flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200
                                            ${cActive
                                                ? "bg-green-500/10 text-green-400"
                                                : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
                                            }
                                        `}
                                    >
                                        <child.icon className={`w-[18px] h-[18px] ${cActive ? "text-green-400" : "text-slate-600"}`} />
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
                href={item.href}
                className={`
                    flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 group relative
                    ${active
                        ? "bg-gradient-to-l from-green-500/15 to-green-500/5 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-500 rounded-l-full" />}
                    <item.icon className={`w-[18px] h-[18px] transition-colors ${active ? "text-green-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                    <span>{item.label}</span>
                </div>
                {badgeCount > 0 ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {badgeCount}
                    </span>
                ) : (
                    active && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                )}
            </Link>
        );
    };

    /* ─── Mobile Nav Item ─── */
    const MobileNavItem = ({ item }: { item: NavItem }) => {
        const hasChildren = item.children && item.children.length > 0;
        const active = isActive(item.href, item.exact);
        const childActive = item.children?.some(c => isActive(c.href));
        const isHighlighted = active || childActive;
        let badgeCount = 0;
        if (item.id === "web_orders") badgeCount = pendingOrdersCount;
        if (item.id === "inbox") badgeCount = newMessagesCount;

        if (hasChildren) {
            return (
                <div>
                    <div className="flex items-center gap-0.5">
                        <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-r-xl text-sm font-bold transition-all relative
                                ${isHighlighted ? "bg-green-500/10 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}
                        >
                            {isHighlighted && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-500 rounded-l-full" />}
                            <item.icon className={`w-5 h-5 ${isHighlighted ? "text-green-400" : "text-slate-500"}`} />
                            <span>{item.label}</span>
                        </Link>
                        <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className={`p-2.5 rounded-l-xl transition-all ${isHighlighted ? "text-green-400" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                    <div className={`overflow-hidden transition-all duration-200 ${productsOpen ? "max-h-40 opacity-100 mt-0.5" : "max-h-0 opacity-0"}`}>
                        <div className="mr-5 pr-3 border-r border-slate-800/50 space-y-0.5">
                            {item.children!.map((child) => {
                                const cActive = isActive(child.href);
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all
                                            ${cActive ? "bg-green-500/10 text-green-400" : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"}`}
                                    >
                                        <child.icon className={`w-5 h-5 ${cActive ? "text-green-400" : "text-slate-600"}`} />
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
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all relative
                    ${active ? "bg-green-500/10 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}
            >
                <div className="flex items-center gap-3">
                    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-green-500 rounded-l-full" />}
                    <item.icon className={`w-5 h-5 ${active ? "text-green-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                </div>
                {badgeCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
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
                <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
                    {filteredNavItems.map((item) => <DesktopNavItem key={item.id} item={item} />)}
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
                    {NAV_ITEMS.map((item) => <MobileNavItem key={item.id} item={item} />)}
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
