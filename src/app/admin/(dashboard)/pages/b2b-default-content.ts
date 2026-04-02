/**
 * Default CMS content for the B2B page.
 * Maps existing i18n translations (ar + en) into the CMS bilingual structure.
 */

export function getB2bPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "بوابة الشراكات الصناعية",
            title_en: "Industrial Partnerships Hub",
            subtitle_ar: "مصنع السلام — شريكك الاستراتيجي في توريد الزيوت النباتية والسمن والشورتنج بكميات صناعية وأسعار مباشرة من المصنع.",
            subtitle_en: "Elsalam Factory — Your strategic partner in supplying vegetable oils, margarine & shortening in industrial quantities at factory-direct prices.",
            ctaQuote_ar: "طلب عرض سعر",
            ctaQuote_en: "Request a Quote",
            ctaCatalog_ar: "تحميل الكتالوج PDF",
            ctaCatalog_en: "Download PDF Catalog",
        },

        // ── Advantages (Why Choose Us) ──
        benefits: {
            title_ar: "لماذا مصنع السلام؟",
            title_en: "Why Elsalam Factory?",
            subtitle_ar: "6 أسباب تجعلنا الخيار الأول للمصانع والموزعين",
            subtitle_en: "6 reasons that make us the first choice for factories and distributors",
            items: [
                {
                    title_ar: "طاقة إنتاجية عالية",
                    title_en: "High Production Capacity",
                    description_ar: "500 طن يومياً عبر 8 خطوط إنتاج مجهزة بأحدث التقنيات الأوروبية.",
                    description_en: "500 tons daily across 8 production lines equipped with the latest European technology.",
                },
                {
                    title_ar: "مختبرات جودة متقدمة",
                    title_en: "Advanced Quality Labs",
                    description_ar: "رقابة صارمة على كل مرحلة من مراحل الإنتاج مع تقارير مخبرية لكل شحنة.",
                    description_en: "Strict quality control at every production stage with lab reports for each shipment.",
                },
                {
                    title_ar: "تعبئة مخصصة",
                    title_en: "Custom Packaging",
                    description_ar: "من العبوات الصغيرة للتجزئة إلى الفليكسي تانك للتصدير — حسب احتياجاتك.",
                    description_en: "From small retail bottles to flexitank for export — tailored to your needs.",
                },
                {
                    title_ar: "أسعار تنافسية",
                    title_en: "Competitive Pricing",
                    description_ar: "أسعار مباشرة من المصنع مع شروط دفع مرنة للعملاء الصناعيين.",
                    description_en: "Direct factory prices with flexible payment terms for industrial clients.",
                },
                {
                    title_ar: "لوجستيات متكاملة",
                    title_en: "Integrated Logistics",
                    description_ar: "شحن محلي ودولي مع تتبع الشحنات وضمان التوصيل في الموعد.",
                    description_en: "Local and international shipping with shipment tracking and on-time delivery guarantee.",
                },
                {
                    title_ar: "شريك استراتيجي",
                    title_en: "Strategic Partner",
                    description_ar: "فريق مبيعات مخصص وحلول مصممة حسب احتياجات عملك.",
                    description_en: "Dedicated sales team and solutions designed for your business needs.",
                },
            ],
        },

        // ── Quote Form Settings ──
        quoteForm: {
            title_ar: "طلب عرض سعر بالجملة",
            title_en: "Bulk Quote Request",
            subtitle_ar: "املأ البيانات التالية وسيتواصل معك فريق المبيعات خلال 24 ساعة",
            subtitle_en: "Fill in the details below and our sales team will contact you within 24 hours",
            moq_ar: "الحد الأدنى للطلب (MOQ): 5 أطنان — سيتم الرد خلال 24 ساعة عمل",
            moq_en: "Minimum Order Quantity (MOQ): 5 tons — Response within 24 business hours",
            products: [
                { name_ar: "زيت صويا مكرر", name_en: "Refined Soybean Oil" },
                { name_ar: "زيت عباد الشمس", name_en: "Sunflower Oil" },
                { name_ar: "زيت نخيل", name_en: "Palm Oil" },
                { name_ar: "سمن نباتي", name_en: "Vegetable Ghee" },
                { name_ar: "شورتنج", name_en: "Shortening" },
                { name_ar: "زيت خلطات مخصصة", name_en: "Custom Oil Blends" },
                { name_ar: "Private Label", name_en: "Private Label" },
            ],
            packaging: [
                { name_ar: "براميل (200 لتر)", name_en: "Drums (200L)" },
                { name_ar: "تنكات (18 لتر)", name_en: "Tins (18L)" },
                { name_ar: "عبوات (5 لتر)", name_en: "Bottles (5L)" },
                { name_ar: "عبوات (1 لتر)", name_en: "Bottles (1L)" },
                { name_ar: "Flexitank", name_en: "Flexitank" },
                { name_ar: "تعبئة مخصصة", name_en: "Custom Packaging" },
            ],
        },

        // ── CTA Section ──
        ctaSection: {
            title_ar: "هل أنت مستعد لبدء شراكة؟",
            title_en: "Ready to Start a Partnership?",
            subtitle_ar: "تواصل مع فريق المبيعات الصناعية للحصول على عرض سعر مخصص",
            subtitle_en: "Contact our industrial sales team for a custom quote",
            buttonText_ar: "تواصل معنا الآن",
            buttonText_en: "Contact Us Now",
            buttonLink: "/contact",
        },
    };
}
