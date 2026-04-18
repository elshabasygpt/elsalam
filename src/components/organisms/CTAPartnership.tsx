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
        <section className="py-24 md:py-32 relative bg-surface-soft px-4 sm:px-6">
            <Container>
                <div className="max-w-6xl mx-auto">
                    {/* The Premium Floating Oasis Card */}
                    <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-primary-dark p-10 md:p-20 text-center overflow-hidden shadow-2xl shadow-primary-dark/30 border border-primary-green/50">
                        
                        {/* Cinematic Background Elements INSIDE the card */}
                        <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-[#3a4d23]/80 blur-[120px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[120%] bg-accent-gold/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                        
                        {/* Abstract top-right geometric accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent-gold/20 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none" />
                        
                        {/* Shimmering glass highlight over the card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30 pointer-events-none" />

                        <div className="relative z-10">
                            <ScrollReveal>
                                {/* Small elegant tag */}
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-accent-light text-sm font-bold tracking-widest uppercase mb-8 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                                    {locale === 'en' ? 'B2B PARTNERSHIP' : 'شراكة الأعمال'}
                                </div>

                                <Typography variant="h2" className="text-4xl md:text-5xl lg:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                                    {title}
                                </Typography>
                            </ScrollReveal>
                            
                            <ScrollReveal delay={0.15}>
                                <p className="text-lg md:text-xl text-green-50 max-w-3xl mx-auto mb-10 leading-relaxed font-medium opacity-90">
                                    {subtitle}
                                </p>
                            </ScrollReveal>
                            
                            <ScrollReveal delay={0.3}>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                    <Link href="/b2b/quote" className="w-full sm:w-auto">
                                        <button className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-accent-light px-8 py-4 font-bold text-primary-dark transition-all hover:scale-105 hover:bg-white hover:text-primary-dark hover:shadow-[0_0_40px_rgba(212,163,115,0.6)] focus:outline-none">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {ctaPrimary}
                                                <svg className={`w-5 h-5 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                                </svg>
                                            </span>
                                        </button>
                                    </Link>
                                    
                                    <Link href="/contact" className="w-full sm:w-auto">
                                        <button className="group relative w-full sm:w-auto rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-8 py-4 font-bold text-white transition-all hover:bg-white/20 hover:border-white/60 focus:outline-none">
                                            <span className="flex items-center justify-center gap-2">
                                                {ctaSecondary}
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
