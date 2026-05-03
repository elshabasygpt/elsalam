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
    FileText, ArrowLeft, ArrowRight, Sparkles, Settings, ShoppingBag, ShoppingCart, CreditCard,
    Lock, Truck, Handshake
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
    const [activeTab, setActiveTab] = useState("description");
    
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
    const longDesc = locale === "ar" ? (product.description_ar || product.long_description_ar) : (product.description_en || product.long_description_en);
    const features = safeArray(locale === "ar" ? product.features_ar : product.features_en);
    const certifications = safeArray(product.certifications);
    const categoryName = product.category ? (locale === "ar" ? product.category.name_ar : product.category.name_en) : "";
    const activePromo = product.promotions?.[0];
    const promoBadge = activePromo ? (locale === "ar" ? activePromo.badge_ar : activePromo.badge_en) : null;

    return (
        <main className={`min-h-screen bg-slate-50 ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />

            {/* Flat Header Background spacing + Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-6">
                <Container>
                    <Breadcrumbs items={[
                        { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
                        { label: locale === "ar" ? "منتجاتنا" : "Products", href: "/products" },
                        { label: title },
                    ]} variant="dark" />
                </Container>
            </div>

            <section className="py-8 lg:py-12 relative z-10">
                <Container>
                    {/* Active Promotion Banner */}
                    {activePromo && (
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md border border-red-500">
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
                    )}

                    {/* Upper Product Purchase Fold (Dense Split Layout) */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-12 flex flex-col lg:flex-row">
                        {/* —— LEFT COLUMN: Sticky Image Gallery —— */}
                        <div className="w-full lg:w-[45%] xl:w-[40%] bg-slate-50/60 p-6 sm:p-10 border-b lg:border-b-0 lg:border-l border-gray-200 flex flex-col items-center relative overflow-hidden">
                            {/* Decorative soft glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-[60px] pointer-events-none" />
                            
                            <motion.div
                                className="relative z-20 w-full max-w-[320px] sm:max-w-[400px] xl:max-w-[480px] aspect-square flex items-center justify-center mt-4 sm:mt-8"
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            >
                                <img
                                    src={activeImage || product.featured_image || "/images/placeholder.svg"}
                                    alt={title}
                                    className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] mix-blend-multiply cursor-crosshair hover:scale-105 transition-transform duration-500"
                                />
                                
                                {/* Inner Floating Box Badges */}
                                <div className={`absolute top-0 sm:top-4 ${isRTL ? '-right-2 sm:-right-4' : '-left-2 sm:-left-4'} bg-white shadow-lg p-3 sm:p-5 rounded-2xl flex flex-col items-center gap-1 border border-gray-100 scale-90 sm:scale-100 z-30`}>
                                    <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                                    <span className="text-xs sm:text-sm font-black uppercase text-gray-800 leading-tight text-center">ISO<br/>22000</span>
                                </div>
                                <div className={`absolute bottom-4 sm:bottom-8 ${isRTL ? '-left-2 sm:-left-6' : '-right-2 sm:-right-6'} bg-white shadow-lg px-4 py-3 sm:px-5 sm:py-4 rounded-xl flex items-center justify-center gap-3 border border-gray-100 scale-90 sm:scale-100 z-30`}>
                                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 shrink-0" />
                                    <span className="text-sm sm:text-base font-black text-gray-800 leading-none">100%<br/><span className="text-[10px] sm:text-xs text-gray-500 font-medium">{locale === "ar" ? "طبيعي ونقي" : "Pure & Natural"}</span></span>
                                </div>
                            </motion.div>

                            {/* Image Thumbnails Gallery */}
                            {(product.images && product.images.length > 0) && (
                                <div className="relative z-20 mt-10 md:mt-16 mb-4 flex justify-center flex-wrap items-center gap-2 sm:gap-3 w-full shrink-0">
                                    <div
                                        role="button"
                                        onClick={() => setActiveImage(product.featured_image || "/images/placeholder.svg")}
                                        className={cn("w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] rounded-xl bg-white border-2 transition-all cursor-pointer p-1 shrink-0 flex items-center justify-center shadow-sm", (!activeImage || activeImage === product.featured_image) ? "border-green-600 scale-105 shadow-md" : "border-gray-200 hover:border-green-400 opacity-80 hover:opacity-100")}
                                    >
                                        <img src={product.featured_image || "/images/placeholder.svg"} className="max-w-full max-h-full object-contain mix-blend-multiply" alt="Main" />
                                    </div>
                                    {product.images.map((img, i) => (
                                        <div
                                            role="button"
                                            key={i}
                                            onClick={() => setActiveImage(img.url)}
                                            className={cn("w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] rounded-xl bg-white border-2 transition-all cursor-pointer p-1 shrink-0 flex items-center justify-center shadow-sm", activeImage === img.url ? "border-green-600 scale-105 shadow-md" : "border-gray-200 hover:border-green-400 opacity-80 hover:opacity-100")}
                                        >
                                            <img src={img.url} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={`Gallery ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* —— RIGHT COLUMN: Product Information —— */}
                        <div className="w-full lg:w-[55%] xl:w-[60%] p-6 sm:p-10 xl:p-12 text-start flex flex-col">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-bold rounded-lg">{categoryName}</span>
                                {product.is_exportable && (
                                    <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 border border-green-200">
                                        <Globe className="w-5 h-5 shrink-0" />
                                        {locale === "ar" ? "متاح للتصدير" : "Export Available"}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 pb-3 leading-relaxed drop-shadow-sm">{title}</h1>
                            <p className="text-gray-400 text-sm md:text-base font-bold tracking-[0.2em] uppercase font-english mb-8 pt-2">{subtitle}</p>

                            <div className="mb-8">
                                <PriceTag
                                    price={product.price || (product.packagings?.length > 0 ? product.packagings[0].price : null)}
                                    originalPrice={activePromo?.original_price}
                                    promoPrice={activePromo?.promo_price}
                                    unitAr={product.price_unit_ar || undefined}
                                    unitEn={product.price_unit_en || undefined}
                                    size="lg"
                                    className="!text-green-700 font-black text-3xl sm:text-4xl"
                                />
                                <p className="text-xs font-bold text-gray-400 mt-2">{locale === "ar" ? "الأسعار شاملة ضريبة القيمة المضافة (VAT)" : "Prices are VAT inclusive"}</p>
                            </div>

                            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 block border-b border-gray-100 pb-6">{description}</p>
                            
                            {features && features.length > 0 && (
                                <ul className="flex flex-col gap-3 mb-8">
                                    {features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-5 h-5 text-green-700 shrink-0" />
                                            </div>
                                            <span className="text-gray-800 font-medium text-sm sm:text-base leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Purchase CTA Box */}
                            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 sm:p-6 mt-auto shrink-0 shadow-inner">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <button
                                            onClick={() => {
                                                const finalPrice = activePromo?.promo_price || product.price || (product.packagings?.length > 0 ? product.packagings[0].price : 0) || 0;
                                                addItem({
                                                    id: product.id.toString(), productId: product.id, name_ar: product.name_ar, name_en: product.name_en,
                                                    price: finalPrice, quantity: 1, image: product.featured_image || "/images/placeholder.svg", slug: product.slug
                                                });
                                                setCartOpen(true);
                                            }}
                                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-700 text-white font-black rounded-xl hover:scale-[1.02] hover:bg-green-800 transition-all shadow-[0_4px_15px_rgba(22,163,74,0.3)] text-sm sm:text-base"
                                        >
                                            <ShoppingCart className="w-6 h-6 shrink-0" />
                                            {locale === "ar" ? "أضف للسلة" : "Add to Cart"}
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                const finalPrice = activePromo?.promo_price || product.price || (product.packagings?.length > 0 ? product.packagings[0].price : 0) || 0;
                                                addItem({
                                                    id: product.id.toString(), productId: product.id, name_ar: product.name_ar, name_en: product.name_en,
                                                    price: finalPrice, quantity: 1, image: product.featured_image || "/images/placeholder.svg", slug: product.slug
                                                });
                                                router.push("/checkout");
                                            }}
                                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-slate-900 font-black rounded-xl hover:scale-[1.02] hover:bg-yellow-500 transition-all shadow-[0_4px_15px_rgba(250,204,21,0.2)] text-sm sm:text-base"
                                        >
                                            <CreditCard className="w-6 h-6 shrink-0" />
                                            {locale === "ar" ? "شراء مباشر سريع" : "Fast Buy Now"}
                                        </button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:text-green-800 transition-all text-sm sm:text-base"
                                    >
                                        <Handshake className="w-5 h-5 shrink-0" />
                                        {locale === "ar" ? "طلب تسعير جملة B2B" : "Request Bulk B2B Quote"}
                                    </Link>
                                </div>
                            </div>

                            {/* Trust Elements Footer */}
                            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 font-bold">
                                <span className="flex items-center gap-1.5"><Lock className="w-5 h-5 text-green-600 shrink-0" /> {locale === "ar" ? "دفع آمن 100%" : "Secure Checkout"}</span>
                                <span className="flex items-center gap-1.5"><Truck className="w-5 h-5 text-green-600 shrink-0" /> {locale === "ar" ? "توصيل سريع متاح" : "Fast Delivery"}</span>
                                <span className="flex items-center gap-1.5"><Check className="w-5 h-5 text-green-600 shrink-0" /> {locale === "ar" ? "جودة مضمونة" : "Quality Guaranteed"}</span>
                            </div>
                        </div>
                    </div>

                    {/* ─── TECHNICAL TABS SECTION ─── */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8" id="product-details-tabs">
                        {/* Interactive Tab Headers */}
                        <div className="flex flex-nowrap items-center gap-2 border-b border-gray-200 bg-slate-50/50 p-3 sm:p-5 overflow-x-auto custom-scrollbar" role="tablist">
                            {[
                                { id: "description", label: locale === "ar" ? "الوصف التفصيلي" : "Description", icon: FileText },
                                { id: "specs", label: locale === "ar" ? "المواصفات الفنية" : "Specifications", icon: Settings, condition: product.technical_specs?.length > 0 || product.specs?.length > 0 },
                                { id: "packaging", label: locale === "ar" ? "خيارات التعبئة" : "Packaging Options", icon: Package, condition: product.packagings?.length > 0 },
                                { id: "downloads", label: locale === "ar" ? "الشهادات والملفات" : "Quality & Downloads", icon: ShieldCheck, condition: product.pdf_datasheet || certifications.length > 0 }
                            ].filter(t => t.condition !== false).map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all focus:outline-none shrink-0",
                                            isActive ? "bg-green-700 text-white shadow-md shadow-green-700/20" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Dynamic Content Panel */}
                        <div className="p-6 sm:p-8 md:p-12 min-h-[350px]">
                            {/* Panel: Description */}
                            {activeTab === "description" && (
                                <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                                        <div className="p-2.5 bg-green-50 rounded-xl">
                                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-700 shrink-0" />
                                        </div>
                                        {locale === "ar" ? "الوصف الشامل للمنتج" : "Comprehensive Description"}
                                    </h3>
                                    {longDesc ? (
                                        <div className="text-gray-700 text-lg leading-loose text-justify font-medium">
                                            <p className="whitespace-pre-wrap">{longDesc}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic font-medium">{locale === "ar" ? "لا يوجد وصف مطول متاح." : "No long description available."}</p>
                                    )}
                                </div>
                            )}

                            {/* Panel: Specifications */}
                            {activeTab === "specs" && (
                                <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {product.technical_specs && product.technical_specs.length > 0 && (
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">{locale === "ar" ? "المواصفات الفنية التفصيلية" : "Detailed Technical Specs"}</h3>
                                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                                <table className="w-full text-start" dir={isRTL ? "rtl" : "ltr"}>
                                                    <thead className="bg-slate-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-5 py-4 text-start">{locale === "ar" ? "الخاصية" : "Property"}</th>
                                                            <th className="px-5 py-4 text-start">{locale === "ar" ? "القيمة" : "Value"}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {product.technical_specs.map((spec, i) => (
                                                            <tr key={i} className={`border-b border-gray-50 last:border-0 hover:bg-green-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/20"}`}>
                                                                <td className={`px-5 py-4 text-sm font-bold text-gray-800 w-1/2`}>
                                                                    {locale === "ar" ? spec.property_ar : spec.property_en}
                                                                </td>
                                                                <td className="px-5 py-4 text-sm text-gray-600 font-medium border-x border-gray-100">
                                                                    {locale === "ar" ? spec.value_ar : spec.value_en}
                                                                    {spec.unit_ar && locale === "ar" && <span className="text-xs text-gray-400 font-bold mr-1">{spec.unit_ar}</span>}
                                                                    {spec.unit_en && locale === "en" && <span className="text-xs text-gray-400 font-bold ml-1">{spec.unit_en}</span>}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Brief Specs Table (Basic) */}
                                    {product.specs && product.specs.length > 0 && (
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">{locale === "ar" ? "الخصائص الأساسية" : "Basic Characteristics"}</h3>
                                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                                <table className="w-full text-start" dir={isRTL ? "rtl" : "ltr"}>
                                                    <tbody>
                                                        {product.specs.map((spec, i) => (
                                                            <tr key={i} className="border-b border-gray-100 bg-white hover:bg-green-50/30 transition-colors">
                                                                <td className="px-5 py-3 text-sm font-bold text-gray-800 bg-slate-50/50 w-1/3">
                                                                    {locale === "ar" ? spec.label_ar : spec.label_en}
                                                                </td>
                                                                <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                                                                    {locale === "ar" ? spec.value_ar : spec.value_en}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Panel: Packaging */}
                            {activeTab === "packaging" && (
                                <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 mb-6 pb-4 flex items-center gap-3">
                                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 shrink-0" />
                                        {locale === "ar" ? "خيارات التعبئة والأوزان" : "Packaging Options"}
                                    </h3>
                                    <PackagingPriceTable packagings={product.packagings} />
                                    
                                    {product.is_exportable && (
                                        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 sm:p-6 flex items-start gap-4">
                                            <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-blue-900 text-lg mb-1">{locale === "ar" ? "مخارج الشحن والتصدير" : "Shipping & Export Logistics"}</h4>
                                                <p className="text-sm sm:text-base text-blue-800/80 leading-relaxed max-w-2xl">{locale === "ar" ? "يتم ترتيب باليتات التحميل وفق المعايير الدولية للشحن البحري (20ft / 40ft containers). نرجو التواصل مع قسم المبيعات لتنسيق حمولة الحاويات." : "Loading pallets are arranged according to international sea freight standards. Please contact sales to coordinate container loads."}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Panel: Downloads & Certs */}
                            {activeTab === "downloads" && (
                                <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {certifications.length > 0 && (
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">{locale === "ar" ? "شهادات واعتمادات الجودة" : "Quality Credentials"}</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {certifications.map((cert, i) => (
                                                    <span key={i} className="px-5 py-4 bg-white text-gray-800 text-sm sm:text-base font-bold rounded-xl border-2 border-gray-200 shadow-sm flex items-center gap-2.5 hover:border-green-500 hover:text-green-700 transition-colors">
                                                        <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 shrink-0" />
                                                        {cert}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {product.pdf_datasheet && (
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">{locale === "ar" ? "الملفات المرفقة التقنية" : "Technical Attachments"}</h3>
                                            <a
                                                href={product.pdf_datasheet}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group max-w-md w-full"
                                            >
                                                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                    <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 group-hover:text-green-700 transition-colors">
                                                        {locale === "ar" ? "تنزيل البيانات الفنية (TDS)" : "Download Tech Data (TDS)"}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1 font-medium">{locale === "ar" ? "ملف PDF قابل للطباعة" : "Printable PDF document"}</p>
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            <CTAPartnership />
            <Footer />
        </main>
    );
}
