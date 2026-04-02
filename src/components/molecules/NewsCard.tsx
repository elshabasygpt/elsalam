"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, Play, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/classnames";
import { useLanguage } from "@/lib/i18n-context";
import type { NewsItem } from "@/lib/news-api";

interface NewsCardProps {
    item: NewsItem;
    featured?: boolean;
    className?: string;
}

const CATEGORY_COLORS: Record<string, { badge: string; border: string; glow: string }> = {
    news: {
        badge: "bg-blue-500/90 text-white backdrop-blur-sm",
        border: "group-hover:border-blue-300",
        glow: "group-hover:shadow-blue-100",
    },
    interviews: {
        badge: "bg-purple-500/90 text-white backdrop-blur-sm",
        border: "group-hover:border-purple-300",
        glow: "group-hover:shadow-purple-100",
    },
    factory_tours: {
        badge: "bg-emerald-500/90 text-white backdrop-blur-sm",
        border: "group-hover:border-emerald-300",
        glow: "group-hover:shadow-emerald-100",
    },
    exhibitions: {
        badge: "bg-amber-500/90 text-white backdrop-blur-sm",
        border: "group-hover:border-amber-300",
        glow: "group-hover:shadow-amber-100",
    },
};

const CATEGORY_BORDER_BOTTOM: Record<string, string> = {
    news: "bg-blue-500",
    interviews: "bg-purple-500",
    factory_tours: "bg-emerald-500",
    exhibitions: "bg-amber-500",
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, featured = false, className }) => {
    const { locale, t } = useLanguage();
    const title = locale === "ar" ? item.title_ar : item.title_en;
    const excerpt = locale === "ar" ? item.excerpt_ar : item.excerpt_en;
    const categoryLabel = t.media.categories[item.category as keyof typeof t.media.categories] || item.category;
    const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.news;

    const formattedDate = item.published_at
        ? new Date(item.published_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    /* ──────────── Featured Card — Full-width overlay style ──────────── */
    if (featured) {
        return (
            <Link href={`/media/${item.slug}`} className={cn("group block", className)}>
                <article className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[400px] md:min-h-[480px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {item.featured_image ? (
                            <img
                                src={item.featured_image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-950" />
                        )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Video Play Button */}
                    {item.media_type === "youtube" && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 border border-white/20">
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                        </div>
                    )}

                    {/* Category Badge */}
                    <span className={`absolute top-5 ${locale === "ar" ? "right-5" : "left-5"} px-3.5 py-1.5 rounded-full text-xs font-bold z-10 ${colors.badge}`}>
                        {categoryLabel}
                    </span>

                    {/* Featured Badge */}
                    <span className={`absolute top-5 ${locale === "ar" ? "left-5" : "right-5"} px-3.5 py-1.5 rounded-full text-xs font-bold z-10 bg-yellow-500/90 text-white backdrop-blur-sm`}>
                        ★ {t.media.featuredLabel}
                    </span>

                    {/* Content on top of overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-5 h-5" />
                                    {formattedDate}
                                </span>
                                {item.reading_time && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-5 h-5" />
                                        {item.reading_time} {locale === "ar" ? "دقائق قراءة" : "min read"}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                                {title}
                            </h2>
                            {excerpt && (
                                <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 line-clamp-2 max-w-2xl">
                                    {excerpt}
                                </p>
                            )}
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-white font-bold text-sm border border-white/20 group-hover:bg-white/25 group-hover:gap-3 transition-all duration-300">
                                {t.media.readMore}
                                <ArrowUpRight className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    /* ──────────── Regular Card — Enhanced with colored border ──────────── */
    return (
        <Link href={`/media/${item.slug}`} className={cn("group block h-full", className)}>
            <article className={cn(
                "relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400 border border-gray-100 flex flex-col h-full",
                colors.border,
                colors.glow
            )}>
                {/* Thumbnail */}
                <div className="relative h-52 bg-gray-100 overflow-hidden shrink-0">
                    {item.featured_image ? (
                        <img
                            src={item.featured_image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-950 flex items-center justify-center">
                            <span className="text-white/20 text-5xl font-black">{title.charAt(0)}</span>
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {item.media_type === "youtube" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                <Play className="w-5 h-5 text-green-700 ml-0.5" />
                            </div>
                        </div>
                    )}

                    {/* Category badge */}
                    <span className={`absolute top-3 ${locale === "ar" ? "right-3" : "left-3"} px-2.5 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                        {categoryLabel}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-5 h-5" />
                            {formattedDate}
                        </span>
                        {item.reading_time && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-5 h-5" />
                                {item.reading_time} {locale === "ar" ? "د" : "min"}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm group-hover:gap-2.5 transition-all duration-300">
                        {t.media.readMore}
                        <ArrowUpRight className="w-5 h-5" />
                    </span>
                </div>

                {/* Colored bottom border */}
                <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 ${CATEGORY_BORDER_BOTTOM[item.category] || "bg-green-500"}`} />
            </article>
        </Link>
    );
};
