"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Globe2, Navigation, TrendingUp } from "lucide-react";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

export const GlobalFootprint = () => {
    const { locale } = useLanguage();
    const cms = usePageContent("globalFootprint");

    const sTitle = getBilingualValue(cms, "title", locale) || (locale === 'en' ? 'Exporting Excellence Worldwide' : 'نصدر الجودة إلى جميع أنحاء العالم');
    const sSubtitle = getBilingualValue(cms, "subtitle", locale) || (locale === 'en' 
        ? 'Elsalam Factory is not just a local leader; we are a trusted partner in over 15 countries across the Middle East, Africa, and Europe, adhering to strict international trade and quality standards.' 
        : 'مصنع السلام ليس مجرد رائد محلي؛ بل نحن شريك موثوق في أكثر من 15 دولة عبر الشرق الأوسط وأفريقيا وأوروبا، ملتزمون بأعلى معايير الجودة والتجارة الدولية.');
    
    // Ensure we use the generated premium map if the CMS is empty or using the old placeholder
    const sImage = cms?.image && cms.image !== "/images/placeholder.svg" ? cms.image : "/images/global-map-bg.png";

    const stat1Value = cms?.stat1Value || "15+";
    const stat1Label = getBilingualValue(cms, "stat1Label", locale) || (locale === 'en' ? 'Export Countries' : 'دولة تصدير');
    
    const stat2Value = cms?.stat2Value || (locale === 'en' ? '20,000 MT' : '20,000 طن');
    const stat2Label = getBilingualValue(cms, "stat2Label", locale) || (locale === 'en' ? 'Annual Export Volume' : 'حجم التصدير السنوي');

    return (
        <section className="py-24 bg-primary-dark relative overflow-hidden text-white min-h-[800px] flex items-center justify-center" id="global-reach">
            
            {/* Cinematic Background Map Layer */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={sImage} 
                    alt="Global Footprint Background" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-transparent to-primary-dark opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-transparent to-primary-dark opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary-green/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                    
                    {/* Header Content */}
                    <ScrollReveal>
                        <span className="inline-flex items-center gap-2 py-1.5 px-6 rounded-full bg-[#1b4332]/80 text-[#52b788] text-sm font-bold mb-6 border border-[#2d6a4f] backdrop-blur-md shadow-[0_0_20px_rgba(82,183,136,0.15)]">
                            <Globe2 className="w-5 h-5 animate-pulse" />
                            {locale === 'en' ? 'Global Footprint' : 'التواجد العالمي'}
                        </span>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl">
                            {sTitle}
                        </h2>

                        <p className="text-white/80 text-lg md:text-2xl leading-relaxed mb-16 font-medium max-w-3xl mx-auto drop-shadow-md">
                            {sSubtitle}
                        </p>
                    </ScrollReveal>

                    {/* Stats Glassmorphism Grid */}
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-3xl mx-auto">
                        
                        {/* Stat 1 */}
                        <StaggerItem>
                            <div className="relative p-8 md:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/20 rounded-full blur-3xl group-hover:bg-primary-green/40 transition-all duration-500" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-green/10 rounded-full blur-3xl group-hover:bg-primary-green/30 transition-all duration-500" />
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-gradient-to-br from-primary-green/30 to-primary-green/10 flex items-center justify-center text-[#52b788] mb-6 border border-primary-green/20 shadow-[0_0_15px_rgba(82,183,136,0.2)]">
                                        <Navigation strokeWidth={2.5} className="w-10 h-10 md:w-12 md:h-12 group-hover:-translate-y-2 group-hover:rotate-12 transition-transform duration-500" />
                                    </div>
                                    <h4 className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-sm">
                                        {stat1Value}
                                    </h4>
                                    <p className="text-white/70 font-bold text-lg md:text-xl tracking-wide uppercase">
                                        {stat1Label}
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Stat 2 */}
                        <StaggerItem>
                            <div className="relative p-8 md:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/20 rounded-full blur-3xl group-hover:bg-accent-gold/40 transition-all duration-500" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl group-hover:bg-accent-gold/30 transition-all duration-500" />
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-gradient-to-br from-accent-gold/30 to-accent-gold/10 flex items-center justify-center text-accent-gold mb-6 border border-accent-gold/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                        <TrendingUp strokeWidth={2.5} className="w-10 h-10 md:w-12 md:h-12 group-hover:-translate-y-2 group-hover:rotate-6 transition-transform duration-500" />
                                    </div>
                                    <h4 className="text-5xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-sm">
                                        {stat2Value}
                                    </h4>
                                    <p className="text-white/70 font-bold text-lg md:text-xl tracking-wide uppercase">
                                        {stat2Label}
                                    </p>
                                </div>
                            </div>
                        </StaggerItem>
                        
                    </StaggerContainer>
                </div>
            </Container>
        </section>
    );
};
