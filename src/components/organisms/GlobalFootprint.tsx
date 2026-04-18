"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Globe2, MapPin, Navigation, TrendingUp } from "lucide-react";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

const REGIONS = [
    { nameEn: "Middle East", nameAr: "الشرق الأوسط", top: "45%", left: "55%", delay: "0s" },
    { nameEn: "North Africa", nameAr: "شمال أفريقيا", top: "35%", left: "48%", delay: "0.5s" },
    { nameEn: "East Africa", nameAr: "شرق أفريقيا", top: "55%", left: "58%", delay: "1s" },
    { nameEn: "Europe", nameAr: "أوروبا", top: "25%", left: "50%", delay: "1.5s" },
];

export const GlobalFootprint = () => {
    const { locale } = useLanguage();
    const cms = usePageContent("globalFootprint");

    const sTitle = getBilingualValue(cms, "title", locale) || (locale === 'en' ? 'Exporting Excellence Worldwide' : 'نصدر الجودة إلى جميع أنحاء العالم');
    const sSubtitle = getBilingualValue(cms, "subtitle", locale) || (locale === 'en' 
        ? 'Elsalam Factory is not just a local leader; we are a trusted partner in over 15 countries across the Middle East, Africa, and Europe, adhering to strict international trade and quality standards.' 
        : 'مصنع السلام ليس مجرد رائد محلي؛ بل نحن شريك موثوق في أكثر من 15 دولة عبر الشرق الأوسط وأفريقيا وأوروبا، ملتزمون بأعلى معايير الجودة والتجارة الدولية.');
    const sImage = cms?.image || "/images/placeholder.svg";

    const stat1Value = cms?.stat1Value || "15+";
    const stat1Label = getBilingualValue(cms, "stat1Label", locale) || (locale === 'en' ? 'Export Countries' : 'دولة تصدير');
    
    const stat2Value = cms?.stat2Value || (locale === 'en' ? '20,000 MT' : '20,000 طن');
    const stat2Label = getBilingualValue(cms, "stat2Label", locale) || (locale === 'en' ? 'Annual Export Volume' : 'حجم التصدير السنوي');

    return (
        <section className="py-24 bg-primary-dark relative overflow-hidden text-white" id="global-reach">
            {/* Dark prestige background with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-green/20 blur-[100px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left/Right Text Content */}
                    <div>
                        <ScrollReveal>
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary-green/20 text-primary-green text-sm font-bold mb-6 border border-primary-green/30 backdrop-blur-sm shadow-sm hover:bg-primary-green/30 transition-colors">
                                <Globe2 className="w-5 h-5" />
                                {locale === 'en' ? 'Global Footprint' : 'التواجد العالمي'}
                            </span>

                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                {sTitle}
                            </h2>

                            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 font-medium">
                                {sSubtitle}
                            </p>

                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <StaggerItem>
                                    <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/10 rounded-full blur-2xl group-hover:bg-primary-green/20 transition-all duration-500"></div>
                                        <div className="w-14 h-14 rounded-2xl bg-primary-green/20 flex items-center justify-center text-primary-green mb-5 border border-primary-green/20">
                                            <Navigation strokeWidth={2} className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                                        </div>
                                        <h4 className="text-4xl font-black mb-2 tracking-tight">{stat1Value}</h4>
                                        <p className="text-white/70 font-semibold">{stat1Label}</p>
                                    </div>
                                </StaggerItem>
                                <StaggerItem>
                                    <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-2xl group-hover:bg-accent-gold/20 transition-all duration-500"></div>
                                        <div className="w-14 h-14 rounded-2xl bg-accent-gold/20 flex items-center justify-center text-accent-gold mb-5 border border-accent-gold/20">
                                            <TrendingUp strokeWidth={2} className="w-7 h-7 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </div>
                                        <h4 className="text-4xl font-black mb-2 tracking-tight">{stat2Value}</h4>
                                        <p className="text-white/70 font-semibold">{stat2Label}</p>
                                    </div>
                                </StaggerItem>
                            </StaggerContainer>
                        </ScrollReveal>
                    </div>

                    {/* Right/Left Interactive Map Display */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-slate-900/50 rounded-[2.5rem] border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-2xl group">

                        {/* Crisp Real Image Display */}
                        <div className="absolute inset-0">
                            <img
                                src={sImage}
                                alt="Global Map"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-transparent to-slate-900/40 pointer-events-none" />
                        </div>

                        {/* Geometric Technical Grid Layer */}
                        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
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
