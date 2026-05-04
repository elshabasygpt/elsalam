import { SectionConfig, FieldConfig } from '../types';

export const contactConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "📞",
            description: "عنوان ووصف صفحة تواصل معنا",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "backgroundImage", labelAr: "صورة الخلفية", labelEn: "Background Image", type: "url", bilingual: false, placeholder: "https://images.unsplash.com/..." },
            ],
        },
        {
            id: "contactInfo",
            title: "معلومات الاتصال",
            emoji: "📋",
            description: "عنوان المصنع وأرقام الهاتف والبريد",
            fields: [
                { key: "address", labelAr: "العنوان الرئيسي", labelEn: "Main Address", type: "text", bilingual: true },
                { key: "phone", labelAr: "رقم الهاتف", labelEn: "Phone", type: "text", bilingual: false, placeholder: "+20 1xx xxx xxxx" },
                { key: "email", labelAr: "البريد الإلكتروني", labelEn: "Email", type: "text", bilingual: false, placeholder: "info@elsalamoils.com" },
                { key: "workingHours", labelAr: "ساعات العمل", labelEn: "Working Hours", type: "text", bilingual: true },
            ],
        },
        {
            id: "formSettings",
            title: "إعدادات نموذج التواصل",
            emoji: "📝",
            description: "نصوص نموذج إرسال الرسائل",
            fields: [
                { key: "title", labelAr: "عنوان النموذج", labelEn: "Form Title", type: "text", bilingual: true, placeholder: "أرسل رسالتك" },
                { key: "submitButton", labelAr: "نص زر الإرسال", labelEn: "Submit Button Text", type: "text", bilingual: true, placeholder: "إرسال الرسالة" },
                { key: "successMessage", labelAr: "رسالة النجاح", labelEn: "Success Message", type: "textarea", bilingual: true },
                { key: "errorMessage", labelAr: "رسالة الخطأ", labelEn: "Error Message", type: "textarea", bilingual: true },
            ],
        },
        {
            id: "social",
            title: "روابط التواصل",
            emoji: "🔗",
            description: "أرقام الواتساب وروابط التواصل الاجتماعي",
            fields: [
                { key: "whatsappLocal", labelAr: "واتساب (محلي) — الرابط", labelEn: "WhatsApp (Local) — URL", type: "url", bilingual: false, placeholder: "https://wa.me/201234567890" },
                { key: "whatsappLocalLabel", labelAr: "واتساب (محلي) — التسمية", labelEn: "WhatsApp (Local) — Label", type: "text", bilingual: true, placeholder: "واتساب — مبيعات محلية" },
                { key: "whatsappExport", labelAr: "واتساب (تصدير) — الرابط", labelEn: "WhatsApp (Export) — URL", type: "url", bilingual: false, placeholder: "https://wa.me/201234567890" },
                { key: "whatsappExportLabel", labelAr: "واتساب (تصدير) — التسمية", labelEn: "WhatsApp (Export) — Label", type: "text", bilingual: true, placeholder: "واتساب — التصدير" },
                { key: "facebook", labelAr: "فيسبوك", labelEn: "Facebook", type: "url", bilingual: false, placeholder: "https://facebook.com/..." },
                { key: "instagram", labelAr: "انستقرام", labelEn: "Instagram", type: "url", bilingual: false, placeholder: "https://instagram.com/..." },
                { key: "linkedin", labelAr: "لينكدإن", labelEn: "LinkedIn", type: "url", bilingual: false, placeholder: "https://linkedin.com/..." },
            ],
        },
        {
            id: "map",
            title: "الموقع على الخريطة",
            emoji: "📍",
            description: "رابط Google Maps أو إحداثيات الموقع",
            fields: [
                { key: "mapEmbedUrl", labelAr: "رابط Google Maps Embed", labelEn: "Google Maps Embed URL", type: "url", bilingual: false, placeholder: "https://www.google.com/maps/embed?pb=..." },
                { key: "lat", labelAr: "خط العرض", labelEn: "Latitude", type: "text", bilingual: false, placeholder: "30.5965" },
                { key: "lng", labelAr: "خط الطول", labelEn: "Longitude", type: "text", bilingual: false, placeholder: "30.9876" },
            ],
        },
        {
            id: "branches",
            title: "الفروع والمكاتب",
            emoji: "🏢",
            description: "فروع ومكاتب مبيعات المصنع",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "فروعنا ومكاتبنا" },
                {
                    key: "items",
                    labelAr: "فرع",
                    labelEn: "Branch",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم الفرع", labelEn: "Branch Name", type: "text", bilingual: true },
                        { key: "address", labelAr: "العنوان", labelEn: "Address", type: "text", bilingual: true },
                        { key: "phone", labelAr: "رقم الهاتف", labelEn: "Phone", type: "text", bilingual: false },
                        { key: "mapLink", labelAr: "رابط خريطة جوجل", labelEn: "Google Maps Link", type: "url", bilingual: false },
                    ],
                },
            ],
        },
    ];
