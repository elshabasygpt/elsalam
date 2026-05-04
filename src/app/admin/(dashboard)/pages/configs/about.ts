import { SectionConfig, FieldConfig } from '../types';

export const aboutConfig: SectionConfig[] = [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "📌",
            description: "عنوان ووصف صفحة من نحن",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true, placeholder: "مثال: قصة مصنع السلام" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "badge", labelAr: "الشارة", labelEn: "Badge", type: "text", bilingual: true, placeholder: "مثال: جودة عالمية منذ عام 2000" },
                { key: "backgroundImage", labelAr: "صورة الخلفية", labelEn: "Background Image", type: "url", bilingual: false, placeholder: "/images/about-bg.jpg" },
            ],
        },
        {
            id: "story",
            title: "قصتنا",
            emoji: "📖",
            description: "النص الأساسي لقصة المصنع — فقرتين",
            fields: [
                { key: "title", labelAr: "عنوان القصة", labelEn: "Story Title", type: "text", bilingual: true },
                { key: "paragraph1", labelAr: "الفقرة الأولى", labelEn: "First Paragraph", type: "textarea", bilingual: true },
                { key: "paragraph2", labelAr: "الفقرة الثانية", labelEn: "Second Paragraph", type: "textarea", bilingual: true },
            ],
        },
        {
            id: "timeline",
            title: "خط الزمن (Timeline)",
            emoji: "⏱",
            description: "محطات تاريخية في مسيرة المصنع",
            fields: [
                {
                    key: "items",
                    labelAr: "محطة زمنية",
                    labelEn: "Timeline Entry",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "year", labelAr: "السنة", labelEn: "Year", type: "text", bilingual: false, placeholder: "2000" },
                        { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                    ],
                },
            ],
        },
        {
            id: "ceo",
            title: "السيرة الذاتية — رئيس مجلس الإدارة",
            emoji: "👤",
            description: "بيانات رئيس مجلس الإدارة والمسيرة المهنية الكاملة",
            fields: [
                { key: "name", labelAr: "الاسم", labelEn: "Name", type: "text", bilingual: true },
                { key: "role", labelAr: "المنصب", labelEn: "Role", type: "text", bilingual: true },
                { key: "image", labelAr: "الصورة الشخصية", labelEn: "Profile Image URL", type: "url", bilingual: false, placeholder: "/images/ceo.jpg" },
                { key: "quote", labelAr: "اقتباس", labelEn: "Quote", type: "textarea", bilingual: true },
                { key: "educationDesc", labelAr: "التعليم والنشأة", labelEn: "Education & Early Life", type: "textarea", bilingual: true },
                {
                    key: "careerStations",
                    labelAr: "محطة مهنية",
                    labelEn: "Career Station",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم المحطة (شركة + فترة)", labelEn: "Station (Company + Period)", type: "text", bilingual: true, placeholder: "شركة كوكاكولا – الإسكندرية (1990–1992)" },
                        { key: "role", labelAr: "المسمى الوظيفي", labelEn: "Job Title", type: "text", bilingual: true, placeholder: "مشرف مبيعات" },
                        { key: "desc", labelAr: "الوصف والإنجازات", labelEn: "Description & Achievements", type: "textarea", bilingual: true },
                        { key: "image", labelAr: "شعار الشركة", labelEn: "Company Logo URL", type: "url", bilingual: false, placeholder: "/images/logos/company.png" },
                    ],
                },
                { key: "entrepreneurshipDesc", labelAr: "التحول لريادة الأعمال", labelEn: "Entrepreneurship Journey", type: "textarea", bilingual: true },
                { key: "expansionDesc", labelAr: "التوسع الاستراتيجي", labelEn: "Strategic Expansion", type: "textarea", bilingual: true },
                {
                    key: "innovationPoints",
                    labelAr: "ابتكار",
                    labelEn: "Innovation",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "text", labelAr: "نقطة الابتكار", labelEn: "Innovation Point", type: "text", bilingual: true },
                    ],
                },
                { key: "visionDesc", labelAr: "الرؤية والقيادة", labelEn: "Vision & Leadership", type: "textarea", bilingual: true },
                {
                    key: "leadershipPoints",
                    labelAr: "سمة قيادية",
                    labelEn: "Leadership Trait",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "text", labelAr: "السمة", labelEn: "Trait", type: "text", bilingual: true },
                    ],
                },
            ],
        },
        {
            id: "gallery",
            title: "معرض الصور",
            emoji: "🖼",
            description: "صور المصنع والمعدات — جولة في المصنع",
            fields: [
                { key: "title", labelAr: "عنوان المعرض", labelEn: "Gallery Title", type: "text", bilingual: true, placeholder: "جولة في المصنع" },
                { key: "subtitle", labelAr: "وصف المعرض", labelEn: "Gallery Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "صورة",
                    labelEn: "Image",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "وصف الصورة", labelEn: "Caption", type: "text", bilingual: true },
                        { key: "url", labelAr: "رابط الصورة", labelEn: "Image URL", type: "url", bilingual: false, placeholder: "/images/factory/gallery-1.jpg" },
                    ],
                },
            ],
        },
        {
            id: "team",
            title: "فريق الإدارة العليا",
            emoji: "👥",
            description: "أعضاء فريق الإدارة العليا وشركاء النجاح",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "شركاء النجاح" },
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "فريق الإدارة العليا" },
                { key: "subtitle", labelAr: "وصف القسم", labelEn: "Section Subtitle", type: "textarea", bilingual: true },
                {
                    key: "members",
                    labelAr: "عضو",
                    labelEn: "Member",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم العضو", labelEn: "Name", type: "text", bilingual: true },
                        { key: "role", labelAr: "المسمى الوظيفي", labelEn: "Role", type: "text", bilingual: true },
                        { key: "image", labelAr: "الصورة الشخصية", labelEn: "Profile Image URL", type: "url", bilingual: false, placeholder: "/images/team/member.jpg" },
                    ],
                },
            ],
        },
    ];
