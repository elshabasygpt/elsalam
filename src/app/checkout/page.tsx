"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { useLanguage } from "@/lib/i18n-context";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, Loader2, MapPin, Phone, User, ShoppingBag, ShieldCheck, Lock, CreditCard, Printer, FileText, ArrowLeft, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/classnames";
import { motion } from "framer-motion";
import { egyptLocations } from "@/lib/egypt";
import { SearchableSelect } from "@/components/atoms/SearchableSelect";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function CheckoutPage() {
    return (
        <AuthProvider>
            <CheckoutContent />
        </AuthProvider>
    );
}

function CheckoutContent() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { t, locale, isRTL } = useLanguage();
    const router = useRouter();
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        governorate: "Cairo",
        city: "",
        shippingAddress: "",
    });
    
    const [shippingZones, setShippingZones] = useState<any[]>([]);
    const [promoInput, setPromoInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });
    const [siteSettings, setSiteSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/public/shipping").then(r => r.json()).then(setShippingZones).catch(console.error);
        fetch("/api/public/settings").then(r => r.json()).then(setSiteSettings).catch(console.error);
    }, []);

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                customerName: prev.customerName || session.user.name || "",
                customerEmail: prev.customerEmail || session.user.email || "",
            }));
        }
    }, [session]);

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        setPromoLoading(true);
        setPromoMessage({ text: "", type: "" });
        try {
            const res = await fetch("/api/public/checkout/validate-promo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: promoInput, totalAmount: getTotalPrice() })
            });
            const data = await res.json();
            if (data.valid) {
                setAppliedPromo(data);
                setPromoMessage({ text: data.message, type: "success" });
            } else {
                setAppliedPromo(null);
                setPromoMessage({ text: data.message, type: "error" });
            }
        } catch (e) {
            setPromoMessage({ text: locale === "ar" ? "فشل التحقق من الكود" : "Failed to validate code", type: "error" });
        } finally {
            setPromoLoading(false);
        }
    };

    const selectedGovernorateData = egyptLocations.find(loc => loc.nameEn === formData.governorate || loc.nameAr === formData.governorate);
    const dbZone = shippingZones.find(z => z.name_en === formData.governorate || z.name_ar === formData.governorate);
    const shippingFee = dbZone ? dbZone.fee : (selectedGovernorateData?.shippingBaseRate || 100);
    const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
    const finalTotal = getTotalPrice() - discountAmount + shippingFee;

    const ArrowForward = isRTL ? ChevronLeft : ChevronRight;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorToastOptions = {
            position: "bottom-center" as const,
            duration: 4000,
            style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: 'bold',
                padding: '16px 24px',
                borderRadius: '16px',
                fontSize: '16px',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
            },
        };

        // Custom Validation with Toasts
        if (!formData.customerName.trim()) {
            toast.error(locale === "ar" ? "برجاء كتابة الاسم كامل" : "Please enter your full name", errorToastOptions);
            return;
        }
        if (!formData.customerPhone.trim()) {
            toast.error(locale === "ar" ? "برجاء كتابة رقم الهاتف الخاص بك" : "Please enter your phone number", errorToastOptions);
            return;
        }
        if (!formData.governorate) {
            toast.error(locale === "ar" ? "برجاء اختيار المحافظة" : "Please select your governorate", errorToastOptions);
            return;
        }
        if (!formData.city) {
            toast.error(locale === "ar" ? "برجاء اختيار المدينة" : "Please select your city", errorToastOptions);
            return;
        }
        if (!formData.shippingAddress.trim()) {
            toast.error(locale === "ar" ? "برجاء كتابة العنوان التفصيلي بدقة" : "Please enter your detailed address", errorToastOptions);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/public/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    customerEmail: formData.customerEmail,
                    governorate: formData.governorate,
                    city: formData.city,
                    shippingAddress: formData.shippingAddress,
                    shippingFee,
                    promoCode: appliedPromo?.code || null,
                    items: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            if (res.ok) {
                const orderData = await res.json();
                // Snapshot order details for the invoice UI using real ID
                const orderId = orderData.orderId || orderData.id;
                const currentTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                
                setOrderDetails({
                    id: orderId,
                    items: [...items],
                    total: finalTotal,
                    shippingFee,
                    discountAmount,
                    promoCode: appliedPromo?.code,
                    formData: { ...formData },
                    date: new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                });

                setSuccess(true);
                clearCart();
                window.scrollTo(0, 0);
            } else {
                alert(locale === "ar" ? "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى." : "An error occurred while processing the order. Please try again.");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className={`min-h-screen bg-slate-50 flex flex-col relative ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                <div className="print:hidden h-full flex flex-col relative overflow-hidden flex-1">
                    <Navbar />
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-400/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 blur-[150px] rounded-full pointer-events-none" />

                    <div className="flex-1 flex items-center justify-center pt-40 md:pt-48 pb-20 relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white max-w-lg w-full mx-4 text-center ring-1 ring-slate-100"
                        >
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100 relative"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-600 drop-shadow-sm absolute" />
                                <div className="absolute w-full h-full border-4 border-green-400 border-t-transparent rounded-full animate-spin opacity-20"></div>
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-800 mb-2">{locale === "ar" ? "تم استلام طلبك بنجاح!" : "Order Received Successfully!"}</h1>
                            
                            {orderDetails && (
                                <div className="bg-slate-100/50 rounded-xl py-3 px-4 mb-6 inline-block font-mono text-lg font-bold text-slate-700 tracking-wider border border-slate-200">
                                    #{orderDetails.id}
                                </div>
                            )}

                            <p className="text-slate-500 mb-10 leading-relaxed text-lg px-2">
                                {locale === "ar" 
                                    ? "شكراً لثقتك بنا. سيتم مراجعة طلبك وسيقوم فريقنا بالتواصل معك قريباً لتأكيد موعد التسليم." 
                                    : "Thank you for trusting us. Your order will be reviewed and our team will contact you soon."}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-[0_10px_25px_rgba(15,23,42,0.2)] gap-2 group"
                                >
                                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {locale === "ar" ? "تحميل فاتورة PDF" : "Download PDF Invoice"}
                                </button>
                                <Link href="/products" className="inline-flex items-center justify-center w-full py-4 bg-white text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all border-2 border-slate-200 hover:border-slate-300 gap-2">
                                    {locale === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                                    {locale === "ar" ? "العودة للتسوق" : "Back to Shopping"}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                    <Footer />
                </div>

                {/* Printable Invoice Block */}
                {orderDetails && (
                    <>
                        <style dangerouslySetInnerHTML={{ __html: `
                            @media print {
                                @page { size: A4; margin: 0; }
                                body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
                            }
                        `}} />
                        <div className="hidden print:flex print:flex-col bg-white p-10 font-sans text-slate-900 w-[210mm] min-h-[297mm] mx-auto overflow-hidden relative" dir={isRTL ? "rtl" : "ltr"}>
                        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
                            <div>
                                {siteSettings?.invoiceShowLogo ? (
                                    (siteSettings?.invoiceLogoUrl || siteSettings?.logoUrl) ? (
                                        <img src={siteSettings.invoiceLogoUrl || siteSettings.logoUrl} alt="Logo" className="object-contain mb-2" crossOrigin="anonymous" style={{ height: `${siteSettings?.invoiceLogoSize || 64}px` }} />
                                    ) : (
                                        <div className="rounded-xl flex items-center justify-center mb-3 shadow-md print:shadow-none print:border print:border-green-800" style={{ backgroundImage: siteSettings?.invoiceColor ? 'none' : 'linear-gradient(to bottom right, #16a34a, #047857)', backgroundColor: siteSettings?.invoiceColor || '#16a34a', width: `${siteSettings?.invoiceLogoSize || 64}px`, height: `${siteSettings?.invoiceLogoSize || 64}px` }}>
                                            <Leaf className="text-white" style={{ width: `${(siteSettings?.invoiceLogoSize || 64) * 0.6}px`, height: `${(siteSettings?.invoiceLogoSize || 64) * 0.6}px` }} />
                                        </div>
                                    )
                                ) : (
                                    <h1 className="text-4xl font-black mb-2" style={{ color: siteSettings?.invoiceColor || '#0f172a' }}>{siteSettings?.siteNameEn || "ELSALAM"}</h1>
                                )}
                                {siteSettings?.invoiceSubtitle && (
                                    <p className="text-slate-500 text-sm font-medium">{siteSettings.invoiceSubtitle}</p>
                                )}
                                {siteSettings?.invoiceCompanyDetails && (
                                    <p className="text-slate-500 text-xs mt-2 whitespace-pre-wrap leading-relaxed">{siteSettings.invoiceCompanyDetails}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">{locale === "ar" ? "فاتورة طلب" : "INVOICE"}</h2>
                                <p className="text-slate-600 font-mono text-lg mb-1">#{orderDetails.id}</p>
                                <p className="text-slate-500 text-sm">{orderDetails.date}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10 mb-10">
                            <div>
                                <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs mb-3">{locale === "ar" ? "معلومات العميل" : "Customer Info"}</h3>
                                <p className="font-bold text-lg mb-1">{orderDetails.formData.customerName}</p>
                                <p className="text-slate-600 mb-1">{orderDetails.formData.customerPhone}</p>
                                {orderDetails.formData.customerEmail && <p className="text-slate-600">{orderDetails.formData.customerEmail}</p>}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs mb-3">{locale === "ar" ? "عنوان الشحن" : "Shipping Address"}</h3>
                                <p className="font-bold text-lg mb-1">{orderDetails.formData.governorate}</p>
                                <p className="text-slate-600">{orderDetails.formData.city}</p>
                                <p className="text-slate-600 mt-1">{orderDetails.formData.shippingAddress}</p>
                            </div>
                        </div>

                        <table className="w-full mb-10 text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 text-slate-700">
                                    <th className={`py-4 font-bold ${isRTL ? "text-right" : "text-left"}`}>{locale === "ar" ? "المنتج" : "Product"}</th>
                                    <th className="py-4 font-bold text-center">{locale === "ar" ? "الكمية" : "Qty"}</th>
                                    <th className={`py-4 font-bold ${isRTL ? "text-left" : "text-right"}`}>{locale === "ar" ? "الإجمالي" : "Total"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                        <td className={`py-4 ${isRTL ? "text-right" : "text-left"}`}>
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name_en} className="w-12 h-12 object-cover rounded-md border border-slate-200" crossOrigin="anonymous" />
                                                <div>
                                                    <p className="font-bold">{locale === "ar" ? item.name_ar : item.name_en}</p>
                                                    <p className="text-sm text-slate-500">{item.price} {locale === "ar" ? "ج.م." : "EGP"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center font-bold">{item.quantity}</td>
                                        <td className={`py-4 font-bold ${isRTL ? "text-left" : "text-right"}`}>{item.price * item.quantity} {locale === "ar" ? "ج.م." : "EGP"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="w-1/2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-600 font-bold">{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                                    <span className="font-bold">{orderDetails.total - (orderDetails.shippingFee || 0)} {locale === "ar" ? "ج.م." : "EGP"}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-600 font-bold">{locale === "ar" ? "مصاريف الشحن" : "Shipping"}</span>
                                    <span className="text-slate-800 font-bold">{orderDetails.shippingFee} {locale === "ar" ? "ج.م." : "EGP"}</span>
                                </div>
                                <div className="border-t-2 border-slate-200 pt-4 mt-2 flex justify-between items-center">
                                    <span className="text-2xl font-black">{locale === "ar" ? "الإجمالي" : "Total"}</span>
                                    <span className="text-2xl font-black text-green-700">{orderDetails.total} {locale === "ar" ? "ج.م." : "EGP"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t-2 border-slate-100 text-center text-slate-500 text-sm font-medium print:break-inside-avoid">
                            <p className="whitespace-pre-wrap">
                                {locale === "ar" 
                                    ? (siteSettings?.invoiceNotesAr || "نشكركم على اختياركم السلام للزيوت والدهون")
                                    : (siteSettings?.invoiceNotesEn || "Thank you for choosing Elsalam Oils & Fats")}
                            </p>
                            {siteSettings?.invoiceWebsiteUrl && (
                                <p className="mt-2 text-xs font-mono">{siteSettings.invoiceWebsiteUrl}</p>
                            )}
                        </div>
                        </div>
                    </>
                )}
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className={`min-h-screen bg-slate-50 flex flex-col relative overflow-hidden ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                <Navbar />
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center pt-40 md:pt-48 pb-20 px-4 relative z-10">
                    <ShoppingBag className="w-24 h-24 text-slate-200 mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-3">{locale === "ar" ? "سلة المشتريات فارغة" : "Your cart is empty"}</h1>
                    <p className="text-gray-500 mb-8">{locale === "ar" ? "قم بإضافة بعض المنتجات أولاً للمتابعة للدفع." : "Add some products first to proceed to checkout."}</p>
                    <Link href="/products" className="px-8 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all">
                        {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className={`min-h-screen bg-slate-50 flex flex-col relative pt-[80px] lg:pt-[88px] ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />
            
            {/* Header Area */}
            <div className="bg-slate-900 text-white pt-20 md:pt-24 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-300 via-transparent to-transparent"></div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black mb-4">{locale === "ar" ? "إتمام الشراء" : "Secure Checkout"}</h1>
                    <div className="flex items-center justify-center gap-4 mt-6 text-slate-300 font-bold text-sm sm:text-base">
                        <span className="flex items-center gap-2 drop-shadow-sm"><Lock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" /> {locale === "ar" ? "دفع آمن 100%" : "100% Secure"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mx-2"></span>
                        <span className="flex items-center gap-2 drop-shadow-sm"><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" /> {locale === "ar" ? "ضمان استرجاع" : "Money-back Guarantee"}</span>
                    </div>
                </Container>
            </div>

            <section className="-mt-32 pb-24 flex-1 relative z-20">
                <Container>
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* ── Checkout Form ── */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="xl:col-span-8 space-y-6"
                        >
                            {/* Contact Section */}
                            <form id="checkout-form" onSubmit={handleSubmit} noValidate className="bg-white rounded-[24px] shadow-sm border border-slate-200">
                                <div className="border-b border-slate-100 p-6 md:p-8 flex items-center gap-4 bg-slate-50/50 relative rounded-t-[24px]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] rounded-tr-[24px] pointer-events-none"></div>
                                    <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] min-w-[56px] sm:min-w-[64px] bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-inner relative z-10 shrink-0">
                                        <User className="text-green-400 shrink-0" style={{ width: '32px', height: '32px' }} strokeWidth={2.5} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-black text-slate-900">{locale === "ar" ? "1. بيانات التواصل" : "1. Contact Info"}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{locale === "ar" ? "معلومات التواصل الأساسية لتأكيد الطلب" : "Basic info to confirm your order"}</p>
                                    </div>
                                </div>
                                
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "الاسم كامل" : "Full Name"} <span className="text-red-500">*</span></label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={formData.customerName}
                                            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                            placeholder={locale === "ar" ? "الاسم الثنائي على الأقل" : "First and last name"}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "رقم الهاتف" : "Phone Number"} <span className="text-red-500">*</span></label>
                                        <input 
                                            required 
                                            type="tel" 
                                            value={formData.customerPhone}
                                            onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all text-left font-medium text-slate-800 placeholder:text-slate-400"
                                            dir="ltr"
                                            placeholder="+20 100 000 0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}</label>
                                        <input 
                                            type="email" 
                                            value={formData.customerEmail}
                                            onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400 text-left"
                                            dir="ltr"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-4 bg-slate-50 border-t border-b border-slate-100" />

                                {/* Shipping Section */}
                                <div className="border-b border-slate-100 p-6 md:p-8 flex items-center gap-4 bg-slate-50/50 relative">
                                    <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] min-w-[56px] sm:min-w-[64px] bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-inner relative z-10 shrink-0">
                                        <MapPin className="text-green-400 shrink-0" style={{ width: '32px', height: '32px' }} strokeWidth={2.5} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-black text-slate-900">{locale === "ar" ? "2. التوصيل والشحن" : "2. Shipping"}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{locale === "ar" ? "أين نرسل لك طلبك؟" : "Where should we send your order?"}</p>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "المحافظة" : "Governorate"} <span className="text-red-500">*</span></label>
                                            <SearchableSelect 
                                                required
                                                value={formData.governorate}
                                                onChange={(val) => setFormData({ ...formData, governorate: val, city: "" })}
                                                placeholder={locale === "ar" ? "اختر المحافظة" : "Select Governorate"}
                                                searchPlaceholder={locale === "ar" ? "ابحث عن المحافظة..." : "Search governorate..."}
                                                options={shippingZones.length > 0 ? shippingZones.map(gov => ({
                                                    value: gov.name_en,
                                                    label: locale === "ar" ? gov.name_ar : gov.name_en
                                                })) : egyptLocations.map(gov => ({
                                                    value: gov.nameEn,
                                                    label: locale === "ar" ? gov.nameAr : gov.nameEn
                                                }))}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "المدينة" : "City"} <span className="text-red-500">*</span></label>
                                            <SearchableSelect 
                                                required
                                                disabled={!selectedGovernorateData}
                                                value={formData.city}
                                                onChange={(val) => setFormData({ ...formData, city: val })}
                                                placeholder={locale === "ar" ? "اختر المدينة" : "Select City"}
                                                searchPlaceholder={locale === "ar" ? "ابحث عن المدينة..." : "Search city..."}
                                                options={selectedGovernorateData ? selectedGovernorateData.cities.map(city => ({
                                                    value: city.nameEn,
                                                    label: locale === "ar" ? city.nameAr : city.nameEn
                                                })) : []}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "العنوان التفصيلي" : "Detailed Address"} <span className="text-red-500">*</span></label>
                                        <textarea 
                                            required 
                                            rows={3}
                                            value={formData.shippingAddress}
                                            onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all resize-none font-medium text-slate-800 placeholder:text-slate-400"
                                            placeholder={locale === "ar" ? "اسم الشارع، رقم المبنى، الدور، الشقة، علامة مميزة..." : "Street name, building num, floor, apt, landmark..."}
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-4 bg-slate-50 border-t border-b border-slate-100" />

                                {/* Payment Section */}
                                <div className="p-6 md:p-8 bg-green-50/30 rounded-b-[24px]">
                                    <h4 className="font-bold text-slate-800 mb-4">{locale === "ar" ? "طريقة الدفع المتوفرة" : "Available Payment Method"}</h4>
                                    <div className="bg-white border-2 border-green-500/30 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-[100px] pointer-events-none" />
                                        <div className="w-6 h-6 rounded-full border-[6px] border-green-600 shrink-0 bg-white"></div>
                                        <div>
                                            <h4 className="font-bold text-green-900 text-[15px]">{locale === "ar" ? "الدفع عند الاستلام (COD)" : "Cash on Delivery"}</h4>
                                            <p className="text-sm text-green-700/70 mt-1">{locale === "ar" ? "ادفع نقداً بكل أمان عند استلام شحنتك" : "Pay securely in cash when you receive your order"}</p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>

                        {/* ── Order Summary ── */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="xl:col-span-4"
                        >
                            <div className="bg-slate-900 text-white rounded-[24px] shadow-xl border border-slate-800 p-6 md:p-8 sticky top-32 overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-600"></div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[200px] pointer-events-none"></div>

                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                                    <ShoppingBag className="text-green-400 shrink-0" style={{ width: '36px', height: '36px' }} strokeWidth={2.5} />
                                    {locale === "ar" ? "فاتورة الطلب" : "Order Invoice"}
                                </h3>
                                
                                <div className="space-y-4 mb-8 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-start gap-4 p-3 bg-slate-800/80 hover:bg-slate-800 rounded-2xl transition-colors border border-slate-700">
                                            <div className="w-[72px] h-[72px] bg-white rounded-xl p-2 shrink-0 relative flex items-center justify-center">
                                                <img src={item.image} alt={item.name_ar} className="max-w-full max-h-full object-contain" />
                                                <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-green-500 text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-md border-2 border-white ring-2 ring-slate-900">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">{locale === "ar" ? item.name_ar : item.name_en}</p>
                                                <p className="text-green-400 font-black text-base mt-2 tracking-wide">{item.price.toLocaleString()} <span className="text-xs text-green-400/70">{locale === "ar" ? "ج.م" : "EGP"}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-slate-700/80 pt-6 space-y-4 mb-8 relative z-10">
                                    <div className="flex justify-between items-center text-slate-400 font-medium text-sm">
                                        <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                                        <span className="font-bold text-white text-base tracking-wide">{getTotalPrice().toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-medium text-sm">
                                        <span>{locale === "ar" ? "مصاريف الشحن" : "Shipping"}</span>
                                        <span className="font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-md text-xs">
                                            {shippingFee > 0 ? `${shippingFee.toLocaleString()} ${locale === "ar" ? "ج.م" : "EGP"}` : (locale === "ar" ? "اختر المحافظة" : "Select Gov")}
                                        </span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-rose-400 font-medium text-sm bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                                            <span>{locale === "ar" ? "الخصم" : "Discount"} ({appliedPromo.code})</span>
                                            <span className="font-bold">- {discountAmount.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code Input Field */}
                                <div className="mb-8 relative z-10">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            placeholder={locale === "ar" ? "كود الخصم (اختياري)" : "Promo Code (Optional)"}
                                            value={promoInput}
                                            onChange={e => setPromoInput(e.target.value.toUpperCase())}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-green-500 transition-colors uppercase tracking-wider"
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={promoLoading || !promoInput.trim()}
                                            className="bg-slate-700 hover:bg-slate-600 text-white px-5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center shrink-0 min-w-[80px]"
                                        >
                                            {promoLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : (locale === "ar" ? "تطبيق" : "Apply")}
                                        </button>
                                    </div>
                                    {promoMessage.text && (
                                        <p className={`mt-2 text-xs font-bold ${promoMessage.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                                            {promoMessage.text}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex justify-between items-end mb-8 shadow-inner relative z-10">
                                    <span className="text-slate-300 font-bold">{locale === "ar" ? "الإجمالي المطلوب" : "Total Required"}</span>
                                    <span className="text-[32px] leading-none font-black text-white">{finalTotal.toLocaleString()} <span className="text-sm font-medium text-slate-400 ml-1">{locale === "ar" ? "ج.م" : "EGP"}</span></span>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading}
                                    className="relative z-10 w-full overflow-hidden flex items-center justify-center gap-3 py-4 bg-green-500 text-slate-900 font-black text-[17px] rounded-2xl transition-all shadow-[0_5px_15px_rgba(34,197,94,0.3)] disabled:opacity-70 group hover:shadow-[0_10px_25px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {loading ? (
                                        <Loader2 className="w-7 h-7 animate-spin relative z-10" />
                                    ) : (
                                        <>
                                            <span className="relative z-10 drop-shadow-sm">{locale === "ar" ? "تأكيد الطلب الآن" : "Confirm Order Now"}</span>
                                            <Lock className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110 drop-shadow-sm" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-bold relative z-10 bg-slate-800/50 py-3 rounded-xl border border-slate-700/50">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 shrink-0" />
                                    <span>{locale === "ar" ? "معلوماتك مشفرة ومحمية بالكامل" : "Your information is securely encrypted"}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
