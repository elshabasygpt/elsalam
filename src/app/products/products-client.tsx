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
import { Loader2, ShoppingBag, Sparkles, Home, ChevronLeft, ChevronRight, Eye, ArrowLeft, ArrowRight, ShoppingCart, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useRouter } from "next/navigation";

export function ProductsClient() {
    const { t, locale, isRTL } = useLanguage();
    const router = useRouter();
    const { addItem, setIsOpen: setCartOpen } = useCartStore();
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

    const handleAddToCart = (product: ProductItem, e?: React.MouseEvent) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        addItem({
            id: product.id.toString(),
            productId: product.id,
            slug: product.slug,
            name_ar: product.name_ar,
            name_en: product.name_en,
            price: product.active_promotion?.promo_price || product.price || 0,
            image: product.featured_image || "/images/placeholder.svg",
            quantity: 1,
        });
        setCartOpen(true);
    };

    const handleBuyNow = (product: ProductItem, e?: React.MouseEvent) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        addItem({
            id: product.id.toString(),
            productId: product.id,
            slug: product.slug,
            name_ar: product.name_ar,
            name_en: product.name_en,
            price: product.active_promotion?.promo_price || product.price || 0,
            image: product.featured_image || "/images/placeholder.svg",
            quantity: 1,
        });
        router.push("/checkout");
    };

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
                                        <article className="group relative bg-white rounded-[24px] shadow-sm hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
                                            {/* Promo Badge */}
                                            {badge && (
                                                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black rounded-full shadow-lg shadow-red-600/20">
                                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                                    {badge}
                                                </div>
                                            )}

                                            {/* Image / Header Container */}
                                            <div className="relative h-[240px] w-full bg-gradient-to-br from-green-50/80 to-emerald-100/50 flex items-center justify-center p-6 overflow-hidden group-hover:bg-green-100/50 transition-colors duration-500">
                                                {/* Decorative soft glow */}
                                                <div className="absolute inset-0 z-0">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/60 blur-2xl rounded-full" />
                                                </div>

                                                {/* Quick Action Overlay */}
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col justify-center gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-30">
                                                    {product.stock > 0 ? (
                                                        <button onClick={(e) => handleAddToCart(product, e)} className="w-10 h-10 rounded-full bg-white shadow-lg text-green-700 flex items-center justify-center hover:bg-green-700 hover:text-white hover:scale-110 tooltip-trigger transition-all">
                                                            <ShoppingBag className="w-4.5 h-4.5" />
                                                        </button>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 shadow-md text-slate-400 flex items-center justify-center cursor-not-allowed" title={locale === "ar" ? "نفذت الكمية" : "Out of stock"}>
                                                            <ShoppingBag className="w-4.5 h-4.5 opacity-50" />
                                                        </div>
                                                    )}
                                                    <a href={`/products/${product.slug}`} className="w-10 h-10 rounded-full bg-white shadow-lg text-green-700 flex items-center justify-center hover:bg-green-700 hover:text-white hover:scale-110 transition-all">
                                                        <Eye className="w-4.5 h-4.5" />
                                                    </a>
                                                </div>

                                                {product.featured_image ? (
                                                    <img
                                                        src={product.featured_image}
                                                        alt={title}
                                                        className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
                                                    />
                                                ) : (
                                                    <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/40 backdrop-blur-md flex items-center justify-center text-green-800 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                        <ShoppingBag className="w-10 h-10 opacity-50" />
                                                    </div>
                                                )}

                                                {product.is_exportable && (
                                                    <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-20 bg-white/80 backdrop-blur-md text-green-800 text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white`}>
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                        {t.featuredProducts.availableForExport}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Container */}
                                            <div className="p-6 flex flex-col flex-grow bg-white relative z-20">
                                                <div className="mb-4">
                                                    <h3 className="font-black text-slate-800 text-lg md:text-[20px] leading-tight mb-1 group-hover:text-green-700 transition-colors line-clamp-2">{title}</h3>
                                                    {product.stock === 0 && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-block mb-2">{locale === "ar" ? "نفذت الكمية" : "Out of Stock"}</span>}
                                                    {desc && <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2">{desc}</p>}
                                                </div>

                                                {/* Price Area */}
                                                <div className="mt-auto pt-2 pb-5">
                                                    <PriceTag
                                                        price={product.price}
                                                        originalPrice={promo?.original_price}
                                                        promoPrice={promo?.promo_price}
                                                        unitAr={product.price_unit_ar || undefined}
                                                        unitEn={product.price_unit_en || undefined}
                                                        size="sm"
                                                    />
                                                </div>

                                                {/* CTA Buttons */}
                                                <div className="flex flex-col gap-2.5">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={(e) => handleAddToCart(product, e)}
                                                            className="w-full inline-flex items-center justify-center gap-2 px-2 py-3 bg-green-700 text-white font-bold text-[12px] md:text-sm rounded-xl hover:bg-green-800 hover:shadow-lg active:scale-[0.98] transition-all duration-300"
                                                        >
                                                            <ShoppingCart className="w-5 h-5 shrink-0" />
                                                            {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleBuyNow(product, e)}
                                                            className="w-full inline-flex items-center justify-center gap-2 px-2 py-3 bg-yellow-500 text-slate-900 font-bold text-[12px] md:text-sm rounded-xl hover:bg-yellow-400 hover:shadow-lg active:scale-[0.98] transition-all duration-300"
                                                        >
                                                            <CreditCard className="w-5 h-5 shrink-0" />
                                                            {locale === "ar" ? "شراء مباشر" : "Buy Now"}
                                                        </button>
                                                    </div>
                                                    <a
                                                        href={`/products/${product.slug}`}
                                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-[13px] rounded-xl hover:bg-slate-100 hover:text-green-700 transition-all duration-300 shadow-sm"
                                                    >
                                                        <Eye className="w-5 h-5 shrink-0" />
                                                        {t.featuredProducts.productDetails}
                                                    </a>
                                                </div>
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
