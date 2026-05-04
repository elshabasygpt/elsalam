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

const bText = (obj: any, isRTL: boolean) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[isRTL ? "ar" : "en"] || obj.ar || obj.en || "";
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

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
                                <p className="text-white/70 mb-8 text-sm">{t.contact.pageSubtitle}</p>

                                <ul className="flex flex-col gap-6">
                                {/* Main Address */}
                                    {(bText(cmsContent?.contactInfo?.address, isRTL) || !cmsContent?.branches?.items?.some((b: any) => b.name_ar || b.address_ar)) && (
                                        <li className="flex items-start gap-4 group">
                                            <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                                <MapPin className="w-4 h-4 text-green-300" />
                                            </span>
                                            <div className="mt-0.5 flex-1">
                                                <h4 className="font-bold text-white mb-0.5">{isRTL ? "العنوان الرئيسي" : "Main Address"}</h4>
                                                <p className="text-white/80 text-sm leading-relaxed">{bText(cmsContent?.contactInfo?.address, isRTL) || t.footer.address}</p>
                                            </div>
                                        </li>
                                    )}

                                    {/* Additional Branches */}
                                    {cmsContent?.branches?.items?.map((branch: any, idx: number) => {
                                        const bName = isRTL ? (branch.name_ar || branch.name) : (branch.name_en || branch.name);
                                        const bAddr = isRTL ? (branch.address_ar || branch.address) : (branch.address_en || branch.address);
                                        
                                        if (!bName && !bAddr) return null;
                                        return (
                                            <li key={`branch-${idx}`} className="flex items-start gap-4 group">
                                                <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                                    <MapPin className="w-4 h-4 text-green-300" />
                                                </span>
                                                <div className="mt-0.5 flex-1 flex flex-col items-start">
                                                    {bName && <h4 className="font-bold text-white mb-0.5">{bName}</h4>}
                                                    {bAddr && <p className="text-white/80 text-sm leading-relaxed mb-1">{bAddr}</p>}
                                                    {branch.phone && <p className="text-white font-medium text-[15px] tracking-wide mb-2 drop-shadow-sm"><span dir="ltr">{branch.phone}</span></p>}
                                                    {branch.mapLink && (
                                                        <a href={branch.mapLink} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 backdrop-blur-sm border border-white/10 w-fit">
                                                            {isRTL ? "عرض الخريطة" : "View Map"} &rarr;
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                    <li className="flex items-start gap-4 group">
                                        <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                            <Phone className="w-4 h-4 text-green-300" />
                                        </span>
                                        <div className="mt-0.5 flex-1">
                                            <h4 className="font-bold text-white mb-0.5">{isRTL ? "الهاتف" : "Phone"}</h4>
                                            <p className="text-white font-medium text-base tracking-wide drop-shadow-sm"><span dir="ltr">{cmsContent?.contactInfo?.phone || t.footer.phone}</span></p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 group">
                                        <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                            <Mail className="w-4 h-4 text-green-300" />
                                        </span>
                                        <div className="mt-0.5 flex-1">
                                            <h4 className="font-bold text-white mb-0.5">{isRTL ? "البريد الإلكتروني" : "Email"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed"><span dir="ltr">{cmsContent?.contactInfo?.email || t.footer.email}</span></p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 group">
                                        <span className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                            <Clock className="w-4 h-4 text-green-300" />
                                        </span>
                                        <div className="mt-0.5 flex-1">
                                            <h4 className="font-bold text-white mb-0.5">{isRTL ? "ساعات العمل" : "Working Hours"}</h4>
                                            <p className="text-white/80 text-sm leading-relaxed">{cmsContent?.contactInfo?.workingHours || "السبت - الخميس: 8:00 ص - 5:00 م"}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative z-10 mt-12 space-y-4">
                                <Typography variant="h4" className="mb-4 text-white/90">{t.contact.quickContact}</Typography>
                                <a href={`https://wa.me/${(settings?.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1da851] transition-colors shadow-lg">
                                    <WhatsAppIcon className="w-6 h-6" />
                                    {t.contact.whatsappLocal}
                                </a>
                                <a href={`https://wa.me/${(settings?.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-[#25D366] hover:border-transparent transition-all backdrop-blur-sm">
                                    <WhatsAppIcon className="w-6 h-6" />
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
                                        <FormField id="contact-name" label={t.contact.name} placeholder={t.contact.namePlaceholder} required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                                        {errors.name && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <FormField id="contact-email" label={t.contact.emailLabel} type="email" placeholder={t.contact.emailPlaceholder} dir="ltr" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                                        {errors.email && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>}
                                    </div>
                                </div>
                                <FormField id="contact-phone" label={t.contact.phone} type="tel" placeholder={t.contact.phonePlaceholder} dir="ltr" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-bold text-gray-800 mb-2">{t.contact.message} *</label>
                                    <textarea
                                        id="contact-message"
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
                                    src={(() => {
                                        let mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.4326162312674!2d30.0150!3d30.5510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMzJzAzLjYiTiAzMMKwMDAnNTQuMCJF!5e0!3m2!1sar!2seg!4v1";
                                        
                                        if (cmsContent?.map?.lat && cmsContent?.map?.lng) {
                                            return `https://maps.google.com/maps?q=${cmsContent.map.lat},${cmsContent.map.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                        } else if (cmsContent?.map?.mapEmbedUrl) {
                                            const url = cmsContent.map.mapEmbedUrl;
                                            if (url.includes('embed') || url.includes('output=embed')) {
                                                return url;
                                            } else {
                                                const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                                                if (match) {
                                                    return `https://maps.google.com/maps?q=${match[1]},${match[2]}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                                }
                                                return `https://maps.google.com/maps?q=${encodeURIComponent(settings?.siteNameEn || "Elsalam Oils Factory")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                            }
                                        }
                                        return mapSrc;
                                    })()}
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
