"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CTAPartnership } from "@/components/organisms/CTAPartnership";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { ProductCard } from "@/components/molecules/ProductCard";
import { PriceTag } from "@/components/atoms/PriceTag";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { cn } from "@/utils/classnames";
import { useLanguage } from "@/lib/i18n-context";
import {
    getProducts,
    getCategories,
    getPromotions,
    type ProductItem,
    type ProductCategory,
    type PromotionItem,
} from "@/lib/products-api";
import { Loader2, ShoppingBag, Sparkles, Home, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductsClient() {
    const { t, locale, isRTL } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("all");
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsData, categoriesData, promosData] = await Promise.all([
                    getProducts({ category: activeCategory !== "all" ? activeCategory : undefined }),
                    getCategories(),
                    activeCategory === "all" ? getPromotions() : Promise.resolve([]),
                ]);
                setProducts(productsData.data);
                setCategories(categoriesData);
                setPromotions(promosData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategory]);

    const allCategories = [
        { slug: "all", name: locale === "ar" ? "الكل" : "All" },
        ...categories.map((c) => ({
            slug: c.slug,
            name: locale === "ar" ? c.name_ar : c.name_en,
        })),
    ];

    const BreadcrumbSeparator = isRTL ? ChevronLeft : ChevronRight;

    return (
        <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 border-b border-green-800/50">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-green-500/10 blur-3xl saturate-200" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-yellow-500/10 blur-3xl saturate-200" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                </div>

                <Container className="relative z-10">
                    <ScrollReveal>
                        <div className="flex flex-col items-center text-center">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2.5 px-5 py-2.5 mb-8 text-sm md:text-base font-bold text-white/70 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                                <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Home className="w-5 h-5" />
                                    {t.nav.home || "الرئيسية"}
                                </Link>
                                <BreadcrumbSeparator className="w-5 h-5 text-white/40" />
                                <span className="text-white drop-shadow-md">{t.nav.products || "منتجاتنا"}</span>
                            </nav>

                            {/* Titles */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
                                {t.products.heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-medium">
                                {t.products.heroSubtitle}
                            </p>
                        </div>
                    </ScrollReveal>
                </Container>
                
                {/* Bottom Curve */}
                <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-surface-soft" style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }} />
            </section>

            {/* Promotions Banner */}
            {promotions.length > 0 && (
                <section className="py-8">
                    <Container>
                        <ScrollReveal>
                            <PromoBanner promotions={promotions} />
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* Products Grid */}
            <section className="py-16">
                <Container>
                    {/* Category Filters */}
                    <ScrollReveal>
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {allCategories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 select-none border",
                                        activeCategory === cat.slug
                                            ? "bg-green-700 text-white border-green-700 shadow-md"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                            <ShoppingBag className="w-16 h-16 opacity-50" />
                            <p className="text-lg font-medium">{t.products.emptyState}</p>
                        </div>
                    ) : (
                        <StaggerContainer key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => {
                                const title = locale === "ar" ? product.name_ar : product.name_en;
                                const desc = locale === "ar" ? product.short_description_ar : product.short_description_en;
                                const promo = product.active_promotion;
                                const badge = promo ? (locale === "ar" ? promo.badge_ar : promo.badge_en) : null;

                                return (
                                    <StaggerItem key={product.id}>
                                        <article className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden border border-gray-100 flex flex-col h-full">
                                            {/* Promo Badge */}
                                            {badge && (
                                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-full shadow-lg animate-pulse">
                                                    <Sparkles className="w-5 h-5" />
                                                    {badge}
                                                </div>
                                            )}

                                            {/* Image / Gradient Header */}
                                            <div className={`relative h-44 w-full bg-gradient-to-br ${product.gradient_from || "from-green-700"} ${product.gradient_to || "to-green-950"} overflow-hidden`}>
                                                <div className="absolute inset-0 opacity-10">
                                                    <div className="absolute top-4 right-4 w-32 h-32 border border-white/30 rounded-full" />
                                                    <div className="absolute -bottom-6 -left-6 w-40 h-40 border border-white/20 rounded-full" />
                                                </div>
                                                {product.featured_image ? (
                                                    <img
                                                        src={product.featured_image}
                                                        alt={title}
                                                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                                                            <ShoppingBag className="w-10 h-10" />
                                                        </div>
                                                    </div>
                                                )}

                                                {product.is_exportable && (
                                                    <div className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30`}>
                                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                                        {t.featuredProducts.availableForExport}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{title}</h3>
                                                {desc && <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{desc}</p>}

                                                {/* Price */}
                                                <div className="mt-auto mb-4">
                                                    <PriceTag
                                                        price={product.price}
                                                        originalPrice={promo?.original_price}
                                                        promoPrice={promo?.promo_price}
                                                        unitAr={product.price_unit_ar || undefined}
                                                        unitEn={product.price_unit_en || undefined}
                                                        size="sm"
                                                    />
                                                </div>

                                                {/* CTA */}
                                                <a
                                                    href={`/products/${product.slug}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-700 text-white font-bold text-sm rounded-xl hover:bg-green-800 hover:shadow-lg active:scale-[0.97] transition-all duration-300"
                                                >
                                                    {t.featuredProducts.productDetails}
                                                </a>
                                            </div>
                                        </article>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>
                    )}
                </Container>
            </section>

            <CTAPartnership />
            <Footer />
        </main>
    );
}
