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
import { useCartStore } from "@/lib/store/useCartStore";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import { ShoppingBag } from "lucide-react";

export const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>("products");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { locale, setLocale, t, isRTL } = useLanguage();
    const { getTotalItems, setIsOpen: setCartOpen } = useCartStore();

    useEffect(() => {
        fetch("/api/site-logo")
            .then(r => r.json())
            .then(d => { if (d.logoUrl) setLogoUrl(d.logoUrl); })
            .catch(() => {});
            
        fetch("/api/public/categories")
            .then(r => r.json())
            .then(d => { if (d.data) setFetchedCategories(d.data); })
            .catch(() => {});
            
        setIsMounted(true);
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
            subLinks: fetchedCategories.length > 0 
                ? fetchedCategories.map((c: any) => ({
                    label: isRTL ? c.name_ar : c.name_en,
                    href: `/products?category=${c.slug}`,
                    icon: Droplets, // Fallback icon for mobile
                    imageUrl: c.imageUrl,
                    slug: c.slug
                })) 
                : [
                    { label: t.nav.menuOils || "زيوت الطعام", href: "/products", icon: Droplets, slug: "oils" },
                    { label: t.nav.menuGhee || "السمن النباتي", href: "/products", icon: CakeSlice, slug: "ghee" },
                    { label: t.nav.menuShortening || "الشورتنج", href: "/products", icon: Flame, slug: "shortening" },
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
    const forceSolidBar = scrolled || !isHome || isOpen;
    const navTextClass = forceSolidBar ? "text-gray-900" : "text-white";
    const navHoverClass = forceSolidBar ? "hover:text-green-700" : "hover:text-gray-200";

    return (
        <>
            <header className={cn(
                "fixed top-0 w-full transition-all duration-500",
                forceSolidBar ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200 py-1" : "pt-2 sm:pt-3 px-2 sm:px-4 lg:px-6",
                isOpen ? "z-[100]" : "z-50"
            )}>
                <Container className="max-w-[1480px]">
                <div
                    className={cn(
                        "flex items-center justify-between min-h-[3.5rem] sm:min-h-[4rem] md:h-[4.5rem] lg:h-[4.5rem] py-2 md:py-0 transition-all duration-500 relative",
                        !forceSolidBar 
                            ? "bg-black/20 backdrop-blur-md border border-white/20 shadow-md rounded-[1.25rem] px-3 sm:px-4 lg:px-6"
                            : "px-2 lg:px-0"
                    )}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 lg:gap-3 group shrink-0 relative z-50">
                        <div className={cn(
                            "w-11 h-11 md:w-[3.75rem] md:h-[3.75rem] min-w-[2.75rem] md:min-w-[3.75rem] rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden shrink-0",
                            forceSolidBar ? "bg-primary-green/10 group-hover:bg-primary-green/20" : "bg-white/20 group-hover:bg-white/30"
                        )}>
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain object-center p-0.5 scale-110" />
                            ) : (
                                <Leaf className={cn("w-7 h-7 md:w-10 md:h-10 scale-110", forceSolidBar ? "text-primary-green" : "text-white")} />
                            )}
                        </div>
                        <div className="flex flex-col justify-center">
                            <Typography variant="h4" as="span" weight="bold" className={cn(
                                "transition-colors duration-300 font-black tracking-tight leading-none",
                                forceSolidBar ? "text-primary-dark" : "text-white drop-shadow-md"
                            )}>
                                {t.nav.brand}
                            </Typography>
                            <span className={cn(
                                "text-[10px] leading-tight font-bold mt-1 tracking-wide opacity-90 block",
                                forceSolidBar ? "text-primary-green" : "text-white/90"
                            )}>
                                {isRTL ? "لعصر وإستخلاص الزيوت النباتية" : "For Extracting Vegetable Oils"}
                            </span>
                        </div>
                    </Link>

                    {/* Center Desktop Navigation */}
                    <nav className="hidden xl:flex items-center justify-center flex-1 mx-1 lg:mx-4 h-full">
                        <ul className="flex items-center gap-1 xl:gap-1.5">
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
                                            "px-2.5 xl:px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center gap-1 whitespace-nowrap peer",
                                            isActive(link.href)
                                                ? (forceSolidBar ? "text-green-700 bg-green-50" : "text-white bg-white/20")
                                                : cn(navTextClass, navHoverClass)
                                        )}
                                    >
                                        {link.label}
                                        {(link.hasMegaDropdown || link.hasSimpleDropdown) && (
                                            <ChevronDown 
                                                className={cn(
                                                    "w-[18px] h-[18px] transition-transform duration-300",
                                                    activeDropdown === link.id ? "rotate-180" : ""
                                                )} 
                                                strokeWidth={2.5}
                                            />
                                        )}
                                    </Link>

                                    {/* ── Mega Dropdown for Products ── */}
                                    {link.hasMegaDropdown && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[540px] z-50 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0">
                                            <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                                                {/* Product Category Cards dynamically mapped */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 p-2">
                                                    {link.subLinks?.map((subLink: any, idx: number) => {
                                                        const IconComponent = subLink.icon;
                                                        return (
                                                            <Link key={idx} href={subLink.href} className="group/card p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300 text-center flex flex-col items-center gap-3 border border-transparent hover:border-green-100">
                                                                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center group-hover/card:bg-white group-hover/card:scale-110 group-hover/card:shadow-sm transition-all duration-300 overflow-hidden border border-slate-100 p-1.5">
                                                                    {subLink.imageUrl ? (
                                                                        <img src={subLink.imageUrl} alt={subLink.label} className="w-full h-full object-contain" />
                                                                    ) : (
                                                                        IconComponent && <IconComponent className="w-7 h-7 text-green-700" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-sm mb-1">{subLink.label}</p>
                                                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">استكشف المنتجات</p>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
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
                    <div className="hidden xl:flex items-center gap-2 xl:gap-3 shrink-0 relative z-50">
                        {/* Cart Button */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className={cn(
                                "relative p-3 rounded-[1rem] transition-all duration-300 hover:scale-105 active:scale-95 group/cart",
                                forceSolidBar ? "bg-gray-50 hover:bg-green-50 text-gray-700" : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                            )}
                        >
                            <ShoppingBag className={cn("w-6 h-6", forceSolidBar ? "group-hover/cart:text-green-700" : "")} strokeWidth={2} />
                            {(isMounted && getTotalItems() > 0) && (
                                <span className={cn(
                                    "absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md border-2",
                                    forceSolidBar ? "bg-red-500 border-white" : "bg-accent-gold text-primary-dark border-transparent"
                                )}>
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>

                        <div className={cn(
                            "flex items-center pl-2 xl:pl-3 border-l transition-colors duration-300",
                            forceSolidBar ? "border-surface-light text-text-dark" : "border-white/20 text-white"
                        )}>
                            <LanguageSwitcher currentLocale={locale} onChange={setLocale} />
                        </div>
                        <Link
                            href="/contact"
                            className={cn(
                                "flex items-center justify-center gap-2 h-9 lg:h-10 px-4 xl:px-5 rounded-lg font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn",
                                forceSolidBar
                                    ? "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg"
                                    : "bg-white text-green-800 hover:bg-gray-50 shadow-lg"
                            )}
                        >
                            <span className="text-sm whitespace-nowrap">{t.nav.getQuote}</span>
                            <ArrowLeft className={cn("w-5 h-5 transition-transform shrink-0", isRTL ? "group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1 rotate-180")} strokeWidth={2.5} />
                        </Link>
                    </div>

                    {/* Mobile Toggle & Cart — visible on all mobile and tablet sizes up to xl */}
                    {!isOpen && (
                        <div className="flex xl:hidden items-center gap-2 relative z-50">
                            {/* Mobile Cart Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className={cn(
                                    "relative p-2.5 rounded-xl transition-colors",
                                    forceSolidBar ? "text-primary-dark hover:bg-surface-soft bg-gray-50/80" : "text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                )}
                            >
                                <ShoppingBag className="w-6 h-6" strokeWidth={2} />
                                {(isMounted && getTotalItems() > 0) && (
                                    <span className={cn(
                                        "absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md border-2",
                                        forceSolidBar ? "bg-red-500 border-white" : "bg-accent-gold text-primary-dark border-transparent"
                                    )}>
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>
                            
                            <button
                                className={cn(
                                    "flex p-2 rounded-lg transition-colors",
                                    forceSolidBar ? "text-primary-dark hover:bg-surface-soft" : "text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                )}
                                onClick={() => setIsOpen(true)}
                                aria-label="Toggle Menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
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
                                "fixed top-0 h-full w-[85vw] max-w-sm bg-surface-soft shadow-[0_0_80px_rgba(40,54,24,0.3)] z-[100] xl:hidden flex flex-col",
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
                                        <div className="w-12 h-12 min-w-[3rem] bg-white shadow-md rounded-2xl p-0.5 flex shrink-0 items-center justify-center overflow-hidden">
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-sm scale-110" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 min-w-[3rem] bg-white shadow-xl rounded-2xl flex items-center justify-center border border-white/50 shrink-0">
                                            <Leaf className="w-8 h-8 text-primary-green scale-110" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center">
                                        <span className="bg-gradient-to-r from-primary-dark to-primary-green bg-clip-text text-transparent leading-none">
                                            {t.nav.brand}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-bold mt-1 tracking-wide text-primary-green/80">
                                            {isRTL ? "لعصر وإستخلاص الزيوت النباتية" : "For Extracting Vegetable Oils"}
                                        </span>
                                    </div>
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
                                                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                                                            <ArrowLeft className={cn("w-5 h-5 text-green-700", isRTL ? "" : "rotate-180")} />
                                                                        </div>
                                                                        {t.nav.menuViewAll || "عرض كل " + link.label}
                                                                    </Link>
                                                                    {link.subLinks.map((sub: any, i) => (
                                                                        <Link 
                                                                            key={i} 
                                                                            href={sub.href} 
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-green-50 hover:text-green-700 transition-colors"
                                                                        >
                                                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0 overflow-hidden p-1 border border-green-200">
                                                                                {sub.imageUrl ? (
                                                                                    <img src={sub.imageUrl} alt={sub.label} className="w-full h-full object-contain" />
                                                                                ) : (
                                                                                    sub.icon && <sub.icon className="w-5 h-5 text-green-700" />
                                                                                )}
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

            {/* Mount CartDrawer outside of the header to prevent backdrop-filter containing block issues */}
            <CartDrawer />
        </>
    );
};
