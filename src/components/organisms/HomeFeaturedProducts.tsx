"use client";

import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useState, useEffect } from "react";
import { getProducts, type ProductItem } from "@/lib/products-api";

export const HomeFeaturedProducts = () => {
    const { t, isRTL, locale } = useLanguage();
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts({ featured: true })
            .then((res) => setProducts(res.data.slice(0, 4)))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-24 bg-gray-50" id="products">
            <Container>
                <ScrollReveal>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div>
                            <p className="text-green-700 font-bold text-sm mb-2">
                                {t.featuredProducts.badge}
                            </p>
                            <h2 className="text-3xl font-black text-gray-900">
                                {t.featuredProducts.title}
                            </h2>
                            <p className="text-gray-500 mt-2 text-base">
                                {t.featuredProducts.subtitle}
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-xl hover:bg-green-100 transition-all duration-300"
                        >
                            {t.featuredProducts.viewAll}
                            <ArrowLeft
                                className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${
                                    !isRTL ? "rotate-180" : ""
                                }`}
                            />
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
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const title =
                                locale === "ar" ? product.name_ar : product.name_en;
                            const description =
                                locale === "ar"
                                    ? product.short_description_ar
                                    : product.short_description_en;
                            return (
                                <StaggerItem key={product.id}>
                                    <ProductCard
                                        id={product.slug}
                                        title={title}
                                        description={description ?? ""}
                                        imageUrl={
                                            product.featured_image ?? "/images/placeholder.svg"
                                        }
                                        isAvailableForExport={product.is_exportable}
                                        gradientFrom={product.gradient_from ?? "from-green-700"}
                                        gradientTo={product.gradient_to ?? "to-green-950"}
                                    />
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                )}
            </Container>
        </section>
    );
};
