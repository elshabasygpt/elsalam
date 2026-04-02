"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { cn } from "@/utils/classnames";
import { Leaf, Menu, X, ChevronDown, ArrowLeft, Droplets, CakeSlice, Flame, ShieldCheck, Factory, Handshake, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { locale, setLocale, t, isRTL } = useLanguage();

    useEffect(() => {
        fetch("/api/site-logo")
            .then(r => r.json())
            .then(d => { if (d.logoUrl) setLogoUrl(d.logoUrl); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    const navLinks = [
        { id: "home", label: t.nav.home, href: "/" },
        { id: "about", label: t.nav.about, href: "/about" },
        {
            id: "products",
            label: t.nav.products,
            href: "/products",
            hasMegaDropdown: true
        },
        {
            id: "quality_production",
            label: t.nav.qualityAndProduction,
            href: "/quality",
            hasSimpleDropdown: true,
            subLinks: [
                { label: t.nav.quality, href: "/quality", icon: ShieldCheck },
                { label: t.nav.production, href: "/production", icon: Factory },
            ]
        },
        {
            id: "partnerships_export",
            label: t.nav.partnersAndExport,
            href: "/b2b",
            hasSimpleDropdown: true,
            subLinks: [
                { label: t.nav.b2b, href: "/b2b", icon: Handshake },
                { label: t.nav.export, href: "/export", icon: Globe },
            ]
        },
        { id: "media", label: t.nav.media, href: "/media" },
        { id: "contact", label: (t.nav as any).contact || "تواصل معنا", href: "/contact" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    // Solid Background classes vs Transparent background classes
    const isSolid = scrolled || !isHome || isOpen;
    const navTextClass = isSolid ? "text-gray-900" : "text-white";
    const navHoverClass = isSolid ? "hover:text-green-700" : "hover:text-gray-200";

    return (
        <header className={cn(
            "fixed top-0 w-full transition-all duration-500 pt-3 px-3 sm:px-6 lg:px-8",
            isOpen ? "z-[100]" : "z-50"
        )}>
            <Container className="max-w-7xl">
                <div
                    className={cn(
                        "flex items-center justify-between h-14 sm:h-16 md:h-20 px-4 sm:px-6 rounded-2xl transition-all duration-500 relative",
                        isSolid
                            ? "bg-white shadow-lg border border-gray-200"
                            : "bg-black/20 backdrop-blur-md border border-white/20 shadow-md"
                    )}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0 relative z-50">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden",
                            isSolid ? "bg-primary-green/10 group-hover:bg-primary-green/20" : "bg-white/20 group-hover:bg-white/30"
                        )}>
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <Leaf className={cn("w-6 h-6", isSolid ? "text-primary-green" : "text-white")} />
                            )}
                        </div>
                        <Typography variant="h4" as="span" weight="bold" className={cn(
                            "transition-colors duration-300 font-bold tracking-tight",
                            isSolid ? "text-primary-dark" : "text-white drop-shadow-md"
                        )}>
                            {t.nav.brand}
                        </Typography>
                    </Link>

                    {/* Center Desktop Navigation */}
                    <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 h-full">
                        <ul className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <li
                                    key={link.id}
                                    className="relative h-full flex items-center group"
                                    onMouseEnter={() => (link.hasMegaDropdown || link.hasSimpleDropdown) && setActiveDropdown(link.id)}
                                    onMouseLeave={() => (link.hasMegaDropdown || link.hasSimpleDropdown) && setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center gap-1 whitespace-nowrap peer",
                                            isActive(link.href)
                                                ? (isSolid ? "text-green-700 bg-green-50" : "text-white bg-white/20")
                                                : cn(navTextClass, navHoverClass)
                                        )}
                                    >
                                        {link.label}
                                        {(link.hasMegaDropdown || link.hasSimpleDropdown) && (
                                            <ChevronDown className={cn(
                                                "w-5 h-5 transition-transform duration-300",
                                                activeDropdown === link.id ? "rotate-180" : ""
                                            )} />
                                        )}
                                    </Link>

                                    {/* ── Mega Dropdown for Products ── */}
                                    {link.hasMegaDropdown && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[540px] z-50 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0">
                                            <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                                                {/* Product Category Cards */}
                                                <div className="grid grid-cols-3 gap-0 p-2">
                                                    <Link href="/products" className="group/card p-4 rounded-xl hover:bg-green-50 transition-all duration-300 text-center flex flex-col items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover/card:bg-green-200 group-hover/card:scale-110 transition-all duration-300">
                                                            <Droplets className="w-6 h-6 text-green-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm mb-1">{t.nav.menuOils}</p>
                                                            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{t.nav.menuOilsDesc}</p>
                                                        </div>
                                                    </Link>

                                                    <Link href="/products" className="group/card p-4 rounded-xl hover:bg-amber-50 transition-all duration-300 text-center flex flex-col items-center gap-3 border-x border-gray-100">
                                                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover/card:bg-amber-200 group-hover/card:scale-110 transition-all duration-300">
                                                            <CakeSlice className="w-6 h-6 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm mb-1">{t.nav.menuGhee}</p>
                                                            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{t.nav.menuGheeDesc}</p>
                                                        </div>
                                                    </Link>

                                                    <Link href="/products" className="group/card p-4 rounded-xl hover:bg-orange-50 transition-all duration-300 text-center flex flex-col items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover/card:bg-orange-200 group-hover/card:scale-110 transition-all duration-300">
                                                            <Flame className="w-6 h-6 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm mb-1">{t.nav.menuShortening}</p>
                                                            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{t.nav.menuShorteningDesc}</p>
                                                        </div>
                                                    </Link>
                                                </div>

                                                {/* CTA Footer Strip */}
                                                <div className="bg-green-50 border-t border-green-100 px-5 py-3 flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">{t.nav.menuViewAllHint}</span>
                                                    <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors group/cta">
                                                        {t.nav.menuViewAll}
                                                        <ArrowLeft className={cn("w-5 h-5 transition-transform", isRTL ? "group-hover/cta:-translate-x-1" : "group-hover/cta:translate-x-1 rotate-180")} strokeWidth={2} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Simple Dropdown for Pages ── */}
                                    {link.hasSimpleDropdown && link.subLinks && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 z-50 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0">
                                            <div className="bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden py-2 flex flex-col">
                                                {link.subLinks.map((sub, i) => (
                                                    <Link key={i} href={sub.href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-green-50 transition-colors group/sub h-full">
                                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0 group-hover/sub:bg-green-200 transition-colors">
                                                            <sub.icon className="w-5 h-5 text-green-700" />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-gray-700 group-hover/sub:text-green-700 transition-colors">{sub.label}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right Call-to-Action & Utils */}
                    <div className="hidden lg:flex items-center gap-4 shrink-0 relative z-50">
                        <div className={cn(
                            "flex items-center pl-4 border-l transition-colors duration-300",
                            isSolid ? "border-surface-light text-text-dark" : "border-white/20 text-white"
                        )}>
                            <LanguageSwitcher currentLocale={locale} onChange={setLocale} />
                        </div>
                        <Link
                            href="/contact"
                            className={cn(
                                "flex items-center justify-center gap-2 h-10 px-5 rounded-lg font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn",
                                isSolid
                                    ? "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg"
                                    : "bg-white text-green-800 hover:bg-gray-50 shadow-lg"
                            )}
                        >
                            <span className="text-base">{t.nav.getQuote}</span>
                            <ArrowLeft className={cn("w-5 h-5 transition-transform", isRTL ? "group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1 rotate-180")} strokeWidth={2.5} />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    {!isOpen && (
                        <button
                            className={cn(
                                "lg:hidden p-2 rounded-lg transition-colors relative z-50",
                                isSolid ? "text-primary-dark hover:bg-surface-soft" : "text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                            )}
                            onClick={() => setIsOpen(true)}
                            aria-label="Toggle Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </Container>

            {/* Premium Mobile Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-md z-[90] lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: isRTL ? "100%" : "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: isRTL ? "100%" : "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl z-[100] lg:hidden flex flex-col",
                                isRTL ? "right-0" : "left-0"
                            )}
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-6 border-b border-surface-light">
                                <span className="font-bold text-lg text-primary-dark flex items-center gap-2">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
                                    ) : (
                                        <Leaf className="w-5 h-5 text-primary-green" />
                                    )}
                                    {t.nav.brand}
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-surface-soft text-text-dark hover:bg-surface-light transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <ul className="flex flex-col gap-2">
                                    {navLinks.map((link) => (
                                        <li key={link.id}>
                                            {link.subLinks ? (
                                                <div className="p-2 space-y-1">
                                                    <div className={cn("block px-4 py-2 rounded-xl text-lg font-bold text-primary-dark cursor-pointer")}>
                                                        {link.label}
                                                    </div>
                                                    <div className="pl-6 space-y-2 border-l-2 border-surface-light ml-4">
                                                        {link.subLinks.map((sub, i) => (
                                                            <Link key={i} href={sub.href} className="block py-2 text-text-dark font-medium hover:text-primary-green transition-colors">
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        "block p-4 rounded-xl text-lg transition-colors border border-transparent",
                                                        isActive(link.href)
                                                            ? "bg-primary-green/5 text-primary-green border-primary-green/10 font-bold"
                                                            : "text-primary-dark hover:bg-surface-soft hover:border-surface-light font-medium"
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mobile Footer */}
                            <div className="p-5 border-t border-surface-light bg-surface-soft mt-auto space-y-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                                <LanguageSwitcher currentLocale={locale} onChange={setLocale} />
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-2.5 w-full p-3.5 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 transition-colors shadow-md active:scale-[0.97] text-base"
                                >
                                    <span>{t.nav.getQuote}</span>
                                    <ArrowLeft className={cn("w-5 h-5 transition-transform", isRTL ? "" : "rotate-180")} strokeWidth={2.5} />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
