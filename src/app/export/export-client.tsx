"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { ExportInquiryForm } from "@/components/organisms/ExportInquiryForm";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { StatsCounter } from "@/components/organisms/StatsCounter";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Globe, Plane, Ship, Anchor, Truck, Package, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ExportClient() {
    const { t, locale, isRTL } = useLanguage();
    const CtaArrow = isRTL ? ArrowLeft : ArrowRight;

    // Logistics features specifically for B2B export
    const logistics = [
        {
            icon: <Ship className="w-10 h-10 text-blue-500" />,
            title_ar: "الشحن البحري",
            title_en: "Sea Freight",
            desc_ar: "تصميم حاويات مخصص لكفاءة الحجم والشحن لجميع الموانئ العالمية الرئيسية بنظام FOB أو CIF.",
            desc_en: "Custom containerization for volume efficiency and shipping to all major global ports under FOB or CIF."
        },
        {
            icon: <Plane className="w-10 h-10 text-sky-500" />,
            title_ar: "الشحن الجوي",
            title_en: "Air Freight",
            desc_ar: "خيارات التسليم السريع للطلبات العاجلة والعينات بأسعار تنافسية من مطارات القاهرة والإسكندرية.",
            desc_en: "Expedited delivery options for urgent orders and samples at competitive rates from Cairo and Alex airports."
        },
        {
            icon: <Truck className="w-10 h-10 text-emerald-500" />,
            title_ar: "لوجستيات برية",
            title_en: "Land Logistics",
            desc_ar: "شبكة نقل بري واسعة تغطي شمال أفريقيا والشرق الأوسط بكفاءة وأمان تام.",
            desc_en: "Extensive land transportation network covering North Africa and the Middle East safely and efficiently."
        },
        {
            icon: <Package className="w-10 h-10 text-amber-500" />,
            title_ar: "تعبئة مخصصة للتصدير",
            title_en: "Export Packaging",
            desc_ar: "حلول تعبئة قوية مطابقة للمواصفات الدولية تضمن سلامة المنتجات أثناء الرحلات الطويلة.",
            desc_en: "Robust packaging solutions matching international standards, ensuring product integrity during transit."
        }
    ];

    return (
        <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />

            {/* Premium Export Hero */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-slate-900 to-primary-dark overflow-hidden">
                {/* Background Video/Image Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>

                {/* Dynamic Glow Backgrounds */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full" />
                </div>

                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface-soft" style={{ clipPath: "ellipse(100% 100% at 50% 100%)" }} />

                <Container className="relative z-10 text-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                            <Globe className="w-5 h-5 text-blue-300" />
                            <span className="text-white/90 text-sm font-bold uppercase tracking-wider">
                                {locale === 'ar' ? 'شبكة تصدير عالمية' : 'Global Export Network'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-xl leading-tight max-w-4xl mx-auto">
                            {locale === 'ar' ? 'نصدر جودة مصرية' : 'Exporting Egyptian Quality Globally'}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                                {locale === 'ar' ? 'بمعايير عالمية' : 'With Global Standards'}
                            </span>
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                            {t.export.heroSubtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#export-inquiry" className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all w-full sm:w-auto justify-center">
                                {t.export.heroCta}
                                <CtaArrow className="w-5 h-5" />
                            </a>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Global Reach Stats */}
            <div className="relative z-20 -mt-10 lg:-mt-16">
                <StatsCounter />
            </div>

            {/* Capacity & Logistics */}
            <section className="py-24 bg-surface-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />

                <Container className="relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl lg:text-5xl font-black text-primary-dark mb-4">
                                {locale === 'ar' ? 'قدرات لوجستية متطورة' : 'Advanced Logistic Capabilities'}
                            </h2>
                            <p className="text-text-dark/70 text-lg">
                                {locale === 'ar'
                                    ? 'نضمن وصول منتجاتنا بأعلى جودة وفي الوقت المحدد إلى أي مكان في العالم من خلال شبكة لوجستية متكاملة.'
                                    : 'We guarantee our products arrive in premium condition, on time, anywhere in the world through an integrated logistics network.'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {logistics.map((item, i) => (
                            <StaggerItem key={i}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-300 h-full">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {locale === "ar" ? item.title_ar : item.title_en}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {locale === "ar" ? item.desc_ar : item.desc_en}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>

            {/* Compliance & Export Data Table */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <ScrollReveal>
                            <div className={`relative ${isRTL ? "lg:pl-10" : "lg:pr-10"}`}>
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-green-700" />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">
                                    {t.export.complianceTitle}
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {t.export.complianceSubtitle}
                                </p>

                                <div className="flex flex-col gap-4">
                                    {[
                                        { ar: "مطابقة لمواصفات FDA و EFSA", en: "FDA & EFSA Compliant" },
                                        { ar: "شهادات صحية ومنشأ مع كل شحنة", en: "Health & Origin Certificates per shipment" },
                                        { ar: "تخليص جمركي سريع وفعال", en: "Fast and efficient customs clearance" },
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-gray-800">{locale === 'ar' ? feature.ar : feature.en}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-xl">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">
                                    {locale === 'ar' ? 'معلومات التصدير القياسية' : 'Standard Export Information'}
                                </h3>
                                <table className="w-full text-left" dir={isRTL ? 'rtl' : 'ltr'}>
                                    <tbody>
                                        {t.export.complianceData.map((row, i) => (
                                            <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-white transition-colors">
                                                <td className="py-4 pr-4 font-bold text-sm text-slate-900 w-1/3">{row.label}</td>
                                                <td className="py-4 text-sm text-slate-600 font-medium">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Target Markets */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
                    <Globe className="w-full h-full text-white" strokeWidth={0.5} />
                </div>
                <Container className="relative z-10">
                    <ScrollReveal>
                        <SectionHeader
                            title={t.export.marketsTitle}
                            subtitle={t.export.marketsSubtitle}
                            className="[&_h2]:text-white [&_p]:text-white/70"
                        />
                    </ScrollReveal>
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12" staggerDelay={0.1}>
                        {t.export.markets.map((m, i) => (
                            <StaggerItem key={i}>
                                <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-2 group">
                                    <Anchor className="w-8 h-8 text-blue-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-xl font-bold text-white mb-2">{m.region}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{m.countries}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>

            <CertificationsBanner />

            <div id="export-inquiry" className="scroll-mt-20">
                <ExportInquiryForm />
            </div>

            <Footer />
        </main>
    );
}
