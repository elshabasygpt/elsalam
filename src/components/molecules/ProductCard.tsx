import React from "react";
import { cn } from "@/utils/classnames";
import { Check, ArrowLeft, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";

export interface ProductCardProps {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    imageUrl: string;
    isAvailableForExport?: boolean;
    features?: string[];
    packaging?: string[];
    gradientFrom?: string;
    gradientTo?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    title,
    subtitle,
    description,
    imageUrl,
    isAvailableForExport,
    features = [],
    packaging = [],
    gradientFrom = "from-green-800",
    gradientTo = "to-green-950",
    icon,
    className,
}) => {
    const { t, isRTL } = useLanguage();
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
    return (
        <article
            className={cn(
                "group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden border border-gray-100 flex flex-col h-full",
                className
            )}
        >
            {/* ── Image & Header Container ── */}
            <div className="relative h-64 w-full bg-slate-50/50 overflow-hidden flex items-center justify-center p-8 group-hover:bg-slate-50 transition-colors duration-500">
                {/* Subtle gradient glow behind the product based on props */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} group-hover:scale-110 group-hover:opacity-30 transition-all duration-700`} />

                {/* Main Visual */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {icon || imageUrl.includes("placeholder") ? (
                        <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg shadow-green-900/10 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            {icon || <Package className="w-10 h-10" strokeWidth={1.5} />}
                        </div>
                    ) : (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="max-w-full max-h-full object-contain drop-shadow-md group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500"
                        />
                    )}
                </div>

                {/* Export badge */}
                {isAvailableForExport && (
                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md text-green-700 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-green-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        {t.featuredProducts.availableForExport}
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-6 flex flex-col flex-grow bg-white border-t border-gray-50">
                {/* Title & Subtitle */}
                <div className="mb-3">
                    <h3 className="font-extrabold text-gray-900 text-lg md:text-xl leading-snug group-hover:text-green-700 transition-colors">{title}</h3>
                    {subtitle && (
                        <p className="text-green-600 text-[10px] font-black mt-1.5 tracking-wider uppercase">{subtitle}</p>
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{description}</p>

                {/* Features List */}
                {features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-600 font-medium">
                                <div className="mt-0.5 rounded-full bg-green-50 p-0.5 shrink-0">
                                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                                </div>
                                {f}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Packaging Sizes */}
                {packaging.length > 0 && (
                    <div className="mt-auto mb-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <span className="text-xs text-gray-400 font-semibold">{t.featuredProducts.availablePackaging}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {packaging.map((p, i) => (
                                <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100 font-medium">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-8">
                    <Link
                        href={`/products/${id}`}
                        className="group/btn w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 border border-gray-100 text-green-700 font-black text-sm rounded-xl hover:bg-green-700 hover:text-white hover:border-green-700 active:scale-[0.97] transition-all duration-300 shadow-sm"
                    >
                        {t.featuredProducts.productDetails}
                        <ArrowIcon className="w-5 h-5 group-hover/btn:-translate-x-1.5 transition-transform duration-300" strokeWidth={2.5} />
                    </Link>
                </div>
            </div>
        </article>
    );
};
