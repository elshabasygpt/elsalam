"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, Phone, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { id: "home",     href: "/",        icon: Home,    labelAr: "الرئيسية", labelEn: "Home"     },
    { id: "products", href: "/products", icon: Package, labelAr: "المنتجات", labelEn: "Products" },
    { id: "contact",  href: "/contact",  icon: Phone,   labelAr: "تواصل",    labelEn: "Contact"  },
    { id: "about",    href: "/about",    icon: Info,    labelAr: "عن السلام", labelEn: "About"   },
] as const;

export function MobileBottomNav() {
    const pathname = usePathname();
    const { isRTL } = useLanguage();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

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

    if (pathname.startsWith("/admin")) return null;

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
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
                    className="fixed bottom-0 inset-x-0 z-50 md:hidden"
                    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                    {/* Glass card with strong border */}
                    <div
                        className="mx-3 mb-3 rounded-2xl overflow-hidden"
                        style={{
                            background: "rgba(255,255,255,0.98)",
                            boxShadow: "0 -2px 0 0 #e2e8f0, 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
                            border: "1.5px solid rgba(226,232,240,0.9)",
                        }}
                    >
                        <div className="flex items-stretch h-[62px]">
                            {NAV_ITEMS.map((item) => {
                                const active = isActive(item.href);
                                const Icon   = item.icon;
                                const label  = isRTL ? item.labelAr : item.labelEn;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                                        style={{ WebkitTapHighlightColor: "transparent" }}
                                    >
                                        {/* Active background bubble */}
                                        {active && (
                                            <motion.div
                                                layoutId="nav-bubble"
                                                className="absolute inset-x-1 inset-y-1.5 rounded-xl bg-green-50"
                                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <motion.div
                                            animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                            className="relative z-10"
                                        >
                                            <Icon
                                                style={{
                                                    width: 22,
                                                    height: 22,
                                                    color: active ? "#16a34a" : "#475569",
                                                    strokeWidth: active ? 2.5 : 2,
                                                }}
                                            />
                                        </motion.div>

                                        {/* Label */}
                                        <span
                                            className="relative z-10 leading-none font-bold"
                                            style={{
                                                fontSize: 10,
                                                color: active ? "#16a34a" : "#475569",
                                            }}
                                        >
                                            {label}
                                        </span>

                                        {/* Active dot */}
                                        {active && (
                                            <motion.span
                                                layoutId="nav-dot"
                                                className="absolute bottom-1.5 w-1 h-1 rounded-full bg-green-500"
                                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
