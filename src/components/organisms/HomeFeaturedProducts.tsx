"use client";

import { Container } from "@/components/atoms/Container";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue } from "@/lib/page-content-context";
import { useState, useEffect, useRef } from "react";
import { getProducts, type ProductItem } from "@/lib/products-api";

export const HomeFeaturedProducts = () => {
    const { t, isRTL, locale } = useLanguage();
    const cmsSect = usePageContent("featuredProducts");
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading]   = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use CMS products if defined and not empty
        if (cmsSect?.products && Array.isArray(cmsSect.products) && cmsSect.products.length > 0) {
            const cmsProducts = cmsSect.products.map((p: any, idx: number) => ({
                id: idx + 9999, // use numeric offset to avoid conflicts
                slug: p.slug || "#",
                name_ar: p.title_ar || p.title || "",
                name_en: p.title_en || p.title || "",
                short_description_ar: p.description_ar || p.description || "",
                short_description_en: p.description_en || p.description || "",
                featured_image: p.image || null,
                is_exportable: true, 
                gradient_from: "from-green-700",
                gradient_to: "to-green-950",
            })) as unknown as ProductItem[];
            setProducts(cmsProducts);
            setLoading(false);
        } else {
            // Fallback to database API
            getProducts({ featured: true })
                .then((res) => setProducts(res.data.slice(0, 4)))
                .catch(() => setProducts([]))
                .finally(() => setLoading(false));
        }
    }, [cmsSect]);

    // Track active dot as user scrolls
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;
        const onScroll = () => {
            const idx = Math.round(el.scrollLeft / el.offsetWidth);
            setActiveIdx(Math.max(0, idx));
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [products.length]);

    const scrollTo = (idx: number) => {
        carouselRef.current?.scrollTo({
            left: idx * (carouselRef.current.offsetWidth * 0.85 + 12),
            behavior: "smooth",
        });
    };

    // CMS Values
    const badge    = getBilingualValue(cmsSect, "badge", locale) || t.featuredProducts.badge;
    const title    = getBilingualValue(cmsSect, "title", locale) || t.featuredProducts.title;
    const subtitle = getBilingualValue(cmsSect, "subtitle", locale) || t.featuredProducts.subtitle;
    const viewAll  = getBilingualValue(cmsSect, "viewAll", locale) || t.featuredProducts.viewAll;

    return (
        <section className="py-16 md:py-24 bg-gray-50" id="products">
            <Container>
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-5 md:gap-4">
                        <div className="max-w-xl">
                            <p className="text-primary-green font-bold text-sm mb-3 tracking-widest uppercase flex items-center gap-2">
                                <span className="w-6 h-[2px] bg-primary-green rounded-full"></span>
                                {badge}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                {title}
                            </h2>
                            <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
                                {subtitle}
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="group flex w-full md:w-auto items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-100 text-primary-dark font-bold text-[15px] rounded-2xl hover:border-primary-green hover:bg-green-50 shadow-sm transition-all duration-300"
                        >
                            {viewAll}
                            <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1.5 transition-transform ${!isRTL ? "rotate-180" : ""}`} />
                        </Link>
                    </div>
                </ScrollReveal>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <ShoppingBag className="w-16 h-16 opacity-30" />
                        <p className="font-medium">{t.products.emptyState}</p>
                    </div>
                ) : (
                    <>
                        {/* ── Mobile: Horizontal Swipe Carousel ── */}
                        <div className="block md:hidden relative -mx-4 px-4 overflow-hidden">
                            <div
                                ref={carouselRef}
                                className="
                                    flex gap-4 overflow-x-auto
                                    snap-carousel scrollbar-hide scroll-momentum-x
                                    pb-8 pt-2 items-stretch
                                "
                            >
                                {products.map((product) => {
                                    const title       = locale === "ar" ? product.name_ar       : product.name_en;
                                    const description = locale === "ar" ? product.short_description_ar : product.short_description_en;
                                    return (
                                        <div
                                            key={product.id}
                                            className="
                                                flex-none w-[85vw] sm:w-[320px] max-w-sm
                                                snap-center h-auto
                                            "
                                        >
                                            <div className="h-full">
                                                <ProductCard
                                                    id={product.slug}
                                                    title={title}
                                                    description={description ?? ""}
                                                    imageUrl={product.featured_image ?? "/images/placeholder.svg"}
                                                    isAvailableForExport={product.is_exportable}
                                                    gradientFrom={product.gradient_from ?? "from-green-700"}
                                                    gradientTo={product.gradient_to ?? "to-green-950"}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Spacer for last card padding */}
                                <div className="flex-none w-4" />
                            </div>

                            {/* Dot indicators */}
                            <div className="flex items-center justify-center gap-2 mt-0 mb-2 relative z-10">
                                {products.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => scrollTo(idx)}
                                        className={`rounded-full transition-all duration-300 ${
                                            idx === activeIdx
                                                ? "w-6 h-2 bg-green-600"
                                                : "w-2 h-2 bg-green-200"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── Desktop: Regular Grid ── */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => {
                                const title       = locale === "ar" ? product.name_ar       : product.name_en;
                                const description = locale === "ar" ? product.short_description_ar : product.short_description_en;
                                return (
                                    <ProductCard
                                        key={product.id}
                                        id={product.slug}
                                        title={title}
                                        description={description ?? ""}
                                        imageUrl={product.featured_image ?? "/images/placeholder.svg"}
                                        isAvailableForExport={product.is_exportable}
                                        gradientFrom={product.gradient_from ?? "from-green-700"}
                                        gradientTo={product.gradient_to ?? "to-green-950"}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </Container>
        </section>
    );
};


