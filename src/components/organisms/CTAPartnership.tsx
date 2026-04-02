"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

export const CTAPartnership = () => {
    const { t, locale } = useLanguage();
    const cms = usePageContent("ctaPartnership");

    const title = getBilingualValue(cms, "title", locale) ?? t.cta.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.cta.subtitle;
    const ctaPrimary = getBilingualValue(cms, "ctaPrimary", locale) ?? t.cta.ctaPrimary;
    const ctaSecondary = getBilingualValue(cms, "ctaSecondary", locale) ?? t.cta.ctaSecondary;

    return (
        <section className="py-24 bg-gradient-to-r from-primary-dark to-primary-green text-white relative overflow-hidden">
            <div className="absolute top-0 start-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 end-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 start-1/3 w-32 h-32 bg-white/5 rounded-full" />

            <Container className="relative z-10 text-center">
                <ScrollReveal>
                    <Typography variant="h2" className="text-white mb-6">
                        {title}
                    </Typography>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                    <Typography variant="body-lg" className="text-white/80 max-w-2xl mx-auto mb-10">
                        {subtitle}
                    </Typography>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/b2b/quote">
                            <Button size="lg" variant="white">
                                {ctaPrimary}
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                                {ctaSecondary}
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>
            </Container>
        </section>
    );
};
