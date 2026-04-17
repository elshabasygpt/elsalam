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
    gradientFrom = "from-green-600",
    gradientTo = "to-green-800",
    icon,
    className,
}) => {
    const { t, isRTL } = useLanguage();
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
    const hasImage = imageUrl && !imageUrl.includes("placeholder") && imageUrl.trim() !== "";

    return (
        <article
            className={cn(
                "group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full",
                className
            )}
        >
            {/* ── Image & Header Container ── */}
            <div className="relative h-[280px] w-full bg-slate-50/50 overflow-hidden flex items-center justify-center p-8 group-hover:bg-slate-100/50 transition-colors duration-500">
                {/* Decorative background blur */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${gradientFrom} ${gradientTo} rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />
                <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${gradientFrom} ${gradientTo} rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />

                {/* Main Visual */}
                <div className="relative z-10 w-full h-full flex items-center justify-center mt-4">
                    {hasImage ? (
                        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-contain drop-shadow-xl"
                                onError={(e) => { 
                                    (e.target as HTMLImageElement).style.display = 'none'; 
                                    (e.target as any).nextElementSibling!.style.display = 'flex'; 
                                }}
                            />
                            {/* Fallback triggered on image error */}
                            <div className="hidden absolute inset-0 items-center justify-center">
                                <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg shadow-green-900/20 flex flex-col items-center justify-center text-white`}>
                                    <Package className="w-12 h-12 mb-2" strokeWidth={1} />
                                    <span className="text-[10px] opacity-70 font-bold">No Image</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-2xl shadow-green-900/10 flex items-center justify-center text-white/95 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700`}>
                            {icon || <Package className="w-14 h-14" strokeWidth={1.5} />}
                        </div>
                    )}
                </div>

                {/* Export badge */}
                {isAvailableForExport && (
                    <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-green-700 text-[10px] font-black px-3.5 py-2 rounded-full flex items-center gap-2 shadow-sm border border-slate-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                        {t.featuredProducts.availableForExport}
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-8 flex flex-col flex-grow bg-white relative z-20">
                {/* Title & Subtitle */}
                <div className="mb-4">
                    {subtitle && (
                        <p className="text-green-600 text-[11px] font-black mb-2 tracking-widest uppercase">{subtitle}</p>
                    )}
                    <h3 className="font-extrabold text-slate-800 text-xl leading-tight group-hover:text-green-700 transition-colors">{title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{description}</p>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <Link
                        href={`/products/${id}`}
                        className="group/btn w-full inline-flex items-center justify-between px-6 py-4 bg-slate-50 text-slate-700 hover:text-white font-bold text-sm rounded-2xl hover:bg-green-600 transition-all duration-300 relative overflow-hidden"
                    >
                        <span className="relative z-10">{t.featuredProducts.productDetails}</span>
                        <div className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover/btn:bg-white/20 group-hover/btn:text-white transition-colors">
                            <ArrowIcon className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" strokeWidth={2.5} />
                        </div>
                    </Link>
                </div>
            </div>
        </article>
    );
};
