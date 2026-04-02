/**
 * Default CMS content for the About page.
 * Maps existing i18n translations (ar + en) into the CMS bilingual structure.
 */

export function getAboutPageDefaultContent(): Record<string, any> {
    return {
        // ── Hero ──
        hero: {
            title_ar: "عن مصنع السلام",
            title_en: "About Elsalam Factory",
            subtitle_ar: "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج",
            subtitle_en: "Over 25 years of leadership in the vegetable oils, margarine & shortening industry",
            badge_ar: "من نحن",
            badge_en: "About Us",
        },

        // ── Story ──
        story: {
            title_ar: "قصتنا",
            title_en: "Our Story",
            paragraph1_ar: "تأسس مصنع السلام لعصر واستخلاص الزيوت النباتية عام 2000 في المنطقة الصناعية بمصر. بدأنا بخط إنتاج واحد ورؤية واضحة: تقديم زيوت نباتية بجودة عالمية وأسعار منافسة. واليوم، نفخر بامتلاك 8 خطوط إنتاج بطاقة 500 طن يومياً، ونصدّر إلى أكثر من 15 دولة.",
            paragraph1_en: "Elsalam Factory for Extracting and Refining Vegetable Oils was established in 2000 in the Industrial Zone, Egypt. We started with a single production line and a clear vision: to provide world-class vegetable oils at competitive prices. Today, we proudly operate 8 production lines with a daily capacity of 500 MT, exporting to over 15 countries.",
            paragraph2_ar: "نحن ملتزمون بالاستدامة والابتكار المستمر، مع استثمارات مستمرة في تطوير خطوط الإنتاج ومعامل الجودة لضمان مطابقة منتجاتنا لأعلى المواصفات القياسية المحلية والدولية.",
            paragraph2_en: "We are committed to sustainability and continuous innovation, consistently investing in our production lines and quality laboratories to ensure our products meet the highest local and international standards.",
        },

        // ── Timeline ──
        timeline: {
            items: [
                { year: "2000", title_ar: "التأسيس والانطلاق", title_en: "Foundation & Launch", description_ar: "بدأنا رحلتنا بخط إنتاج واحد للزيوت النباتية مع التركيز على تلبية احتياجات السوق المحلي بأعلى معايير الجودة.", description_en: "Began our journey with a single vegetable oil production line, focusing on meeting local market needs with the highest quality standards." },
                { year: "2008", title_ar: "توسعة خطوط التكرير", title_en: "Refinery Expansion", description_ar: "افتتاح خط التكرير المتطور لضمان النقاء التام والشفافية العالية لزيوتنا بمعايير أوروبية.", description_en: "Inaugurated a state-of-the-art refining line to ensure absolute purity and high transparency of our oils under European standards." },
                { year: "2015", title_ar: "دخول أسواق التصدير", title_en: "Entering Export Markets", description_ar: "حصولنا على شهادات الجودة العالمية وبلوغ طاقة إنتاجية سمحت لنا ببدء التصدير الناجح لدول أفريقيا والشرق الأوسط.", description_en: "Achieved international quality certifications and production capacity that enabled successful exports to Africa and the Middle East." },
                { year: "2020", title_ar: "إطلاق السمن والشورتنج", title_en: "Ghee & Shortening Launch", description_ar: "تنويع محفظة المنتجات لتشمل السمن النباتي الممتاز وشورتنج المخابز المتخصص لتلبية القطاع الصناعي.", description_en: "Diversified the product portfolio to include premium vegetable ghee and specialized bakery shortening to supply the industrial sector." },
                { year: "2025", title_ar: "الريادة والاستدامة", title_en: "Leadership & Sustainability", description_ar: "الوصول لطاقة 500 طن يومياً مع تصدير مستمر لـ 15 دولة وتطبيق سياسات إنتاج خضراء ومستدامة.", description_en: "Reached 500 MT daily capacity with continuous exports to 15+ countries, implementing green and sustainable production policies." },
            ],
        },

        // ── CEO Bio ──
        ceo: {
            name_ar: "محمد إسماعيل إدريس",
            name_en: "Mohamed Ismail Idris",
            role_ar: "رئيس مجلس إدارة مصنع السلام لعصر واستخلاص الزيوت النباتية",
            role_en: "Chairman of the Board, Elsalam Factory for Vegetable Oils and Refining",
            quote_ar: "نؤمن أن الجودة ليست خياراً بل هي التزام. رؤيتنا أن نكون الشريك الأول لكل مصنع ومطعم وموزع يبحث عن زيوت نباتية بمعايير عالمية مصنوعة في مصر.",
            quote_en: "We believe quality is an obligation, not an option. Our vision is to be the premier partner for every factory, restaurant, and distributor seeking world-class vegetable oils made in Egypt.",
            educationDesc_ar: "تخرج السيد محمد إسماعيل إدريس من جامعة الإسكندرية عام 1990، وبدأ مسيرته المهنية في مجال المبيعات، حيث أظهر منذ بداياته شغفًا واضحًا بمجال التسويق وبناء العلامات التجارية وتعزيز الحصة السوقية للشركات.",
            educationDesc_en: "Mr. Mohamed Ismail Idris graduated from Alexandria University in 1990 and began his professional career in sales, where he demonstrated a clear passion for marketing, brand building, and expanding market share from the very beginning.",
            careerStations: [
                { title_ar: "شركة كوكاكولا – الإسكندرية (1990–1992)", title_en: "Coca-Cola Company – Alexandria (1990–1992)", role_ar: "مشرف مبيعات", role_en: "Sales Supervisor", desc_ar: "توسيع الحصة السوقية، زيادة المبيعات، تطبيق تقنيات تسويق مبتكرة", desc_en: "Expanded market share, increased sales, implemented innovative marketing techniques" },
                { title_ar: "شركة العوجان – المملكة العربية السعودية (1993–1995)", title_en: "Aujan Industries – Saudi Arabia (1993–1995)", role_ar: "مشرف التموين", role_en: "Catering Supervisor", desc_ar: "أسّس قسم التموين بالشركة، وساهم في إدخال منتجات (راني، فيمتو، شوكولاتة كادبوري) إلى قطاعات الفنادق والمطاعم والمستشفيات والقطاع العسكري، والخطوط الجوية السعودية.", desc_en: "Founded the company's Catering Department, successfully introducing products (Rani, Vimto, Cadbury chocolate) to hotels, restaurants, hospitals, the military sector, and Saudi Arabian Airlines." },
                { title_ar: "شركة باعشن – السعودية (1995–1997)", title_en: "Baeshen Company – Saudi Arabia (1995–1997)", role_ar: "مدير المنطقة الشمالية", role_en: "Northern Region Manager", desc_ar: "قاد جهود تسويق علامة شاي ربيع، وأسهم في إطلاق وتوسيع انتشار المنتج في السوق السعودي.", desc_en: "Led the marketing efforts for Rabea Tea brand, contributing to the launch and extensive expansion of the product in the Saudi market." },
                { title_ar: "شركة نستله مصر (1998)", title_en: "Nestle Egypt (1998)", role_ar: "مدير المبيعات - الإسكندرية", role_en: "Sales Manager - Alexandria", desc_ar: "أشرف على توزيع المنتجات الجافة (نسكافيه، نيدو، سيريلاك، شوكولاتة نستله) وعزز انتشار العلامة محليًا.", desc_en: "Supervised the distribution of dry products (Nescafe, Nido, Cerelac, Nestle chocolate) and enhanced the brand's local presence." },
                { title_ar: "شركة صافولا سايم داربي (1999–2001)", title_en: "Savola Sime Darby (1999–2001)", role_ar: "مدير مبيعات القطاع الصناعي", role_en: "Industrial Sector Sales Manager", desc_ar: "ركز على توزيع زيت النخيل للصناعات الغذائية وقدم حلولًا صناعية مبتكرة من خلال إعادة تدوير مشتقات الزيت.", desc_en: "Focused on distributing palm oil to the food industry and introduced innovative industrial solutions by recycling oil derivatives." },
            ],
            entrepreneurshipDesc_ar: "في عام 2002، اتخذ السيد محمد إدريس خطوة جريئة بتأسيس شركة السلام كشركة متخصصة في تجارة وتكرير الزيوت النباتية وتوريد المواد الخام للمصانع الكبرى والمطاعم.",
            entrepreneurshipDesc_en: "In 2002, Mr. Mohamed Idris took a bold step by founding Elsalam Company as a specialized entity in trading and refining vegetable oils and supplying raw materials to major factories and restaurants.",
            expansionDesc_ar: "توسعت الشركة في توزيع زيت النخيل والشورتنج والمارجرين، وخدمة أكثر من 135 مصنعًا في مصر. وفي عام 2020، تم افتتاح مصنع حديث بدمنهور مزود بأحدث خطوط الإنتاج.",
            expansionDesc_en: "The company expanded into distributing palm oil, shortening, and margarine, serving over 135 factories in Egypt. In 2020, a modern factory was inaugurated in Damanhour, equipped with the latest production lines.",
            innovationPoints: [
                { text_ar: "إدخال الشورتنج في إنتاج الأجبان", text_en: "Introducing shortening in cheese production" },
                { text_ar: "تطوير حلول صناعية لصناعة الأغذية", text_en: "Developing industrial solutions for the food industry" },
                { text_ar: "استثمار مخلفات زيت النخيل في صناعة الصابون", text_en: "Investing palm oil derivatives in soap manufacturing" },
                { text_ar: "تطبيق نظام رقابة جودة صارم في كل مراحل الإنتاج", text_en: "Implementing strictly monitored quality control across all production stages" },
            ],
            visionDesc_ar: "يهدف إلى الريادة في صناعة الزيوت والدهون الطبيعية في مصر والشرق الأوسط، معتمداً على بناء شراكات استراتيجية طويلة الأمد، دعم الصناعات الصغيرة، والالتزام بالمسؤولية المجتمعية.",
            visionDesc_en: "His vision is to lead the vegetable oils and natural fats industry in Egypt and the Middle East, relying on building long-term strategic partnerships, supporting small industries, and committing to social responsibility.",
            leadershipPoints: [
                { text_ar: "خبرة تتجاوز 30 عامًا في قطاع الأغذية", text_en: "Over 30 years of experience in the food sector" },
                { text_ar: "خلفية قوية في المبيعات الصناعية", text_en: "Strong background in industrial sales" },
                { text_ar: "قدرة على بناء شراكات استراتيجية", text_en: "Ability to build strategic partnerships" },
                { text_ar: "توجه ابتكاري في تطوير المنتجات", text_en: "Innovative approach to product development" },
                { text_ar: "دعم حقيقي للصناعات الصغيرة والمتوسطة", text_en: "Genuine support for small and medium-sized industries" },
            ],
        },

        // ── Gallery ──
        gallery: {
            title_ar: "جولة في المصنع",
            title_en: "Factory Tour",
            subtitle_ar: "نظرة على خطوط الإنتاج ومرافق الجودة",
            subtitle_en: "A look at our production lines and quality facilities",
            items: [
                { title_ar: "خط إنتاج الزيوت الآلي", title_en: "Automated Oil Production Line", url: "" },
                { title_ar: "معامل رقابة الجودة", title_en: "Quality Control Labs", url: "" },
                { title_ar: "خزانات التخزين", title_en: "Storage Tanks", url: "" },
                { title_ar: "خط تعبئة العبوات", title_en: "Bottle Filling Line", url: "" },
                { title_ar: "مستودعات الشحن", title_en: "Shipping Warehouses", url: "" },
                { title_ar: "منطقة استقبال المواد الخام", title_en: "Raw Material Reception Area", url: "" },
                { title_ar: "غرفة التحكم المركزية", title_en: "Central Control Room", url: "" },
                { title_ar: "خط إنتاج السمن", title_en: "Ghee Production Line", url: "" },
            ],
        },
    };
}
