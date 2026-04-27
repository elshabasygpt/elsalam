"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import {
    MapPin, Phone, Mail, Facebook, Linkedin, Instagram,
    ArrowLeft, Send, ChevronRight, ExternalLink, Leaf
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";

const QUICK_LINK_HREFS = ["/", "/about", "/quality", "/production", "/media", "/contact"];
const PRODUCT_LINK_HREFS = ["/products", "/products", "/products", "/b2b", "/export"];

export const Footer = () => {
    const { t, isRTL, locale } = useLanguage();
    const cmsFooter = usePageContent("footer");
    const [settings, setSettings] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        fetch("/api/public/settings", { cache: "no-store" })
            .then(res => res.json())
            .then(data => { if (data && !data.error) setSettings(data); })
            .catch(err => console.error("Failed to fetch settings config:", err));
    }, []);

    // ── Merge data priority: CMS → Settings → Fallback ──
    const displayPhone   = cmsFooter?.phone   || settings?.contactPhone || t.footer.phone;
    const displayEmail   = cmsFooter?.email   || settings?.contactEmail || t.footer.email;
    const cmsAddress     = getBilingualValue(cmsFooter, "address", locale);
    const settingsAddr   = locale === "ar" ? settings?.addressAr : settings?.addressEn;
    const displayAddress = cmsAddress || settingsAddr || t.footer.address;
    const displayDesc    = getBilingualValue(cmsFooter, "description", locale) || t.footer.description;
    const displayCopy    = getBilingualValue(cmsFooter, "copyright", locale)   || t.footer.copyright;
    const displayFB      = cmsFooter?.facebook  || settings?.facebookUrl  || "https://facebook.com/elsalamoils";
    const displayIG      = cmsFooter?.instagram || settings?.instagramUrl || "https://instagram.com/elsalamoils";
    const displayLI      = cmsFooter?.linkedin  || settings?.linkedinUrl  || "https://linkedin.com/company/elsalamoils";
    const displayBrand   = locale === "ar" ? (cmsFooter?.brandName || t.nav.brand) : (cmsFooter?.brandEn || t.nav.brand);
    const displayLogoStr = cmsFooter?.logo;

    const SOCIAL = [
        { icon: <Facebook  className="w-5 h-5" strokeWidth={1.8} />, href: displayFB, label: "Facebook",  color: "hover:bg-blue-600/80  hover:border-blue-500" },
        { icon: <Instagram className="w-5 h-5" strokeWidth={1.8} />, href: displayIG, label: "Instagram", color: "hover:bg-pink-600/80   hover:border-pink-500" },
        { icon: <Linkedin  className="w-5 h-5" strokeWidth={1.8} />, href: displayLI, label: "LinkedIn",  color: "hover:bg-sky-600/80    hover:border-sky-500" },
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) { setSubscribed(true); setEmail(""); }
    };

    return (
        <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a1a0f 0%, #061209 60%, #040d07 100%)" }}>

            {/* ── Decorative top glow ── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-24 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* ── Subtle radial pattern ── */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #22c55e 1px, transparent 0)", backgroundSize: "48px 48px" }} />

            {/* ════════════════════════════════════════════
                CTA STRIP
            ════════════════════════════════════════════ */}
            <div className="relative border-b border-green-500/10"
                style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)" }}>
                {/* glow blob */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 left-1/4 w-64 h-32 bg-green-300/10 blur-3xl rounded-full" />
                    <div className="absolute -bottom-10 right-1/4 w-64 h-32 bg-emerald-300/10 blur-3xl rounded-full" />
                </div>
                <Container className="relative py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className={`text-center ${isRTL ? "md:text-right" : "md:text-left"}`}>
                        <p className="text-white font-black text-xl md:text-2xl tracking-tight leading-snug">
                            {t.footer.ctaTitle}
                        </p>
                        <p className="text-green-200/80 text-sm mt-1">{t.footer.ctaSubtitle}</p>
                    </div>
                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-green-900 font-bold rounded-2xl
                                   hover:bg-green-50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]
                                   hover:-translate-y-0.5 active:scale-[0.97]
                                   transition-all duration-300 shadow-xl text-sm whitespace-nowrap"
                    >
                        <Send className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        {t.footer.ctaButton}
                    </Link>
                </Container>
            </div>

            {/* ════════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════════ */}
            <Container className="pt-16 pb-4 mobile-bottom-offset">
                <ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14 pb-14 border-b border-white/[0.06]">

                        {/* ── Col 1: Brand + About ─────────────────── */}
                        <div className="md:col-span-4 space-y-6">
                            {/* Logo + Name */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-green-500/20 shadow-lg shadow-green-900/30 flex-shrink-0 bg-white/5">
                                    {displayLogoStr ? (
                                        <img src={displayLogoStr} alt={displayBrand} className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Image
                                            src="/icon.png"
                                            alt={displayBrand}
                                            fill
                                            className="object-contain p-2"
                                            sizes="80px"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-tight">{displayBrand}</p>
                                    <p className="text-green-400/70 text-[11px] font-semibold tracking-widest uppercase font-english mt-0.5">
                                        Elsalam Oils
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="w-5 h-0.5 bg-gradient-to-r from-green-500 to-transparent rounded-full" />
                                        <span className="text-green-500/50 text-[9px] font-bold uppercase tracking-widest font-english">Est. 2000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-white/40 text-sm leading-relaxed">
                                {displayDesc}
                            </p>

                            {/* Stats pills */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { val: "25+", label: locale === "ar" ? "عاماً" : "Years" },
                                    { val: "500T", label: locale === "ar" ? "يومياً" : "Daily" },
                                    { val: "15+", label: locale === "ar" ? "دولة" : "Countries" },
                                ].map((s, i) => (
                                    <div key={i}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm">
                                        <span className="text-green-400 font-black text-sm font-english">{s.val}</span>
                                        <span className="text-white/30 text-xs">{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Social icons */}
                            <div className="flex items-center gap-3 pt-1">
                                {SOCIAL.map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className={`w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center
                                                    text-white/50 hover:text-white transition-all duration-300
                                                    hover:scale-110 hover:shadow-lg ${s.color}`}>
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Col 2: Quick Links ───────────────────── */}
                        <div className="md:col-span-2">
                            <h4 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                                <span className="w-1 h-4 bg-green-500 rounded-full" />
                                {t.footer.quickLinksTitle}
                            </h4>
                            <ul className="space-y-3">
                                {t.footer.quickLinks.map((label, i) => (
                                    <li key={i}>
                                        <Link href={QUICK_LINK_HREFS[i]}
                                            className="group flex items-center gap-2 text-white/40 hover:text-white text-sm transition-all duration-300">
                                            <ChevronRight className={`w-5 h-5 text-green-500/0 group-hover:text-green-400 transition-all duration-300 flex-shrink-0 ${!isRTL ? "rotate-180" : ""}`} />
                                            <span className="group-hover:translate-x-0.5 transition-transform duration-300">{label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Col 3: Products ──────────────────────── */}
                        <div className="md:col-span-2">
                            <h4 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                                {t.footer.productsTitle}
                            </h4>
                            <ul className="space-y-3">
                                {t.footer.productLinks.map((label, i) => (
                                    <li key={i}>
                                        <Link href={PRODUCT_LINK_HREFS[i]}
                                            className="group flex items-center gap-2 text-white/40 hover:text-white text-sm transition-all duration-300">
                                            <ChevronRight className={`w-5 h-5 text-amber-500/0 group-hover:text-amber-400 transition-all duration-300 flex-shrink-0 ${!isRTL ? "rotate-180" : ""}`} />
                                            <span className="group-hover:translate-x-0.5 transition-transform duration-300">{label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Col 4: Contact + Newsletter ──────────── */}
                        <div className="md:col-span-4 space-y-6">
                            {/* Contact */}
                            <div>
                                <h4 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-sky-500 rounded-full" />
                                    {t.footer.addressTitle}
                                </h4>
                                <ul className="space-y-3.5">
                                    {[
                                        {
                                            icon: <MapPin className="w-6 h-6" strokeWidth={1.5} />,
                                            label: t.footer.addressTitle,
                                            value: displayAddress,
                                            color: "text-green-400",
                                            bg: "bg-green-500/10"
                                        },
                                        {
                                            icon: <Phone className="w-6 h-6" strokeWidth={1.5} />,
                                            label: t.contact.phone,
                                            value: displayPhone,
                                            color: "text-green-400",
                                            bg: "bg-green-500/10",
                                            ltr: true,
                                        },
                                        {
                                            icon: <Mail className="w-6 h-6" strokeWidth={1.5} />,
                                            label: t.contact.emailLabel,
                                            value: displayEmail,
                                            color: "text-green-400",
                                            bg: "bg-green-500/10",
                                            ltr: true,
                                        },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <span className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                                                {item.icon}
                                            </span>
                                            <div>
                                                <p className="text-white/50 text-xs font-medium mb-0.5">{item.label}</p>
                                                <p className={`text-white/70 text-xs ${item.ltr ? "font-english" : ""}`} dir={item.ltr ? "ltr" : undefined}>
                                                    {item.value}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Newsletter */}
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                <p className="text-white font-semibold text-sm mb-1">{t.footer.newsletterTitle}</p>
                                <p className="text-white/35 text-xs mb-3">{t.footer.newsletterSubtitle}</p>
                                {subscribed ? (
                                    <div className="flex items-center gap-2 text-green-400 text-sm py-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{locale === "ar" ? "تم الاشتراك بنجاح!" : "Subscribed!"}</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder={t.footer.newsletterPlaceholder}
                                            required
                                            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white text-xs placeholder-white/25
                                                       focus:outline-none focus:border-green-500/50 focus:bg-white/12 transition-all duration-200"
                                        />
                                        <button type="submit"
                                            className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold
                                                       transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex-shrink-0">
                                            <Send className="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ════════════════════════════════════════════
                        BOTTOM BAR
                    ════════════════════════════════════════════ */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Left: Copyright */}
                        <div className="flex items-center gap-2.5 text-white/25 text-xs">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <Leaf className="w-5 h-5 text-green-500/60" />
                            </div>
                            <span>© {new Date().getFullYear()} {displayCopy}</span>
                        </div>

                        {/* Center: Certified badges */}
                        <div className="hidden md:flex items-center gap-2">
                            {[
                                { label: "ISO 9001",   color: "text-sky-400",   bg: "bg-sky-500/10",   border: "border-sky-500/20" },
                                { label: "ISO 22000",  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                                { label: "HACCP",      color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
                                { label: "Halal ✓",    color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
                            ].map((cert, i) => (
                                <span key={i}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${cert.border} ${cert.bg} ${cert.color} text-[11px] font-bold font-english tracking-wider transition-all duration-300 hover:scale-105`}>
                                    {cert.label}
                                </span>
                            ))}
                        </div>

                        {/* Right: Policy links */}
                        <div className="flex items-center gap-5 text-white/25 text-xs">
                            <Link href="/privacy" className="hover:text-white/60 transition-colors duration-200">{t.footer.privacy}</Link>
                            <span className="w-px h-3 bg-white/10" />
                            <Link href="/terms" className="hover:text-white/60 transition-colors duration-200">{t.footer.terms}</Link>
                        </div>
                    </div>

                </ScrollReveal>
            </Container>

            {/* ── Bottom accent line ── */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
        </footer>
    );
};
