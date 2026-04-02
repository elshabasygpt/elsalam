"use client";

import React from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { MapPin, Phone, Mail, Leaf, Facebook, Linkedin, Instagram, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";

const QUICK_LINK_HREFS = ["/", "/about", "/quality", "/production", "/media", "/contact"];
const PRODUCT_LINK_HREFS = ["/products", "/products", "/products", "/b2b", "/export"];

const SOCIAL_LINKS = [
    { icon: <Facebook className="w-5 h-5" strokeWidth={1.5} />, href: "https://facebook.com/elsalamoils", label: "Facebook", hoverBg: "hover:bg-blue-600" },
    { icon: <Instagram className="w-5 h-5" strokeWidth={1.5} />, href: "https://instagram.com/elsalamoils", label: "Instagram", hoverBg: "hover:bg-pink-600" },
    { icon: <Linkedin className="w-5 h-5" strokeWidth={1.5} />, href: "https://linkedin.com/company/elsalamoils", label: "LinkedIn", hoverBg: "hover:bg-sky-600" },
];

export const Footer = () => {
    const { t, isRTL } = useLanguage();

    return (
        <footer className="relative bg-gradient-to-b from-gray-950 via-green-950 to-gray-950 text-white mt-0">
            {/* ── CTA Strip ── */}
            <div className="bg-green-700">
                <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-start">
                        <p className="text-white font-bold text-lg">{t.footer.ctaTitle}</p>
                        <p className="text-green-200 text-sm">{t.footer.ctaSubtitle}</p>
                    </div>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-800 font-bold rounded-xl hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 shadow-md text-base"
                    >
                        <Send className="w-5 h-5" />
                        {t.footer.ctaButton}
                    </Link>
                </Container>
            </div>

            {/* ── Main Footer Content ── */}
            <Container className="pt-16 pb-8">
                <ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/10">

                        {/* Column 1: About + Social */}
                        <div className="lg:col-span-1 space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-green-400" strokeWidth={1.5} />
                                </span>
                                <div>
                                    <p className="text-white font-black text-lg leading-tight">{t.nav.brand}</p>
                                    <p className="text-green-400/70 text-xs font-semibold tracking-wider uppercase font-english">Elsalam Oils</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed">
                                {t.footer.description}
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                                {SOCIAL_LINKS.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 text-white/70 hover:text-white hover:scale-110 ${social.hoverBg}`}
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-green-500 rounded-full" />
                                {t.footer.quickLinksTitle}
                            </h4>
                            <ul className="space-y-2.5">
                                {t.footer.quickLinks.map((label, i) => (
                                    <li key={i}>
                                        <Link
                                            href={QUICK_LINK_HREFS[i]}
                                            className="group text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
                                        >
                                            <ArrowLeft className={`w-5 h-5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-green-400 ${!isRTL ? "rotate-180" : ""}`} />
                                            <span className="group-hover:translate-x-[-4px] transition-transform duration-300">{label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Products */}
                        <div>
                            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
                                {t.footer.productsTitle}
                            </h4>
                            <ul className="space-y-2.5">
                                {t.footer.productLinks.map((label, i) => (
                                    <li key={i}>
                                        <Link
                                            href={PRODUCT_LINK_HREFS[i]}
                                            className="group text-white/50 hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
                                        >
                                            <ArrowLeft className={`w-5 h-5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-400 ${!isRTL ? "rotate-180" : ""}`} />
                                            <span className="group-hover:translate-x-[-4px] transition-transform duration-300">{label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact Info */}
                        <div>
                            <h4 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-sky-500 rounded-full" />
                                {t.footer.addressTitle}
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">{t.footer.addressTitle}</p>
                                        <p className="text-white/50 text-xs">{t.footer.address}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">{t.contact.phone}</p>
                                        <p className="text-white/50 text-xs font-english" dir="ltr">{t.footer.phone}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">{t.contact.emailLabel}</p>
                                        <p className="text-white/50 text-xs font-english">{t.footer.email}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* ── Bottom Bar ── */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-white/60 transition-colors">{t.footer.privacy}</Link>
                            <Link href="/terms" className="hover:text-white/60 transition-colors">{t.footer.terms}</Link>
                        </div>
                    </div>
                </ScrollReveal>
            </Container>
        </footer>
    );
};
