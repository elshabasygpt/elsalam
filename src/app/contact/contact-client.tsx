"use client";

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Container } from "@/components/atoms/Container";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { Breadcrumbs } from "@/components/atoms/Breadcrumbs";
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

export function ContactClient({ settings, cmsContent }: { settings: any, cmsContent?: Record<string, any> }) {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<FormStatus>("idle");

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = t.contact.errNameRequired;
        if (!formData.email.trim()) {
            newErrors.email = t.contact.errEmailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.contact.errEmailInvalid;
        }
        if (!formData.message.trim()) {
            newErrors.message = t.contact.errMessageRequired;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = t.contact.errMessageShort;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("loading");
        try {
            const response = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    body: formData.message,
                    type: "inquiry"
                }),
            });

            if (!response.ok) throw new Error("Failed to send");

            setStatus("success");
            setFormData({ name: "", email: "", phone: "", message: "" });
            setTimeout(() => setStatus("idle"), 5000);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const heroBgImage = cmsContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2670&auto=format&fit=crop";

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            {/* Premium Contact Hero */}
            <section className="relative pt-32 pb-32 lg:pt-40 lg:pb-40 bg-gradient-to-b from-slate-900 via-primary-dark/90 to-primary-dark overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url('${heroBgImage}')` }}
                ></div>
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
                </div>
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-soft to-transparent z-0" />

                <Container className="relative z-10 text-center flex flex-col items-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 shadow-xl">
                            <MessageCircle className="w-5 h-5 text-green-400 animate-pulse" />
                            <span className="text-white/90 text-sm font-bold uppercase tracking-wider">
                                {t.nav.contact}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight max-w-4xl mx-auto">
                            {t.contact.pageTitle}
                        </h1>
                        <p className="text-white/80 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed text-balance">
                            {t.contact.pageSubtitle}
                        </p>
                    </ScrollReveal>
                </Container>
            </section>

            <section className="pb-24 relative -mt-20 z-20">
                <Container>
                    <div className="mb-10 text-center md:text-start px-4">
                        <Breadcrumbs items={[
                            { label: t.nav.home, href: "/" },
                            { label: t.contact.pageTitle },
                        ]} className="justify-center md:justify-start" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-stretch bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                        
                        {/* Contact Info (Dark Vibrant Card) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-green-900 to-green-800 p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-between">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <Typography variant="h3" className="mb-2 font-bold text-white">{t.contact.contactInfoTitle}</Typography>
                                <p className="text-white/70 mb-10 text-sm">{t.contact.pageSubtitle}</p>

                                <ul className="space-y-8">
                                    <li className="flex items-start gap-4">
                                        <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-green-300" />
                                        </span>
                                        <div className="mt-1">
                                            <h4 className="font-bold text-white mb-1">{isRTL ? "العنوان" : "Address"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed">{t.footer.address}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-green-300" />
                                        </span>
                                        <div className="mt-1">
                                            <h4 className="font-bold text-white mb-1">{isRTL ? "الهاتف" : "Phone"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed" dir="ltr">{t.footer.phone}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-green-300" />
                                        </span>
                                        <div className="mt-1">
                                            <h4 className="font-bold text-white mb-1">{isRTL ? "البريد الإلكتروني" : "Email"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed">{t.footer.email}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5 text-green-300" />
                                        </span>
                                        <div className="mt-1">
                                            <h4 className="font-bold text-white mb-1">{isRTL ? "ساعات العمل" : "Working Hours"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed">{t.contact.workingHours}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative z-10 mt-12 space-y-4">
                                <Typography variant="h4" className="mb-4 text-white/90">{t.contact.quickContact}</Typography>
                                <a href={`https://wa.me/${(settings?.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg">
                                    <MessageCircle className="w-5 h-5" />
                                    {t.contact.whatsappLocal}
                                </a>
                                <a href={`https://wa.me/${(settings?.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                                    <MessageCircle className="w-5 h-5" />
                                    {t.contact.whatsappExport}
                                </a>
                            </div>
                        </div>

                        {/* Contact Form (White Clean Card) */}
                        <div className="lg:col-span-7 p-10 lg:p-14 bg-white relative">
                            <SectionHeader title={t.contact.formTitle} align="start" className="mb-8" />

                            <AnimatePresence>
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="mb-8 flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl text-green-800"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        </div>
                                        <span className="font-bold">{t.contact.successMessage}</span>
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="mb-8 flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-800"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <span className="font-bold">{t.contact.errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <FormField label={t.contact.name} placeholder={t.contact.namePlaceholder} required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                                        {errors.name && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <FormField label={t.contact.emailLabel} type="email" placeholder={t.contact.emailPlaceholder} dir="ltr" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                                        {errors.email && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>}
                                    </div>
                                </div>
                                <FormField label={t.contact.phone} type="tel" placeholder={t.contact.phonePlaceholder} dir="ltr" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">{t.contact.message} *</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/50 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none transition-all shadow-sm"
                                        placeholder={t.contact.messagePlaceholder}
                                        value={formData.message}
                                        onChange={(e) => handleChange("message", e.target.value)}
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.message}</p>}
                                </div>
                                <Button type="submit" size="lg" className="w-full gap-3 h-14 text-lg rounded-xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.4)] hover:-translate-y-1 transition-all" disabled={status === "loading"}>
                                    {status === "loading" ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            {t.contact.sending}
                                        </>
                                    ) : (
                                        t.contact.send
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Interactive Map Section */}
                    <ScrollReveal delay={0.2} className="mt-16">
                        <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-gray-100">
                            <div className="w-full h-[400px] rounded-[1.5rem] overflow-hidden relative">
                                <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10" />
                                <iframe
                                    src={settings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.4326162312674!2d30.0150!3d30.5510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMzJzAzLjYiTiAzMMKwMDAnNTQuMCJF!5e0!3m2!1sar!2seg!4v1"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={t.footer.address}
                                    className="relative z-10"
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <Footer />
        </main>
    );
}
