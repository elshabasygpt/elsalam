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
        ? cms.types.map((p: any) => ({ 
            title: getItemBilingual(p, "title", locale), 
            sizes: getItemBilingual(p, "sizes", locale), 
            description: getItemBilingual(p, "description", locale),
            image: p.image 
        }))
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

                {/* Premium Image-Based Cards Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {types.map((pkg: any, i: number) => {
                        const cfg = PKG_CONFIG[i];
                        if (!cfg) return null;
                        
                        // Extract CMS image or fallback to the premium generated image
                        const imageSrc = pkg.image && pkg.image !== "/images/packaging/pet.png" 
                            ? pkg.image 
                            : `/images/packaging/${cfg.id === "bottles" ? "pet" : cfg.id}.png`;

                        return (
                            <StaggerItem key={cfg.id}>
                                <div className={`group relative bg-white rounded-[2rem] border ${cfg.borderColor} hover:border-[#ccd5ae]/50 shadow-sm hover:shadow-2xl hover:shadow-[#e9edc9]/20 transition-all duration-700 h-full flex flex-col overflow-hidden hover:-translate-y-2`}>
                                    
                                    {/* Product Image Section */}
                                    <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                                        <img 
                                            src={imageSrc} 
                                            alt={pkg.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out brightness-95 group-hover:brightness-105"
                                        />
                                        
                                        {/* Subtle overlay gradient to blend image with card */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                                        
                                        {/* Elegant Numbering Tag */}
                                        <div className="absolute top-5 right-5 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-white font-black text-gray-800 text-sm shadow-sm">
                                            {cfg.number}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="relative px-8 pt-4 pb-8 flex-1 flex flex-col items-center text-center bg-white">
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-[#606c38] transition-colors duration-300">
                                            {pkg.title}
                                        </h3>

                                        {/* Premium Sizes Badge */}
                                        <div className="mb-5 inline-flex items-center justify-center">
                                            <span className="bg-[#fefae0] text-[#606c38] px-4 py-1.5 rounded-full text-sm font-bold border border-[#e9edc9] shadow-sm">
                                                {pkg.sizes}
                                            </span>
                                        </div>

                                        <p className="text-gray-500 text-[15px] leading-relaxed flex-1 mb-8">
                                            {pkg.description}
                                        </p>

                                        {/* Features indicators */}
                                        <div className="flex items-center justify-center gap-2 text-sm text-[#283618] pt-5 border-t border-gray-100 w-full">
                                            <CheckCircle2 className="w-5 h-5 text-[#606c38] shrink-0" />
                                            <span className="font-bold">
                                                {locale === "ar" ? "متوفر حسب الطلب" : "Available on demand"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom premium border reveal */}
                                    <div className="h-1.5 w-0 bg-gradient-to-r from-[#d4a373] to-[#ccd5ae] group-hover:w-full transition-all duration-700 ease-out absolute bottom-0 left-0" />
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
