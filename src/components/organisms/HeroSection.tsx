"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Container } from "@/components/atoms/Container";
import { Button } from "@/components/atoms/Button";
import { ShieldCheck, Award, Leaf as LeafIcon, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getItemBilingual } from "@/lib/page-content-context";

const CERTIFICATIONS = [
    { icon: <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />, label: "ISO 9001" },
    { icon: <Award className="w-5 h-5" strokeWidth={1.5} />, label: "HACCP" },
    { icon: <LeafIcon className="w-5 h-5" strokeWidth={1.5} />, label: "Halal" },
];

export const HeroSection = () => {
    const { t, isRTL, locale } = useLanguage();
    const [activeTab, setActiveTab] = useState(0);
    const [direction, setDirection] = useState(0);

    const cmsHero   = usePageContent("heroSlides");
    const cmsDesign = usePageContent("heroDesign");

    // ── Design tokens (with safe defaults) ──────────────────────────────────
    const d = {
        titleFontSize:       (cmsDesign?.titleFontSize      as string) || "text-6xl",
        titleFontWeight:     (cmsDesign?.titleFontWeight     as string) || "font-extrabold",
        titleLineHeight:     (cmsDesign?.titleLineHeight     as string) || "leading-tight",
        subtitleFontSize:    (cmsDesign?.subtitleFontSize    as string) || "text-lg",
        titleColor:          (cmsDesign?.titleColor          as string) || "#ffffff",
        titleLine2Color:     (cmsDesign?.titleLine2Color     as string) || "#34d399",
        subtitleColor:       (cmsDesign?.subtitleColor       as string) || "#d1d5db",
        contentPaddingTop:   Number(cmsDesign?.contentPaddingTop    ?? 144),
        contentPaddingBottom:Number(cmsDesign?.contentPaddingBottom  ?? 96),
        cardPaddingX:        Number(cmsDesign?.cardPaddingX          ?? 48),
        cardPaddingY:        Number(cmsDesign?.cardPaddingY          ?? 48),
        cardBgOpacity:       Number(cmsDesign?.cardBgOpacity         ?? 40),
        cardBlur:            (cmsDesign?.cardBlur            as string) || "backdrop-blur-md",
        cardBorderEnabled:   cmsDesign?.cardBorderEnabled !== false,
        cardRounded:         (cmsDesign?.cardRounded         as string) || "rounded-[2rem]",
        overlayOpacity:      Number(cmsDesign?.overlayOpacity        ?? 80),
        textAlign:           (cmsDesign?.textAlign           as string) || "text-start",
        cardMaxWidth:        (cmsDesign?.cardMaxWidth         as string) || "max-w-3xl",
    };

    // ── Build slides ─────────────────────────────────────────────────────────
    const slides = useMemo(() => {
        if (cmsHero?.slides && Array.isArray(cmsHero.slides) && cmsHero.slides.length > 0) {
            return cmsHero.slides.map((s: any, i: number) => ({
                id: `slide-${i}`,
                tabName:         getItemBilingual(s, "tabName",    locale),
                badge:           getItemBilingual(s, "badge",      locale),
                titleLine1:      getItemBilingual(s, "titleLine1", locale),
                titleLine2:      getItemBilingual(s, "titleLine2", locale),
                subtitle:        getItemBilingual(s, "subtitle",   locale),
                ctaPrimary:      getItemBilingual(s, "ctaPrimary", locale),
                ctaPrimaryLink:  s.ctaPrimaryLink  || "/products",
                ctaSecondary:    getItemBilingual(s, "ctaSecondary", locale),
                ctaSecondaryLink:s.ctaSecondaryLink || "/contact",
                image:           s.image           || "/images/hero-bg.png",
            }));
        }
        return Array.isArray(t.heroSlides) ? t.heroSlides : [];
    }, [cmsHero, t.heroSlides, locale]);

    // ── Auto-advance every 8s ────────────────────────────────────────────────
    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setDirection(1);
            setActiveTab((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleTabClick = (index: number) => {
        setDirection(index > activeTab ? 1 : -1);
        setActiveTab(index);
    };

    if (!slides || slides.length === 0) return null;

    const currentSlide = slides[activeTab];

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0, scale: 1.05 }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
        exit:   (dir: number) => ({ zIndex: 0, x: dir < 0 ? 1000 : -1000, opacity: 0, scale: 0.95 }),
    };

    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    return (
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-black">

            {/* ── Background Slider ── */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale:   { duration: 0.5 },
                        }}
                        className="absolute inset-0"
                    >
                        <img
                            src={currentSlide.image}
                            alt={currentSlide.titleLine2}
                            className="w-full h-full object-cover origin-center"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Top gradient */}
                <div
                    className="absolute inset-x-0 top-0 h-40 z-0 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}
                />

                {/* Dynamic overlay — driven by heroDesign.overlayOpacity */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ background: `rgba(0,0,0,${d.overlayOpacity / 100})` }}
                />

                {/* Decorative glows */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            {/* ── Main Content ── */}
            <Container
                className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl"
                style={{
                    paddingTop:    d.contentPaddingTop,
                    paddingBottom: d.contentPaddingBottom,
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`${d.textAlign} ${d.cardMaxWidth} ${d.cardRounded} ${d.cardBlur} shadow-2xl relative overflow-visible group`}
                        style={{
                            backgroundColor: `rgba(0,0,0,${d.cardBgOpacity / 100})`,
                            border:  d.cardBorderEnabled ? "1px solid rgba(255,255,255,0.1)" : "none",
                            padding: `${d.cardPaddingY}px ${d.cardPaddingX}px`,
                            ...(d.textAlign === "text-center"
                                ? { marginLeft: "auto", marginRight: "auto" }
                                : {}),
                        }}
                    >
                        {/* Internal glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[inherit]" />

                        <div className="relative z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6">
                                <LeafIcon className="w-5 h-5 text-green-400" strokeWidth={2.5} />
                                {currentSlide.badge}
                            </div>

                            {/* Accent bar */}
                            <div
                                className={`w-16 h-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-10 ${
                                    isRTL ? "ml-auto md:ml-0 md:mr-0" : ""
                                }`}
                            />

                            {/* H1 — all typography driven by design tokens */}
                            <h1
                                className={`${d.titleFontSize} ${d.titleFontWeight} ${d.titleLineHeight} mb-6 drop-shadow-2xl transition-all`}
                                style={{ color: d.titleColor }}
                            >
                                <span className="block">{currentSlide.titleLine1}</span>
                                <span className="block mt-1" style={{ color: d.titleLine2Color }}>
                                    {currentSlide.titleLine2}
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p
                                className={`${d.subtitleFontSize} mb-10 leading-relaxed font-medium max-w-2xl`}
                                style={{ color: d.subtitleColor }}
                            >
                                {currentSlide.subtitle}
                            </p>

                            {/* CTAs */}
                            <div
                                className={`flex flex-wrap items-center gap-4 ${
                                    d.textAlign === "text-center" ? "justify-center" : "justify-start"
                                }`}
                            >
                                <Link href={currentSlide.ctaPrimaryLink}>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 border-none px-8 h-14 text-base md:text-lg font-bold shadow-xl shadow-green-900/40 hover:shadow-green-900/60 transition-all group"
                                    >
                                        {currentSlide.ctaPrimary}
                                        <ArrowIcon
                                            strokeWidth={2.5}
                                            className={`w-6 h-6 transition-transform duration-300 ${
                                                isRTL
                                                    ? "mr-3 rotate-180 group-hover:-translate-x-2"
                                                    : "ml-3 group-hover:translate-x-2"
                                            }`}
                                        />
                                    </Button>
                                </Link>
                                <Link href={currentSlide.ctaSecondaryLink}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 h-14 text-base backdrop-blur-sm transition-all"
                                    >
                                        {currentSlide.ctaSecondary}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Certifications row */}
                <div className="mt-16 flex flex-wrap items-center justify-center md:justify-start gap-4 opacity-80">
                    {CERTIFICATIONS.map((cert, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                            <span className="text-green-500">{cert.icon}</span>
                            <span>{cert.label}</span>
                            {i < CERTIFICATIONS.length - 1 && (
                                <span className="w-1 h-1 bg-white/30 rounded-full mx-2" />
                            )}
                        </div>
                    ))}
                </div>
            </Container>

            {/* ── Tab Navigator ── */}
            <div className="relative z-20 w-full border-t border-white/10 bg-black/50 backdrop-blur-2xl">
                <Container>
                    <div className="flex w-full overflow-x-auto scrollbar-hide">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => handleTabClick(idx)}
                                className={`flex-1 min-w-[200px] py-6 px-4 text-center border-t-2 transition-all duration-300 group ${
                                    activeTab === idx
                                        ? "border-green-400 bg-white/10 shadow-[inset_0_2px_20px_rgba(74,222,128,0.1)]"
                                        : "border-transparent hover:bg-white/5 hover:border-white/20 text-white/50 hover:text-white/80"
                                }`}
                            >
                                <span
                                    className={`text-xs font-bold tracking-widest uppercase block mb-1 ${
                                        activeTab === idx
                                            ? "text-green-400"
                                            : "text-white/40 group-hover:text-white/60"
                                    }`}
                                >
                                    0{idx + 1}
                                </span>
                                <span
                                    className={`text-base md:text-lg font-bold ${
                                        activeTab === idx ? "text-white" : ""
                                    }`}
                                >
                                    {slide.tabName}
                                </span>
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Bottom curve */}
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none transform translate-y-[2px]">
                <svg
                    viewBox="0 0 1440 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-md"
                >
                    <path
                        d="M0 40V20C240 0 480 0 720 10C960 20 1200 30 1440 20V40H0Z"
                        fill="#F8FAF9"
                    />
                </svg>
            </div>
        </section>
    );
};
