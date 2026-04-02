"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { Package, Milk, Cylinder, Ship, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";
import Link from "next/link";

const PKG_CONFIG = [
    {
        id: "bottles",
        icon: Milk,
        gradient: "from-sky-500 to-blue-600",
        lightGradient: "from-sky-50 to-blue-50",
        borderColor: "border-sky-200",
        hoverBorder: "hover:border-sky-300",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-600",
        badgeBg: "bg-sky-100 text-sky-700",
        accentDot: "bg-sky-500",
        glowColor: "group-hover:shadow-sky-200/60",
        number: "01",
    },
    {
        id: "tins",
        icon: Package,
        gradient: "from-amber-500 to-orange-600",
        lightGradient: "from-amber-50 to-orange-50",
        borderColor: "border-amber-200",
        hoverBorder: "hover:border-amber-300",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        badgeBg: "bg-amber-100 text-amber-700",
        accentDot: "bg-amber-500",
        glowColor: "group-hover:shadow-amber-200/60",
        number: "02",
    },
    {
        id: "drums",
        icon: Cylinder,
        gradient: "from-slate-500 to-gray-700",
        lightGradient: "from-slate-50 to-gray-100",
        borderColor: "border-slate-200",
        hoverBorder: "hover:border-slate-300",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        badgeBg: "bg-slate-100 text-slate-700",
        accentDot: "bg-slate-500",
        glowColor: "group-hover:shadow-slate-200/60",
        number: "03",
    },
    {
        id: "flexitank",
        icon: Ship,
        gradient: "from-emerald-500 to-green-700",
        lightGradient: "from-emerald-50 to-green-50",
        borderColor: "border-emerald-200",
        hoverBorder: "hover:border-emerald-300",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        badgeBg: "bg-emerald-100 text-emerald-700",
        accentDot: "bg-emerald-500",
        glowColor: "group-hover:shadow-emerald-200/60",
        number: "04",
    },
];

export const PackagingGuide = () => {
    const { t, locale, isRTL } = useLanguage();
    const cms = usePageContent("packaging");

    const badge = getBilingualValue(cms, "badge", locale) ?? t.packaging.badge;
    const title = getBilingualValue(cms, "title", locale) ?? t.packaging.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.packaging.subtitle;
    const types = (cms?.types && Array.isArray(cms.types) && cms.types.length > 0)
        ? cms.types.map((p: any) => ({ title: getItemBilingual(p, "title", locale), sizes: getItemBilingual(p, "sizes", locale), description: getItemBilingual(p, "description", locale) }))
        : t.packaging.types;

    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    return (
        <section className="py-28 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22%23000%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />

            <Container className="relative z-10">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-6 border border-amber-200 shadow-sm">
                            <Package className="w-6 h-6" />
                            {badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">
                            {title}
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full mt-6 opacity-60" />
                    </div>
                </ScrollReveal>

                {/* Cards Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
                    {types.map((pkg: any, i: number) => {
                        const cfg = PKG_CONFIG[i];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return (
                            <StaggerItem key={cfg.id}>
                                <div className={`group relative bg-white rounded-3xl border ${cfg.borderColor} ${cfg.hoverBorder} shadow-sm hover:shadow-2xl ${cfg.glowColor} transition-all duration-500 h-full flex flex-col overflow-hidden hover:-translate-y-2`}>
                                    {/* Top gradient accent bar */}
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Card number + Icon header */}
                                    <div className={`relative px-7 pt-8 pb-4`}>
                                        {/* Subtle background pattern on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        <div className="relative z-10 flex items-start justify-between">
                                            {/* Icon container */}
                                            <div className={`w-20 h-20 rounded-2xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                                                <Icon className="w-10 h-10" strokeWidth={1.5} />
                                            </div>

                                            {/* Number badge */}
                                            <span className={`text-4xl font-black text-gray-100 group-hover:text-gray-200 transition-colors duration-300 select-none leading-none`}>
                                                {cfg.number}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 px-7 pb-4 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-gray-800 transition-colors leading-tight">
                                            {pkg.title}
                                        </h3>

                                        {/* Size badge */}
                                        <div className="mb-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${cfg.badgeBg} border border-current/10`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.accentDot}`} />
                                                {pkg.sizes}
                                            </span>
                                        </div>

                                        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">
                                            {pkg.description}
                                        </p>

                                        {/* Features indicators */}
                                        <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-100">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                            <span className="font-medium">
                                                {locale === "ar" ? "متوفر حسب الطلب" : "Available on demand"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom hover reveal bar */}
                                    <div className={`h-1 w-0 bg-gradient-to-r ${cfg.gradient} group-hover:w-full transition-all duration-700 ease-out`} />
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>

                {/* Bottom CTA */}
                <ScrollReveal>
                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-4 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border border-amber-100 shadow-sm">
                            <p className="text-gray-600 font-bold text-sm">
                                {locale === "ar"
                                    ? "نوفّر تعبئة مخصصة حسب متطلبات الأسواق المحلية والتصدير"
                                    : "We offer custom packaging tailored to local and export market requirements"}
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.97] whitespace-nowrap"
                            >
                                {locale === "ar" ? "تواصل معنا" : "Contact Us"}
                                <ArrowIcon className={`w-5 h-5 ${isRTL ? "" : "rotate-0"}`} />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </Container>
        </section>
    );
};
