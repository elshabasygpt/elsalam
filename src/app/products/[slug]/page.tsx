"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { CTAPartnership } from "@/components/organisms/CTAPartnership";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { PriceTag } from "@/components/atoms/PriceTag";
import { CountdownTimer } from "@/components/atoms/CountdownTimer";
import { PackagingPriceTable } from "@/components/molecules/PackagingPriceTable";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/atoms/Breadcrumbs";
import { useLanguage } from "@/lib/i18n-context";
import { getProductDetail, type ProductDetail } from "@/lib/products-api";
import {
    Check, Package, Globe, ShieldCheck,
    Droplets, CakeSlice, Flame, Loader2,
    FileText, ArrowLeft, ArrowRight, Sparkles, Settings, ShoppingBag, ShoppingCart, CreditCard
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { cn } from "@/utils/classnames";

function safeArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
    }
    return [];
}

function getIcon(iconName: string | null) {
    switch (iconName) {
        case "droplets": return <Droplets className="w-12 h-12" />;
        case "cakeslice": return <CakeSlice className="w-12 h-12" />;
        case "flame": return <Flame className="w-12 h-12" />;
        default: return <Droplets className="w-12 h-12" />;
    }
}

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { t, locale, isRTL } = useLanguage();

    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const router = useRouter();
    const { addItem, setIsOpen: setCartOpen } = useCartStore();

    const BackArrow = isRTL ? ArrowRight : ArrowLeft;
    const CtaArrow = isRTL ? ArrowLeft : ArrowRight;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(false);
            try {
                const data = await getProductDetail(slug);
                setProduct(data);
                setActiveImage(data.featured_image || "/images/placeholder.svg");
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
                </div>
                <Footer />
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                <Navbar />
                <section className="py-32">
                    <Container className="text-center">
                        <Typography variant="h2" className="text-primary-dark mb-4">
                            {locale === "ar" ? "المنتج غير موجود" : "Product Not Found"}
                        </Typography>
                        <Typography variant="body-lg" className="text-text-dark/60 mb-8">
                            {locale === "ar" ? "عذراً، لم نتمكن من العثور على هذا المنتج." : "Sorry, we couldn't find this product."}
                        </Typography>
                        <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all">
                            <BackArrow className="w-5 h-5" />
                            {locale === "ar" ? "العودة للمنتجات" : "Back to Products"}
                        </Link>
                    </Container>
                </section>
                <Footer />
            </main>
        );
    }

    const title = locale === "ar" ? product.name_ar : product.name_en;
    const subtitle = locale === "ar" ? product.name_en : product.name_ar;
    const description = locale === "ar" ? product.short_description_ar : product.short_description_en;
    const longDesc = locale === "ar" ? product.long_description_ar : product.long_description_en;
    const features = safeArray(locale === "ar" ? product.features_ar : product.features_en);
    const certifications = safeArray(product.certifications);
    const categoryName = product.category ? (locale === "ar" ? product.category.name_ar : product.category.name_en) : "";
    const activePromo = product.promotions?.[0];
    const promoBadge = activePromo ? (locale === "ar" ? activePromo.badge_ar : activePromo.badge_en) : null;

    return (
        <main className={`min-h-screen bg-surface-soft ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />

            {/* ─── Premium B2B Product Hero ─── */}
            <section className={`relative pt-40 sm:pt-44 pb-24 lg:pt-48 lg:pb-32 bg-gradient-to-br ${product.gradient_from || "from-green-700"} ${product.gradient_to || "to-green-950"} overflow-x-hidden overflow-y-visible`}>

                {/* Dynamic Glow Backgrounds */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 blur-[150px] rounded-full" />
                </div>

                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface-soft" style={{ clipPath: "ellipse(100% 100% at 50% 100%)" }} />

                <Container className="relative z-10">
                    <ScrollReveal>
                        <Breadcrumbs items={[
                            { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
                            { label: locale === "ar" ? "منتجاتنا" : "Products", href: "/products" },
                            { label: title },
                        ]} variant="light" className="mb-2" />
                    </ScrollReveal>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <ScrollReveal>
                            <div className={`text-center ${isRTL ? "lg:text-right" : "lg:text-left"}`}>
                                <div className="flex flex-wrap items-center gap-3 mb-6 justify-center lg:justify-start">
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/20 text-sm font-bold rounded-full">{categoryName}</span>
                                    {product.is_exportable && (
                                        <span className="px-4 py-1.5 bg-green-400/20 backdrop-blur-md border border-green-400/30 text-green-100 text-sm font-bold rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                                            <Globe className="w-5 h-5" />
                                            {locale === "ar" ? "متاح للتصدير" : "Available for Export"}
                                        </span>
                                    )}
                                    {promoBadge && (
                                        <span className="px-4 py-1.5 bg-red-500/90 text-white text-sm font-bold rounded-full flex items-center gap-1 animate-pulse shadow-lg shadow-red-500/30">
                                            <Sparkles className="w-5 h-5" />
                                            {promoBadge}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 drop-shadow-xl leading-snug">{title}</h1>
                                <p className="text-white/70 text-sm md:text-base font-bold tracking-[0.2em] uppercase font-english mb-8">{subtitle}</p>
                                <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">{description}</p>

                                {/* Price block with CTA */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start p-5 sm:p-6 rounded-3xl bg-black/10 backdrop-blur-md border border-white/10 shadow-2xl w-full sm:w-auto mt-6">
                                    <div className="w-full sm:w-auto flex justify-center sm:block">
                                        <PriceTag
                                            price={product.price || (product.packagings?.length > 0 ? product.packagings[0].price : null)}
                                            originalPrice={activePromo?.original_price}
                                            promoPrice={activePromo?.promo_price}
                                            unitAr={product.price_unit_ar || undefined}
                                            unitEn={product.price_unit_en || undefined}
                                            size="lg"
                                            className="text-white drop-shadow-md align-middle [&_span]:text-white [&_span]:!text-white/70"
                                        />
                                    </div>
                                    <div className="w-full h-px sm:w-px sm:h-16 bg-white/20"></div>
                                    
                                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => {
                                                const finalPrice = activePromo?.promo_price || product.price || (product.packagings?.length > 0 ? product.packagings[0].price : 0) || 0;
                                                addItem({
                                                    id: product.id.toString(),
                                                    productId: product.id,
                                                    name_ar: product.name_ar,
                                                    name_en: product.name_en,
                                                    price: finalPrice,
                                                    quantity: 1,
                                                    image: product.featured_image || "/images/placeholder.svg",
                                                    slug: product.slug
                                                });
                                                setCartOpen(true);
                                            }}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-green-500 text-white font-black rounded-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-all text-sm sm:text-base"
                                        >
                                            <ShoppingCart className="w-5 h-5 shrink-0" />
                                            {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                const finalPrice = activePromo?.promo_price || product.price || (product.packagings?.length > 0 ? product.packagings[0].price : 0) || 0;
                                                addItem({
                                                    id: product.id.toString(),
                                                    productId: product.id,
                                                    name_ar: product.name_ar,
                                                    name_en: product.name_en,
                                                    price: finalPrice,
                                                    quantity: 1,
                                                    image: product.featured_image || "/images/placeholder.svg",
                                                    slug: product.slug
                                                });
                                                router.push("/checkout");
                                            }}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-yellow-500 text-slate-900 font-black rounded-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:bg-yellow-400 transition-all text-sm sm:text-base"
                                        >
                                            <CreditCard className="w-5 h-5 shrink-0" />
                                            {locale === "ar" ? "شراء مباشر" : "Buy Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* 3D Floating Product Image & Badges */}
                        <ScrollReveal delay={0.2} className="relative flex flex-col justify-center lg:justify-end items-center min-h-[400px] lg:min-h-[550px] mt-10 lg:mt-16">
                            {/* Floating image wrapper */}
                            <motion.div
                                className="relative z-20 w-full max-w-[320px] lg:max-w-[400px] aspect-[3/4]"
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            >
                                <img
                                    src={activeImage || product.featured_image || "/images/placeholder.svg"}
                                    alt={title}
                                    className="w-full h-full object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] hover:scale-[1.03] transition-transform duration-500 cursor-crosshair"
                                />
                                {/* Bottom shadow reflection */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/50 blur-2xl rounded-full" />
                            </motion.div>

                            {/* Image Thumbnails */}
                            {(product.images && product.images.length > 0) && (
                                <div className="relative mt-8 flex justify-center flex-wrap items-center gap-4 w-full px-4 shrink-0">
                                    <div
                                        role="button"
                                        onClick={() => setActiveImage(product.featured_image || "/images/placeholder.svg")}
                                        className={cn("relative flex items-center justify-center overflow-hidden w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl bg-white border-2 transition-all cursor-pointer p-1.5 shrink-0 shadow-sm", (!activeImage || activeImage === product.featured_image) ? "border-green-600 shadow-md scale-105" : "border-gray-200/60 hover:border-green-400 opacity-80 hover:opacity-100")}
                                    >
                                        <img src={product.featured_image || "/images/placeholder.svg"} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="Main" />
                                    </div>
                                    {product.images.map((img, i) => (
                                        <div
                                            role="button"
                                            key={i}
                                            onClick={() => setActiveImage(img.url)}
                                            className={cn("relative flex items-center justify-center overflow-hidden w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl bg-white border-2 transition-all cursor-pointer p-1.5 shrink-0 shadow-sm", activeImage === img.url ? "border-green-600 shadow-md scale-105" : "border-gray-200/60 hover:border-green-400 opacity-80 hover:opacity-100")}
                                        >
                                            <img src={img.url} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={`Gallery ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
                                className={`absolute top-5 sm:top-10 ${isRTL ? 'right-2 sm:right-10' : 'left-2 sm:left-10'} z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center gap-2 sm:gap-4`}
                            >
                                <ShieldCheck className="w-7 h-7 sm:w-10 sm:h-10 text-yellow-300 drop-shadow-md shrink-0" />
                                <div className="text-start">
                                    <p className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight">ISO 22000</p>
                                    <p className="text-white/80 text-[10px] sm:text-xs font-medium">Certified Facility</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 7, delay: 0.5, ease: "easeInOut" }}
                                className={`absolute bottom-5 sm:bottom-20 ${isRTL ? 'left-2 sm:left-10' : 'right-2 sm:right-10'} z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center gap-2 sm:gap-4`}
                            >
                                <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-green-300 drop-shadow-md shrink-0" />
                                <div className="text-start">
                                    <p className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight whitespace-nowrap">100%</p>
                                    <p className="text-white/80 text-[10px] sm:text-xs font-medium whitespace-nowrap">{locale === 'ar' ? 'نقي وطبيعي' : 'Pure & Natural'}</p>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Active Promotion Banner */}
            {activePromo && (
                <section className="-mt-6 relative z-10">
                    <Container className="max-w-4xl">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                            <div className="flex items-center gap-3 text-white">
                                <Sparkles className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <h3 className="font-bold text-sm">
                                        {locale === "ar" ? activePromo.title_ar : activePromo.title_en}
                                    </h3>
                                </div>
                            </div>
                            <CountdownTimer endDate={activePromo.ends_at} />
                        </div>
                    </Container>
                </section>
            )}

            {/* Content Grid */}
            <section className="py-16">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            {longDesc && (
                                <ScrollReveal>
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-black text-gray-900 mb-4">
                                            {locale === "ar" ? "عن المنتج" : "About Product"}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed text-base">{longDesc}</p>
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Features */}
                            {features && features.length > 0 && (
                                <ScrollReveal delay={0.1}>
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-black text-gray-900 mb-6">
                                            {locale === "ar" ? "المميزات" : "Features"}
                                        </h2>
                                        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {features.map((feature, i) => (
                                                <StaggerItem key={i}>
                                                    <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                                                        <Check className="w-5 h-5 text-green-600 shrink-0" />
                                                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                                                    </div>
                                                </StaggerItem>
                                            ))}
                                        </StaggerContainer>
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Specs Table */}
                            {product.specs && product.specs.length > 0 && (
                                <ScrollReveal delay={0.2}>
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-black text-gray-900 mb-6">
                                            {locale === "ar" ? "المواصفات الفنية" : "Technical Specifications"}
                                        </h2>
                                        <div className="overflow-hidden rounded-xl border border-gray-100">
                                            <table className="w-full">
                                                <tbody>
                                                    {product.specs.map((spec, i) => (
                                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-5 py-4 text-sm font-bold text-gray-900 w-1/3">
                                                                {locale === "ar" ? spec.label_ar : spec.label_en}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                                {locale === "ar" ? spec.value_ar : spec.value_en}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Technical Specs Table */}
                            {product.technical_specs && product.technical_specs.length > 0 && (
                                <ScrollReveal delay={0.2}>
                                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-green-600" />
                                            {locale === "ar" ? "المواصفات الفنية التفصيلية" : "Detailed Technical Specs"}
                                        </h2>
                                        <div className="overflow-hidden rounded-xl border border-gray-100">
                                            <table className="w-full text-start" dir={isRTL ? "rtl" : "ltr"}>
                                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-5 py-3 text-start">{locale === "ar" ? "الخاصية" : "Property"}</th>
                                                        <th className="px-5 py-3 text-start">{locale === "ar" ? "القيمة" : "Value"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.technical_specs.map((spec, i) => (
                                                        <tr key={i} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                                            <td className={`px-5 py-4 text-sm font-bold text-gray-900 w-1/2 ${isRTL ? "border-l" : "border-r"} border-gray-50`}>
                                                                {locale === "ar" ? spec.property_ar : spec.property_en}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                                                                {locale === "ar" ? spec.value_ar : spec.value_en}
                                                                {spec.unit_ar && locale === "ar" && <span className="text-xs text-gray-400 mr-1">{spec.unit_ar}</span>}
                                                                {spec.unit_en && locale === "en" && <span className="text-xs text-gray-400 ml-1">{spec.unit_en}</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Packaging & Prices */}
                            {product.packagings && product.packagings.length > 0 && (
                                <ScrollReveal delay={0.1}>
                                    <PackagingPriceTable packagings={product.packagings} />
                                </ScrollReveal>
                            )}

                            {/* Certifications */}
                            {certifications.length > 0 && (
                                <ScrollReveal delay={0.2}>
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-5">
                                            <ShieldCheck className="w-5 h-5 text-green-600" />
                                            <h3 className="font-bold text-gray-900">
                                                {locale === "ar" ? "شهادات الجودة" : "Quality Certifications"}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {certifications.map((cert, i) => (
                                                <span key={i} className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-100">
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* PDF Datasheet */}
                            {product.pdf_datasheet && (
                                <ScrollReveal delay={0.25}>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/products/${product.slug}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-200 transition-colors group"
                                    >
                                        <FileText className="w-8 h-8 text-red-500 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                                                {locale === "ar" ? "تنزيل البيانات الفنية (TDS)" : "Download TDS (PDF)"}
                                            </h4>
                                            <p className="text-xs text-gray-400">{locale === "ar" ? "اضغط للتحميل" : "Click to download"}</p>
                                        </div>
                                    </a>
                                </ScrollReveal>
                            )}

                            {/* CTA */}
                            <ScrollReveal delay={0.3}>
                                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white text-center">
                                    <h3 className="font-bold text-lg mb-2">
                                        {locale === "ar" ? "مهتم بهذا المنتج؟" : "Interested in this product?"}
                                    </h3>
                                    <p className="text-white/70 text-sm mb-5">
                                        {locale === "ar" ? "تواصل معنا للحصول على عرض سعر مخصص" : "Contact us for a custom price quote"}
                                    </p>
                                    <Link
                                        href="/contact"
                                        data-analytics="sidebar_quote_click"
                                        className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-white text-green-800 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
                                    >
                                        {locale === "ar" ? "اطلب تسعير" : "Request Quote"}
                                        <BackArrow className="w-5 h-5" />
                                    </Link>
                                    {product.is_exportable && (
                                        <Link
                                            href="/b2b"
                                            data-analytics="sidebar_export_click"
                                            className="inline-flex items-center gap-2 w-full justify-center mt-3 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
                                        >
                                            <Globe className="w-5 h-5" />
                                            {locale === "ar" ? "استفسار تصدير" : "Export Inquiry"}
                                        </Link>
                                    )}
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </Container>
            </section>

            <CTAPartnership />
            <Footer />
        </main>
    );
}
