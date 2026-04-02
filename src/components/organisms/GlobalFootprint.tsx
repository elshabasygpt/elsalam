"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Globe2, MapPin, Navigation, TrendingUp } from "lucide-react";

const REGIONS = [
    { nameEn: "Middle East", nameAr: "الشرق الأوسط", top: "45%", left: "55%", delay: "0s" },
    { nameEn: "North Africa", nameAr: "شمال أفريقيا", top: "35%", left: "48%", delay: "0.5s" },
    { nameEn: "East Africa", nameAr: "شرق أفريقيا", top: "55%", left: "58%", delay: "1s" },
    { nameEn: "Europe", nameAr: "أوروبا", top: "25%", left: "50%", delay: "1.5s" },
];

export const GlobalFootprint = () => {
    const { locale, t } = useLanguage();

    return (
        <section className="py-24 bg-primary-dark relative overflow-hidden text-white" id="global-reach">
            {/* Dark prestige background with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-green/20 blur-[100px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left/Right Text Content */}
                    <div>
                        <ScrollReveal>
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary-green/20 text-primary-green text-sm font-bold mb-6 border border-primary-green/30 backdrop-blur-sm">
                                <Globe2 className="w-5 h-5" />
                                {locale === 'en' ? 'Global Footprint' : 'التواجد العالمي'}
                            </span>

                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                {locale === 'en' ? 'Exporting Excellence Worldwide' : 'نصدر الجودة إلى جميع أنحاء العالم'}
                            </h2>

                            <p className="text-white/70 text-lg leading-relaxed mb-10">
                                {locale === 'en'
                                    ? 'Elsalam Factory is not just a local leader; we are a trusted partner in over 15 countries across the Middle East, Africa, and Europe, adhering to strict international trade and quality standards.'
                                    : 'مصنع السلام ليس مجرد رائد محلي؛ بل نحن شريك موثوق في أكثر من 15 دولة عبر الشرق الأوسط وأفريقيا وأوروبا، ملتزمون بأعلى معايير الجودة والتجارة الدولية.'}
                            </p>

                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <StaggerItem>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-primary-green/20 flex items-center justify-center text-primary-green mb-4">
                                            <Navigation strokeWidth={1.5} className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-3xl font-black mb-1">15+</h4>
                                        <p className="text-white/60 text-sm">{locale === 'en' ? 'Export Countries' : 'دولة تصدير'}</p>
                                    </div>
                                </StaggerItem>
                                <StaggerItem>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-accent-gold/20 flex items-center justify-center text-accent-gold mb-4">
                                            <TrendingUp strokeWidth={1.5} className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-3xl font-black mb-1">20,000<span className="text-lg text-accent-gold font-bold"> MT</span></h4>
                                        <p className="text-white/60 text-sm">{locale === 'en' ? 'Annual Export Volume' : 'حجم التصدير السنوي'}</p>
                                    </div>
                                </StaggerItem>
                            </StaggerContainer>
                        </ScrollReveal>
                    </div>

                    {/* Right/Left Interactive Map Display */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center backdrop-blur-sm">

                        {/* Abstract World Map Placeholder (Stylized Image) */}
                        <div className="absolute inset-4 opacity-30 mix-blend-screen">
                            <img
                                src="/images/placeholder.svg"
                                alt="World Map"
                                className="w-full h-full object-cover rounded-2xl opacity-50 grayscale"
                            />
                        </div>

                        {/* Animated Grid Lines */}
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />

                        {/* Regions/Pins */}
                        {REGIONS.map((region, idx) => (
                            <div
                                key={idx}
                                className="absolute flex flex-col items-center group cursor-pointer"
                                style={{ top: region.top, left: region.left }}
                            >
                                <div className="relative">
                                    {/* Pulse effect */}
                                    <div
                                        className="absolute inset-0 bg-primary-green rounded-full animate-ping opacity-75"
                                        style={{ animationDelay: region.delay, animationDuration: '2.5s' }}
                                    />
                                    <div className="relative w-4 h-4 bg-primary-green rounded-full border-2 border-primary-dark shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                                </div>
                                <div className="absolute top-6 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 whitespace-nowrap bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-sm font-bold shadow-xl pointer-events-none">
                                    {locale === 'en' ? region.nameEn : region.nameAr}
                                </div>
                            </div>
                        ))}

                        {/* Central Hub (Egypt) */}
                        <div className="absolute top-[40%] left-[52%] flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-accent-gold rounded-full animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                                <div className="absolute -inset-2 bg-accent-gold/20 rounded-full animate-pulse" />
                                <MapPin className="relative z-10 w-8 h-8 text-accent-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" fill="currentColor" />
                            </div>
                            <div className="mt-2 bg-accent-gold/20 backdrop-blur-md px-3 py-1 rounded-full border border-accent-gold/30 text-xs font-bold text-accent-gold whitespace-nowrap shadow-lg">
                                {locale === 'en' ? 'Egypt (HQ)' : 'مصر (المقر)'}
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        </section>
    );
};
