"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";

interface PriceTagProps {
    price: number | null;
    originalPrice?: number | null;
    promoPrice?: number | null;
    unit?: string;
    unitAr?: string;
    unitEn?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
    price,
    originalPrice,
    promoPrice,
    unit,
    unitAr,
    unitEn,
    size = "md",
    className = "",
}) => {
    const { locale } = useLanguage();

    const displayUnit = unit || (locale === "ar" ? unitAr : unitEn);
    const hasPromo = promoPrice != null && originalPrice != null;
    const displayPrice = hasPromo ? promoPrice : price;

    if (displayPrice == null) {
        return (
            <span className={`font-bold text-green-700 ${size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"} ${className}`}>
                {locale === "ar" ? "اطلب عرض سعر" : "Request Quote"}
            </span>
        );
    }

    const sizeClasses = {
        sm: { price: "text-lg", unit: "text-xs", original: "text-xs" },
        md: { price: "text-2xl", unit: "text-sm", original: "text-sm" },
        lg: { price: "text-3xl md:text-4xl", unit: "text-base", original: "text-base" },
    };

    const s = sizeClasses[size];

    return (
        <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
            {hasPromo && (
                <span className={`line-through text-gray-400 font-medium ${s.original}`}>
                    {originalPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                </span>
            )}
            <span className={`font-black ${hasPromo ? "text-red-600" : "text-green-800"} ${s.price}`}>
                {displayPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            </span>
            <span className={`text-gray-500 font-medium ${s.unit}`}>
                {locale === "ar" ? "ج.م" : "EGP"}
                {displayUnit && ` / ${displayUnit}`}
            </span>
        </div>
    );
};
