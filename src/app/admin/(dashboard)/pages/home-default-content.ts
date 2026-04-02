/**
 * Default CMS content for the home page.
 * This maps the existing i18n translations (ar + en) into the CMS structure
 * so the admin editor shows pre-filled content on first use.
 */

export function getHomePageDefaultContent(): Record<string, any> {
    return {
        // ── Section 1: Hero Slides ──
        heroSlides: {
            slides: [
                {
                    tabName_ar: "الجودة والإنتاج",
                    tabName_en: "Quality & Production",
                    badge_ar: "أكثر من 25 عاماً من الخبرة في عصر الزيوت",
                    badge_en: "Over 25 years of experience in oil pressing",
                    titleLine1_ar: "الريادة في عصر",
                    titleLine1_en: "Leading in",
                    titleLine2_ar: "الزيوت النباتية",
                    titleLine2_en: "Vegetable Oils",
                    subtitle_ar: "مصنع السلام يلتزم بتقديم أعلى معايير الجودة في إنتاج الزيوت، السمن والشورتنج للسوق المصري والعالمي بأحدث التقنيات الأوروبية.",
                    subtitle_en: "Elsalam Factory is committed to the highest quality standards in producing oils, margarine & shortening for the Egyptian and international markets using the latest European technologies.",
                    ctaPrimary_ar: "اكتشف منتجاتنا",
                    ctaPrimary_en: "Explore Products",
                    ctaPrimaryLink: "/products",
                    ctaSecondary_ar: "شراكات التصدير",
                    ctaSecondary_en: "Export Partnerships",
                    ctaSecondaryLink: "/export",
                    image: "/images/hero-bg.png",
                },
                {
                    tabName_ar: "التصدير العالمي",
                    tabName_en: "Global Export",
                    badge_ar: "نصدر لأكثر من 15 دولة حول العالم",
                    badge_en: "Exporting to 15+ countries worldwide",
                    titleLine1_ar: "شريكك الموثوق في",
                    titleLine1_en: "Your Trusted Partner in",
                    titleLine2_ar: "التجارة الدولية",
                    titleLine2_en: "Global Trade",
                    subtitle_ar: "منتجات جاهزة للتصدير بأعلى المواصفات القياسية، مع لوجستيات متكاملة لتلبية متطلبات الأسواق العالمية بمرونة وكفاءة.",
                    subtitle_en: "Export-ready products meeting the highest international standards, backed by integrated logistics to serve global markets with flexibility and efficiency.",
                    ctaPrimary_ar: "دليل التصدير",
                    ctaPrimary_en: "Export Guide",
                    ctaPrimaryLink: "/export",
                    ctaSecondary_ar: "تواصل معنا",
                    ctaSecondary_en: "Contact Us",
                    ctaSecondaryLink: "/contact",
                    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c1590f?q=80&w=2070&auto=format&fit=crop",
                },
                {
                    tabName_ar: "شراكات الجملة B2B",
                    tabName_en: "B2B Partnerships",
                    badge_ar: "طاقة إنتاجية تصل إلى 500 طن يومياً",
                    badge_en: "Production capacity up to 500 tons/day",
                    titleLine1_ar: "حلول صناعية",
                    titleLine1_en: "Industrial Solutions at",
                    titleLine2_ar: "بأسعار المصنع",
                    titleLine2_en: "Factory Prices",
                    subtitle_ar: "نوفر الزيوت، السمن، والشورتنج بكميات ضخمة وتعبئات مخصصة للمصانع، المخابز، وسلاسل المطاعم الكبرى.",
                    subtitle_en: "We supply oils, margarine, and shortening in bulk quantities with custom packaging for factories, bakeries, and major restaurant chains.",
                    ctaPrimary_ar: "طلب عرض سعر بالجملة",
                    ctaPrimary_en: "Request Bulk Quote",
                    ctaPrimaryLink: "/b2b/quote",
                    ctaSecondary_ar: "مزايا الشراكة",
                    ctaSecondary_en: "Partnership Benefits",
                    ctaSecondaryLink: "/b2b",
                    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=1974&auto=format&fit=crop",
                },
            ],
        },

        // ── Section 2: Stats ──
        stats: {
            items: [
                { value: "25+", label_ar: "سنوات الخبرة", label_en: "Years of Experience" },
                { value: "500", label_ar: "طن إنتاج يومياً", label_en: "Tons Daily Production" },
                { value: "15+", label_ar: "دولة تصدير", label_en: "Export Countries" },
                { value: "200+", label_ar: "عميل صناعي", label_en: "Industrial Clients" },
                { value: "8", label_ar: "خطوط إنتاج", label_en: "Production Lines" },
                { value: "6", label_ar: "شهادات جودة", label_en: "Quality Certifications" },
            ],
        },

        // ── Section 3: Why Choose Us ──
        whyChooseUs: {
            badge_ar: "لماذا نحن؟",
            badge_en: "Why Us?",
            title_ar: "لماذا تختار",
            title_en: "Why Choose",
            titleHighlight_ar: "مصنع السلام",
            titleHighlight_en: "Elsalam Factory",
            subtitle_ar: "نبني شراكات استراتيجية موثوقة تعتمد على الجودة والالتزام المطلق",
            subtitle_en: "We build reliable strategic partnerships based on quality and absolute commitment",
            reasons: [
                { title_ar: "طاقة إنتاجية ضخمة", title_en: "Massive Production Capacity", description_ar: "بقدرة إنتاجية تصل إلى 500 طن يومياً، نضمن تلبية كافة الطلبيات الكبرى للقطاع الصناعي والتجاري دون تأخير.", description_en: "With a production capacity of up to 500 tons per day, we guarantee fulfilling all major orders for the industrial and commercial sectors without delay." },
                { title_ar: "معايير جودة عالمية", title_en: "Global Quality Standards", description_ar: "حاصلون على أعلى شهادات الجودة وسلامة الغذاء الدولية، مما يضمن تصدير منتجاتنا لأكثر من 15 دولة.", description_en: "Certified with the highest international quality and food safety standards, ensuring our products are exported to over 15 countries." },
                { title_ar: "تقنيات تكرير متطورة", title_en: "Advanced Refining Technology", description_ar: "نستخدم أحدث تكنولوجيا التكرير لتحقيق أعلى درجات النقاء والشفافية، مع الحفاظ على القيمة الغذائية.", description_en: "We use the latest refining technology to achieve the highest levels of purity and transparency while preserving nutritional value." },
                { title_ar: "طبيعي 100%", title_en: "100% Natural", description_ar: "منتجاتنا خالية تماماً من المواد الحافظة والإضافات الكيميائية الضارة، لنقدم لك زيوتاً صحية وآمنة تماماً.", description_en: "Our products are completely free from preservatives and harmful chemical additives, offering you healthy and safe oils." },
            ],
        },

        // ── Section 4: Segments ──
        segments: {
            title_ar: "كيف يمكننا خدمتك؟",
            title_en: "How Can We Serve You?",
            subtitle_ar: "نقدم حلولاً مخصصة لكل قطاع",
            subtitle_en: "Customized solutions for every sector",
            items: [
                { title_ar: "مصانع الأغذية", title_en: "Food Manufacturers", desc_ar: "حلول بالجملة مع مواصفات مخصصة لخطوط إنتاجك", desc_en: "Wholesale solutions with custom specs for your production lines", cta_ar: "طلب عرض سعر", cta_en: "Request Quote" },
                { title_ar: "فنادق ومطاعم", title_en: "Hotels & Restaurants", desc_ar: "منتجات HoReCa بتعبئات مناسبة ومواصفات عالمية", desc_en: "HoReCa products with suitable packaging & global specs", cta_ar: "تواصل معنا", cta_en: "Contact Us" },
                { title_ar: "التصدير العالمي", title_en: "Global Export", desc_ar: "منتجات جاهزة للتصدير بمطابقة كاملة للمعايير الدولية", desc_en: "Export-ready products fully compliant with international standards", cta_ar: "استفسار تصدير", cta_en: "Export Inquiry" },
                { title_ar: "التجزئة والتوزيع", title_en: "Retail & Distribution", desc_ar: "أسعار تنافسية وتوصيل مباشر لنقاط البيع", desc_en: "Competitive prices with direct delivery to points of sale", cta_ar: "تسوق الآن", cta_en: "Shop Now" },
            ],
        },

        // ── Section 5: Featured Products ──
        featuredProducts: {
            badge_ar: "أفضل المنتجات",
            badge_en: "Top Products",
            title_ar: "منتجاتنا الرائدة",
            title_en: "Our Leading Products",
            subtitle_ar: "تلبية لاحتياجات السوق المحلي والتصدير",
            subtitle_en: "Meeting local market and export needs",
            viewAll_ar: "عرض كل المنتجات",
            viewAll_en: "View All Products",
        },

        // ── Section 6: Our Process ──
        ourProcess: {
            title_ar: "مسار الإنتاج",
            title_en: "Production Journey",
            subtitle_ar: "من الطبيعة إلى مائدتك",
            subtitle_en: "From nature to your table",
        },

        // ── Section 7: Global Footprint ──
        globalFootprint: {
            title_ar: "البصمة العالمية",
            title_en: "Global Footprint",
            subtitle_ar: "نصدر لأكثر من 15 دولة حول العالم",
            subtitle_en: "We export to over 15 countries worldwide",
        },

        // ── Section 8: Sustainability ──
        sustainability: {
            title_ar: "الاستدامة والمسؤولية البيئية",
            title_en: "Sustainability & Environmental Responsibility",
            subtitle_ar: "نلتزم بأعلى معايير الاستدامة في عمليات الإنتاج",
            subtitle_en: "We are committed to the highest sustainability standards in our production processes",
        },

        // ── Section 9: Virtual Tour ──
        virtualTour: {
            title_ar: "الجولة الافتراضية",
            title_en: "Virtual Tour",
            subtitle_ar: "تعرف على مصنعنا من الداخل",
            subtitle_en: "Explore our factory from the inside",
        },

        // ── Section 10: Packaging ──
        packaging: {
            badge_ar: "خيارات التعبئة",
            badge_en: "Packaging Options",
            title_ar: "عبوات تلبي كافة احتياجاتك",
            title_en: "Packaging for Every Need",
            subtitle_ar: "نوفر خيارات تعبئة مرنة ومتنوعة تناسب جميع القطاعات من التجزئة وحتى الشحن البحري للصناعات الكبرى.",
            subtitle_en: "We provide flexible and diverse packaging options suitable for all sectors, from retail to bulk maritime shipping for major industries.",
            types: [
                { title_ar: "عبوات بلاستيكية (PET)", title_en: "PET Plastic Bottles", sizes_ar: "1، 2، 5 لتر", sizes_en: "1, 2, 5 liters", description_ar: "مثالية لتطبيقات التجزئة والأسواق الاستهلاكية والاستخدام المنزلي.", description_en: "Ideal for retail applications, consumer markets, and household use." },
                { title_ar: "تنكات صفيح", title_en: "Tin Cans", sizes_ar: "16 لتـر، 18 لتـر", sizes_en: "16L, 18L", description_ar: "الخيار الأمثل للمطاعم والفنادق (HoReCa) المعتمدة على الاستهلاك الكثيف.", description_en: "The optimal choice for restaurants and hotels (HoReCa) with heavy consumption." },
                { title_ar: "براميـل حديدية", title_en: "Steel Drums", sizes_ar: "200 لتـر", sizes_en: "200L", description_ar: "تعبئة اقتصادية للمصانع الغذائية ومصانع الحلويات والمخابز الكبرى.", description_en: "Economical packaging for food factories, confectioneries, and large bakeries." },
                { title_ar: "فليكسي تانك", title_en: "Flexitank", sizes_ar: "22,000 لتـر", sizes_en: "22,000L", description_ar: "الحل الاستراتيجي لتصدير كميات ضخمة للشحن البحري بأقل تكلفة لوجستية.", description_en: "The strategic solution for exporting large quantities via maritime shipping at the lowest logistics cost." },
            ],
        },

        // ── Section 11: Certifications ──
        certifications: {
            badge_ar: "الجودة والامتثال",
            badge_en: "Quality & Compliance",
            title_ar: "شهادات الجودة والاعتمادات الدولية",
            title_en: "Quality Certifications & International Accreditations",
            subtitle_ar: "نفخر بحصولنا على أعلى الشهادات العالمية التي تضمن جودة وسلامة منتجاتنا",
            subtitle_en: "We are proud to hold the highest international certifications ensuring the quality and safety of our products",
            certs: [
                { name_ar: "ISO 9001", name_en: "ISO 9001", desc_ar: "إدارة الجودة الشاملة", desc_en: "Total Quality Management" },
                { name_ar: "ISO 22000", name_en: "ISO 22000", desc_ar: "سلامة الغذاء الدولية", desc_en: "International Food Safety" },
                { name_ar: "HACCP", name_en: "HACCP", desc_ar: "تحليل المخاطر ونقاط التحكم", desc_en: "Hazard Analysis & Critical Control" },
                { name_ar: "Halal", name_en: "Halal", desc_ar: "شهادة الحلال المعتمدة", desc_en: "Certified Halal" },
                { name_ar: "GMP", name_en: "GMP", desc_ar: "ممارسات التصنيع الجيدة", desc_en: "Good Manufacturing Practices" },
                { name_ar: "FDA", name_en: "FDA", desc_ar: "معتمد من إدارة الغذاء والدواء", desc_en: "FDA Approved" },
            ],
        },

        // ── Section 12: Testimonials ──
        testimonials: {
            title_ar: "ماذا يقول عملاؤنا",
            title_en: "What Our Clients Say",
            subtitle_ar: "ثقة تمتد لأكثر من 25 عاماً مع آلاف العملاء في مصر والعالم",
            subtitle_en: "Trust spanning over 25 years with thousands of clients in Egypt and worldwide",
            items: [
                { name_ar: "م. خالد عبد الرحمن", name_en: "Eng. Khaled Abdel Rahman", role_ar: "مدير مشتريات — مصنع بسكويت النجمة", role_en: "Purchasing Manager — Star Biscuit Factory", content_ar: "نتعامل مع مصنع السلام منذ أكثر من 8 سنوات. جودة الشورتنج ثابتة في كل شحنة، وخدمة ما بعد البيع ممتازة.", content_en: "We've been working with Elsalam Factory for over 8 years. The shortening quality is consistent in every shipment, and the after-sales service is excellent." },
                { name_ar: "أ. سارة المصري", name_en: "Ms. Sara Al-Masry", role_ar: "مالكة سلسلة مطاعم الأصالة", role_en: "Owner of Al-Asala Restaurant Chain", content_ar: "زيت عباد الشمس من السلام هو اختيارنا الأول. لا يغير نكهة الطعام ويتحمل القلي المتكرر بشكل ممتاز.", content_en: "Elsalam's sunflower oil is our first choice. It doesn't alter food flavor and handles repeated frying excellently." },
                { name_ar: "Mr. Ahmed Hassan", name_en: "Mr. Ahmed Hassan", role_ar: "مدير الاستيراد — شركة Global Foods Trading, الإمارات", role_en: "Import Manager — Global Foods Trading, UAE", content_ar: "مصنع السلام هو موردنا الموثوق للزيوت النباتية. شهادات ISO والحلال مع أسعار تنافسية تجعلهم الخيار الأفضل في مصر.", content_en: "Elsalam is our trusted supplier for vegetable oils. Their ISO and Halal certifications, combined with competitive pricing, make them the best choice in Egypt." },
                { name_ar: "أ. محمد يوسف", name_en: "Mr. Mohamed Youssef", role_ar: "موزع معتمد — القاهرة الكبرى", role_en: "Authorized Distributor — Greater Cairo", content_ar: "التعامل مع مصنع السلام سهل واحترافي. الأسعار تنافسية والتسليم دائماً في الموعد. أنصح بالتعامل معهم.", content_en: "Working with Elsalam Factory is easy and professional. Prices are competitive and delivery is always on time. Highly recommended." },
            ],
        },

        // ── Section 13: Timeline ──
        timeline: {
            badge_ar: "مراحل الإنتاج",
            badge_en: "Production Process",
            title_ar: "مسار الإنتاج",
            title_en: "Production Journey",
            subtitle_ar: "من الطبيعة إلى مائدتك، رحلة موثقة بأعلى معايير الجودة العالمية",
            subtitle_en: "From nature to your table, a journey documented with the highest global quality standards",
            steps: [
                { title_ar: "استلام وتجهيز البذور", title_en: "Seed Reception & Preparation", description_ar: "استلام البذور الزراعية (صويا، عباد شمس) وتمريرها على أجهزة التنظيف المغناطيسية والغربلة.", description_en: "Receiving agricultural seeds (soybean, sunflower) and passing them through magnetic cleaning and sieving equipment." },
                { title_ar: "العصر والاستخلاص", title_en: "Pressing & Extraction", description_ar: "تكسير وتسخين البذور لزيادة المردود الزيتي، ثم عصرها آلياً واستخلاص الزيت الخام.", description_en: "Crushing and heating seeds to increase oil yield, then mechanically pressing and extracting crude oil." },
                { title_ar: "التكرير والتنقية", title_en: "Refining & Purification", description_ar: "إزالة الصمغ، التبييض، ونزع الرائحة للوصول للزيت النقي عالي الشفافية.", description_en: "Degumming, bleaching, and deodorizing to achieve pure, highly transparent oil." },
                { title_ar: "التعبئة والتغليف", title_en: "Filling & Packaging", description_ar: "تعبئة آلية تحت ظروف صحية تامة لضمان الحفاظ على الخواص الطبيعية للمنتج.", description_en: "Automated filling under full sanitary conditions to preserve the natural properties of the product." },
            ],
        },

        // ── Section 14: FAQ ──
        faq: {
            title_ar: "الأسئلة الشائعة",
            title_en: "Frequently Asked Questions",
            subtitle_ar: "إجابات على أكثر الأسئلة شيوعاً من عملائنا",
            subtitle_en: "Answers to the most common questions from our clients",
            items: [
                { question_ar: "ما هي أنواع الزيوت التي ينتجها مصنع السلام؟", question_en: "What types of oils does Elsalam Factory produce?", answer_ar: "ينتج مصنع السلام تشكيلة واسعة تشمل: زيت صويا مكرر، زيت عباد الشمس، زيت نخيل مكرر، سمن نباتي ممتاز، سمن نباتي صناعي، شورتنج المخابز، وشورتنج القلي العميق. كما نقدم خلطات زيوت مخصصة حسب مواصفات العميل.", answer_en: "Elsalam Factory produces a wide range including: refined soybean oil, sunflower oil, refined palm oil, premium vegetable ghee, industrial margarine, bakery shortening, and deep frying shortening. We also offer custom oil blends per client specifications." },
                { question_ar: "هل منتجاتكم حاصلة على شهادات جودة؟", question_en: "Are your products quality certified?", answer_ar: "نعم، جميع منتجاتنا حاصلة على شهادات ISO 9001 و ISO 22000 و HACCP وشهادة الحلال. نلتزم بأعلى معايير الجودة والسلامة الغذائية في كل مراحل الإنتاج.", answer_en: "Yes, all our products hold ISO 9001, ISO 22000, HACCP, and Halal certifications. We adhere to the highest quality and food safety standards at every production stage." },
                { question_ar: "ما هي الحد الأدنى لكمية الطلب؟", question_en: "What is the minimum order quantity?", answer_ar: "للسوق المحلي: يختلف الحد الأدنى حسب نوع المنتج والتعبئة. للتصدير: الحد الأدنى هو 20 طن (حاوية 20 قدم). يمكنك التواصل معنا للحصول على تفاصيل أكثر حسب احتياجك.", answer_en: "For local market: the minimum varies by product type and packaging. For export: the minimum is 20 tons (1x20' FCL). Contact us for more details based on your needs." },
                { question_ar: "هل تصدرون لخارج مصر؟", question_en: "Do you export outside Egypt?", answer_ar: "نعم، نصدّر لأكثر من 15 دولة حول العالم تشمل الشرق الأوسط، أفريقيا، أوروبا، وآسيا. نوفر جميع الوثائق اللازمة للتخليص الجمركي.", answer_en: "Yes, we export to over 15 countries worldwide including the Middle East, Africa, Europe, and Asia. We provide all documentation required for customs clearance." },
                { question_ar: "ما هي خيارات التعبئة المتاحة؟", question_en: "What packaging options are available?", answer_ar: "نقدم تعبئات متنوعة: عبوات استهلاكية (1 لتر، 2 لتر، 5 لتر)، عبوات صناعية (18 لتر، براميل 200 لتر)، وفليكسي تانك للشحن بالجملة. يمكننا أيضاً توفير تعبئة مخصصة بعلامتك التجارية.", answer_en: "We offer diverse packaging: consumer bottles (1L, 2L, 5L), industrial packaging (18L, 200L drums), and flexitanks for bulk shipping. We can also provide private label packaging with your brand." },
                { question_ar: "كم يستغرق تنفيذ الطلب والتسليم؟", question_en: "How long does order fulfillment and delivery take?", answer_ar: "للطلبات المحلية: من 3 إلى 7 أيام عمل. لطلبات التصدير: من 14 إلى 21 يوم عمل حسب الوجهة. نلتزم دائماً بمواعيد التسليم المتفق عليها.", answer_en: "For local orders: 3-7 business days. For export orders: 14-21 business days depending on destination. We always commit to agreed delivery schedules." },
            ],
        },

        // ── Section 15: CTA Partnership ──
        ctaPartnership: {
            title_ar: "هل تبحث عن شريك صناعي موثوق؟",
            title_en: "Looking for a Reliable Industrial Partner?",
            subtitle_ar: "سواء كنت مصنعاً للأغذية، سلسلة مطاعم، أو موزعاً عالمياً — مصنع السلام يوفر لك حلولاً مخصصة بأعلى معايير الجودة وأسعار تنافسية.",
            subtitle_en: "Whether you're a food manufacturer, restaurant chain, or global distributor — Elsalam Factory provides customized solutions with the highest quality standards and competitive prices.",
            ctaPrimary_ar: "طلب عرض سعر",
            ctaPrimary_en: "Request a Quote",
            ctaSecondary_ar: "تواصل مع فريق المبيعات",
            ctaSecondary_en: "Contact Sales Team",
        },

        // ── Section 16: Client Logos ──
        clientLogos: {
            badge_ar: "شركاء النجاح",
            badge_en: "Success Partners",
            titleBefore_ar: "يثق بنا أكثر من",
            titleBefore_en: "Trusted by over",
            titleCount: "200+",
            titleAfter_ar: "شريك صناعي",
            titleAfter_en: "industrial partners",
            names: [
                { name_ar: "مجموعة الصفا الغذائية", name_en: "Al-Safa Food Group" },
                { name_ar: "شركة توزيع النيل", name_en: "Nile Distribution Co." },
                { name_ar: "سلسلة فنادق القاهرة", name_en: "Cairo Hotel Chain" },
                { name_ar: "أورينت للصناعات الغذائية", name_en: "Orient Food Industries" },
                { name_ar: "وكالات البحر الأحمر", name_en: "Red Sea Agencies" },
                { name_ar: "مجموعة الخليج للتصدير", name_en: "Gulf Export Group" },
                { name_ar: "شركة الدلتا الصناعية", name_en: "Delta Industrial Co." },
                { name_ar: "كينج فودز الدولية", name_en: "King Foods Int'l" },
            ],
        },

        // ── Section 17: Footer ──
        footer: {
            description_ar: "الريادة في عصر الزيوت النباتية وإنتاج الزيوت، السمن والشورتنج منذ عام 2000. موثوق من أكثر من 200 شريك صناعي حول العالم.",
            description_en: "Leading in vegetable oil pressing and production of oils, margarine & shortening since 2000. Trusted by over 200 industrial partners worldwide.",
            address_ar: "المنطقة الصناعية، المنوفية، مصر",
            address_en: "Industrial Zone, Menoufia, Egypt",
            phone: "+20 1xx xxx xxxx",
            email: "info@elsalamoils.com",
        },
    };
}
