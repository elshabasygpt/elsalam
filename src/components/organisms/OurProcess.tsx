"use client";

import React, { useRef } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Leaf, Droplets, ShieldCheck, PackageCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePageContent } from "@/lib/page-content-context";

const PROCESS_STEPS = [
    {
        icon: Leaf,
        image: "/images/placeholder.svg",
        titleEn: "Careful Seed Selection",
        titleAr: "اختيار أفضل البذور",
        descEn: "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",
        descAr: "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي.",
        grad: "from-green-600 to-green-900",
    },
    {
        icon: Droplets,
        image: "/images/placeholder.svg",
        titleEn: "Advanced Double Refining",
        titleAr: "تكرير متميز ومزدوج",
        descEn: "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",
        descAr: "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق.",
        grad: "from-amber-600 to-amber-900",
    },
    {
        icon: ShieldCheck,
        image: "/images/placeholder.svg",
        titleEn: "Rigorous Labs & QC",
        titleAr: "فحوصات الجودة الصارمة",
        descEn: "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",
        descAr: "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP).",
        grad: "from-slate-700 to-slate-900",
    },
    {
        icon: PackageCheck,
        image: "/images/placeholder.svg",
        titleEn: "Touchless Packaging",
        titleAr: "تعبئة آلية معقمة",
        descEn: "100% automated, touchless packaging lines ensure maximum hygiene and dramatically extend the product shelf-life without preservatives.",
        descAr: "خطوط تعبئة آلية 100% بدون أي تدخل بشري، مما يضمن أقصى درجات التعقيم ويطيل فترة الصلاحية بشكل طبيعي.",
        grad: "from-emerald-600 to-emerald-900",
    }
];

export const OurProcess = () => {
    const { locale, isRTL } = useLanguage();
    const cmsSect = usePageContent("ourProcess");
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const badge = locale === 'en' ? (cmsSect?.badge_en || 'Our Process') : (cmsSect?.badge_ar || 'آلية الإنتاج والجودة');
    const title = locale === 'en' ? (cmsSect?.title_en || 'From Seed to Shelf') : (cmsSect?.title_ar || 'من البذرة إلى المائدة.. رحلة الجودة');
    const subtitle = locale === 'en' 
        ? (cmsSect?.subtitle_en || 'We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.')
        : (cmsSect?.subtitle_ar || 'نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.');

    const steps = (cmsSect?.steps && Array.isArray(cmsSect.steps) && cmsSect.steps.length > 0)
        ? cmsSect.steps
        : PROCESS_STEPS.map(p => ({
            title_en: p.titleEn, title_ar: p.titleAr,
            description_en: p.descEn, description_ar: p.descAr,
            image: p.image,
            icon: p.icon,
            grad: p.grad
        }));

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden text-text-dark" ref={containerRef}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-green/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 blur-3xl rounded-full" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-primary-green/10 text-primary-green text-sm font-bold mb-6 border border-primary-green/20">
                            {badge}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-lg text-text-dark/70">
                            {subtitle}
                        </p>
                    </div>
                </ScrollReveal>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Progress Line (Desktop) */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 bg-surface-light -ml-0.5 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-green via-primary-green to-accent-gold"
                            style={{ height: progressHeight }}
                        />
                    </div>

                    <div className="space-y-24 md:space-y-32">
                        {steps.map((step: any, index: number) => {
                            const isEven = index % 2 === 0;
                            // Fallback icons mapped by index
                            const Icon = step.icon || PROCESS_STEPS[index % PROCESS_STEPS.length].icon;

                            return (
                                <div key={index} className="relative flex flex-col md:flex-row items-center group">

                                    {/* Center Animated Node (Desktop) */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border border-slate-100 shadow-[0_0_40px_rgba(34,197,94,0.15)] items-center justify-center z-20 transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(34,197,94,0.3)]">
                                        <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse outline outline-4 outline-green-100 outline-offset-0" />
                                    </div>

                                    {/* Image Layout - Bright and Crisp */}
                                    <div className={`w-full md:w-1/2 relative z-10 ${isEven ? 'md:pe-12 lg:pe-20' : 'md:ps-12 lg:ps-20 md:order-last'}`}>
                                        <ScrollReveal direction={isEven ? "right" : "left"} delay={0.1}>
                                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-green-900/10 aspect-[5/4] md:aspect-[4/3] bg-slate-50 border border-white/50">
                                                <img
                                                    src={step.image || "/images/placeholder.svg"}
                                                    alt={locale === 'en' ? step.title_en : step.title_ar}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                                {/* Floating Elegant Icon Badge on the image */}
                                                <div className={`absolute top-6 ${isEven ? 'right-6' : 'left-6'} z-30`}>
                                                    <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-green-700 shadow-xl border border-white/50 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                                        <Icon strokeWidth={2} className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    </div>

                                    {/* Text Layout - Modern Glassy Card overlaps image slightly */}
                                    <div className={`w-full md:w-1/2 relative z-20 -mt-10 md:mt-0 ${isEven ? 'md:ps-12 lg:ps-20' : 'md:pe-12 lg:pe-20 md:-me-4'} `}>
                                        <ScrollReveal direction={isEven ? "left" : "right"} delay={0.2}>
                                            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/60 text-start group-hover:-translate-y-2 transition-transform duration-700">
                                                {/* Step Number Badge */}
                                                <div className="flex items-center gap-4 mb-6">
                                                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-700 font-black text-xl font-english shadow-inner border border-green-100/50">
                                                        0{index + 1}
                                                    </span>
                                                    <div className="h-0.5 flex-grow bg-gradient-to-r from-green-100 to-transparent"></div>
                                                </div>
                                                
                                                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 leading-tight">
                                                    {locale === 'en' ? step.title_en : step.title_ar}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-[15px] md:text-base whitespace-pre-line font-medium opacity-90">
                                                    {locale === 'en' ? step.description_en : step.description_ar}
                                                </p>
                                            </div>
                                        </ScrollReveal>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
};
