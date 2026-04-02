"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ShieldCheck, Factory, Leaf, Snowflake } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const REASON_CONFIG = [
    { icon: <Factory className="w-9 h-9" strokeWidth={1.5} />, color: "text-blue-600", bg: "bg-blue-100", accentGradient: "from-blue-500 to-blue-600", hoverGlow: "group-hover:shadow-blue-100", lightBg: "bg-blue-50/50" },
    { icon: <ShieldCheck className="w-9 h-9" strokeWidth={1.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accentGradient: "from-emerald-500 to-green-600", hoverGlow: "group-hover:shadow-emerald-100", lightBg: "bg-emerald-50/50" },
    { icon: <Snowflake className="w-9 h-9" strokeWidth={1.5} />, color: "text-sky-600", bg: "bg-sky-100", accentGradient: "from-sky-500 to-cyan-600", hoverGlow: "group-hover:shadow-sky-100", lightBg: "bg-sky-50/50" },
    { icon: <Leaf className="w-9 h-9" strokeWidth={1.5} />, color: "text-amber-600", bg: "bg-amber-100", accentGradient: "from-amber-500 to-orange-500", hoverGlow: "group-hover:shadow-amber-100", lightBg: "bg-amber-50/50" },
];

export const WhyChooseUs = () => {
    const { t, locale } = useLanguage();
    const nums = ["01", "02", "03", "04"];
    const cms = usePageContent("whyChooseUs");

    const badge = getBilingualValue(cms, "badge", locale) ?? t.whyChooseUs.badge;
    const title = getBilingualValue(cms, "title", locale) ?? t.whyChooseUs.title;
    const titleHL = getBilingualValue(cms, "titleHighlight", locale) ?? t.whyChooseUs.titleHighlight;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.whyChooseUs.subtitle;

    const reasons = (cms?.reasons && Array.isArray(cms.reasons) && cms.reasons.length > 0)
        ? cms.reasons.map((r: any) => ({ title: getItemBilingual(r, "title", locale), description: getItemBilingual(r, "description", locale) }))
        : t.whyChooseUs.reasons;

    return (
        <section className="py-28 relative overflow-hidden bg-gradient-to-b from-surface-soft via-white to-surface-soft">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-green/[0.03] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            <div className="absolute inset-0 bg-organic-pattern opacity-40 pointer-events-none" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <span className="inline-block py-1.5 px-5 rounded-full bg-green-100 text-primary-green text-sm font-bold mb-6 border border-green-200">
                            {badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-text-dark mb-5 leading-tight">
                            {title} <span className="text-primary-green">{titleHL}</span>؟
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            {subtitle}
                        </p>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-primary-green to-transparent mx-auto rounded-full mt-6 opacity-60" />
                    </div>
                </ScrollReveal>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-7" staggerDelay={0.12}>
                    {reasons.map((reason, i) => {
                        const cfg = REASON_CONFIG[i];
                        return (
                            <StaggerItem key={i}>
                                <div className={`group relative bg-white rounded-3xl border border-gray-100 hover:border-gray-200 ${cfg.hoverGlow} hover:shadow-xl transition-all duration-500 h-full overflow-hidden`}>
                                    <div className={`absolute top-0 right-0 bottom-0 w-1.5 bg-gradient-to-b ${cfg.accentGradient} rounded-r-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className={`absolute inset-0 ${cfg.lightBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />
                                    <div className="relative z-10 p-8 md:p-10 flex gap-6 md:gap-8 items-start">
                                        <div className="shrink-0 flex flex-col items-center gap-3">
                                            <div className={`w-18 h-18 w-[72px] h-[72px] rounded-2xl ${cfg.bg} ${cfg.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                                                {cfg.icon}
                                            </div>
                                            <span className={`text-xs font-black ${cfg.color} opacity-40 group-hover:opacity-80 transition-opacity duration-300 tracking-widest`}>
                                                {nums[i]}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                                                {reason.title}
                                            </h3>
                                            <p className="text-gray-500 leading-relaxed text-sm md:text-base group-hover:text-gray-600 transition-colors duration-300">
                                                {reason.description}
                                            </p>
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
