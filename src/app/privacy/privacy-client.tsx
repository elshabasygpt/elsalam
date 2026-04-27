"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { Shield, Lock, Eye, Database, FileText, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export const PrivacyClient = () => {
    const { t, isRTL } = useLanguage();
    const p = t.privacyPage;

    if (!p) {
        return null;
    }

    const icons = [
        <Shield key="shield" className="w-10 h-10 text-green-500" />,
        <Database key="db" className="w-10 h-10 text-green-500" />,
        <Lock key="lock" className="w-10 h-10 text-green-500" />,
        <Eye key="eye" className="w-10 h-10 text-green-500" />,
        <FileText key="file" className="w-10 h-10 text-green-500" />,
    ];

    return (
        <main className="min-h-screen bg-gray-50/50 pb-0">
            <Navbar />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-gray-900 via-green-950 to-gray-900 text-white pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/3" />
                </div>
                
                <Container className="relative z-10 text-center max-w-4xl">
                    <ScrollReveal>
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-white/10 border border-white/20 mb-8 backdrop-blur-sm shadow-xl">
                            <Shield className="w-14 h-14 text-green-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{p.heroTitle}</h1>
                        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                            {p.heroSubtitle}
                        </p>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Content Section */}
            <Container className="max-w-4xl -mt-10 relative z-20">
                <ScrollReveal delay={0.1}>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                        <div className="prose prose-green max-w-none">
                            <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm font-bold">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <span>{p.lastUpdated}</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed text-lg mb-10">
                                {p.intro}
                            </p>

                            <div className="space-y-12">
                                {p.sections.map((section: any, index: number) => (
                                    <div key={index} className="scroll-mt-24" id={`section-${index}`}>
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="w-20 h-20 rounded-[1.25rem] bg-green-50 border border-green-100 flex items-center justify-center shrink-0 shadow-sm">
                                                {icons[index % icons.length]}
                                            </div>
                                            <h2 className="text-3xl font-black text-gray-900 m-0">{section.title}</h2>
                                        </div>
                                        <div className="pl-24 rtl:pr-24 rtl:pl-0">
                                            <p className="text-gray-600 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-12 border-gray-100" />

                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{p.contactTitle}</h3>
                                <p className="text-gray-600 mb-6">{p.contactDesc}</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="mailto:info@elsalamoil.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                                        info@elsalamoil.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </Container>
            <Footer />
        </main>
    );
};
