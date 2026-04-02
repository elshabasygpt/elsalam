"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { CountdownTimer } from "@/components/atoms/CountdownTimer";
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface PromotionItem {
    id: number;
    title_ar: string;
    title_en: string;
    description_ar: string | null;
    description_en: string | null;
    badge_ar: string | null;
    badge_en: string | null;
    discount_type: string;
    original_price: number | null;
    promo_price: number | null;
    ends_at: string;
    featured_image: string | null;
    product?: {
        slug: string;
        name_ar: string;
        name_en: string;
    } | null;
}

interface PromoBannerProps {
    promotions: PromotionItem[];
    className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promotions, className }) => {
    const { locale, isRTL } = useLanguage();
    const [current, setCurrent] = useState(0);

    const NextIcon = isRTL ? ChevronLeft : ChevronRight;
    const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    useEffect(() => {
        if (promotions.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((p) => (p + 1) % promotions.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [promotions.length]);

    if (!promotions || promotions.length === 0) return null;

    const promo = promotions[current];
    const title = locale === "ar" ? promo.title_ar : promo.title_en;
    const desc = locale === "ar" ? promo.description_ar : promo.description_en;
    const badge = locale === "ar" ? promo.badge_ar : promo.badge_en;
    const productName = promo.product ? (locale === "ar" ? promo.product.name_ar : promo.product.name_en) : null;

    return (
        <div className={`relative rounded-2xl overflow-hidden ${className || ""}`}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
            </div>

            <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    {/* Content */}
                    <div className="flex-1 text-center md:text-start">
                        {badge && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 text-yellow-900 text-sm font-black rounded-full mb-4 shadow-lg">
                                <Sparkles className="w-5 h-5" />
                                {badge}
                            </span>
                        )}
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                            {title}
                        </h3>
                        {desc && (
                            <p className="text-white/70 text-sm md:text-base mb-4 max-w-lg">{desc}</p>
                        )}

                        {/* Price Display */}
                        {promo.original_price != null && promo.promo_price != null && (
                            <div className="flex items-baseline gap-3 mb-4 justify-center md:justify-start">
                                <span className="line-through text-white/40 text-lg font-medium">
                                    {promo.original_price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {locale === "ar" ? "ج.م" : "EGP"}
                                </span>
                                <span className="text-yellow-300 font-black text-2xl md:text-3xl">
                                    {promo.promo_price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {locale === "ar" ? "ج.م" : "EGP"}
                                </span>
                            </div>
                        )}

                        {promo.product?.slug && (
                            <Link
                                href={`/products/${promo.product.slug}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-700 font-bold rounded-xl hover:bg-gray-50 hover:shadow-lg active:scale-[0.97] transition-all duration-300 text-sm"
                            >
                                {locale === "ar" ? "تسوق الآن" : "Shop Now"}
                                <ArrowIcon className="w-5 h-5" />
                            </Link>
                        )}
                    </div>

                    {/* Countdown */}
                    <div className="shrink-0 flex flex-col items-center gap-3">
                        <span className="text-white/50 text-xs font-bold uppercase tracking-wider">
                            {locale === "ar" ? "ينتهي العرض خلال" : "Offer ends in"}
                        </span>
                        <CountdownTimer endDate={promo.ends_at} />
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            {promotions.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    {promotions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {promotions.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrent((p) => (p - 1 + promotions.length) % promotions.length)}
                        className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20"
                    >
                        <PrevIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrent((p) => (p + 1) % promotions.length)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20"
                    >
                        <NextIcon className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};
