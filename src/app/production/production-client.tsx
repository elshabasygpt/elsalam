"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { Wheat, Settings, Factory, FlaskConical, Sparkles, Wind, Package, ShieldCheck, ChevronDown } from "lucide-react";
import React, { useRef } from "react";
import { useLanguage } from "@/lib/i18n-context";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/classnames";

const STEP_ICONS = [
    <Wheat className="w-7 h-7" strokeWidth={1.5} key="wheat" />,
    <Settings className="w-7 h-7" strokeWidth={1.5} key="settings" />,
    <Factory className="w-7 h-7" strokeWidth={1.5} key="factory" />,
    <FlaskConical className="w-7 h-7" strokeWidth={1.5} key="flask" />,
    <Sparkles className="w-7 h-7" strokeWidth={1.5} key="sparkles" />,
    <Wind className="w-7 h-7" strokeWidth={1.5} key="wind" />,
    <Package className="w-7 h-7" strokeWidth={1.5} key="package" />,
    <ShieldCheck className="w-7 h-7" strokeWidth={1.5} key="shield" />,
];

// Unsplash images for each step (manufacturing, refining, oil pouring, etc.)
const STEP_IMAGES = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop", // Seeds
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop", // Crushing
    "https://images.unsplash.com/photo-1621644065615-1a3b1a8f68c3?q=80&w=2000&auto=format&fit=crop", // Extraction / Machinery
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2000&auto=format&fit=crop", // Refining / Chemistry
    "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2000&auto=format&fit=crop", // Bleaching / Purity
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop", // Deodorization / Steam
    "https://images.unsplash.com/photo-1591122709280-d2c6081e6b83?q=80&w=2000&auto=format&fit=crop", // Packaging
    "https://images.unsplash.com/photo-1579389082947-e54d8e911928?q=80&w=2000&auto=format&fit=crop", // QC / Lab
];

export function ProductionClient({ cmsContent = {} }: { cmsContent?: Record<string, any> }) {
    const { t, isRTL } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Extract dynamic content with fallbacks to static translations
    const heroTitle = isRTL ? (cmsContent?.hero?.title_ar || t.production.heroTitle) : (cmsContent?.hero?.title_en || t.production.heroTitle);
    const heroSubtitle = isRTL ? (cmsContent?.hero?.subtitle_ar || t.production.heroSubtitle) : (cmsContent?.hero?.subtitle_en || t.production.heroSubtitle);
    const heroBgImage = cmsContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2500&auto=format&fit=crop";

    // Allow adding or removing steps dynamically from CMS
    const stepsData = cmsContent?.steps?.items?.length > 0 ? cmsContent.steps.items : t.production.steps;

    // Map scroll progress to the height of the glowing line
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <main className="min-h-screen bg-slate-50 font-arabic overflow-hidden">
            <Navbar />

            {/* Immersive Hero Section */}
            <section className="relative min-h-[50vh] pt-20 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={heroBgImage} 
                        alt={heroTitle} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark" />
                    <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-20 mix-blend-overlay" />
                </div>

                <Container className="relative z-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                            <span className="text-white text-sm font-bold tracking-widest uppercase">
                                Technology & Precision
                            </span>
                        </div>
                        
                        <Typography variant="h1" align="center" className="text-white mb-6 drop-shadow-xl text-5xl md:text-6xl lg:text-7xl font-black w-full">
                            {heroTitle}
                        </Typography>
                        
                        <Typography variant="body-lg" align="center" className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed drop-shadow-md text-balance">
                            {heroSubtitle}
                        </Typography>
                    </motion.div>
                </Container>

                {/* Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Scroll to Explore</span>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                    >
                        <ChevronDown className="w-5 h-5 text-white" />
                    </motion.div>
                </motion.div>
            </section>

            {/* The Journey Timeline */}
            <section className="py-24 md:py-32 relative" ref={containerRef}>
                <Container>
                    <div className="relative max-w-6xl mx-auto">
                        
                        {/* Center Glowing Line (Desktop Only) */}
                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-green via-green-500 to-green-700" 
                                style={{ height: lineHeight }} 
                            />
                        </div>

                        {/* Mobile Glowing Line */}
                        <div className="block md:hidden absolute start-[28px] top-0 bottom-0 w-1 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute top-0 w-full bg-gradient-to-b from-primary-green via-green-500 to-green-700" 
                                style={{ height: lineHeight }} 
                            />
                        </div>

                        <div className="space-y-24 md:space-y-32">
                            {stepsData.map((step: any, idx: number) => {
                                const isEven = idx % 2 === 0;
                                
                                // Extract localized step title and description
                                const stepTitle = isRTL ? (step.title_ar || step.title) : (step.title_en || step.title);
                                const stepDesc = isRTL ? (step.description_ar || step.description) : (step.description_en || step.description);
                                const stepImage = step.image || STEP_IMAGES[idx % STEP_IMAGES.length];
                                
                                return (
                                    <div key={idx} className="relative flex flex-col md:flex-row items-center justify-between group">
                                        
                                        {/* Mobile Timeline Node */}
                                        <div className="md:hidden absolute start-0 top-0 w-14 h-14 rounded-2xl bg-white shadow-xl border border-green-100 flex items-center justify-center z-10">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                                                {STEP_ICONS[idx % STEP_ICONS.length]}
                                            </div>
                                        </div>

                                        {/* Desktop Timeline Node */}
                                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white shadow-xl border-2 border-slate-50 items-center justify-center z-10 group-hover:scale-110 group-hover:border-green-100 transition-all duration-500">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 text-green-700 flex items-center justify-center group-hover:from-green-500 group-hover:to-green-700 group-hover:text-white transition-all duration-500">
                                                {STEP_ICONS[idx % STEP_ICONS.length]}
                                            </div>
                                        </div>

                                        {/* Content Block */}
                                        <motion.div 
                                            initial={{ opacity: 0, x: isRTL ? (isEven ? -50 : 50) : (isEven ? 50 : -50) }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.7, ease: "easeOut" }}
                                            className={cn(
                                                "w-full md:w-[45%] ps-20 pt-2 md:pt-0 md:ps-0",
                                                isEven ? (isRTL ? "md:text-left" : "md:text-right") : (isRTL ? "md:text-right" : "md:text-left"),
                                                !isEven && "md:order-last"
                                            )}
                                        >
                                            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group-hover:border-green-100">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="text-5xl font-black text-green-50 drop-shadow-sm pointer-events-none select-none">
                                                        {(idx + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <Typography variant="h3" className="text-primary-dark font-black !mb-0 leading-tight">
                                                        {stepTitle}
                                                    </Typography>
                                                </div>
                                                <Typography variant="body" className="text-slate-600 leading-loose font-medium">
                                                    {stepDesc}
                                                </Typography>
                                            </div>
                                        </motion.div>

                                        {/* Image Block */}
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                                            className={cn(
                                                "w-full md:w-[45%] mt-8 md:mt-0 ps-20 md:ps-0",
                                                isEven && "md:order-last"
                                            )}
                                        >
                                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl bg-slate-200 border-4 border-white group-hover:shadow-2xl group-hover:border-green-50 transition-all duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent z-10" />
                                                <img 
                                                    src={stepImage} 
                                                    alt={stepTitle} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            </div>
                                        </motion.div>
                                        
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </section>

            <CertificationsBanner />
            <Footer />
        </main>
    );
}
