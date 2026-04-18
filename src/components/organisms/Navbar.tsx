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
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>("products");
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
            hasMegaDropdown: true,
            subLinks: [
                { label: t.nav.menuOils || "زيوت الطعام", href: "/products", icon: Droplets },
                { label: t.nav.menuGhee || "السمن النباتي", href: "/products", icon: CakeSlice },
                { label: t.nav.menuShortening || "الشورتنج", href: "/products", icon: Flame },
            ]
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
                    <nav className="hidden lg:flex items-center justify-center flex-1 mx-1 xl:mx-4 h-full">
                        <ul className="flex items-center gap-0.5 xl:gap-1">
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
                                                "w-4 h-4 transition-transform duration-300",
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
                    <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0 relative z-50">
                        <div className={cn(
                            "flex items-center pl-2 xl:pl-4 border-l transition-colors duration-300",
                            isSolid ? "border-surface-light text-text-dark" : "border-white/20 text-white"
                        )}>
                            <LanguageSwitcher currentLocale={locale} onChange={setLocale} />
                        </div>
                        <Link
                            href="/contact"
                            className={cn(
                                "flex items-center justify-center gap-2 h-10 px-4 sm:px-5 rounded-lg font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn",
                                isSolid
                                    ? "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg"
                                    : "bg-white text-green-800 hover:bg-gray-50 shadow-lg"
                            )}
                        >
                            <span className="text-sm sm:text-base">{t.nav.getQuote}</span>
                            <ArrowLeft className={cn("w-4 h-4 sm:w-5 sm:h-5 transition-transform", isRTL ? "group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1 rotate-180")} strokeWidth={2.5} />
                        </Link>
                    </div>

                    {/* Mobile Toggle — hidden on small mobile (uses BottomNav), visible on tablet */}
                    {!isOpen && (
                        <button
                            className={cn(
                                "hidden md:flex lg:hidden p-2 rounded-lg transition-colors relative z-50",
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

            {/* Premium Cinematic Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Immersive Glass Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { delay: 0.2 } }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[90] lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Beautiful Floating Drawer */}
                        <motion.div
                            initial={{ x: isRTL ? "100%" : "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: isRTL ? "100%" : "-100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 28, stiffness: 200 }}
                            className={cn(
                                "fixed top-0 h-full w-[85vw] max-w-sm bg-surface-soft shadow-[0_0_80px_rgba(40,54,24,0.3)] z-[100] lg:hidden flex flex-col",
                                isRTL ? "right-0 rounded-l-[3rem]" : "left-0 rounded-r-[3rem]"
                            )}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-green/20 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent-gold/20 blur-[80px] rounded-full pointer-events-none" />

                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-6 relative z-10">
                                <Link 
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="font-black text-xl text-primary-dark flex items-center gap-2 drop-shadow-sm"
                                >
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                                    ) : (
                                        <div className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center border border-white/50">
                                            <Leaf className="w-6 h-6 text-primary-green" />
                                        </div>
                                    )}
                                    <span className="bg-gradient-to-r from-primary-dark to-primary-green bg-clip-text text-transparent">
                                        {t.nav.brand}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-md active:scale-95"
                                >
                                    <X className="w-6 h-6" strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Staggered Mobile Links */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10 custom-scrollbar">
                                <ul className="flex flex-col gap-3">
                                    {navLinks.map((link, idx) => (
                                        <motion.li 
                                            key={link.id}
                                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                        >
                                            {link.subLinks ? (
                                                <div className="p-1 mb-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                                    <button 
                                                        onClick={() => setExpandedMobileMenu(expandedMobileMenu === link.id ? null : link.id)}
                                                        className="w-full flex items-center justify-between px-5 py-4 text-[17px] font-black text-primary-dark bg-gray-50/50 hover:bg-gray-100/50 transition-colors focus:outline-none"
                                                    >
                                                        <span>{link.label}</span>
                                                        <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform duration-300", expandedMobileMenu === link.id ? "rotate-180 text-primary-green" : "")} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {expandedMobileMenu === link.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="overflow-hidden border-t border-gray-50"
                                                            >
                                                                <div className="p-2 space-y-1 bg-white">
                                                                    <Link 
                                                                        href={link.href} 
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-700 font-bold hover:bg-green-50 transition-colors"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                                                            <ArrowLeft className={cn("w-4 h-4 text-green-700", isRTL ? "" : "rotate-180")} />
                                                                        </div>
                                                                        {t.nav.menuViewAll || "عرض كل " + link.label}
                                                                    </Link>
                                                                    {link.subLinks.map((sub, i) => (
                                                                        <Link 
                                                                            key={i} 
                                                                            href={sub.href} 
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-green-50 hover:text-green-700 transition-colors"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                                                <sub.icon className="w-4 h-4 text-green-700" />
                                                                            </div>
                                                                            {sub.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "block px-5 py-4 rounded-2xl text-[17px] transition-all shadow-sm border",
                                                        isActive(link.href)
                                                            ? "bg-gradient-to-r from-primary-green to-[#3a4d23] text-white border-transparent font-black shadow-lg shadow-green-900/20"
                                                            : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-800 border-gray-100 font-black"
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mobile Footer */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-6 bg-white/60 backdrop-blur-md border-t border-surface-light mt-auto relative z-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-gray-100">
                                        <LanguageSwitcher currentLocale={locale} onChange={setLocale} />
                                    </div>
                                    <Link
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-accent-gold text-[#283618] font-black hover:bg-[#ebbb78] transition-all shadow-lg shadow-accent-gold/30 active:scale-[0.98] text-lg border border-accent-light"
                                    >
                                        <span>{t.nav.getQuote}</span>
                                        <ArrowLeft className={cn("w-5 h-5 transition-transform", isRTL ? "" : "rotate-180")} strokeWidth={3} />
                                    </Link>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
