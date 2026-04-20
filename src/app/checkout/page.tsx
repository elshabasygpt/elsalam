"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { useLanguage } from "@/lib/i18n-context";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, Loader2, MapPin, Phone, User, ShoppingBag, ShieldCheck, Lock, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/classnames";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { t, locale, isRTL } = useLanguage();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        governorate: "Cairo",
        shippingAddress: "",
    });

    const ArrowForward = isRTL ? ChevronLeft : ChevronRight;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/public/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            if (res.ok) {
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
            <main className={`min-h-screen bg-slate-50 flex flex-col relative overflow-hidden ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
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
                            className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-600 drop-shadow-sm" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-slate-800 mb-4">{locale === "ar" ? "تم استلام طلبك بنجاح!" : "Order Received Successfully!"}</h1>
                        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
                            {locale === "ar" 
                                ? "شكراً لثقتك بنا. سيتم مراجعة طلبك وسيقوم فريقنا بالتواصل معك قريباً لتأكيد موعد التسليم والدفع عند الاستلام." 
                                : "Thank you for trusting us. Your order will be reviewed and our team will contact you soon to confirm delivery and cash on delivery payment."}
                        </p>
                        <Link href="/products" className="inline-flex items-center justify-center w-full py-4 bg-green-600 text-white font-bold text-lg rounded-2xl hover:bg-green-700 hover:scale-[1.02] transition-all shadow-[0_10px_25px_rgba(22,163,74,0.3)]">
                            {locale === "ar" ? "العودة للتسوق" : "Back to Shopping"}
                        </Link>
                    </motion.div>
                </div>
                <Footer />
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
        <main className={`min-h-screen bg-slate-50 flex flex-col relative ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <Navbar />
            
            {/* Header Area */}
            <div className="bg-slate-900 text-white pt-40 md:pt-48 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-300 via-transparent to-transparent"></div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black mb-4">{locale === "ar" ? "إتمام الشراء" : "Secure Checkout"}</h1>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-300">
                        <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-400" /> {locale === "ar" ? "دفع آمن 100%" : "100% Secure"}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-500 mx-2"></span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-400" /> {locale === "ar" ? "ضمان استرجاع" : "Money-back Guarantee"}</span>
                    </div>
                </Container>
            </div>

            <section className="-mt-20 pb-24 flex-1 relative z-20">
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
                            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="border-b border-slate-100 p-6 md:p-8 flex items-center gap-4 bg-slate-50/50 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] pointer-events-none"></div>
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-inner relative z-10">
                                        <User className="w-6 h-6" />
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
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-inner relative z-10">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-xl font-black text-slate-900">{locale === "ar" ? "2. التوصيل والشحن" : "2. Shipping"}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{locale === "ar" ? "أين نرسل لك طلبك؟" : "Where should we send your order?"}</p>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">{locale === "ar" ? "المحافظة / المدينة" : "Governorate / City"} <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select 
                                                required
                                                value={formData.governorate}
                                                onChange={e => setFormData({ ...formData, governorate: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 hover:border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-600/10 focus:border-green-600 focus:bg-white transition-all appearance-none font-medium text-slate-800"
                                            >
                                                <option value="Cairo">{locale === "ar" ? "القاهرة" : "Cairo"}</option>
                                                <option value="Giza">{locale === "ar" ? "الجيزة" : "Giza"}</option>
                                                <option value="Alexandria">{locale === "ar" ? "الإسكندرية" : "Alexandria"}</option>
                                                <option value="Other">{locale === "ar" ? "أخرى (سيتم تحديدها في العنوان)" : "Other (specify in address)"}</option>
                                            </select>
                                            <ChevronDown className={`absolute ${isRTL ? "left-5" : "right-5"} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none`} />
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
                                <div className="p-6 md:p-8 bg-green-50/30">
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
                                    <ShoppingBag className="w-6 h-6 text-green-400" />
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
                                        <span className="font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-md text-xs">{locale === "ar" ? "تحدد لاحقاً" : "TBD"}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex justify-between items-end mb-8 shadow-inner relative z-10">
                                    <span className="text-slate-300 font-bold">{locale === "ar" ? "الإجمالي المطلوب" : "Total Required"}</span>
                                    <span className="text-[32px] leading-none font-black text-white">{getTotalPrice().toLocaleString()} <span className="text-sm font-medium text-slate-400 ml-1">{locale === "ar" ? "ج.م" : "EGP"}</span></span>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading}
                                    className="relative z-10 w-full overflow-hidden flex items-center justify-center gap-3 py-4 bg-green-500 text-slate-900 font-black text-[17px] rounded-2xl transition-all shadow-[0_5px_15px_rgba(34,197,94,0.3)] disabled:opacity-70 group hover:shadow-[0_10px_25px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">{locale === "ar" ? "تأكيد الطلب الآن" : "Confirm Order Now"}</span>
                                            <Lock className="w-4 h-4 relative z-10 transition-transform group-hover:scale-110" />
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium relative z-10">
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
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
