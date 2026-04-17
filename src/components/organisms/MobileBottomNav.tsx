"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, Phone, Info, ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { id: "home",     href: "/",        iconAr: "🏠", icon: Home,    labelKey: "home"     },
    { id: "products", href: "/products", iconAr: "🧴", icon: Package, labelKey: "products" },
    { id: "contact",  href: "/contact",  iconAr: "📞", icon: Phone,   labelKey: "contact"  },
    { id: "about",    href: "/about",    iconAr: "🌿", icon: Info,    labelKey: "about"    },
] as const;

export function MobileBottomNav() {
    const pathname  = usePathname();
    const { t, isRTL } = useLanguage();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Hide on scroll down, show on scroll up — just like native apps
    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            if (currentY < 60) {
                setVisible(true);
            } else {
                setVisible(currentY < lastScrollY.current);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Don't render on admin pages
    if (pathname.startsWith("/admin")) return null;

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const labels: Record<string, string> = {
        home:     isRTL ? "الرئيسية" : "Home",
        products: isRTL ? "المنتجات" : "Products",
        contact:  isRTL ? "تواصل"    : "Contact",
        about:    isRTL ? "عن السلام" : "About",
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    key="bottom-nav"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="
                        fixed bottom-0 inset-x-0 z-50
                        md:hidden
                        bg-white/95 backdrop-blur-xl
                        border-t border-slate-200/80
                        shadow-[0_-4px_24px_rgba(0,0,0,0.08)]
                        pb-[env(safe-area-inset-bottom)]
                    "
                    style={{ WebkitBackdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-stretch h-16">
                        {NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            const Icon   = item.icon;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`
                                        flex-1 flex flex-col items-center justify-center gap-0.5
                                        relative select-none
                                        transition-all duration-200 active:scale-90
                                        ${active ? "text-green-600" : "text-slate-400"}
                                    `}
                                >
                                    {/* Active pill indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-green-500"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon with scale animation */}
                                    <motion.div
                                        animate={{ scale: active ? 1.2 : 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    >
                                        <Icon
                                            className={`w-5 h-5 transition-all ${
                                                active
                                                    ? "stroke-green-600 fill-green-50"
                                                    : "stroke-slate-400"
                                            }`}
                                            strokeWidth={active ? 2.5 : 1.8}
                                        />
                                    </motion.div>

                                    {/* Label */}
                                    <span className={`text-[10px] font-bold leading-none transition-all ${
                                        active ? "text-green-600" : "text-slate-400"
                                    }`}>
                                        {labels[item.labelKey]}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
