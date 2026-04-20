"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CertificationsBanner } from "@/components/organisms/CertificationsBanner";
import { OurProcess } from "@/components/organisms/OurProcess";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Button } from "@/components/atoms/Button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ShieldCheck, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

export function QualityClient() {
    const { t, locale } = useLanguage();

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            <section className="pt-36 pb-20 bg-primary-dark text-white">
                <Container className="text-center">
                    <ScrollReveal>
                        <Typography variant="h1" className="text-white mb-4">{t.quality.heroTitle}</Typography>
                        <Typography variant="body-lg" className="text-white/80 max-w-2xl mx-auto">
                            {t.quality.heroSubtitle}
                        </Typography>
                    </ScrollReveal>
                </Container>
            </section>

            <CertificationsBanner />

            {/* QC Checklist */}
            <section className="py-24 bg-white">
                <Container>
                    <ScrollReveal>
                        <SectionHeader title={t.quality.qcTitle} subtitle={t.quality.qcSubtitle} />
                    </ScrollReveal>
                    <StaggerContainer className="max-w-2xl mx-auto space-y-4" staggerDelay={0.08}>
                        {t.quality.qcChecks.map((check, i) => (
                            <StaggerItem key={i}>
                                <div className="flex items-center gap-4 p-4 bg-surface-soft border border-surface-light rounded-md hover:border-accent-green/30 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0 group-hover:bg-primary-green group-hover:text-white transition-all">
                                        <ShieldCheck className="w-5 h-5 text-primary-green group-hover:text-white transition-colors" />
                                    </div>
                                    <Typography variant="body" className="text-text-dark">{check}</Typography>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </Container>
            </section>

            {/* Quality Control Lab Gallery Placeholder */}
            <section className="py-20 bg-surface-soft">
                <Container>
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-black text-primary-dark mb-4">
                                {locale === 'ar' ? 'معامل فحص الجودة' : 'Quality Control Laboratories'}
                            </h2>
                            <p className="text-text-dark/70 max-w-2xl mx-auto">
                                {locale === 'ar'
                                    ? 'نمتلك أحدث الأجهزة المعملية لضمان مطابقة جميع منتجاتنا للمواصفات القياسية العالمية.'
                                    : 'Equipped with state-of-the-art laboratory technology to ensure all our products meet strict international standards.'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Image 1 */}
                        <ScrollReveal delay={0.1}>
                            <div className="w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-light relative group">
                                <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop" alt="Lab Test" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </ScrollReveal>

                        {/* Image 2 */}
                        <ScrollReveal delay={0.2}>
                            <div className="w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-light relative group">
                                <img src="https://images.unsplash.com/photo-1582719478250-c89e82c5a013?q=80&w=1200&auto=format&fit=crop" alt="QC Validation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </ScrollReveal>

                        {/* Image 3 */}
                        <ScrollReveal delay={0.3}>
                            <div className="w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-light relative group md:col-span-2 lg:col-span-1">
                                <img src="https://images.unsplash.com/photo-1574689211272-bc1550ce15f5?q=80&w=1200&auto=format&fit=crop" alt="Quality Team" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            <OurProcess />

            {/* Download CTA */}
            <section className="py-16 bg-surface-soft">
                <Container className="text-center">
                    <ScrollReveal>
                        <Typography variant="h3" className="text-primary-dark mb-6">{t.quality.downloadTitle}</Typography>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="primary" className="gap-2">
                                <Download className="w-5 h-5" />
                                {t.quality.downloadISO9001}
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-5 h-5" />
                                {t.quality.downloadISO22000}
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-5 h-5" />
                                {t.quality.downloadHalal}
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <Footer />
        </main>
    );
}
