"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { Wheat, Settings, Factory, FlaskConical, Sparkles, Wind, Package, ShieldCheck } from "lucide-react";
import React from "react";
import { useLanguage } from "@/lib/i18n-context";

const STEP_ICONS = [
    <Wheat className="w-6 h-6" strokeWidth={1.5} key="wheat" />,
    <Settings className="w-6 h-6" strokeWidth={1.5} key="settings" />,
    <Factory className="w-6 h-6" strokeWidth={1.5} key="factory" />,
    <FlaskConical className="w-6 h-6" strokeWidth={1.5} key="flask" />,
    <Sparkles className="w-6 h-6" strokeWidth={1.5} key="sparkles" />,
    <Wind className="w-6 h-6" strokeWidth={1.5} key="wind" />,
    <Package className="w-6 h-6" strokeWidth={1.5} key="package" />,
    <ShieldCheck className="w-6 h-6" strokeWidth={1.5} key="shield" />,
];

export default function ProductionPage() {
    const { t, locale } = useLanguage();

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            <section className="pt-36 pb-20 bg-primary-dark text-white">
                <Container className="text-center">
                    <ScrollReveal>
                        <Typography variant="h1" className="text-white mb-4">{t.production.heroTitle}</Typography>
                        <Typography variant="body-lg" className="text-white/80 max-w-2xl mx-auto">
                            {t.production.heroSubtitle}
                        </Typography>
                    </ScrollReveal>
                </Container>
            </section>

            <section className="py-24 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <StaggerContainer className="relative border-s-2 border-primary-green/20 ps-8 ms-4 space-y-16" staggerDelay={0.1}>
                            {t.production.steps.map((step, i) => (
                                <StaggerItem key={i}>
                                    <div className="relative group">
                                        <div className="absolute w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center -start-[53px] top-0 shadow-sm group-hover:scale-110 group-hover:shadow-elevation transition-all">
                                            {STEP_ICONS[i]}
                                        </div>
                                        <Typography variant="h3" as="h3" className="text-primary-dark mb-3">
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body" className="text-text-dark/70 leading-relaxed mb-6">
                                            {step.description}
                                        </Typography>

                                        {/* Factory Image Placeholder */}
                                        <div className="w-full max-w-2xl aspect-video bg-surface-light rounded-2xl overflow-hidden border border-surface-light/50 relative group-hover:shadow-lg transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 opacity-50"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-slate-300 flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                        <Factory className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-medium">{locale === 'ar' ? 'صورة مرحلة الإنتاج' : 'Production Stage Photo'}</span>
                                                </div>
                                            </div>
                                            {/* When real images arrive, replace the above with:
                                            <img src="/images/factory/step-X.jpg" className="w-full h-full object-cover object-center" alt={step.title} />
                                            */}
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </Container>
            </section>

            <CertificationsBanner />
            <Footer />
        </main>
    );
}
