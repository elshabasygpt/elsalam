import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Pencil, Eye, CheckCircle2, Clock } from "lucide-react";

const PAGES_CONFIG = [
    { slug: "home", nameAr: "الصفحة الرئيسية", nameEn: "Home Page", href: "/", emoji: "🏠" },
    { slug: "about", nameAr: "من نحن", nameEn: "About Us", href: "/about", emoji: "ℹ️" },
    { slug: "quality", nameAr: "معايير الجودة", nameEn: "Quality Standards", href: "/quality", emoji: "✅" },
    { slug: "production", nameAr: "مراحل الإنتاج", nameEn: "Production", href: "/production", emoji: "🏭" },
    { slug: "export", nameAr: "التصدير العالمي", nameEn: "Export", href: "/export", emoji: "🌍" },
    { slug: "b2b", nameAr: "شراكات B2B", nameEn: "B2B Partnerships", href: "/b2b", emoji: "🤝" },
    { slug: "contact", nameAr: "تواصل معنا", nameEn: "Contact Us", href: "/contact", emoji: "📞" },
];

export default async function AdminPagesPage() {
    const pageContents = await prisma.pageContent.findMany();
    const contentMap = new Map(pageContents.map((p) => [p.pageSlug, p]));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-800">إدارة محتوى الصفحات</h1>
                <p className="text-slate-400 text-sm mt-1">تعديل محتوى صفحات الموقع الأساسية</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-400">
                    <FileText className="w-5 h-5" />
                    <span>إجمالي الصفحات: <span className="font-bold text-slate-600">{PAGES_CONFIG.length}</span></span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">{contentMap.size}</span>
                    <span className="text-slate-400">محفوظ</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAGES_CONFIG.map((page) => {
                    const hasContent = contentMap.has(page.slug);
                    return (
                        <div
                            key={page.slug}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-3xl">{page.emoji}</div>
                                    {hasContent ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg border border-green-100">
                                            <CheckCircle2 className="w-5 h-5" />
                                            محفوظ
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-100">
                                            <Clock className="w-5 h-5" />
                                            افتراضي
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base font-bold text-slate-800 mb-0.5">{page.nameAr}</h3>
                                <p className="text-xs text-slate-400 mb-5">{page.nameEn}</p>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/pages/${page.slug}`}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-900 transition-colors"
                                    >
                                        <Pencil className="w-5 h-5" />
                                        تعديل المحتوى
                                    </Link>
                                    <a
                                        href={page.href}
                                        target="_blank"
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors border border-slate-100"
                                    >
                                        <Eye className="w-5 h-5" />
                                        معاينة
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
