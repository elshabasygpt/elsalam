// Section configurations for each page

export interface FieldConfig {
    key: string;
    labelAr: string;
    labelEn: string;
    type: "text" | "textarea" | "url" | "list" | "select" | "color" | "range" | "toggle";
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
    bilingual: boolean;
    required?: boolean;
    placeholder?: string;
    placeholderEn?: string;
    listFields?: FieldConfig[];
}

export interface SectionConfig {
    id: string;
    title: string;
    emoji: string;
    description?: string;
    fields: FieldConfig[];
}

export const PAGE_SECTIONS: Record<string, SectionConfig[]> = {
    home: [
        // ── 1. Hero Slides ──
        {
            id: "heroSlides",
            title: "السلايدر الرئيسي (Hero Slides)",
            emoji: "🎞",
            description: "الشرائح والعناوين الرئيسية أعلى الصفحة — يمكنك إضافة/حذف شرائح",
            fields: [
                {
                    key: "slides",
                    labelAr: "شريحة",
                    labelEn: "Slide",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "tabName", labelAr: "اسم التبويب", labelEn: "Tab Name", type: "text", bilingual: true, placeholder: "مثال: الجودة والإنتاج" },
                        { key: "badge", labelAr: "الشارة", labelEn: "Badge", type: "text", bilingual: true, placeholder: "مثال: أكثر من 25 عاماً" },
                        { key: "titleLine1", labelAr: "السطر الأول من العنوان", labelEn: "Title Line 1", type: "text", bilingual: true, placeholder: "الريادة في عصر" },
                        { key: "titleLine2", labelAr: "السطر الثاني من العنوان", labelEn: "Title Line 2", type: "text", bilingual: true, placeholder: "الزيوت النباتية" },
                        { key: "subtitle", labelAr: "النص التوضيحي", labelEn: "Subtitle", type: "textarea", bilingual: true },
                        { key: "ctaPrimary", labelAr: "نص الزر الأساسي", labelEn: "Primary Button", type: "text", bilingual: true, placeholder: "اكتشف منتجاتنا" },
                        { key: "ctaPrimaryLink", labelAr: "رابط الزر الأساسي", labelEn: "Primary Link", type: "url", bilingual: false, placeholder: "/products" },
                        { key: "ctaSecondary", labelAr: "نص الزر الثانوي", labelEn: "Secondary Button", type: "text", bilingual: true, placeholder: "شراكات التصدير" },
                        { key: "ctaSecondaryLink", labelAr: "رابط الزر الثانوي", labelEn: "Secondary Link", type: "url", bilingual: false, placeholder: "/export" },
                        { key: "image", labelAr: "صورة/خلفية الشريحة", labelEn: "Slide Image URL", type: "url", bilingual: false, placeholder: "/images/hero-bg.png" },
                    ],
                },
            ],
        },

        // ── 1b. Hero Design Controls ──
        {
            id: "heroDesign",
            title: "🎨 تصميم الهيرو — الخط والألوان والتخطيط",
            emoji: "🎨",
            description: "تحكم كامل في حجم الخط ووزنه وألوان النصوص والحشو وتأثير الزجاج وطبقة التعتيم",
            fields: [
                // ─── Typography ───────────────────────────────
                {
                    key: "titleFontSize",
                    labelAr: "حجم العنوان الرئيسي (H1)",
                    labelEn: "Title Font Size",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "صغير — 36px", value: "text-4xl" },
                        { label: "متوسط — 48px", value: "text-5xl" },
                        { label: "كبير — 60px", value: "text-6xl" },
                        { label: "كبير جداً — 72px", value: "text-7xl" },
                        { label: "ضخم — 96px", value: "text-8xl" },
                    ],
                },
                {
                    key: "titleFontWeight",
                    labelAr: "وزن خط العنوان",
                    labelEn: "Title Font Weight",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "Bold (700)", value: "font-bold" },
                        { label: "Extra Bold (800)", value: "font-extrabold" },
                        { label: "Black (900)", value: "font-black" },
                    ],
                },
                {
                    key: "titleLineHeight",
                    labelAr: "ارتفاع السطر (Line Height)",
                    labelEn: "Line Height",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "ضيق — 1.1", value: "leading-tight" },
                        { label: "متقارب — 1.25", value: "leading-snug" },
                        { label: "عادي — 1.5", value: "leading-normal" },
                        { label: "واسع — 1.75", value: "leading-relaxed" },
                    ],
                },
                {
                    key: "subtitleFontSize",
                    labelAr: "حجم خط العنوان الفرعي",
                    labelEn: "Subtitle Font Size",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "صغير — 14px", value: "text-sm" },
                        { label: "عادي — 16px", value: "text-base" },
                        { label: "متوسط — 18px", value: "text-lg" },
                        { label: "كبير — 20px", value: "text-xl" },
                        { label: "كبير جداً — 24px", value: "text-2xl" },
                    ],
                },
                // ─── Colors ────────────────────────────────────
                {
                    key: "titleColor",
                    labelAr: "لون العنوان الرئيسي (السطر الأول)",
                    labelEn: "Title Color",
                    type: "color",
                    bilingual: false,
                    placeholder: "#ffffff",
                },
                {
                    key: "titleLine2Color",
                    labelAr: "لون الكلمة المميزة (السطر الثاني)",
                    labelEn: "Highlighted Title Color",
                    type: "color",
                    bilingual: false,
                    placeholder: "#34d399",
                },
                {
                    key: "subtitleColor",
                    labelAr: "لون النص التوضيحي",
                    labelEn: "Subtitle Color",
                    type: "color",
                    bilingual: false,
                    placeholder: "#d1d5db",
                },
                // ─── Spacing ───────────────────────────────────
                {
                    key: "contentPaddingTop",
                    labelAr: "الحشو العلوي للمحتوى",
                    labelEn: "Content Padding Top",
                    type: "range",
                    bilingual: false,
                    min: 20,
                    max: 200,
                    step: 4,
                },
                {
                    key: "contentPaddingBottom",
                    labelAr: "الحشو السفلي للمحتوى",
                    labelEn: "Content Padding Bottom",
                    type: "range",
                    bilingual: false,
                    min: 16,
                    max: 160,
                    step: 4,
                },
                {
                    key: "cardPaddingX",
                    labelAr: "الحشو الأفقي للبطاقة الداخلية",
                    labelEn: "Card Padding X",
                    type: "range",
                    bilingual: false,
                    min: 16,
                    max: 80,
                    step: 4,
                },
                {
                    key: "cardPaddingY",
                    labelAr: "الحشو العمودي للبطاقة الداخلية",
                    labelEn: "Card Padding Y",
                    type: "range",
                    bilingual: false,
                    min: 16,
                    max: 80,
                    step: 4,
                },
                // ─── Glassmorphism Card ────────────────────────
                {
                    key: "cardBgOpacity",
                    labelAr: "شفافية خلفية البطاقة (0 = شفاف، 80 = شبه معتم)",
                    labelEn: "Card Background Opacity",
                    type: "range",
                    bilingual: false,
                    min: 0,
                    max: 80,
                    step: 5,
                },
                {
                    key: "cardBlur",
                    labelAr: "تأثير الضبابية (Blur)",
                    labelEn: "Card Blur",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "بدون ضباب", value: "backdrop-blur-none" },
                        { label: "خفيف", value: "backdrop-blur-sm" },
                        { label: "متوسط", value: "backdrop-blur-md" },
                        { label: "قوي", value: "backdrop-blur-xl" },
                        { label: "قوي جداً", value: "backdrop-blur-3xl" },
                    ],
                },
                {
                    key: "cardBorderEnabled",
                    labelAr: "إظهار حدود البطاقة",
                    labelEn: "Show Card Border",
                    type: "toggle",
                    bilingual: false,
                },
                {
                    key: "cardRounded",
                    labelAr: "انحناء حواف البطاقة",
                    labelEn: "Card Corner Radius",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "حاد", value: "rounded-xl" },
                        { label: "متوسط", value: "rounded-2xl" },
                        { label: "دائري كبير", value: "rounded-3xl" },
                        { label: "كبسول", value: "rounded-[2rem]" },
                    ],
                },
                // ─── Overlay ───────────────────────────────────
                {
                    key: "overlayOpacity",
                    labelAr: "شدة تعتيم خلفية الصورة (0 = بدون، 95 = معتم جداً)",
                    labelEn: "Background Overlay Opacity",
                    type: "range",
                    bilingual: false,
                    min: 0,
                    max: 95,
                    step: 5,
                },
                // ─── Layout ─────────────────────────────────────
                {
                    key: "textAlign",
                    labelAr: "محاذاة النص",
                    labelEn: "Text Alignment",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "يسار / بداية السطر", value: "text-start" },
                        { label: "وسط", value: "text-center" },
                    ],
                },
                {
                    key: "cardMaxWidth",
                    labelAr: "أقصى عرض للبطاقة",
                    labelEn: "Card Max Width",
                    type: "select",
                    bilingual: false,
                    options: [
                        { label: "ضيق — 576px", value: "max-w-xl" },
                        { label: "متوسط — 672px", value: "max-w-2xl" },
                        { label: "واسع — 768px", value: "max-w-3xl" },
                        { label: "أوسع — 896px", value: "max-w-4xl" },
                        { label: "كامل العرض", value: "max-w-full" },
                    ],
                },
            ],
        },

        {
            id: "segments",
            title: "قطاعات الأعمال المخصصة",
            emoji: "🏢",
            description: "تتحكم في قسم (نقدم حلول متخصصة لكل قطاع)",
            fields: [
                { key: "title", labelAr: "العنوان الرئيسي", labelEn: "Title", type: "text", bilingual: true, placeholder: "كيف يمكننا خدمتك؟" },
                { key: "subtitle", labelAr: "الوصف الفرعي", labelEn: "Subtitle", type: "text", bilingual: true, placeholder: "نقدم حلولاً مخصصة لكل قطاع" },
                {
                    key: "items",
                    labelAr: "قطاع",
                    labelEn: "Segment",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "عنوان القطاع", labelEn: "Segment Title", type: "text", bilingual: true, placeholder: "مصانع الأغذية" },
                        { key: "desc", labelAr: "وصف القطاع", labelEn: "Description", type: "textarea", bilingual: true },
                        { key: "cta", labelAr: "نص الزر", labelEn: "Button Text", type: "text", bilingual: true, placeholder: "طلب عرض سعر" },
                        { key: "link", labelAr: "رابط الزر", labelEn: "Button Link", type: "text", bilingual: false, placeholder: "/b2b/quote" },
                        { key: "image", labelAr: "صورة القطاع", labelEn: "Segment Image", type: "url", bilingual: false, placeholder: "/images/segment-1.jpg" },
                    ],
                },
            ],
        },

        {
            id: "stats",
            title: "الإحصائيات والأرقام",
            emoji: "📊",
            description: "أرقام إنجازات المصنع (سنوات خبرة، طاقة إنتاجية، دول تصدير...)",
            fields: [
                {
                    key: "items",
                    labelAr: "إحصائية",
                    labelEn: "Stat",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "number", labelAr: "الرقم", labelEn: "Number", type: "text", bilingual: false, placeholder: "25+" },
                        { key: "label", labelAr: "التسمية", labelEn: "Label", type: "text", bilingual: true, placeholder: "سنوات الخبرة" },
                    ],
                },
            ],
        },

        // ── 3. Why Choose Us ──
        {
            id: "whyChooseUs",
            title: "لماذا تختارنا",
            emoji: "⭐",
            description: "مميزات المصنع — 4 أسباب تجعلنا الخيار الأول",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Section Badge", type: "text", bilingual: true, placeholder: "لماذا نحن؟" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, placeholder: "لماذا تختار" },
                { key: "titleHighlight", labelAr: "الكلمة المميزة (مُلوّنة)", labelEn: "Highlighted Word", type: "text", bilingual: true, placeholder: "مصنع السلام" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                {
                    key: "reasons",
                    labelAr: "ميزة",
                    labelEn: "Reason",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "عنوان الميزة", labelEn: "Title", type: "text", bilingual: true, placeholder: "طاقة إنتاجية ضخمة" },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                    ],
                },
            ],
        },


        {
            id: "featuredProducts",
            title: "المنتجات المميزة",
            emoji: "📦",
            description: "المنتجات الرئيسية المعروضة على الصفحة الرئيسية",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "أفضل المنتجات" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "text", bilingual: true },
                { key: "viewAll", labelAr: "نص زر عرض الكل", labelEn: "View All Text", type: "text", bilingual: true, placeholder: "عرض كل المنتجات" },
                {
                    key: "products",
                    labelAr: "منتج",
                    labelEn: "Product",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم المنتج", labelEn: "Product Name", type: "text", bilingual: true, placeholder: "زيت صويا مكرر" },
                        { key: "subtitle", labelAr: "الاسم الإنجليزي", labelEn: "English Name", type: "text", bilingual: false, placeholder: "Refined Soybean Oil" },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                        { key: "image", labelAr: "صورة المنتج", labelEn: "Product Image", type: "url", bilingual: false, placeholder: "/images/products/soy-oil.png" },
                        { key: "slug", labelAr: "رابط المنتج (أو Slug)", labelEn: "Product Link/Slug", type: "text", bilingual: false, placeholder: "soybean-oil أو /products/soybean-oil" },
                    ],
                },
            ],
        },

        // ── 6. Our Process (آلية الإنتاج) ──
        {
            id: "ourProcess",
            title: "آلية الإنتاج والجودة",
            emoji: "⚙️",
            description: "خطوات الإنتاج من البذرة إلى المائدة",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "آلية الإنتاج والجودة" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, placeholder: "من البذرة إلى المائدة" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                {
                    key: "steps",
                    labelAr: "خطوة",
                    labelEn: "Step",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم الخطوة", labelEn: "Step Title", type: "text", bilingual: true, placeholder: "اختيار أفضل البذور" },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                        { key: "image", labelAr: "صورة الخطوة", labelEn: "Step Image", type: "url", bilingual: false, placeholder: "/images/process/step-1.jpg" },
                    ],
                },
            ],
        },

        // ── 7. Global Footprint (البصمة العالمية) ──
        {
            id: "globalFootprint",
            title: "البصمة العالمية",
            emoji: "🌍",
            description: "خريطة التصدير ودول التواجد",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, placeholder: "بصمتنا العالمية" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
            ],
        },

        // ── 8. Sustainability (الاستدامة) ──
        {
            id: "sustainability",
            title: "الاستدامة والمسؤولية البيئية",
            emoji: "🌱",
            description: "نصوص قسم الاستدامة وحماية البيئة",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
            ],
        },

        // ── 9. Virtual Tour (جولة افتراضية) ──
        {
            id: "virtualTour",
            title: "الجولة الافتراضية",
            emoji: "🎥",
            description: "قسم الفيديو أو الجولة الافتراضية في المصنع",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "videoUrl", labelAr: "رابط الفيديو", labelEn: "Video URL", type: "url", bilingual: false, placeholder: "https://youtube.com/..." },
            ],
        },

        // ── 10. Packaging Guide ──
        {
            id: "packaging",
            title: "دليل التعبئة والتغليف",
            emoji: "📦",
            description: "أنواع العبوات المتاحة",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "خيارات التعبئة" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                {
                    key: "types",
                    labelAr: "نوع عبوة",
                    labelEn: "Package Type",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم العبوة", labelEn: "Package Name", type: "text", bilingual: true, placeholder: "عبوات بلاستيكية (PET)" },
                        { key: "sizes", labelAr: "الأحجام", labelEn: "Sizes", type: "text", bilingual: true, placeholder: "1، 2، 5 لتر" },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                        { key: "image", labelAr: "صورة العبوة", labelEn: "Package Image", type: "url", bilingual: false, placeholder: "/images/packaging/pet.png" },
                    ],
                },
            ],
        },

        // ── 11. Certifications ──
        {
            id: "certifications",
            title: "شهادات الجودة والاعتمادات",
            emoji: "🏅",
            description: "الشهادات الدولية التي حصل عليها المصنع",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "الجودة والامتثال" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                {
                    key: "certs",
                    labelAr: "شهادة",
                    labelEn: "Certificate",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم الشهادة", labelEn: "Certificate Name", type: "text", bilingual: true, placeholder: "ISO 9001" },
                        { key: "desc", labelAr: "الوصف", labelEn: "Description", type: "text", bilingual: true, placeholder: "إدارة الجودة الشاملة" },
                        { key: "image", labelAr: "صورة الشهادة", labelEn: "Certificate Image", type: "url", bilingual: false, placeholder: "/images/certs/iso.png" },
                    ],
                },
            ],
        },

        // ── 12. Testimonials (آراء العملاء) ──
        {
            id: "testimonials",
            title: "آراء العملاء والشركاء",
            emoji: "💬",
            description: "اقتباسات وتقييمات العملاء",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "ماذا يقول عملاؤنا" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "رأي عميل",
                    labelEn: "Testimonial",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم العميل", labelEn: "Client Name", type: "text", bilingual: true, placeholder: "م. خالد عبد الرحمن" },
                        { key: "role", labelAr: "المنصب/الشركة", labelEn: "Role/Company", type: "text", bilingual: true, placeholder: "مدير مشتريات — مصنع النجمة" },
                        { key: "content", labelAr: "نص التقييم", labelEn: "Review Text", type: "textarea", bilingual: true },
                        { key: "avatar", labelAr: "صورة العميل", labelEn: "Client Photo", type: "url", bilingual: false, placeholder: "/images/clients/avatar.jpg" },
                    ],
                },
            ],
        },

        // ── 13. Timeline (مسار الإنتاج) ──
        {
            id: "timeline",
            title: "مسار الإنتاج (Timeline)",
            emoji: "🔄",
            description: "خطوات رحلة المنتج من الطبيعة إلى المائدة",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "مراحل الإنتاج" },
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                {
                    key: "steps",
                    labelAr: "مرحلة",
                    labelEn: "Step",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "title", labelAr: "اسم المرحلة", labelEn: "Step Title", type: "text", bilingual: true, placeholder: "استلام وتجهيز البذور" },
                        { key: "description", labelAr: "الوصف", labelEn: "Description", type: "textarea", bilingual: true },
                    ],
                },
            ],
        },

        // ── 14. FAQ (الأسئلة الشائعة) ──
        {
            id: "faq",
            title: "الأسئلة الشائعة (FAQ)",
            emoji: "❓",
            description: "الأسئلة والأجوبة المتكررة",
            fields: [
                { key: "title", labelAr: "عنوان القسم", labelEn: "Section Title", type: "text", bilingual: true, placeholder: "الأسئلة الشائعة" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "text", bilingual: true },
                {
                    key: "items",
                    labelAr: "سؤال",
                    labelEn: "Question",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "question", labelAr: "السؤال", labelEn: "Question", type: "text", bilingual: true },
                        { key: "answer", labelAr: "الإجابة", labelEn: "Answer", type: "textarea", bilingual: true },
                    ],
                },
            ],
        },

        // ── 15. CTA Partnership ──
        {
            id: "ctaPartnership",
            title: "دعوة الشراكة (CTA)",
            emoji: "🤝",
            description: "قسم الدعوة للتواصل والشراكة أسفل الصفحة",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, placeholder: "هل تبحث عن شريك صناعي موثوق؟" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "ctaPrimary", labelAr: "نص الزر الأساسي", labelEn: "Primary Button", type: "text", bilingual: true, placeholder: "طلب عرض سعر" },
                { key: "ctaSecondary", labelAr: "نص الزر الثانوي", labelEn: "Secondary Button", type: "text", bilingual: true, placeholder: "تواصل مع فريق المبيعات" },
            ],
        },

        // ── 16. Client Logos ──
        {
            id: "clientLogos",
            title: "شركاء النجاح (Client Logos)",
            emoji: "🏢",
            description: "أسماء وشعارات الشركاء",
            fields: [
                { key: "badge", labelAr: "شارة القسم", labelEn: "Badge", type: "text", bilingual: true, placeholder: "شركاء النجاح" },
                { key: "titleBefore", labelAr: "نص قبل الرقم", labelEn: "Text Before Number", type: "text", bilingual: true, placeholder: "يثق بنا أكثر من" },
                { key: "titleCount", labelAr: "الرقم", labelEn: "Count", type: "text", bilingual: false, placeholder: "200+" },
                { key: "titleAfter", labelAr: "نص بعد الرقم", labelEn: "Text After Number", type: "text", bilingual: true, placeholder: "شريك صناعي" },
                {
                    key: "names",
                    labelAr: "شريك",
                    labelEn: "Partner",
                    type: "list",
                    bilingual: false,
                    listFields: [
                        { key: "name", labelAr: "اسم الشريك", labelEn: "Partner Name", type: "text", bilingual: true, placeholder: "مجموعة الصفا الغذائية" },
                        { key: "logo", labelAr: "شعار الشريك", labelEn: "Logo URL", type: "url", bilingual: false, placeholder: "/images/clients/logo.png" },
                    ],
                },
            ],
        },

        // ── 17. Footer ──
        {
            id: "footer",
            title: "تذييل الصفحة (Footer)",
            emoji: "📋",
            description: "نصوص وبيانات الفوتر",
            fields: [
                { key: "description", labelAr: "وصف المصنع", labelEn: "Factory Description", type: "textarea", bilingual: true },
                { key: "address", labelAr: "العنوان", labelEn: "Address", type: "text", bilingual: true, placeholder: "المنطقة الصناعية، المنوفية، مصر" },
                { key: "phone", labelAr: "رقم الهاتف", labelEn: "Phone", type: "text", bilingual: false, placeholder: "+20 1xx xxx xxxx" },
                { key: "email", labelAr: "البريد الإلكتروني", labelEn: "Email", type: "text", bilingual: false, placeholder: "info@elsalamoils.com" },
                { key: "copyright", labelAr: "نص حقوق النشر", labelEn: "Copyright", type: "text", bilingual: true },
                { key: "newsletterTitle", labelAr: "عنوان النشرة البريدية", labelEn: "Newsletter Title", type: "text", bilingual: true },
                { key: "newsletterSubtitle", labelAr: "وصف النشرة", labelEn: "Newsletter Subtitle", type: "text", bilingual: true },
            ],
        },
    ],

    about: [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "📌",
            description: "عنوان ووصف صفحة من نحن",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true, placeholder: "مثال: قصة مصنع السلام" },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
                { key: "badge", labelAr: "الشارة", labelEn: "Badge", type: "text", bilingual: true, placeholder: "مثال: جودة عالمية منذ عام 2000" },
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
    ],

    quality: [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "✅",
            description: "عنوان ووصف صفحة معايير الجودة",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
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
    ],

    production: [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "🏭",
            description: "عنوان ووصف صفحة مراحل الإنتاج",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
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
    ],

    export: [
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
    ],

    b2b: [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "🤝",
            description: "عنوان ووصف صفحة شراكات B2B",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
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
    ],

    contact: [
        {
            id: "hero",
            title: "القسم الرئيسي (Hero)",
            emoji: "📞",
            description: "عنوان ووصف صفحة تواصل معنا",
            fields: [
                { key: "title", labelAr: "العنوان", labelEn: "Title", type: "text", bilingual: true, required: true },
                { key: "subtitle", labelAr: "الوصف", labelEn: "Subtitle", type: "textarea", bilingual: true },
            ],
        },
        {
            id: "contactInfo",
            title: "معلومات الاتصال",
            emoji: "📋",
            description: "عنوان المصنع وأرقام الهاتف والبريد",
            fields: [
                { key: "address", labelAr: "العنوان", labelEn: "Address", type: "text", bilingual: true },
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
                    ],
                },
            ],
        },
    ],
};
