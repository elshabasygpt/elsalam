"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { useLanguage } from "@/lib/i18n-context";
import { InfiniteMarquee } from "@/components/organisms/InfiniteMarquee";

export const ClientLogos = () => {
    const { t } = useLanguage();

    const clientsUrl = t.clients.names.map((name, i) => ({
        alt: name,
        src: "/images/placeholder.svg",
    }));

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden bg-organic-pattern">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            <Container className="relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-4 rounded-full bg-green-100 text-primary-green text-sm font-bold mb-6 border border-green-200 shadow-sm">
                            {t.clients.badge}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-text-dark mb-6 group leading-tight">
                            {t.clients.titleBefore} <span className="text-primary-green inline-block hover:scale-110 hover:-rotate-3 transition-transform duration-300">{t.clients.titleCount}</span> {t.clients.titleAfter}
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-primary-green to-transparent mx-auto rounded-full opacity-70" />
                    </div>
                </ScrollReveal>
            </Container>

            <div className="flex flex-col gap-8">
                <InfiniteMarquee images={clientsUrl} speed={50} direction="left" />
                <div className="hidden md:block">
                    <InfiniteMarquee images={[...clientsUrl].reverse()} speed={60} direction="right" />
                </div>
            </div>
        </section>
    );
};
