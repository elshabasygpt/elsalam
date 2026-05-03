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

            {/* Premium B2B Hero */}
            <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
                {/* Background Image & Overlays */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={heroBgImage} 
                        alt={heroTitle} 
                        className="w-full h-full object-cover"
                    />
                    {/* Deep green to dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/90 to-primary-dark z-0" />
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-grid.svg')] z-0" />
                    {/* Bottom seamless blend to next section */}
                    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-primary-dark to-transparent z-0" />
                </div>

                <Container className="relative z-10 text-center flex flex-col items-center">
                    <ScrollReveal>
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 mx-auto shadow-xl">
                            <Handshake className="w-4 h-4 text-primary-green animate-pulse" />
                            <span className="text-white text-sm font-bold tracking-widest uppercase">
                                {heroBadge}
                            </span>
                        </div>
                        
                        <Typography variant="h1" align="center" className="text-white mb-6 drop-shadow-2xl text-5xl md:text-6xl lg:text-7xl font-black w-full leading-tight">
                            {heroTitle}
                        </Typography>
                        
                        <Typography variant="body-lg" align="center" className="text-white/90 max-w-3xl mx-auto text-lg md:text-2xl font-medium leading-relaxed drop-shadow-md text-balance mb-12">
                            {heroSubtitle}
                        </Typography>
                        
                        <div className="flex flex-wrap justify-center gap-6">
                            <Button size="lg" variant="secondary" className="bg-white text-primary-dark hover:bg-slate-100 font-bold px-8 h-14 rounded-full shadow-[0_8px_30px_rgb(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.25)] transition-all hover:-translate-y-1">
                                <a href="#quote-form" className="flex items-center gap-2">
                                    <BadgeDollarSign className="w-5 h-5" />
                                    {ctaQuote}
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-8 h-14 rounded-full backdrop-blur-sm transition-all hover:-translate-y-1">
                                <a href="/catalog.pdf" download="elsalam_products_catalog.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {ctaCatalog}
                                </a>
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
                    <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2 bg-black/20 backdrop-blur-sm">
                        <div className="w-1.5 h-3 rounded-full bg-white/70 animate-pulse" />
                    </div>
                </div>
            </section>

            <StatsCounter />

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


            <QuoteForm />
            <ClientLogos />
            <Footer />
        </main>
        </PageContentProvider>
    );
}
