"use client";

import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Factory, UtensilsCrossed, Globe, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const FALLBACK_SEGMENTS = [
    { titleEn: "Food Manufacturers", titleAr: "مصانع الأغذية", descEn: "Custom bulk solutions", descAr: "حلول بالجملة بمواصفات مخصصة", ctaEn: "Request Quote", ctaAr: "طلب عرض سعر", link: "/b2b/quote", image: "/images/placeholder.svg", color: "group-hover:text-green-500" },
    { titleEn: "Hotels & Restaurants", titleAr: "فنادق ومطاعم", descEn: "HoReCa premium lines", descAr: "منتجات HoReCa بمواصفات عالمية", ctaEn: "Contact Us", ctaAr: "تواصل معنا", link: "/contact", image: "/images/placeholder.svg", color: "group-hover:text-orange-500" },
    { titleEn: "Global Export", titleAr: "التصدير العالمي", descEn: "Ready-to-export products", descAr: "منتجات جاهزة للتصدير", ctaEn: "Export Inquiry", ctaAr: "استفسار تصدير", link: "/export", image: "/images/placeholder.svg", color: "group-hover:text-blue-500" },
    { titleEn: "Retail & Distribution", titleAr: "التجزئة والتوزيع", descEn: "Direct to POS", descAr: "توصيل لنقاط البيع", ctaEn: "Shop Now", ctaAr: "تسوق الآن", link: "/products", image: "/images/placeholder.svg", color: "group-hover:text-purple-500" },
];

export const HomeSegments = () => {
    const { t, isRTL, locale } = useLanguage();
    const cmsSect = usePageContent("segments");

    const sTitle = getBilingualValue(cmsSect, "title", locale) || (locale === 'en' ? "How can we serve you?" : "كيف يمكننا خدمتك؟");
    const sSubtitle = getBilingualValue(cmsSect, "subtitle", locale) || (locale === 'en' ? "Tailored solutions for every sector" : "نقدم حلولاً مخصصة لكل قطاع");

    const items = (cmsSect?.items && Array.isArray(cmsSect.items) && cmsSect.items.length > 0)
        ? cmsSect.items.map((s: any, i: number) => ({
            title: locale === 'en' ? s.title_en : s.title_ar,
            desc: locale === 'en' ? s.desc_en : s.desc_ar,
            cta: locale === 'en' ? s.cta_en : s.cta_ar,
            link: s.link || FALLBACK_SEGMENTS[i % FALLBACK_SEGMENTS.length].link,
            image: s.image || FALLBACK_SEGMENTS[i % FALLBACK_SEGMENTS.length].image,
            color: FALLBACK_SEGMENTS[i % FALLBACK_SEGMENTS.length].color,
        }))
        : FALLBACK_SEGMENTS.map(s => ({
            title: locale === 'en' ? s.titleEn : s.titleAr,
            desc: locale === 'en' ? s.descEn : s.descAr,
            cta: locale === 'en' ? s.ctaEn : s.ctaAr,
            link: s.link,
            image: s.image,
            color: s.color,
        }));

    return (
        <section className="py-24 bg-surface-soft/50 relative overflow-hidden">
            <Container className="relative z-10">
                {/* ── Professional Section Header ── */}
                <ScrollReveal>
                    <div className="text-center max-w-3xl mx-auto mb-16 px-4">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6 border border-green-200 shadow-sm">
                            {locale === 'en' ? 'Our Segments' : 'قطاعات الأعمال'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
                            {sTitle}
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-green-700 mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600 font-medium">
                            {sSubtitle}
                        </p>
                    </div>
                </ScrollReveal>

                {/* ── Non-Overlapping Grid Layout ── */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((seg, i) => (
                        <StaggerItem key={i}>
                            <Link
                                href={seg.link}
                                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full border border-slate-100"
                            >
                                {/* Top Image Area */}
                                <div className="relative h-[200px] lg:h-[220px] 2xl:h-[240px] w-full overflow-hidden bg-slate-100 group-hover:shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05)] transition-shadow duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <img
                                        src={seg.image || "/images/placeholder.svg"}
                                        alt={seg.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Bottom Content Area (Non-Overlapping) */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow text-center items-center justify-between">
                                    <div>
                                        <h3 className="font-extrabold text-slate-800 text-xl md:text-2xl mb-3 group-hover:text-green-700 transition-colors duration-300">
                                            {seg.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                                            {seg.desc}
                                        </p>
                                    </div>

                                    <div className="inline-flex items-center gap-2 font-bold text-green-700 bg-green-50 px-5 py-2.5 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 w-full justify-center">
                                        <span>{seg.cta}</span>
                                        <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${!isRTL ? "rotate-180" : ""}`} />
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
};
