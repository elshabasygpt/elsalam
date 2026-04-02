import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, TrendingUp, Newspaper, FileText, Plus, Settings, ExternalLink, ArrowLeft, Layers, Clock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalPages = await prisma.pageContent.count();
    const recentProducts = await prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
    });

    const stats = [
        {
            label: "المنتجات",
            value: totalProducts,
            icon: Package,
            color: "green",
            bg: "bg-green-50",
            text: "text-green-600",
            ring: "ring-green-500/10",
            href: "/admin/products",
        },
        {
            label: "التصنيفات",
            value: totalCategories,
            icon: Layers,
            color: "blue",
            bg: "bg-blue-50",
            text: "text-blue-600",
            ring: "ring-blue-500/10",
            href: "/admin/products",
        },
        {
            label: "صفحات محفوظة",
            value: totalPages,
            icon: FileText,
            color: "violet",
            bg: "bg-violet-50",
            text: "text-violet-600",
            ring: "ring-violet-500/10",
            href: "/admin/pages",
        },
    ];

    const quickActions = [
        {
            label: "إضافة منتج",
            desc: "أضف منتج جديد للموقع",
            icon: Package,
            href: "/admin/products/new",
            color: "green",
            bgClass: "hover:bg-green-50 hover:border-green-200",
            iconBg: "bg-green-100 text-green-600",
        },
        {
            label: "تعديل الصفحات",
            desc: "عدّل محتوى صفحات الموقع",
            icon: FileText,
            href: "/admin/pages",
            color: "blue",
            bgClass: "hover:bg-blue-50 hover:border-blue-200",
            iconBg: "bg-blue-100 text-blue-600",
        },
        {
            label: "الإعدادات",
            desc: "تعديل إعدادات الموقع",
            icon: Settings,
            href: "/admin/settings",
            color: "amber",
            bgClass: "hover:bg-amber-50 hover:border-amber-200",
            iconBg: "bg-amber-100 text-amber-600",
        },
        {
            label: "عرض الموقع",
            desc: "فتح الموقع في نافذة جديدة",
            icon: ExternalLink,
            href: "/",
            color: "slate",
            bgClass: "hover:bg-slate-100 hover:border-slate-300",
            iconBg: "bg-slate-100 text-slate-600",
            external: true,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-l from-green-600 via-green-700 to-emerald-800 rounded-2xl p-7 md:p-8 shadow-lg shadow-green-600/10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                        أهلاً بك، {session.user?.name || "المدير"} 👋
                    </h1>
                    <p className="text-green-100/80 text-sm md:text-base max-w-lg leading-relaxed">
                        مرحباً بك في لوحة تحكم مصنع السلام. من هنا يمكنك إدارة المنتجات والمحتوى والإعدادات.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group ring-1 ring-transparent hover:ring-gray-100"
                    >
                        <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className={`w-6 h-6 ${stat.text}`} />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-400 mb-1">{stat.label}</div>
                            <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:-translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Products — 3 cols */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-400" />
                            آخر المنتجات المحدَّثة
                        </h2>
                        <Link href="/admin/products" className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1">
                            عرض الكل <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>

                    {recentProducts.length === 0 ? (
                        <div className="p-10 text-center">
                            <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">لا توجد منتجات حتى الآن</p>
                            <Link href="/admin/products/new" className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 mt-3 hover:text-green-700">
                                <Plus className="w-5 h-5" /> أضف أول منتج
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}/edit`}
                                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/50 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                        <Package className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-700 truncate">{product.name_ar}</div>
                                        <div className="text-[11px] text-slate-400">{product.name_en}</div>
                                    </div>
                                    {product.category && (
                                        <span className="hidden sm:inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                                            {product.category.name_ar}
                                        </span>
                                    )}
                                    <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:-translate-x-1 transition-all shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions — 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-400" />
                            إجراءات سريعة
                        </h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                        {quickActions.map((action) => {
                            const Comp = action.external ? "a" : Link;
                            return (
                                <Comp
                                    key={action.label}
                                    href={action.href}
                                    {...(action.external ? { target: "_blank" } : {})}
                                    className={`flex flex-col items-center justify-center p-5 border border-gray-100 rounded-xl transition-all duration-200 gap-2.5 group ${action.bgClass}`}
                                >
                                    <div className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-slate-700">{action.label}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{action.desc}</div>
                                    </div>
                                </Comp>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
