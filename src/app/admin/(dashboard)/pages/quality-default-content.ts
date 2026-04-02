/**
 * Default CMS content for the Quality page.
 * Maps existing i18n translations (ar + en) into the CMS bilingual structure.
 */

export function getQualityPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "معايير الجودة",
            title_en: "Quality Standards",
            subtitle_ar: "نلتزم بأعلى معايير الجودة والسلامة الغذائية العالمية في كل مرحلة من مراحل الإنتاج",
            subtitle_en: "We adhere to the highest global quality and food safety standards at every stage of production",
        },

        // ── QC Checks ──
        qcChecks: {
            title_ar: "نقاط رقابة الجودة",
            title_en: "Quality Control Checkpoints",
            subtitle_ar: "8 نقاط فحص صارمة في كل دورة إنتاج",
            subtitle_en: "8 strict inspection points in every production cycle",
            items: [
                { text_ar: "فحص المواد الخام عند الاستلام", text_en: "Raw material inspection upon receipt" },
                { text_ar: "تحليل نسبة الحموضة والرطوبة", text_en: "Acidity and moisture analysis" },
                { text_ar: "اختبار اللون والشفافية", text_en: "Color and transparency testing" },
                { text_ar: "تحليل نقطة الدخان ونقطة الذوبان", text_en: "Smoke point and melting point analysis" },
                { text_ar: "فحص المعادن الثقيلة والملوثات", text_en: "Heavy metals and contaminants testing" },
                { text_ar: "اختبار الثبات الأكسيدي", text_en: "Oxidative stability testing" },
                { text_ar: "فحص التعبئة والتغليف", text_en: "Packaging and labeling inspection" },
                { text_ar: "تحليل العمر الافتراضي المتسارع", text_en: "Accelerated shelf life analysis" },
            ],
        },

        // ── Lab ──
        lab: {
            title_ar: "معامل فحص الجودة",
            title_en: "Quality Control Laboratories",
            description_ar: "مختبرات مجهزة بأحدث أجهزة التحليل والفحص لضمان مطابقة منتجاتنا لأعلى المعايير الدولية",
            description_en: "Laboratories equipped with the latest analysis and testing equipment to ensure our products meet the highest international standards",
            images: [
                { title_ar: "فريق الجودة", title_en: "Quality Team", url: "" },
                { title_ar: "فحص الجودة", title_en: "Quality Check", url: "" },
                { title_ar: "اختبار المعمل", title_en: "Lab Test", url: "" },
            ],
        },

        // ── Downloads ──
        downloads: {
            title_ar: "تحميل شهادات الجودة والمواصفات الفنية",
            title_en: "Download Quality Certificates & Technical Specifications",
            items: [
                { label_ar: "تحميل شهادة ISO 9001", label_en: "Download ISO 9001 Certificate", url: "" },
                { label_ar: "تحميل شهادة ISO 22000", label_en: "Download ISO 22000 Certificate", url: "" },
                { label_ar: "تحميل شهادة Halal", label_en: "Download Halal Certificate", url: "" },
            ],
        },
    };
}
