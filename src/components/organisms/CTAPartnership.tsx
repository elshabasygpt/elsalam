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
    const { t, locale } = useLanguage();
    const cms = usePageContent("ctaPartnership");

    const title = getBilingualValue(cms, "title", locale) ?? t.cta.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.cta.subtitle;
    const ctaPrimary = getBilingualValue(cms, "ctaPrimary", locale) ?? t.cta.ctaPrimary;
    const ctaSecondary = getBilingualValue(cms, "ctaSecondary", locale) ?? t.cta.ctaSecondary;

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-surface-soft px-4">
            
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-0" />
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] bg-primary-green/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[70%] bg-accent-gold/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <Container className="relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-20 text-center overflow-hidden shadow-2xl shadow-green-900/40">
                        
                        {/* Shimmering glass highlight over the card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                        
                        <ScrollReveal>
                            {/* Small elegant tag */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold text-sm font-bold tracking-widest uppercase mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                                {locale === 'en' ? 'B2B PARTNERSHIP' : 'شراكة الأعمال'}
                            </div>

                            <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                {title}
                            </Typography>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={0.15}>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                                {subtitle}
                            </p>
                        </ScrollReveal>
                        
                        <ScrollReveal delay={0.3}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                <Link href="/b2b/quote" className="w-full sm:w-auto">
                                    <button className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-accent-gold px-8 py-4 font-bold text-gray-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,163,115,0.4)] focus:outline-none">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {ctaPrimary}
                                            <svg className={`w-5 h-5 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full bg-white/30 skew-x-12 transition-transform duration-700 ease-in-out group-hover:translate-x-[150%]" />
                                    </button>
                                </Link>
                                
                                <Link href="/contact" className="w-full sm:w-auto">
                                    <button className="group relative w-full sm:w-auto rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 focus:outline-none">
                                        <span className="flex items-center justify-center gap-2">
                                            {ctaSecondary}
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </Container>
        </section>
    );
};
