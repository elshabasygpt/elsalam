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
        <section className="py-24 bg-surface-soft relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-60 z-0" />
            <Container className="relative z-10">
                <ScrollReveal>
                    <SectionHeader title={sTitle} subtitle={sSubtitle} />
                </ScrollReveal>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {items.map((seg, i) => (
                        <StaggerItem key={i}>
                            <Link 
                                href={seg.link} 
                                className="group relative block rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 h-[380px] bg-white border border-white"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-slate-100">
                                    <img 
                                        src={seg.image || "/images/placeholder.svg"} 
                                        alt={seg.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                </div>

                                {/* Content Layer */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                    {/* Text Content */}
                                    <div className="relative z-20 transform transition-transform duration-500 group-hover:-translate-y-4">
                                        <h3 className={`font-black text-white text-2xl md:text-3xl mb-2 transition-colors duration-300 ${seg.color}`}>
                                            {seg.title}
                                        </h3>
                                        <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-2">
                                            {seg.desc}
                                        </p>
                                    </div>
                                    
                                    {/* Hidden CTA Button that appears on hover */}
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                                        <span className="flex items-center justify-between px-5 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-white font-bold text-sm border border-white/20 hover:bg-white hover:text-green-800 transition-colors">
                                            {seg.cta}
                                            <ArrowLeft className={`w-5 h-5 ${!isRTL ? "rotate-180" : ""}`} />
                                        </span>
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
