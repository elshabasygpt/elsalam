"use client";

import React, { useState } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Play, X, Factory, ShieldCheck } from "lucide-react";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

export const VirtualTour = () => {
    const { locale } = useLanguage();
    const cms = usePageContent("virtualTour");
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // Extract Dashboard state
    const sTitle = getBilingualValue(cms, "title", locale) || (locale === 'en' ? 'Experience Excellence' : 'اكتشف التميز من الداخل');
    const sSubtitle = getBilingualValue(cms, "subtitle", locale) || (locale === 'en'
        ? 'Take an exclusive virtual tour of our state-of-the-art facilities and witness the pure quality behind every drop.'
        : 'خذ جولة افتراضية حصرية داخل منشآتنا فائقة التطور، وشاهد بأم عينيك الجودة النقية وراء كل قطرة.');
    
    // Check Visibility Toggle. Default to true if undefined.
    const isVisible = cms?.isVisible !== undefined ? (cms.isVisible === true || cms.isVisible === "true") : true;

    if (!isVisible) return null;

    // Fall back to our stunning generated factory interior image
    const sImage = cms?.image && cms.image !== "/images/placeholder.svg" ? cms.image : "/images/factory-interior.png";
    const sVideoUrl = cms?.videoUrl;

    return (
        <section className="relative py-32 bg-primary-dark overflow-hidden flex items-center justify-center border-y border-white/5" id="virtual-tour">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={sImage}
                    alt="Factory Interior Virtual Tour"
                    className="w-full h-full object-cover scale-105 opacity-60 group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
                />
                <div className="absolute inset-0 bg-primary-dark/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-primary-dark opacity-90" />
            </div>

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

                        {/* Glowing Play Button Modal Trigger */}
                        <button
                            onClick={() => setIsVideoOpen(true)}
                            className="group relative flex items-center justify-center w-24 h-24 mb-10 focus:outline-none"
                            aria-label={locale === 'en' ? "Play Virtual Tour" : "تشغيل الجولة الافتراضية"}
                        >
                            <div className="absolute inset-0 bg-accent-gold rounded-full animate-ping opacity-60" style={{ animationDuration: '3s' }} />
                            <div className="absolute -inset-4 bg-accent-gold/20 rounded-full animate-pulse blur-md" />
                            <div className="relative w-full h-full bg-accent-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-dark shadow-[0_0_40px_rgba(251,191,36,0.5)] group-hover:scale-110 group-hover:bg-accent-gold transition-all duration-300">
                                <Play fill="currentColor" className="w-10 h-10 ml-2" />
                            </div>
                        </button>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                            {sTitle}
                        </h2>

                        <p className="text-xl md:text-2xl text-white/80 font-light mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            {sSubtitle}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-2xl">
                                <Factory className="w-5 h-5 text-accent-gold" />
                                <span className="text-white font-bold">{locale === 'en' ? 'Fully Automated' : 'أتمتة شاملة'}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-2xl">
                                <ShieldCheck className="w-5 h-5 text-primary-green" />
                                <span className="text-white font-bold">{locale === 'en' ? 'ISO 22000 Certified' : 'معتمدة دولياً ISO'}</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </Container>

            {/* Video Modal Placeholder or Iframe */}
            {isVideoOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
                    <button
                        onClick={() => setIsVideoOpen(false)}
                        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2"
                        aria-label="Close video"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(34,197,94,0.1)] relative">
                        {sVideoUrl ? (
                            <iframe 
                                src={sVideoUrl.replace("watch?v=", "embed/") + (sVideoUrl.includes("?") ? "&autoplay=1" : "?autoplay=1")} 
                                title="Virtual Tour Video" 
                                className="w-full h-full" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                                <Play className="w-20 h-20 mb-4 opacity-50" />
                                <p className="text-xl font-bold font-english">Corporate Video Placeholder</p>
                                <p className="text-sm mt-2 opacity-50">Please set Video URL in Dashboard</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};
