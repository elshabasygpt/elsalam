"use client";

import React, { useRef } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { Leaf, Droplets, ShieldCheck, PackageCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden text-text-dark" ref={containerRef}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-green/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 blur-3xl rounded-full" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-primary-green/10 text-primary-green text-sm font-bold mb-6 border border-primary-green/20">
                            {locale === 'en' ? 'Our Process' : 'آلية الإنتاج والجودة'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            {locale === 'en' ? 'From Seed to Shelf' : 'من البذرة إلى المائدة.. رحلة الجودة'}
                        </h2>
                        <p className="text-lg text-text-dark/70">
                            {locale === 'en'
                                ? 'We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.'
                                : 'نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.'}
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

                    <div className="space-y-16 md:space-y-24">
                        {PROCESS_STEPS.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const Icon = step.icon;

                            return (
                                <div key={index} className="relative flex flex-col md:flex-row items-center gap-8 md:gap-0">

                                    {/* Center Node (Desktop) */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-surface-soft shadow-lg items-center justify-center z-10 transition-transform duration-500 hover:scale-125">
                                        <div className="w-4 h-4 rounded-full bg-primary-green animate-pulse" />
                                    </div>

                                    {/* Image Layout */}
                                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pe-16 lg:pe-24' : 'md:ps-16 lg:ps-24 md:order-last'}`}>
                                        <ScrollReveal direction={isEven ? "right" : "left"} delay={0.1}>
                                            <div className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                                                <div className="absolute inset-0 bg-primary-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                                <img
                                                    src={step.image}
                                                    alt={locale === 'en' ? step.titleEn : step.titleAr}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${step.grad} opacity-60 mix-blend-multiply z-20`} />
                                                <div className="absolute bottom-6 left-6 z-30">
                                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                                                        <Icon strokeWidth={1.5} className="w-7 h-7" />
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollReveal>
                                    </div>

                                    {/* Text Layout */}
                                    <div className={`w-full md:w-1/2 ${isEven ? 'md:ps-16 lg:ps-24' : 'md:pe-16 lg:pe-24 md:-me-1'}`}>
                                        <ScrollReveal direction={isEven ? "left" : "right"} delay={0.2}>
                                            <div className="text-start">
                                                <span className="text-6xl font-black text-surface-light opacity-50 block mb-2 font-english">0{index + 1}</span>
                                                <h3 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4 drop-shadow-sm">
                                                    {locale === 'en' ? step.titleEn : step.titleAr}
                                                </h3>
                                                <p className="text-text-dark/70 leading-relaxed text-lg">
                                                    {locale === 'en' ? step.descEn : step.descAr}
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
