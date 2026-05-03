"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { QuoteForm } from "@/components/organisms/QuoteForm";

import { StatsCounter } from "@/components/organisms/StatsCounter";
import { ClientLogos } from "@/components/organisms/ClientLogos";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { Factory, FlaskConical, Package, BadgeDollarSign, Truck, Handshake } from "lucide-react";
import React from "react";
import { useLanguage } from "@/lib/i18n-context";

const ICONS = [
    <Factory className="w-12 h-12" strokeWidth={1.5} key="factory" />,
    <FlaskConical className="w-12 h-12" strokeWidth={1.5} key="flask" />,
    <Package className="w-12 h-12" strokeWidth={1.5} key="package" />,
    <BadgeDollarSign className="w-12 h-12" strokeWidth={1.5} key="dollar" />,
    <Truck className="w-12 h-12" strokeWidth={1.5} key="truck" />,
    <Handshake className="w-12 h-12" strokeWidth={1.5} key="handshake" />,
];

import { PageContentProvider } from "@/lib/page-content-context";

export function B2BClient({ cmsContent = {} }: { cmsContent?: Record<string, any> }) {
    const { t, isRTL } = useLanguage();

    // Hero Section Content
    const heroBadge = isRTL ? (cmsContent?.hero?.badge_ar || "بوابة الشركاء") : (cmsContent?.hero?.badge_en || "Partners Portal");
    const heroTitle = isRTL ? (cmsContent?.hero?.title_ar || t.b2b.heroTitle) : (cmsContent?.hero?.title_en || t.b2b.heroTitle);
    const heroSubtitle = isRTL ? (cmsContent?.hero?.subtitle_ar || t.b2b.heroSubtitle) : (cmsContent?.hero?.subtitle_en || t.b2b.heroSubtitle);
    const heroBgImage = cmsContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2500&auto=format&fit=crop";
    const ctaQuote = isRTL ? (cmsContent?.hero?.ctaQuote_ar || t.b2b.ctaQuote) : (cmsContent?.hero?.ctaQuote_en || t.b2b.ctaQuote);
    const ctaCatalog = isRTL ? (cmsContent?.hero?.ctaCatalog_ar || t.b2b.ctaCatalog) : (cmsContent?.hero?.ctaCatalog_en || t.b2b.ctaCatalog);

    // Advantages Section Content
    const whyTitle = isRTL ? (cmsContent?.advantages?.title_ar || t.b2b.whyTitle) : (cmsContent?.advantages?.title_en || t.b2b.whyTitle);
    const whySubtitle = isRTL ? (cmsContent?.advantages?.subtitle_ar || t.b2b.whySubtitle) : (cmsContent?.advantages?.subtitle_en || t.b2b.whySubtitle);
    const advantagesData = cmsContent?.advantages?.items?.length > 0 ? cmsContent.advantages.items : t.b2b.advantages;

    return (
        <PageContentProvider content={cmsContent}>
            <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            {/* Premium B2B Hero (Matching Export) */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-slate-900 via-primary-dark/90 to-primary-dark overflow-hidden">
                {/* Background Image Overlay */}
                <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url('${heroBgImage}')` }}
                ></div>

                {/* Dynamic Glow Backgrounds */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full" />
                </div>

                {/* Seamless Transition to Next Section */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-primary-dark to-transparent z-0" />

                <Container className="relative z-10 text-center">
                    <ScrollReveal>
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 shadow-xl">
                            <Handshake className="w-5 h-5 text-green-400 animate-pulse" />
                            <span className="text-white/90 text-sm font-bold uppercase tracking-wider">
                                {heroBadge}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight max-w-4xl mx-auto">
                            {heroTitle}
                        </h1>
                        
                        <p className="text-white/80 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
                            {heroSubtitle}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#quote-form" className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-all w-full sm:w-auto justify-center">
                                <BadgeDollarSign className="w-5 h-5" />
                                {ctaQuote}
                            </a>
                            <a href="/catalog.pdf" download="elsalam_products_catalog.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-black rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all w-full sm:w-auto justify-center">
                                <Package className="w-5 h-5" />
                                {ctaCatalog}
                            </a>
                        </div>
                    </ScrollReveal>
                </Container>
                
            </section>

            <StatsCounter />

            <div id="quote-form" className="scroll-mt-20">
                <QuoteForm />
            </div>

            {/* Premium Why Choose Us Section */}
            <section className="py-24 relative bg-surface-soft overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#d1881b]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-green/5 rounded-full blur-[100px] pointer-events-none" />
                
                <Container className="relative z-10">
                    <ScrollReveal>
                        <SectionHeader title={whyTitle} subtitle={whySubtitle} />
                    </ScrollReveal>
                    
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {advantagesData.map((a: any, i: number) => {
                            const advTitle = isRTL ? (a.title_ar || a.title) : (a.title_en || a.title);
                            const advDesc = isRTL ? (a.desc_ar || a.desc) : (a.desc_en || a.desc);
                            
                            return (
                                <StaggerItem key={i}>
                                    <div className="relative p-8 bg-white rounded-2xl border border-surface-light shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group h-full overflow-hidden hover:-translate-y-2 flex flex-col">
                                        {/* Hover Gradient Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d1881b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        {/* Icon Container */}
                                        <div className="w-20 h-20 rounded-2xl bg-surface-soft flex items-center justify-center mb-6 text-primary-dark group-hover:bg-[#d1881b] group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm group-hover:shadow-[0_10px_20px_rgba(209,136,27,0.2)]">
                                            {ICONS[i % ICONS.length]}
                                        </div>
                                        
                                        {/* Content */}
                                        <Typography variant="h3" className="mb-4 font-bold text-primary-dark group-hover:text-[#d1881b] transition-colors duration-300">
                                            {advTitle}
                                        </Typography>
                                        <Typography variant="body" className="text-text-dark/70 leading-relaxed font-medium">
                                            {advDesc}
                                        </Typography>
                                        
                                        {/* Decorative watermark icon */}
                                        <div className="absolute -bottom-6 -right-6 text-surface-light opacity-50 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none scale-150">
                                            {ICONS[i % ICONS.length]}
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </Container>
            </section>

            <ClientLogos />
            <Footer />
        </main>
        </PageContentProvider>
    );
}
