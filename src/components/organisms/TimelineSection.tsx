"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { Wheat, Droplets, Sparkles, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const STEP_CONFIG = [
    { icon: <Wheat className="w-7 h-7" strokeWidth={1.5} />, color: "text-green-600", iconBg: "bg-green-100", numColor: "text-green-200", borderColor: "border-green-200", hoverBorder: "hover:border-green-400" },
    { icon: <Droplets className="w-7 h-7" strokeWidth={1.5} />, color: "text-blue-600", iconBg: "bg-blue-100", numColor: "text-blue-200", borderColor: "border-blue-200", hoverBorder: "hover:border-blue-400" },
    { icon: <Sparkles className="w-7 h-7" strokeWidth={1.5} />, color: "text-amber-600", iconBg: "bg-amber-100", numColor: "text-amber-200", borderColor: "border-amber-200", hoverBorder: "hover:border-amber-400" },
    { icon: <Package className="w-7 h-7" strokeWidth={1.5} />, color: "text-purple-600", iconBg: "bg-purple-100", numColor: "text-purple-200", borderColor: "border-purple-200", hoverBorder: "hover:border-purple-400" },
];

const NUMS = ["01", "02", "03", "04"];

export const TimelineSection = () => {
    const { t, isRTL, locale } = useLanguage();
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
    const cms = usePageContent("timeline");

    const badge = getBilingualValue(cms, "badge", locale) ?? t.timeline.badge;
    const title = getBilingualValue(cms, "title", locale) ?? t.timeline.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.timeline.subtitle;
    const steps = (cms?.steps && Array.isArray(cms.steps) && cms.steps.length > 0)
        ? cms.steps.map((s: any) => ({ title: getItemBilingual(s, "title", locale), description: getItemBilingual(s, "description", locale) }))
        : t.timeline.steps;

    return (
        <section className="py-24 bg-white">
            <Container>
                <ScrollReveal>
                    <div className="text-center mb-14">
                        <p className="text-green-700 font-bold text-sm mb-3 tracking-wider uppercase">{badge}</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{title}</h2>
                        <p className="text-gray-500 text-base max-w-lg mx-auto">{subtitle}</p>
                    </div>
                </ScrollReveal>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.12}>
                    {steps.map((step, index) => {
                        const cfg = STEP_CONFIG[index];
                        return (
                            <StaggerItem key={index}>
                                <div className="relative h-full">
                                    {index < STEP_CONFIG.length - 1 && (
                                        <div className={`hidden lg:flex absolute ${isRTL ? '-left-3' : '-right-3'} top-1/2 -translate-y-1/2 z-10`}>
                                            <ChevronIcon className="w-5 h-5 text-gray-300" />
                                        </div>
                                    )}
                                    <div className={`group relative bg-white border-2 ${cfg.borderColor} ${cfg.hoverBorder} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden`}>
                                        <span className={`absolute top-3 ${isRTL ? 'left-4' : 'right-4'} text-7xl font-black ${cfg.numColor} select-none pointer-events-none leading-none opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                                            {NUMS[index]}
                                        </span>
                                        <div className="relative z-10">
                                            <div className={`w-14 h-14 rounded-xl ${cfg.iconBg} ${cfg.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                                {cfg.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{step.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>
            </Container>
        </section>
    );
};
