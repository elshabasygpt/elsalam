"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n-context";
import { Package } from "lucide-react";

interface PackagingItem {
    id?: number;
    size_ar: string;
    size_en: string;
    price: number | null;
}

interface PackagingPriceTableProps {
    packagings: PackagingItem[];
    className?: string;
}

export const PackagingPriceTable: React.FC<PackagingPriceTableProps> = ({ packagings, className }) => {
    const { locale, t } = useLanguage();

    if (!packagings || packagings.length === 0) return null;

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className || ""}`}>
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <Package className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">
                    {locale === "ar" ? "التعبئات والأسعار" : "Packaging & Prices"}
                </h3>
            </div>
            <div className="divide-y divide-gray-50">
                {packagings.map((pkg, i) => {
                    const size = locale === "ar" ? pkg.size_ar : pkg.size_en;
                    return (
                        <div
                            key={pkg.id || i}
                            className="flex items-center justify-between px-6 py-4 hover:bg-green-50/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0" />
                                <span className="text-gray-700 font-medium">{size}</span>
                            </div>
                            <div className="font-bold">
                                {pkg.price != null ? (
                                    <span className="text-green-800">
                                        {pkg.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
                                        <span className="text-gray-400 text-sm font-normal ms-1">
                                            {locale === "ar" ? "ج.م" : "EGP"}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-sm">
                                        {locale === "ar" ? "اطلب عرض سعر" : "Request Quote"}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
