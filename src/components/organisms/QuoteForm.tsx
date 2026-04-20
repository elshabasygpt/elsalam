"use client";

import React, { useState } from "react";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CheckCircle, ArrowRight, ArrowLeft, Package, Globe, User, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const QuoteForm = () => {
    const { t, isRTL } = useLanguage();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        requirements: [] as string[],
        volume: "", packaging: "",
        country: "", notes: "",
        companyName: "", contactName: "", email: "", phone: ""
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) { nextStep(); return; }
        
        setLoading(true);
        try {
            const bodyContent = `
Requirements: ${formData.requirements.join(", ")}
Volume: ${formData.volume}
Packaging: ${formData.packaging}
Country: ${formData.country}
Notes: ${formData.notes}
            `.trim();

            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.contactName,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.companyName,
                    subject: "B2B Quote Request",
                    body: bodyContent,
                    type: "quote"
                })
            });

            if (res.ok) {
                setSubmitted(true);
                toast.success(isRTL ? "تم إرسال طلب عرض السعر بنجاح!" : "Quote request submitted successfully!", {
                    duration: 4000, position: "bottom-center",
                    style: { background: '#16a34a', color: '#fff', fontWeight: 'bold', padding: '16px', borderRadius: '12px' },
                    iconTheme: { primary: '#fff', secondary: '#16a34a' },
                });
            } else {
                toast.error(isRTL ? "خطأ في الإرسال" : "Failed to send request.");
            }
        } catch {
            toast.error(isRTL ? "فشل الاتصال بالخادم" : "Server connection failed.");
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <section className="py-24 bg-surface-soft">
                <Container className="max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-3xl shadow-2xl border border-green-100"
                    >
                        <span className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </span>
                        <Typography variant="h3" className="text-gray-900 mb-4 font-black">
                            {t.quote.successTitle}
                        </Typography>
                        <Typography variant="body-lg" className="text-gray-600">
                            {t.quote.successMessage}
                        </Typography>
                    </motion.div>
                </Container>
            </section>
        );
    }

    const NextIcon = isRTL ? ArrowLeft : ArrowRight;
    const PrevIcon = isRTL ? ArrowRight : ArrowLeft;

    return (
        <section className="py-24 bg-surface-soft relative overflow-hidden" id="quote-form">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[100px] pointer-events-none" />

            <Container className="max-w-4xl relative z-10">
                <SectionHeader
                    title={t.quote.title}
                    subtitle={t.quote.subtitle}
                />

                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                    {/* Stepper Header */}
                    <div className="bg-gray-50 border-b border-gray-100 p-6 md:px-10 flex justify-between items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block" />
                        <div
                            className="absolute top-1/2 h-1 bg-green-500 -translate-y-1/2 z-0 hidden sm:block transition-all duration-500"
                            style={{ width: `${(step - 1) * 50}%`, right: isRTL ? '40px' : 'auto', left: isRTL ? 'auto' : '40px' }}
                        />

                        {[
                            { num: 1, label: isRTL ? "الاحتياجات" : "Requirements", icon: Package },
                            { num: 2, label: isRTL ? "الشحن" : "Shipping", icon: Globe },
                            { num: 3, label: isRTL ? "التواصل" : "Contact", icon: User }
                        ].map((s) => (
                            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors duration-300 ${step >= s.num
                                    ? "bg-green-600 border-green-100 text-white shadow-lg shadow-green-600/30"
                                    : "bg-white border-gray-100 text-gray-400"
                                    }`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-bold ${step >= s.num ? "text-green-700" : "text-gray-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="p-8 md:p-12 min-h-[400px]">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {/* Step 1: Requirements */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 mb-6">{isRTL ? "ما هي احتياجاتك؟" : "What are your requirements?"}</h3>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-4">{t.quote.productsLabel} *</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {t.quote.products.map((p: string, i: number) => (
                                                    <label key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50/50 cursor-pointer transition-all">
                                                        <input type="checkbox" className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                                                            checked={formData.requirements.includes(p)}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    requirements: e.target.checked 
                                                                        ? [...prev.requirements, p]
                                                                        : prev.requirements.filter(req => req !== p)
                                                                }))
                                                            }}
                                                        />
                                                        <span className="font-semibold text-gray-700">{p}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField label={t.quote.volume} type="number" placeholder={t.quote.volumePlaceholder} required 
                                                value={formData.volume} onChange={(e) => setFormData(prev => ({...prev, volume: e.target.value}))} />
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">{t.quote.packagingLabel}</label>
                                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium appearance-none"
                                                    value={formData.packaging} onChange={(e) => setFormData(prev => ({...prev, packaging: e.target.value}))}>
                                                    <option value="">{isRTL ? "اختر التعبئة" : "Select Packaging"}</option>
                                                    {t.quote.packaging.map((p: string, i: number) => (
                                                        <option key={i} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Shipping */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 mb-6">{isRTL ? "تفاصيل الشحن" : "Shipping Details"}</h3>

                                        <FormField label={t.quote.country} placeholder={t.quote.countryPlaceholder} required 
                                            value={formData.country} onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))} />

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t.quote.notes}</label>
                                            <textarea
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none font-medium"
                                                placeholder={t.quote.notesPlaceholder}
                                                value={formData.notes} onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Contact */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black text-gray-900 mb-6">{isRTL ? "بيانات التواصل" : "Contact Information"}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                            <FormField label={t.quote.companyName} placeholder={t.quote.companyPlaceholder} required 
                                                value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} />
                                            <FormField label={t.quote.contactName} placeholder={t.quote.contactPlaceholder} required 
                                                value={formData.contactName} onChange={(e) => setFormData(prev => ({...prev, contactName: e.target.value}))} />
                                            <FormField label={t.quote.email} type="email" placeholder="trade@company.com" dir="ltr" required 
                                                value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} />
                                            <FormField label={t.quote.phone} type="tel" placeholder="+123456789" dir="ltr" required 
                                                value={formData.phone} onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))} />
                                        </div>

                                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                                            <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-blue-800 font-medium">
                                                {isRTL
                                                    ? "سيقوم فريق مبيعات التصدير بالتواصل معك خلال 24 ساعة لتقديم عرض السعر."
                                                    : "Our export sales team will contact you within 24 hours with a tailored quote."}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-100">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-gray-900 transition-colors"
                                    >
                                        <PrevIcon className="w-5 h-5" />
                                        {isRTL ? "السابق" : "Previous"}
                                    </button>
                                ) : <div />} {/* Empty div to keep 'Next' button on the right */}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        {isRTL ? "التالي" : "Next"}
                                        <NextIcon className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="flex flex-col items-end gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            data-analytics="submit_quote_form"
                                            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-black rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-wait"
                                        >
                                            {loading ? (isRTL ? "جاري الإرسال..." : "Sending...") : t.quote.submit}
                                            {!loading && <CheckCircle className="w-5 h-5" />}
                                        </button>
                                        <div className="flex items-center gap-4 text-gray-400 text-xs">
                                            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> ISO 22000 Certified</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {step === 1 && (
                    <p className="text-center text-sm font-bold text-gray-400 mt-6">
                        {t.quote.moq}
                    </p>
                )}
            </Container>
        </section>
    );
};
