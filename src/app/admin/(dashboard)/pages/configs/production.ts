import { SectionConfig, FieldConfig } from '../types';

export const productionConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "🏭",
            description: "عنوان ووصف صفحة مراحل الإنتاج",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "backgroundImage", labelAr: "صورة الخلفية", labelEn: "Background Image URL", type: "url", bilingual: false, placeholder: "رابط الصورة عالية الجودة" },
            ],
        },
        {
            id: "steps",
            title: "مراحل الإنتاج",
            emoji: "⚙️",
            description: "عنوان القسم وخطوات عملية الإنتاج",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "خطوات عملية الإنتاج" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "مرحلة",
                    labelEn: "Step",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم المرحلة", labelEn: "Step Title", type: "text", bilingual: true },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                        { key: "icon", labelAr: "الأيقونة", labelEn: "Icon", type: "text", bilingual: false, placeholder: "اسم الأيقونة مثل: Factory" },
                    ],
                },
            ],
        },
        {
            id: "capacity",
            title: "الطاقة الإنتاجية",
            emoji: "📊",
            description: "أرقام وإحصائيات الإنتاج",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "الطاقة الإنتاجية" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "إحصائية",
                    labelEn: "Stat",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "label", labelAr: "التسمية", labelEn: "Label", type: "text", bilingual: true },
                        { key: "value", labelAr: "القيمة", labelEn: "Value", type: "text", bilingual: false, placeholder: "مثال: 500" },
                    ],
                },
            ],
        },
        {
            id: "gallery",
            title: "معرض خطوط الإنتاج",
            emoji: "🖼",
            description: "صور من داخل خطوط الإنتاج",
            fields: [
                { key: "title", labelAr: "عنوان المعرض", labelEn: "Gallery Title", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "صورة",
                    labelEn: "Image",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "وصف الصورة", labelEn: "Caption", type: "text", bilingual: true },
                        { key: "url", labelAr: "رابط الصورة", labelEn: "Image URL", type: "url", bilingual: false },
                    ],
                },
            ],
        },
    ];
