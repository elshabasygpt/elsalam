"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CTAPartnership } from "@/components/organisms/CTAPartnership";
import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { NewsCard } from "@/components/molecules/NewsCard";
import { cn } from "@/utils/classnames";
import { useLanguage } from "@/lib/i18n-context";
import { getNewsList, type NewsItem, type PaginatedResponse } from "@/lib/news-api";
import {
    Newspaper,
    Loader2,
    Rss,
    Mic,
    Factory,
    Trophy,
    Sparkles,
    ChevronDown,
} from "lucide-react";

const FILTER_ICONS: Record<string, React.ReactNode> = {
    all: <Sparkles className="w-5 h-5" />,
    news: <Newspaper className="w-5 h-5" />,
    interviews: <Mic className="w-5 h-5" />,
    factory_tours: <Factory className="w-5 h-5" />,
    exhibitions: <Trophy className="w-5 h-5" />,
};

export default function MediaCenterPage() {
    const { t, isRTL, locale } = useLanguage();
    const [activeFilter, setActiveFilter] = useState("all");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const filters = [
        { id: "all", label: t.media.filterAll },
        { id: "news", label: t.media.filterNews },
        { id: "interviews", label: t.media.filterInterviews },
        { id: "factory_tours", label: t.media.filterFactory },
        { id: "exhibitions", label: t.media.filterExhibitions },
    ];

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const category = activeFilter !== "all" ? activeFilter : undefined;
                const data: PaginatedResponse<NewsItem> = await getNewsList({ category, page: 1 });
                setNews(data.data);
                setHasMore(data.meta.current_page < data.meta.last_page);
                setPage(1);
            } catch (error) {
                console.error("Failed to fetch news:", error);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [activeFilter]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const category = activeFilter !== "all" ? activeFilter : undefined;
            const data = await getNewsList({ category, page: nextPage });
            setNews(prev => [...prev, ...data.data]);
            setHasMore(data.meta.current_page < data.meta.last_page);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to load more:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const featuredItem = news.find(item => item.is_featured);
    const regularItems = news.filter(item => item !== featuredItem);

    // Count articles per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: news.length };
        news.forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, [news]);

    return (
        <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />

            {/* ─── Premium Hero Section ─── */}
            <section className="relative pt-40 pb-28 md:pb-32 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-emerald-800" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
                </div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }} />

                <Container className="relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-200 text-sm font-medium mb-6 border border-white/10">
                                <Rss className="w-5 h-5" />
                                {locale === "ar" ? "آخر الأخبار والمستجدات" : "Latest News & Updates"}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                                {t.media.heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-green-100/80 leading-relaxed max-w-2xl mx-auto">
                                {t.media.heroSubtitle}
                            </p>
                        </div>
                    </ScrollReveal>
                </Container>

            </section>

            {/* ─── Filters + Content ─── */}
            <section className="pb-16 md:pb-24 mt-8 md:mt-12">
                <Container>
                    {/* Premium Filter Pills */}
                    <ScrollReveal delay={0.1}>
                        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={cn(
                                        "group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-base font-bold transition-all duration-300 select-none border",
                                        activeFilter === filter.id
                                            ? "bg-green-700 text-white border-green-700 shadow-lg shadow-green-700/25 scale-105"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:shadow-md"
                                    )}
                                >
                                    <span className={cn(
                                        "transition-colors duration-300",
                                        activeFilter === filter.id ? "text-green-200" : "text-gray-400 group-hover:text-green-500"
                                    )}>
                                        {FILTER_ICONS[filter.id]}
                                    </span>
                                    {filter.label}
                                    {!loading && categoryCounts[filter.id] !== undefined && (
                                        <span className={cn(
                                            "inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-[12px] font-bold transition-all duration-300",
                                            activeFilter === filter.id
                                                ? "bg-white/20 text-white"
                                                : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700"
                                        )}>
                                            {categoryCounts[filter.id] || 0}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium animate-pulse">
                                {locale === "ar" ? "جاري تحميل الأخبار..." : "Loading articles..."}
                            </p>
                        </div>
                    ) : news.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Newspaper className="w-10 h-10 opacity-40" />
                            </div>
                            <p className="text-lg font-medium">{t.media.emptyState}</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured Article */}
                            {featuredItem && (
                                <ScrollReveal className="mb-12">
                                    <NewsCard item={featuredItem} featured />
                                </ScrollReveal>
                            )}

                            {/* News Grid */}
                            <StaggerContainer
                                key={`${activeFilter}-${page}`}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                            >
                                {regularItems.map((item) => (
                                    <StaggerItem key={item.id}>
                                        <NewsCard item={item} />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            {/* Load More */}
                            {hasMore && (
                                <div className="flex justify-center mt-14">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="group px-8 py-3.5 bg-white text-green-700 font-bold rounded-full border-2 border-green-200 hover:border-green-500 hover:bg-green-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loadingMore ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                        )}
                                        {t.media.loadMore}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </Container>
            </section>

            <CTAPartnership />
            <Footer />
        </main>
    );
}
