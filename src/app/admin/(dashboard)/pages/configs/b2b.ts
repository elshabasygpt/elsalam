import { SectionConfig, FieldConfig } from '../types';

export const b2bConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "🤝",
            description: "عنوان ووصف صفحة شراكات B2B",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "backgroundImage", labelAr: "صورة الخلفية", labelEn: "Background Image URL", type: "url", bilingual: false, placeholder: "رابط الصورة عالية الجودة" },
                { key: "ctaQuote", labelAr: "نص زر عرض السعر", labelEn: "Quote Button Text", type: "text", bilingual: true, placeholder: "طلب عرض سعر" },
                { key: "ctaCatalog", labelAr: "نص زر الكتالوج", labelEn: "Catalog Button Text", type: "text", bilingual: true, placeholder: "تحميل الكتالوج PDF" },
            ],
        },
        {
            id: "benefits",
            title: "لماذا مصنع السلام؟",
            emoji: "💎",
            description: "مميزات الشراكة مع المصنع",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "لماذا مصنع السلام؟" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "ميزة",
                    labelEn: "Advantage",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                    ],
                },
            ],
        },
        {
            id: "quoteForm",
            title: "نموذج طلب السعر",
            emoji: "📝",
            description: "إعدادات نموذج طلب عرض السعر",
            fields: [
                { key: "title", labelAr: "عنوان النموذج", labelEn: "Form Title", type: "text", bilingual: true, placeholder: "طلب عرض سعر بالجملة" },
                { key: "subtitle", labelAr: "وصف النموذج", labelEn: "Form Subtitle", type: "text", bilingual: true },
                { key: "moq", labelAr: "نص الحد الأدنى", labelEn: "MOQ Notice", type: "text", bilingual: true, placeholder: "الحد الأدنى للطلب: 5 أطنان" },
                {
                    key: "products",
                    labelAr: "منتج",
                    labelEn: "Product",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم المنتج", labelEn: "Product Name", type: "text", bilingual: true },
                    ],
                },
                {
                    key: "packaging",
                    labelAr: "تعبئة",
                    labelEn: "Packaging",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "نوع التعبئة", labelEn: "Packaging Type", type: "text", bilingual: true },
                    ],
                },
            ],
        },
        {
            id: "ctaSection",
            title: "دعوة للتواصل",
            emoji: "📞",
            description: "قسم الدعوة للتواصل في أسفل الصفحة",
            fields: [
                { key: "title", labelAr: "عنوان الدعوة", labelEn: "CTA Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "النص التوضيحي", labelEn: "CTA Subtitle", type: "textarea", bilingual: true },
                { key: "buttonText", labelAr: "نص الزر", labelEn: "Button Text", type: "text", bilingual: true },
                { key: "buttonLink", labelAr: "رابط الزر", labelEn: "Button Link", type: "url", bilingual: false, placeholder: "/contact" },
            ],
        },
    ];
