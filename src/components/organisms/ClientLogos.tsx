"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { InfiniteMarquee } from "@/components/organisms/InfiniteMarquee";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

export const ClientLogos = () => {
    const { t, locale } = useLanguage();
    const cmsSect = usePageContent("clientLogos");

    // Process CMS Data if available
    const hasCmsData = !!cmsSect;

    // Dynamic Texts
    const badge = hasCmsData ? (locale === "ar" ? cmsSect.badge_ar : cmsSect.badge_en) : t.clients.badge;
    const titleBefore = hasCmsData ? (locale === "ar" ? cmsSect.titleBefore_ar : cmsSect.titleBefore_en) : t.clients.titleBefore;
    const titleCount = hasCmsData ? cmsSect.titleCount : t.clients.titleCount;
    const titleAfter = hasCmsData ? (locale === "ar" ? cmsSect.titleAfter_ar : cmsSect.titleAfter_en) : t.clients.titleAfter;

    // Map logos
    let clientsUrl = [];
    if (hasCmsData && Array.isArray(cmsSect.names) && cmsSect.names.length > 0) {
        clientsUrl = cmsSect.names.map((partner: any) => ({
            alt: locale === "ar" ? (partner.name_ar || "") : (partner.name_en || ""),
            src: partner.logo || "/images/placeholder.svg",
        })).filter((c: any) => c.src);
    } else {
        clientsUrl = t.clients.names.map((name, i) => ({
            alt: name,
            src: "/images/placeholder.svg",
        }));
    }

    // Duplicate logos if there are very few, to ensure the marquee flows endlessly without abrupt empty space
    const displayLogos = clientsUrl.length > 0 && clientsUrl.length < 8
        ? [...clientsUrl, ...clientsUrl, ...clientsUrl, ...clientsUrl, ...clientsUrl].slice(0, 10)
        : clientsUrl;

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden bg-organic-pattern">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-4 rounded-full bg-green-100 text-primary-green text-sm font-bold mb-6 border border-green-200 shadow-sm">
                            {badge || t.clients.badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-text-dark mb-6 group leading-tight">
                            {titleBefore} <span className="text-primary-green inline-block hover:scale-110 hover:-rotate-3 transition-transform duration-300">{titleCount}</span> {titleAfter}
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-primary-green to-transparent mx-auto rounded-full opacity-70" />
                    </div>
                </ScrollReveal>
            </Container>

            <div className="flex flex-col gap-8">
                {displayLogos.length > 0 ? (
                    <InfiniteMarquee images={displayLogos} speed={50} direction="left" />
                ) : null}
            </div>
        </section>
    );
};
