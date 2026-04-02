"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";
import { motion, AnimatePresence } from "framer-motion";

export const Testimonials = () => {
    const { t, isRTL, locale } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const cms = usePageContent("testimonials");

    const sectionTitle = getBilingualValue(cms, "title", locale) ?? t.testimonials.title;
    const sectionSubtitle = getBilingualValue(cms, "subtitle", locale) ?? t.testimonials.subtitle;
    const items = (cms?.items && Array.isArray(cms.items) && cms.items.length > 0)
        ? cms.items.map((item: any) => ({ name: getItemBilingual(item, "name", locale), role: getItemBilingual(item, "role", locale), content: getItemBilingual(item, "content", locale) }))
        : t.testimonials.items;

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, items.length]);

    const handleNext = useCallback(() => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const handlePrev = useCallback(() => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    // Determine indices for surrounding items
    const getVisibleItems = () => {
        const prevIdx = (currentIndex - 1 + items.length) % items.length;
        const nextIdx = (currentIndex + 1) % items.length;
        return [prevIdx, currentIndex, nextIdx];
    };

    const [prev, current, next] = getVisibleItems();

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-green/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-gold/5 via-transparent to-transparent pointer-events-none" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16 md:mb-20">
                        <span className="inline-block py-1.5 px-5 rounded-full bg-primary-green/10 text-primary-green text-sm font-bold mb-6 border border-primary-green/20">
                            <Quote className="w-5 h-5 inline-block mr-1.5 -mt-0.5" strokeWidth={1.5} />
                            {sectionTitle}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary-dark mb-4">{sectionTitle}</h2>
                        <p className="text-text-dark/70 text-lg max-w-2xl mx-auto">{sectionSubtitle}</p>
                    </div>
                </ScrollReveal>

                <div className="relative max-w-6xl mx-auto"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}>

                    {/* Carousel Container */}
                    <div className="relative h-[420px] md:h-[350px] flex items-center justify-center overflow-hidden px-4 md:px-12">

                        <div className="absolute inset-0 flex items-center justify-center">
                            {items.map((item, index) => {
                                // Determine position relative to current
                                let position = "hidden";
                                let zIndex = 0;
                                let xOffset = 0;
                                let scale = 0.85;
                                let opacity = 0;

                                if (index === current) {
                                    position = "active";
                                    zIndex = 30;
                                    xOffset = 0;
                                    scale = 1;
                                    opacity = 1;
                                } else if (index === prev) {
                                    position = "prev";
                                    zIndex = 20;
                                    xOffset = isRTL ? 50 : -50;
                                    scale = 0.85;
                                    opacity = 0.4;
                                } else if (index === next) {
                                    position = "next";
                                    zIndex = 20;
                                    xOffset = isRTL ? -50 : 50;
                                    scale = 0.85;
                                    opacity = 0.4;
                                }

                                const isActive = position === "active";

                                return (
                                    <motion.div
                                        key={index}
                                        initial={false}
                                        animate={{
                                            x: `${xOffset}%`,
                                            scale: scale,
                                            opacity: opacity,
                                            zIndex: zIndex,
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className={`absolute w-full max-w-3xl cursor-pointer ${opacity === 0 ? 'pointer-events-none' : ''}`}
                                        onClick={() => {
                                            if (position === "prev") handlePrev();
                                            if (position === "next") handleNext();
                                        }}
                                    >
                                        <div className={`bg-white rounded-3xl p-8 md:p-12 border ${isActive ? 'border-primary-green/20 shadow-[0_20px_40px_rgb(0,0,0,0.08)]' : 'border-surface-light shadow-sm'} transition-all duration-500`}>
                                            <Quote className={`absolute top-6 ${isRTL ? 'left-8' : 'right-8'} w-16 h-16 ${isActive ? 'text-primary-green/10' : 'text-surface-light'} transition-colors duration-500`} strokeWidth={1} />

                                            <div className="flex gap-1.5 mb-6">
                                                {[...Array(5)].map((_, s) => (
                                                    <Star key={s} className="w-6 h-6 fill-accent-gold text-accent-gold" />
                                                ))}
                                            </div>

                                            <p className={`text-lg md:text-xl md:leading-relaxed mb-10 ${isActive ? 'text-text-dark font-medium' : 'text-text-dark/60'} transition-colors duration-500`}>
                                                "{item.content}"
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-green to-primary-dark flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-lg ${isActive ? 'text-primary-dark' : 'text-text-dark/80'}`}>{item.name}</p>
                                                    <p className={`text-sm ${isActive ? 'text-primary-green font-medium' : 'text-text-dark/50'}`}>{item.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8 md:mt-2">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full bg-white border border-surface-light flex items-center justify-center text-primary-dark hover:bg-primary-green hover:text-white hover:border-primary-green transition-all shadow-sm z-40 active:scale-95"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} strokeWidth={2} />
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-2 px-4">
                            {items.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsAutoPlaying(false);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-primary-green' : 'w-2 bg-surface-light hover:bg-primary-green/40'}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full bg-white border border-surface-light flex items-center justify-center text-primary-dark hover:bg-primary-green hover:text-white hover:border-primary-green transition-all shadow-sm z-40 active:scale-95"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </Container>
        </section>
    );
};
