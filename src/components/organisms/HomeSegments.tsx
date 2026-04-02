"use client";

import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Factory, UtensilsCrossed, Globe, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const SEG_CONFIG = [
    { icon: <Factory className="w-9 h-9" strokeWidth={1.5} />, href: "/b2b/quote", iconBg: "bg-green-100", iconColor: "text-green-700", iconHoverBg: "group-hover:bg-green-600", accentBg: "bg-green-600", ctaBg: "bg-green-50 text-green-700 hover:bg-green-100" },
    { icon: <UtensilsCrossed className="w-9 h-9" strokeWidth={1.5} />, href: "/contact", iconBg: "bg-orange-100", iconColor: "text-orange-600", iconHoverBg: "group-hover:bg-orange-500", accentBg: "bg-orange-500", ctaBg: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
    { icon: <Globe className="w-9 h-9" strokeWidth={1.5} />, href: "/export", iconBg: "bg-blue-100", iconColor: "text-blue-600", iconHoverBg: "group-hover:bg-blue-600", accentBg: "bg-blue-600", ctaBg: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { icon: <ShoppingCart className="w-9 h-9" strokeWidth={1.5} />, href: "/products", iconBg: "bg-purple-100", iconColor: "text-purple-600", iconHoverBg: "group-hover:bg-purple-500", accentBg: "bg-purple-500", ctaBg: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
];

export const HomeSegments = () => {
    const { t, isRTL, locale } = useLanguage();
    const cms = usePageContent("segments");

    const sTitle = getBilingualValue(cms, "title", locale) ?? t.segments.title;
    const sSubtitle = getBilingualValue(cms, "subtitle", locale) ?? t.segments.subtitle;
    const items = (cms?.items && Array.isArray(cms.items) && cms.items.length > 0)
        ? cms.items.map((s: any) => ({ title: getItemBilingual(s, "title", locale), desc: getItemBilingual(s, "desc", locale), cta: getItemBilingual(s, "cta", locale) }))
        : t.segments.items;

    return (
        <section className="py-24 bg-white border-b border-surface-light">
            <Container>
                <ScrollReveal>
                    <SectionHeader title={sTitle} subtitle={sSubtitle} />
                </ScrollReveal>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((seg, i) => {
                        const cfg = SEG_CONFIG[i];
                        return (
                            <StaggerItem key={i}>
                                <Link href={cfg.href} className="group relative block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-400 text-center h-full overflow-hidden">
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />
                                    <span className={`w-16 h-16 rounded-2xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center mx-auto mb-5 ${cfg.iconHoverBg} group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                        {cfg.icon}
                                    </span>
                                    <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-gray-800">{seg.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{seg.desc}</p>
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${cfg.ctaBg} transition-all duration-300`}>
                                        {seg.cta}
                                        <ArrowLeft className={`w-5 h-5 translate-x-0 group-hover:-translate-x-1 transition-transform duration-300 ${!isRTL ? "rotate-180" : ""}`} />
                                    </span>
                                </Link>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </Container>
        </section>
    );
};
