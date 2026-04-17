"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { getNewsList, type NewsItem } from "@/lib/news-api";
import { Megaphone, ExternalLink, CalendarDays } from "lucide-react";
import { cn } from "@/utils/classnames";

export const NewsTicker = () => {
    const { t, isRTL, locale } = useLanguage();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch the latest 5 news items
                const data = await getNewsList({ page: 1 });
                setNews(data.data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch news ticker data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading || news.length === 0) return null;

    // Triple the array to ensure smooth infinite marquee scroll
    const duplicatedNews = [...news, ...news, ...news];

    return (
        <section className="bg-black/40 backdrop-blur-md relative z-40 overflow-hidden hide-scrollbar shadow-lg w-full rounded-2xl border border-white/10">
            <div className="flex items-stretch mx-auto min-h-[48px] w-full">

                {/* Badge section - Fixed on the start side */}
                <div className={cn(
                    "flex-shrink-0 z-30 bg-primary-green text-white font-bold text-sm px-4 md:px-6 flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(46,125,50,0.5)] border-inline-end border-green-600/50",
                )}>
                    <Megaphone className="w-6 h-6 animate-pulse text-green-200" strokeWidth={1.5} />
                    <span className="whitespace-nowrap text-base">{locale === 'ar' ? 'أحدث الأخبار' : 'Latest News'}</span>
                </div>

                {/* Marquee section */}
                <div className="flex-grow overflow-hidden relative flex items-center px-4">
                    {/* Gradient fades for smooth entry/exit */}
                    <div className={cn("absolute top-0 bottom-0 w-24 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none", isRTL ? "left-0 rotate-180" : "left-0")} />
                    <div className={cn("absolute top-0 bottom-0 w-24 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10 pointer-events-none", isRTL ? "right-0 rotate-180" : "right-0")} />

                    <div className={cn(
                        "flex w-max items-center h-full",
                        isRTL ? "animate-marquee" : "animate-marquee-reverse"
                    )}>
                        {duplicatedNews.map((item, idx) => (
                            <Link
                                href="/media"
                                key={`${item.id}-${idx}`}
                                className="flex items-center gap-3 md:gap-4 px-6 md:px-8 border-l border-white/10 last:border-0 hover:bg-white/10 transition-colors duration-300 h-full py-2.5 group cursor-pointer"
                            >
                                <span className="text-gray-100 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] md:max-w-[500px] group-hover:text-white transition-colors">
                                    {locale === 'ar' ? item.title_ar : item.title_en}
                                </span>
                                {item.published_at && (
                                    <span className="flex items-center gap-1.5 text-[11px] text-green-100/90 font-medium whitespace-nowrap bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                                        <CalendarDays className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                                        {new Date(item.published_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* View All - Fixed on the end side */}
                <Link
                    href="/media"
                    className={cn(
                        "flex-shrink-0 bg-white/5 hover:bg-white/10 text-white transition-colors duration-300 px-4 md:px-6 text-sm font-bold flex items-center justify-center gap-2.5 z-20 border-x border-white/10 backdrop-blur-sm",
                    )}
                >
                    <span className="hidden sm:inline whitespace-nowrap text-base">{locale === 'ar' ? 'المركز الإعلامي' : 'Media Center'}</span>
                    <ExternalLink className="w-6 h-6 text-green-400" strokeWidth={1.5} />
                </Link>

            </div>
        </section>
    );
};
