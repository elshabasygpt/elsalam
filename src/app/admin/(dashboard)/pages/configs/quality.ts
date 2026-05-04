import { SectionConfig, FieldConfig } from '../types';

export const qualityConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "✅",
            description: "عنوان ووصف صفحة معايير الجودة",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "image", labelAr: "صورة الغلاف (Hero)", labelEn: "Hero Image URL", type: "url", bilingual: false, placeholder: "https://images.unsplash.com/..." },
            ],
        },
        {
            id: "qcChecks",
            title: "فحوصات ضمان الجودة",
            emoji: "🔬",
            description: "عنوان القسم وقائمة إجراءات فحص الجودة",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "نقاط رقابة الجودة" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true, placeholder: "8 نقاط فحص صارمة في كل دورة إنتاج" },
                {
                    key: "items",
                    labelAr: "فحص",
                    labelEn: "Check",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "text", labelAr: "نص الفحص", labelEn: "Check Text", type: "text", bilingual: true },
                        { key: "image", labelAr: "صورة الفحص", labelEn: "Check Image", type: "url", bilingual: false, placeholder: "https://images.unsplash.com/..." },
                    ],
                },
            ],
        },
        {
            id: "lab",
            title: "معامل فحص الجودة",
            emoji: "🧪",
            description: "نصوص وصور معامل الجودة",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true },
                { key: "description", labelAr: "وصف القسم", labelEn: "Section Description", type: "textarea", bilingual: true },
                {
                    key: "images",
                    labelAr: "صورة معمل",
                    labelEn: "Lab Image",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "وصف الصورة", labelEn: "Caption", type: "text", bilingual: true },
                        { key: "url", labelAr: "رابط الصورة", labelEn: "Image URL", type: "url", bilingual: false, placeholder: "/images/quality/lab-1.jpg" },
                    ],
                },
            ],
        },
        {
            id: "downloads",
            title: "ملفات الشهادات",
            emoji: "📥",
            description: "عنوان القسم وروابط تحميل شهادات الجودة",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "تحميل شهادات الجودة والمواصفات الفنية" },
                {
                    key: "items",
                    labelAr: "ملف",
                    labelEn: "File",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "label", labelAr: "اسم الملف", labelEn: "File Name", type: "text", bilingual: true, placeholder: "مثال: شهادة ISO 9001" },
                        { key: "url", labelAr: "رابط الملف", labelEn: "File URL", type: "url", bilingual: false, placeholder: "/files/iso-9001.pdf" },
                    ],
                },
            ],
        },
    ];
