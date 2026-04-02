/**
 * Default CMS content for the Export page.
 * Maps existing i18n translations (ar + en) into the CMS bilingual structure.
 */

export function getExportPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "زيوت نباتية جاهزة للتصدير من مصر",
            title_en: "Export-Ready Vegetable Oils from Egypt",
            subtitle_ar: "زيوت نباتية، سمن وشورتنج بجودة عالمية — حاصلة على شهادات ISO والحلال، شحن لأكثر من 15 دولة.",
            subtitle_en: "Premium quality vegetable oils, margarine & shortening — ISO & Halal certified, shipped to 15+ countries worldwide.",
            cta_ar: "أرسل استفسار تصدير",
            cta_en: "Submit Export Inquiry",
        },

        // ── Markets ──
        markets: {
            title_ar: "أسواقنا المستهدفة",
            title_en: "Target Markets",
            subtitle_ar: "نصدّر لأكثر من 15 دولة في 4 قارات",
            subtitle_en: "We export to 15+ countries across 4 continents",
            items: [
                {
                    region_ar: "الشرق الأوسط",
                    region_en: "Middle East",
                    countries_ar: "الإمارات، السعودية، الكويت، قطر، عمان، البحرين، الأردن",
                    countries_en: "UAE, Saudi Arabia, Kuwait, Qatar, Oman, Bahrain, Jordan",
                    flag: "🇸🇦",
                },
                {
                    region_ar: "أفريقيا",
                    region_en: "Africa",
                    countries_ar: "السودان، ليبيا، كينيا، تنزانيا، غانا، نيجيريا",
                    countries_en: "Sudan, Libya, Kenya, Tanzania, Ghana, Nigeria",
                    flag: "🌍",
                },
                {
                    region_ar: "أوروبا",
                    region_en: "Europe",
                    countries_ar: "ألمانيا، هولندا، إيطاليا، المملكة المتحدة",
                    countries_en: "Germany, Netherlands, Italy, UK",
                    flag: "🇪🇺",
                },
                {
                    region_ar: "آسيا",
                    region_en: "Asia",
                    countries_ar: "الهند، باكستان، ماليزيا، إندونيسيا",
                    countries_en: "India, Pakistan, Malaysia, Indonesia",
                    flag: "🌏",
                },
            ],
        },

        // ── Features ──
        features: {
            title_ar: "لماذا تختارنا كشريك تصدير؟",
            title_en: "Why Choose Us as Export Partner?",
            items: [
                {
                    title_ar: "شهادات جودة عالمية",
                    title_en: "International Quality Certifications",
                    description_ar: "حاصلون على ISO 9001 و ISO 22000 وشهادة الحلال — مطابقة كاملة للمعايير الدولية",
                    description_en: "ISO 9001, ISO 22000 & Halal certified — full compliance with international standards",
                },
                {
                    title_ar: "طاقة إنتاجية عالية",
                    title_en: "High Production Capacity",
                    description_ar: "8 خطوط إنتاج بطاقة 500 طن يومياً تضمن تلبية الطلبات الكبيرة في المواعيد المحددة",
                    description_en: "8 production lines with 500 MT daily capacity, ensuring large orders are fulfilled on time",
                },
                {
                    title_ar: "تعبئة مخصصة",
                    title_en: "Custom Packaging",
                    description_ar: "نوفر خيارات تعبئة متنوعة حسب متطلبات السوق المستهدف مع إمكانية العلامة الخاصة (Private Label)",
                    description_en: "Various packaging options based on target market requirements with Private Label capability",
                },
                {
                    title_ar: "شحن دولي موثوق",
                    title_en: "Reliable International Shipping",
                    description_ar: "خبرة في الشحن البحري من ميناء الإسكندرية مع تجهيز كافة مستندات التصدير والتخليص الجمركي",
                    description_en: "Experienced in maritime shipping from Alexandria port with complete export documentation and customs clearance",
                },
            ],
        },

        // ── Compliance ──
        compliance: {
            title_ar: "الامتثال واللوجستيات",
            title_en: "Compliance & Logistics",
            subtitle_ar: "جميع المستندات جاهزة للتخليص الجمركي بسلاسة",
            subtitle_en: "All documentation ready for seamless customs clearance",
            items: [
                { label_ar: "رمز النظام المنسق (زيت صويا)", label_en: "HS Code (Soybean Oil)", value: "1507.90.90" },
                { label_ar: "بلد المنشأ", label_en: "Country of Origin", value: "مصر / Egypt" },
                { label_ar: "العمر الافتراضي", label_en: "Shelf Life", value: "18 شهر / 18 months" },
                { label_ar: "التخزين", label_en: "Storage", value: "مكان بارد وجاف بعيداً عن الشمس" },
                { label_ar: "الحد الأدنى للتصدير", label_en: "Min Export Order", value: "20 طن (حاوية 20 قدم)" },
                { label_ar: "شروط التجارة", label_en: "Incoterms", value: "FOB Alexandria, CIF, DDP" },
            ],
        },
    };
}
