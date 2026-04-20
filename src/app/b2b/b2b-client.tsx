"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { QuoteForm } from "@/components/organisms/QuoteForm";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { StatsCounter } from "@/components/organisms/StatsCounter";
import { ClientLogos } from "@/components/organisms/ClientLogos";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { Factory, FlaskConical, Package, BadgeDollarSign, Truck, Handshake } from "lucide-react";
import React from "react";
import { useLanguage } from "@/lib/i18n-context";

const ICONS = [
    <Factory className="w-8 h-8" strokeWidth={1.5} key="factory" />,
    <FlaskConical className="w-8 h-8" strokeWidth={1.5} key="flask" />,
    <Package className="w-8 h-8" strokeWidth={1.5} key="package" />,
    <BadgeDollarSign className="w-8 h-8" strokeWidth={1.5} key="dollar" />,
    <Truck className="w-8 h-8" strokeWidth={1.5} key="truck" />,
    <Handshake className="w-8 h-8" strokeWidth={1.5} key="handshake" />,
];

export function B2BClient() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            {/* B2B Hero */}
            <section className="pt-36 pb-20 bg-primary-dark text-white">
                <Container className="text-center">
                    <ScrollReveal>
                        <Typography variant="h1" className="text-white mb-6">{t.b2b.heroTitle}</Typography>
                        <Typography variant="body-lg" className="text-white/80 max-w-2xl mx-auto mb-8">
                            {t.b2b.heroSubtitle}
                        </Typography>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" variant="secondary" className="bg-white text-primary-dark border-none">
                                <a href="#quote-form">{t.b2b.ctaQuote}</a>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                {t.b2b.ctaCatalog}
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <StatsCounter />

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <Container>
                    <ScrollReveal>
                        <SectionHeader title={t.b2b.whyTitle} subtitle={t.b2b.whySubtitle} />
                    </ScrollReveal>
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {t.b2b.advantages.map((a, i) => (
                            <StaggerItem key={i}>
                                <div className="p-6 bg-surface-soft border border-surface-light rounded-md hover:border-primary-green/30 hover:shadow-card transition-all duration-300 group h-full">
                                    <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-green/10 to-primary-green/5 flex items-center justify-center mb-4 text-primary-green group-hover:bg-primary-green group-hover:text-white transition-all duration-300 shadow-sm">
                                        {ICONS[i]}
                                    </span>
                                    <Typography variant="h4" as="h3" className="mb-2">{a.title}</Typography>
                                    <Typography variant="small" className="text-text-dark/70">{a.desc}</Typography>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>

            <CertificationsBanner />
            <QuoteForm />
            <ClientLogos />
            <Footer />
        </main>
    );
}
