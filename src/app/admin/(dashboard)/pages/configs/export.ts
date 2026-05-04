import { SectionConfig, FieldConfig } from '../types';

export const exportConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "🌍",
            description: "عنوان ووصف صفحة التصدير العالمي",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "cta", labelAr: "نص زر الإجراء", labelEn: "CTA Button Text", type: "text", bilingual: true, placeholder: "أرسل استفسار تصدير" },
            ],
        },
        {
            id: "markets",
            title: "الأسواق المستهدفة",
            emoji: "🗺",
            description: "المناطق والدول التي نصدر إليها",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "أسواقنا المستهدفة" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "منطقة",
                    labelEn: "Region",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "region", labelAr: "اسم المنطقة", labelEn: "Region Name", type: "text", bilingual: true },
                        { key: "countries", labelAr: "الدول", labelEn: "Countries", type: "textarea", bilingual: true, placeholder: "الإمارات، السعودية، الكويت..." },
                        { key: "flag", labelAr: "رمز/أيقونة", labelEn: "Icon/Flag", type: "text", bilingual: false, placeholder: "🇸🇦" },
                    ],
                },
            ],
        },
        {
            id: "features",
            title: "مميزات التصدير",
            emoji: "🚢",
            description: "لماذا تختارنا كشريك تصدير",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "لماذا تختارنا كشريك تصدير؟" },
                {
                    key: "items",
                    labelAr: "ميزة",
                    labelEn: "Feature",
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
            id: "compliance",
            title: "الامتثال واللوجستيات",
            emoji: "📋",
            description: "بيانات الشحن والتخليص الجمركي",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "الامتثال واللوجستيات" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "بيان",
                    labelEn: "Data Item",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "label", labelAr: "التسمية", labelEn: "Label", type: "text", bilingual: true },
                        { key: "value", labelAr: "القيمة", labelEn: "Value", type: "text", bilingual: false },
                    ],
                },
            ],
        },
    ];
