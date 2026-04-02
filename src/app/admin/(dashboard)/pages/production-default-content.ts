/**
 * Default CMS content for the Production page.
 * Content tailored for Elsalam Vegetable Oil Factory production process.
 */

export function getProductionPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "مراحل الإنتاج",
            title_en: "Production Stages",
            subtitle_ar: "نتبع أحدث التقنيات العالمية في تصنيع الزيوت النباتية والسمن والشورتنينج عبر 8 خطوط إنتاج متطورة",
            subtitle_en: "We follow the latest global technologies in manufacturing vegetable oils, margarine & shortening across 8 advanced production lines",
        },

        // ── Production Steps ──
        steps: {
            title_ar: "خطوات عملية الإنتاج",
            title_en: "Production Process Steps",
            subtitle_ar: "من استلام المواد الخام حتى التعبئة والتغليف",
            subtitle_en: "From raw material receipt to packaging and labeling",
            items: [
                {
                    title_ar: "استلام وفحص المواد الخام",
                    title_en: "Raw Material Receipt & Inspection",
                    description_ar: "نستقبل أجود أنواع الزيوت الخام من مصادر معتمدة عالمياً ونجري فحوصات شاملة للتأكد من جودتها ومطابقتها للمواصفات",
                    description_en: "We receive the finest crude oils from globally certified sources and conduct comprehensive inspections to ensure quality and specification compliance",
                    icon: "PackageCheck",
                },
                {
                    title_ar: "التكرير والتنقية",
                    title_en: "Refining & Purification",
                    description_ar: "تمر الزيوت الخام بعمليات تكرير متعددة تشمل إزالة الصمغ، والتبييض، وإزالة الروائح للحصول على زيت نقي عالي الجودة",
                    description_en: "Crude oils undergo multiple refining processes including degumming, bleaching, and deodorizing to produce high-quality pure oil",
                    icon: "Filter",
                },
                {
                    title_ar: "الهدرجة والتحويل",
                    title_en: "Hydrogenation & Processing",
                    description_ar: "يتم تحويل الزيوت السائلة إلى سمن وشورتنينج من خلال عمليات هدرجة محكمة تحت إشراف فني متخصص",
                    description_en: "Liquid oils are converted into margarine and shortening through precise hydrogenation processes under specialized technical supervision",
                    icon: "FlaskConical",
                },
                {
                    title_ar: "مراقبة الجودة المخبرية",
                    title_en: "Laboratory Quality Control",
                    description_ar: "يتم إجراء تحاليل مخبرية دقيقة في كل مرحلة لضمان مطابقة المنتج للمواصفات القياسية المحلية والدولية",
                    description_en: "Precise laboratory analyses are conducted at every stage to ensure product compliance with local and international standards",
                    icon: "Microscope",
                },
                {
                    title_ar: "التعبئة والتغليف",
                    title_en: "Filling & Packaging",
                    description_ar: "تعبئة آلية بالكامل في عبوات متنوعة الأحجام مع طباعة بيانات المنتج وتاريخ الإنتاج والصلاحية بأعلى معايير النظافة",
                    description_en: "Fully automated filling in various container sizes with product data, production date, and expiry date printing under the highest hygiene standards",
                    icon: "Package",
                },
                {
                    title_ar: "التخزين والتوزيع",
                    title_en: "Storage & Distribution",
                    description_ar: "مستودعات مجهزة بأنظمة تحكم في درجة الحرارة وأسطول نقل متكامل لضمان وصول المنتجات بأفضل حالة",
                    description_en: "Temperature-controlled warehouses and a comprehensive transport fleet to ensure products arrive in optimal condition",
                    icon: "Truck",
                },
            ],
        },

        // ── Capacity ──
        capacity: {
            title_ar: "الطاقة الإنتاجية",
            title_en: "Production Capacity",
            subtitle_ar: "أرقام تعكس حجم وقدرات مصنع السلام",
            subtitle_en: "Numbers reflecting the scale and capabilities of Elsalam Factory",
            items: [
                { label_ar: "خطوط إنتاج", label_en: "Production Lines", value: "8" },
                { label_ar: "طن يومياً", label_en: "Tons Daily", value: "500" },
                { label_ar: "دولة تصدير", label_en: "Export Countries", value: "15+" },
                { label_ar: "منتج متنوع", label_en: "Diverse Products", value: "50+" },
            ],
        },

        // ── Gallery ──
        gallery: {
            title_ar: "جولة في خطوط الإنتاج",
            title_en: "Production Lines Tour",
            items: [
                { title_ar: "خط إنتاج الزيوت", title_en: "Oil Production Line", url: "" },
                { title_ar: "خط التكرير", title_en: "Refining Line", url: "" },
                { title_ar: "خط التعبئة", title_en: "Filling Line", url: "" },
                { title_ar: "مستودعات التخزين", title_en: "Storage Warehouses", url: "" },
            ],
        },
    };
}
