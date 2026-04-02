"use client";

import { Container } from "@/components/atoms/Container";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Droplets, CakeSlice, Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { usePageContent, getBilingualValue, getItemBilingual } from "@/lib/page-content-context";

const PRODUCT_CONFIG = [
    { id: "refined-soybean-oil", imageUrl: "/images/placeholder.svg", isAvailableForExport: true, gradientFrom: "from-green-700", gradientTo: "to-emerald-900" },
    { id: "sunflower-oil", imageUrl: "/images/placeholder.svg", isAvailableForExport: true, gradientFrom: "from-amber-600", gradientTo: "to-amber-900" },
    { id: "premium-vegetable-ghee", imageUrl: "/images/placeholder.svg", isAvailableForExport: false, gradientFrom: "from-yellow-700", gradientTo: "to-yellow-950" },
    { id: "bakery-shortening", imageUrl: "/images/placeholder.svg", isAvailableForExport: true, gradientFrom: "from-orange-700", gradientTo: "to-red-900" },
];

export const HomeFeaturedProducts = () => {
    const { t, isRTL, locale } = useLanguage();
    const cms = usePageContent("featuredProducts");

    const badge = getBilingualValue(cms, "badge", locale) ?? t.featuredProducts.badge;
    const fpTitle = getBilingualValue(cms, "title", locale) ?? t.featuredProducts.title;
    const fpSubtitle = getBilingualValue(cms, "subtitle", locale) ?? t.featuredProducts.subtitle;
    const viewAll = getBilingualValue(cms, "viewAll", locale) ?? t.featuredProducts.viewAll;

    const tProducts = t.featuredProducts.products;
    const products = tProducts.map((p, i) => ({
        ...PRODUCT_CONFIG[i],
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        features: p.features,
        packaging: ["1L", "5L", "18L"],
    }));

    return (
        <section className="py-24 bg-gray-50" id="products">
            <Container>
                <ScrollReveal>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div>
                            <p className="text-green-700 font-bold text-sm mb-2">{badge}</p>
                            <h2 className="text-3xl font-black text-gray-900">{fpTitle}</h2>
                            <p className="text-gray-500 mt-2 text-base">{fpSubtitle}</p>
                        </div>
                        <Link href="/products" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-xl hover:bg-green-100 transition-all duration-300">
                            {viewAll}
                            <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${!isRTL ? "rotate-180" : ""}`} />
                        </Link>
                    </div>
                </ScrollReveal>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <StaggerItem key={p.id}>
                            <ProductCard {...p} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
};
