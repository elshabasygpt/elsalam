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

export function ContactClient({ settings }: { settings: any }) {
    const { t } = useLanguage();
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

    return (
        <main className="min-h-screen bg-surface-soft font-arabic">
            <Navbar />

            <section className="pt-36 pb-16 bg-primary-dark text-white">
                <Container className="text-center">
                    <ScrollReveal>
                        <Typography variant="h1" className="text-white mb-4">{t.contact.pageTitle}</Typography>
                        <Typography variant="body-lg" className="text-white/80">{t.contact.pageSubtitle}</Typography>
                    </ScrollReveal>
                </Container>
            </section>

            <section className="py-24">
                <Container>
                    <Breadcrumbs items={[
                        { label: t.nav.home, href: "/" },
                        { label: t.contact.pageTitle },
                    ]} className="mb-10" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <ScrollReveal>
                            <div className="bg-white p-8 rounded-lg shadow-card border border-surface-light">
                                <SectionHeader title={t.contact.formTitle} align="start" />

                                <AnimatePresence>
                                    {status === "success" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
                                        >
                                            <CheckCircle className="w-5 h-5 shrink-0" />
                                            <span>{t.contact.successMessage}</span>
                                        </motion.div>
                                    )}
                                    {status === "error" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <span>{t.contact.errorMessage}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                                    <div>
                                        <FormField label={t.contact.name} placeholder={t.contact.namePlaceholder} required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                                        {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <FormField label={t.contact.emailLabel} type="email" placeholder={t.contact.emailPlaceholder} dir="ltr" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                    </div>
                                    <FormField label={t.contact.phone} type="tel" placeholder={t.contact.phonePlaceholder} dir="ltr" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">{t.contact.message} *</label>
                                        <textarea
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-sm border border-surface-light bg-white text-base text-text-dark placeholder:text-text-dark/40 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green resize-none transition-shadow"
                                            placeholder={t.contact.messagePlaceholder}
                                            value={formData.message}
                                            onChange={(e) => handleChange("message", e.target.value)}
                                        />
                                        {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
                                    </div>
                                    <Button type="submit" className="w-full gap-2" disabled={status === "loading"}>
                                        {status === "loading" ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {t.contact.sending}
                                            </>
                                        ) : (
                                            t.contact.send
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </ScrollReveal>

                        {/* Contact Info */}
                        <ScrollReveal delay={0.2}>
                            <div className="space-y-8">
                                <div className="bg-white p-6 rounded-lg shadow-card border border-surface-light">
                                    <Typography variant="h4" className="mb-4">{t.contact.contactInfoTitle}</Typography>
                                    <ul className="space-y-4 text-text-dark/70">
                                        <li className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-primary-green" />
                                            </span>
                                            {t.footer.address}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0">
                                                <Phone className="w-5 h-5 text-primary-green" />
                                            </span>
                                            <span dir="ltr">{t.footer.phone}</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-primary-green" />
                                            </span>
                                            {t.footer.email}
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5 text-primary-green" />
                                            </span>
                                            {t.contact.workingHours}
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-card border border-surface-light">
                                    <Typography variant="h4" className="mb-4">{t.contact.quickContact}</Typography>
                                    <div className="space-y-3">
                                        <a href={`https://wa.me/${(settings?.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="primary" className="w-full gap-2">
                                                <MessageCircle className="w-5 h-5" />
                                                {t.contact.whatsappLocal}
                                            </Button>
                                        </a>
                                        <a href={`https://wa.me/${(settings?.phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="w-full gap-2">
                                                <MessageCircle className="w-5 h-5" />
                                                {t.contact.whatsappExport}
                                            </Button>
                                        </a>
                                    </div>
                                </div>

                                <div className="aspect-video bg-surface-light rounded-lg border border-surface-light overflow-hidden">
                                    <iframe
                                        src={settings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.4326162312674!2d30.0150!3d30.5510!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMzJzAzLjYiTiAzMMKwMDAnNTQuMCJF!5e0!3m2!1sar!2seg!4v1"}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={t.footer.address}
                                    />
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            <Footer />
        </main>
    );
}
