"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ShieldCheck, Award, BadgeCheck, Leaf, Factory, FileCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const CERT_CONFIG = [
    { name: "ISO 9001", icon: <ShieldCheck className="w-7 h-7" strokeWidth={1.5} />, color: "text-blue-400", glow: "bg-blue-500/20", hoverBorder: "hover:border-blue-400/40" },
    { name: "ISO 22000", icon: <FileCheck className="w-7 h-7" strokeWidth={1.5} />, color: "text-emerald-400", glow: "bg-emerald-500/20", hoverBorder: "hover:border-emerald-400/40" },
    { name: "HACCP", icon: <BadgeCheck className="w-7 h-7" strokeWidth={1.5} />, color: "text-amber-400", glow: "bg-amber-500/20", hoverBorder: "hover:border-amber-400/40" },
    { name: "Halal", icon: <Leaf className="w-7 h-7" strokeWidth={1.5} />, color: "text-green-400", glow: "bg-green-500/20", hoverBorder: "hover:border-green-400/40" },
    { name: "GMP", icon: <Factory className="w-7 h-7" strokeWidth={1.5} />, color: "text-purple-400", glow: "bg-purple-500/20", hoverBorder: "hover:border-purple-400/40" },
    { name: "FDA", icon: <Award className="w-7 h-7" strokeWidth={1.5} />, color: "text-sky-400", glow: "bg-sky-500/20", hoverBorder: "hover:border-sky-400/40" },
];

export const CertificationsBanner = () => {
    const { t, locale } = useLanguage();
    const cms = usePageContent("certifications");

    const badge = getBilingualValue(cms, "badge", locale) ?? t.certifications.badge;
    const title = getBilingualValue(cms, "title", locale) ?? t.certifications.title;
    const subtitle = getBilingualValue(cms, "subtitle", locale) ?? t.certifications.subtitle;
    const certs = (cms?.certs && Array.isArray(cms.certs) && cms.certs.length > 0)
        ? cms.certs.map((c: any) => ({ desc: getItemBilingual(c, "desc", locale), name: getItemBilingual(c, "name", locale) }))
        : t.certifications.certs;

    return (
        <section className="py-20 bg-gradient-to-b from-gray-950 via-green-950 to-gray-950 overflow-hidden">
            <Container>
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-green-400 font-bold text-sm mb-3 tracking-wider uppercase">{badge}</p>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{title}</h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">{subtitle}</p>
                    </div>
                </ScrollReveal>

                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CERT_CONFIG.map((cert, i) => (
                        <StaggerItem key={i}>
                            <div className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 ${cert.hoverBorder} hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-default text-center h-full`}>
                                <div className={`absolute inset-0 ${cert.glow} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />
                                <div className={`w-12 h-12 rounded-xl ${cert.glow} flex items-center justify-center ${cert.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {cert.icon}
                                </div>
                                <span className="text-white font-bold text-sm tracking-wide">{cert.name}</span>
                                <span className="text-white/40 text-xs leading-relaxed">{certs[i]?.desc}</span>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
};
