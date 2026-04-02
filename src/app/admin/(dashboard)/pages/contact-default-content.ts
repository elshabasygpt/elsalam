/**
 * Default CMS content for the Contact page.
 * Maps existing i18n translations (ar + en) into the CMS bilingual structure.
 */

export function getContactPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "تواصل معنا",
            title_en: "Contact Us",
            subtitle_ar: "نسعد بالرد على استفساراتكم خلال 24 ساعة عمل",
            subtitle_en: "We're happy to respond to your inquiries within 24 business hours",
        },

        // ── Contact Info ──
        contactInfo: {
            address_ar: "المنطقة الصناعية، المنوفية، مصر",
            address_en: "Industrial Zone, Monofia, Egypt",
            phone: "+20 1xx xxx xxxx",
            email: "info@elsalamoils.com",
            workingHours_ar: "السبت – الخميس: 8:00 ص – 5:00 م",
            workingHours_en: "Saturday – Thursday: 8:00 AM – 5:00 PM",
        },

        // ── Form Settings ──
        formSettings: {
            title_ar: "أرسل رسالتك",
            title_en: "Send Your Message",
            submitButton_ar: "إرسال الرسالة",
            submitButton_en: "Send Message",
            successMessage_ar: "تم إرسال رسالتك بنجاح! سنرد عليك خلال 24 ساعة عمل.",
            successMessage_en: "Your message has been sent successfully! We'll respond within 24 business hours.",
            errorMessage_ar: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
            errorMessage_en: "An error occurred while sending. Please try again.",
        },

        // ── Social / WhatsApp ──
        social: {
            whatsappLocal: "https://wa.me/201234567890",
            whatsappLocalLabel_ar: "واتساب — مبيعات محلية",
            whatsappLocalLabel_en: "WhatsApp — Local Sales",
            whatsappExport: "https://wa.me/201234567890",
            whatsappExportLabel_ar: "واتساب — التصدير",
            whatsappExportLabel_en: "WhatsApp — Export",
            facebook: "",
            instagram: "",
            linkedin: "",
        },

        // ── Map ──
        map: {
            mapEmbedUrl: "",
            lat: "30.5965",
            lng: "30.9876",
        },

        // ── Branches ──
        branches: {
            title_ar: "فروعنا ومكاتبنا",
            title_en: "Our Branches & Offices",
            items: [
                {
                    name_ar: "المصنع الرئيسي",
                    name_en: "Main Factory",
                    address_ar: "المنطقة الصناعية، المنوفية، مصر",
                    address_en: "Industrial Zone, Monofia, Egypt",
                    phone: "+20 1xx xxx xxxx",
                },
                {
                    name_ar: "مكتب المبيعات — القاهرة",
                    name_en: "Sales Office — Cairo",
                    address_ar: "القاهرة، مصر",
                    address_en: "Cairo, Egypt",
                    phone: "+20 1xx xxx xxxx",
                },
            ],
        },
    };
}
