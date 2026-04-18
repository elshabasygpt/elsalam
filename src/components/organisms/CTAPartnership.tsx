"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

export const CTAPartnership = () => {
    const { t, locale, isRTL } = useLanguage();
    const cms = usePageContent("ctaPartnership");

    const title = getBilingualValue(cms, "title", locale) ?? t.cta.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.cta.subtitle;
    const ctaPrimary = getBilingualValue(cms, "ctaPrimary", locale) ?? t.cta.ctaPrimary;
    const ctaSecondary = getBilingualValue(cms, "ctaSecondary", locale) ?? t.cta.ctaSecondary;

    return (
        <section className="relative py-24 md:py-32 xl:py-40 bg-primary-dark overflow-hidden group">
            
            {/* Cinematic Parallax Background Image */}
            <div 
                className="absolute inset-0 w-full h-full bg-[url('/images/factory-interior.png')] bg-cover bg-center bg-no-repeat bg-fixed opacity-30 mix-blend-overlay transition-transform duration-[10000ms] group-hover:scale-110" 
            />
            {/* Deep Green/Gold Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark via-primary-dark/90 to-[#2c3d1b]/80 z-0" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-gold/10 to-transparent z-0 blur-2xl" />

            <Container className="relative z-10 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    
                    {/* The Ultra-Attractive Card Shape */}
                    <div className="relative group/card">
                        
                        {/* Decorative Background Offset Card (Creates a 3D layered look) */}
                        <div className="absolute inset-0 bg-accent-gold/20 rounded-[2rem] md:rounded-[3rem] transform translate-y-4 md:translate-y-6 -translate-x-4 md:-translate-x-6 backdrop-blur-3xl transition-transform duration-500 group-hover/card:translate-y-2 group-hover/card:-translate-x-2" />
                        
                        {/* Main Glassmorphism Card */}
                        <div className="relative rounded-[2rem] md:rounded-[3rem] bg-white/10 backdrop-blur-2xl border border-white/20 p-10 md:p-16 lg:p-24 text-start md:text-center overflow-hidden shadow-2xl shadow-black/40">
                            
                            {/* Inner abstract lighting */}
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-gold/15 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:items-center">
                                <ScrollReveal>
                                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary-dark/50 border border-white/10 text-accent-gold text-sm font-bold tracking-widest uppercase mb-8 shadow-inner">
                                        <div className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-gold"></span>
                                        </div>
                                        {locale === 'en' ? 'Exclusive B2B Partnership' : 'شراكة أعمال حصرية'}
                                    </div>

                                    <Typography variant="h2" className="text-4xl md:text-5xl lg:text-5xl font-black text-white mb-6 leading-[1.3] drop-shadow-xl text-start md:text-center">
                                        {title}
                                    </Typography>
                                </ScrollReveal>
                                
                                <ScrollReveal delay={0.15}>
                                    <p className="text-lg md:text-xl text-green-50/90 max-w-3xl mx-auto mb-12 leading-relaxed font-medium text-start md:text-center">
                                        {subtitle}
                                    </p>
                                </ScrollReveal>
                                
                                <ScrollReveal delay={0.3}>
                                    <div className="flex flex-col sm:flex-row items-stretch md:items-center justify-start md:justify-center gap-4">
                                        <Link href="/b2b/quote" className="w-full sm:w-auto flex-1 md:flex-none">
                                            <button className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-accent-gold to-[#f5cc82] px-10 py-5 font-black text-[#283618] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,163,115,0.7)] hover:from-white hover:to-white focus:outline-none flex items-center justify-center gap-3 border border-accent-light/50">
                                                <span>{ctaPrimary}</span>
                                                <svg className={`w-6 h-6 transition-transform duration-300 ${isRTL ? 'group-hover/card:-translate-x-2' : 'group-hover/card:translate-x-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                                </svg>
                                            </button>
                                        </Link>
                                        
                                        <Link href="/contact" className="w-full sm:w-auto flex-1 md:flex-none">
                                            <button className="relative w-full rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur-lg px-10 py-5 font-bold text-white transition-all hover:bg-white hover:text-primary-dark hover:border-white focus:outline-none flex items-center justify-center gap-3">
                                                <span>{ctaSecondary}</span>
                                            </button>
                                        </Link>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
