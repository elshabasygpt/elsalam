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
            {/* ── Gradient Header ── */}
            <div className={`relative h-64 w-full bg-gradient-to-br ${gradientFrom} ${gradientTo} overflow-hidden`}>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-white/30 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-40 h-40 border border-white/20 rounded-full" />
                </div>

                {/* Large icon or image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {icon ? (
                        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                            {icon}
                        </div>
                    ) : (
                        <div className="w-full h-full p-8 flex items-center justify-center">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="max-w-full max-h-full object-contain group-hover:scale-110 drop-shadow-2xl transition-transform duration-700"
                            />
                        </div>
                    )}
                </div>

                {/* Export badge */}
                {isAvailableForExport && (
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        {t.featuredProducts.availableForExport}
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title & Subtitle */}
                <div className="mb-3">
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{title}</h3>
                    {subtitle && (
                        <p className="text-gray-400 text-xs font-semibold mt-1 tracking-wide uppercase font-english">{subtitle}</p>
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>

                {/* Features List */}
                {features.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
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
                <Link
                    href={`/products/${id}`}
                    className="group/btn mt-auto w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-700 text-white font-bold text-sm rounded-xl hover:bg-green-800 hover:shadow-lg active:scale-[0.97] transition-all duration-300"
                >
                    {t.featuredProducts.productDetails}
                    <ArrowIcon className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </article>
    );
};
