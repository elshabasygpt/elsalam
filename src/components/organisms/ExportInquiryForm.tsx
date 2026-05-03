"use client";

import React, { useState } from "react";
import { Container } from "@/components/atoms/Container";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { Globe } from "lucide-react";

import { useLanguage } from "@/lib/i18n-context";

const INCOTERMS = ["FOB Alexandria", "CIF", "DDP", "EXW"];

export const ExportInquiryForm = () => {
    const { locale, isRTL } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        company: "", contact: "", email: "", phone: "", country: "", port: "",
        products: "", incoterm: "", requirements: "", certs: [] as string[]
    });

    const set = (key: string) => (e: any) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const bodyContent = `
Products & Volume: ${form.products}
Destination: ${form.country} - ${form.port}
Incoterm: ${form.incoterm}
Certs: ${form.certs.join(", ")}
Notes: ${form.requirements}
            `.trim();

            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.contact, email: form.email, phone: form.phone, company: form.company,
                    subject: "B2B Export Inquiry", body: bodyContent, type: "export_inquiry"
                })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                toast.error(isRTL ? "فشل إرسال الطلب." : "Failed to send inquiry.");
            }
        } catch {
            toast.error(isRTL ? "خطأ في الشبكة." : "Network error.");
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <section className="py-24 bg-surface-soft" dir={isRTL ? "rtl" : "ltr"}>
                <Container className="max-w-2xl text-center">
                    <div className="bg-white p-12 rounded-lg shadow-card border border-accent-green/30">
                        <span className="w-16 h-16 rounded-full bg-primary-green/10 flex items-center justify-center mx-auto mb-6"><Globe className="w-8 h-8 text-primary-green" /></span>
                        <Typography variant="h3" className="text-primary-dark mb-4">
                            {isRTL ? "تم استلام طلب التصدير!" : "Export Inquiry Received!"}
                        </Typography>
                        <Typography variant="body" className="text-text-dark/70">
                            {isRTL 
                                ? "سيقوم فريق التصدير الخاص بنا بالرد خلال 48 ساعة مع فاتورة مبدئية، وتقدير الشحن، وحزمة الشهادات."
                                : "Our export team will respond within 48 hours with a pro-forma invoice, shipping estimate, and certificate package."
                            }
                        </Typography>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="py-24 bg-surface-soft" id="export-inquiry" dir={isRTL ? "rtl" : "ltr"}>
            <Container className="max-w-3xl">
                <SectionHeader
                    title={isRTL ? "طلب تسعير للتصدير" : "Export Inquiry"}
                    subtitle={isRTL 
                        ? "أكمل النموذج أدناه وسيقوم فريق التصدير لدينا بإعداد عرض أسعار مخصص خلال 48 ساعة." 
                        : "Complete the form below and our export team will prepare a custom quotation within 48 hours."}
                />

                <form
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`bg-white p-8 lg:p-10 rounded-lg shadow-card border border-surface-light space-y-6 ${isRTL ? "font-arabic text-right" : "font-english text-left"}`}
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField label={isRTL ? "اسم الشركة" : "Company Name"} placeholder={isRTL ? "شركتك" : "Your company"} required value={form.company} onChange={set("company")} />
                        <FormField label={isRTL ? "جهة الاتصال" : "Contact Person"} placeholder={isRTL ? "الاسم الكامل" : "Full name"} required value={form.contact} onChange={set("contact")} />
                        <FormField label={isRTL ? "البريد الإلكتروني" : "Email"} type="email" placeholder="email@company.com" required value={form.email} onChange={set("email")} />
                        <FormField label={isRTL ? "رقم الهاتف (واتساب)" : "Phone (WhatsApp)"} type="tel" placeholder="+1 xxx xxx xxxx" required value={form.phone} onChange={set("phone")} />
                        <FormField label={isRTL ? "الدولة" : "Country"} placeholder={isRTL ? "مثال: ألمانيا" : "e.g. Germany"} required value={form.country} onChange={set("country")} />
                        <FormField label={isRTL ? "ميناء الوصول" : "Destination Port"} placeholder={isRTL ? "مثال: هامبورغ" : "e.g. Hamburg"} value={form.port} onChange={set("port")} />
                    </div>

                    <FormField label={isRTL ? "المنتجات والكمية (بالطن)" : "Products & Volume (Tons)"} placeholder={isRTL ? "مثال: زيت الصويا - 40 طن، سمن - 20 طن" : "e.g. Soybean Oil - 40 tons, Margarine - 20 tons"} required value={form.products} onChange={set("products")} />

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">{isRTL ? "طريقة الشحن المفضلة (Incoterm)" : "Preferred Incoterm"}</label>
                        <div className="flex flex-wrap gap-3">
                            {INCOTERMS.map((term, i) => (
                                <label key={i} className="flex items-center gap-3 px-5 py-3 bg-surface-soft rounded-lg border border-surface-light hover:border-green-500/50 hover:bg-green-50/50 cursor-pointer transition-all shadow-sm">
                                    <input type="radio" name="incoterm" value={term} onChange={set("incoterm")} checked={form.incoterm === term} className="w-5 h-5 accent-green-600 cursor-pointer" />
                                    <span className="text-base font-semibold text-gray-700" dir="ltr">{term}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">{isRTL ? "الشهادات المطلوبة" : "Required Certifications"}</label>
                        <div className="flex flex-wrap gap-3">
                            {["ISO 9001", "ISO 22000", "Halal", "HACCP", "Kosher", "FDA"].map((c, i) => (
                                <label key={i} className="flex items-center gap-3 px-5 py-3 bg-surface-soft rounded-lg border border-surface-light hover:border-green-500/50 hover:bg-green-50/50 cursor-pointer transition-all shadow-sm">
                                    <input type="checkbox" className="w-5 h-5 accent-green-600 cursor-pointer rounded" 
                                        checked={form.certs.includes(c)}
                                        onChange={(e) => {
                                            setForm(prev => ({
                                                ...prev, certs: e.target.checked ? [...prev.certs, c] : prev.certs.filter(cert => cert !== c)
                                            }))
                                        }}
                                    />
                                    <span className="text-base font-semibold text-gray-700" dir="ltr">{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">{isRTL ? "متطلبات إضافية" : "Additional Requirements"}</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-shadow resize-none"
                            placeholder={isRTL ? "تغليف خاص، متطلبات الملصقات، الخ." : "Special packaging, labeling requirements, etc."}
                            value={form.requirements} onChange={set("requirements")}
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg" disabled={loading}>
                        {loading ? (isRTL ? "جاري الإرسال..." : "Sending Inquiry...") : (isRTL ? "إرسال طلب التصدير" : "Submit Export Inquiry")}
                    </Button>

                    <p className="text-center text-sm font-medium text-gray-500">
                        {isRTL ? "الحد الأدنى للتصدير: 20 طن (حاوية 20 قدم) — يتم الرد خلال 48 ساعة عمل" : "Min. export order: 20 tons (1x20' FCL) — Response within 48 business hours"}
                    </p>
                </form>
            </Container>
        </section>
    );
};
