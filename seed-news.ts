import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newsItems = [
    {
        slug: 'iso-22000-certification',
        title_ar: 'حصول مصنع السلام على شهادة أيزو 22000 في سلامة الغذاء',
        title_en: 'Elsalam Factory achieves ISO 22000 certification in food safety',
        excerpt_ar: 'إنجاز جديد يضاف لسجل مصنع السلام بالحصول على أرفع الشهادات الدولية في إدارة سلامة الغذاء، مما يؤكد التزامنا المطلق بالجودة.',
        excerpt_en: 'A new achievement added to Elsalam Factory’s record by obtaining the highest international certifications in food safety management.',
        content_ar: '<p>في إطار سعينا المستمر نحو التميز وتقديم منتجات ترقى لأعلى المعايير العالمية، نفخر بالإعلان عن حصول مصنع السلام للزيوت النباتية على شهادة <strong>الأيزو 22000</strong> لإدارة سلامة الغذاء.</p><p>هذه الشهادة ليست مجرد ورقة، بل هي تكليل لجهود فريق العمل في تطبيق أقصى معايير الرقابة الصارمة في كل مراحل الإنتاج بدءاً من اختيار البذور وحتى تعبئة المنتج النهائي.</p>',
        content_en: '<p>As part of our continuous pursuit of excellence, we are proud to announce that Elsalam Vegetable Oils Factory has obtained the <strong>ISO 22000</strong> certification for food safety management.</p><p>This certification is a culmination of our team’s efforts in applying the strictest control standards at every stage of production.</p>',
        category: 'quality',
        featured_image: 'https://images.unsplash.com/photo-1518349619113-03114f06ac3a?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: true,
        published_at: new Date('2026-05-01T10:00:00Z'),
    },
    {
        slug: 'global-expansion-europe-africa',
        title_ar: 'توسع عالمي: مصنع السلام يفتتح أسواقاً جديدة في أوروبا وإفريقيا',
        title_en: 'Global Expansion: Elsalam opens new markets in Europe and Africa',
        excerpt_ar: 'استكمالاً لرؤية 2030، نجحنا في توقيع عقود تصديرية ضخمة للوصول بمنتجاتنا إلى 5 دول أوروبية وإفريقية جديدة.',
        excerpt_en: 'In line with our 2030 vision, we have successfully signed massive export contracts to reach 5 new European and African countries.',
        content_ar: '<p>استكمالاً لرؤيتنا الاستراتيجية في التوسع العالمي، يسرنا الإعلان عن نجاح مصنع السلام في اختراق أسواق جديدة في كل من قارتي أوروبا وإفريقيا.</p><p>يعكس هذا التوسع ثقة المستهلكين والمستوردين في جودة الزيوت المصرية ومطابقتها للمواصفات الدولية المعتمدة.</p>',
        content_en: '<p>In continuation of our strategic vision for global expansion, we are pleased to announce Elsalam’s success in penetrating new markets in Europe and Africa.</p><p>This expansion reflects the confidence of importers in the quality of Egyptian oils.</p>',
        category: 'export',
        featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: false,
        published_at: new Date('2026-04-28T09:30:00Z'),
    },
    {
        slug: 'green-industry-initiative',
        title_ar: 'مبادرة "صناعة خضراء": كيف يساهم مصنع السلام في تقليل الانبعاثات الكربونية؟',
        title_en: '"Green Industry" initiative: How Elsalam reduces carbon emissions',
        excerpt_ar: 'تعرف على التحديثات التقنية الجديدة في خطوط الإنتاج والتي خفضت استهلاك الطاقة بنسبة 30٪ كجزء من مسؤوليتنا البيئية.',
        excerpt_en: 'Learn about the new technical updates in production lines that reduced energy consumption by 30% as part of our environmental responsibility.',
        content_ar: '<p>إيماناً منا بدور الصناعة في الحفاظ على كوكب الأرض، أطلق مصنع السلام مبادرة <strong>صناعة خضراء</strong>.</p><p>حيث قمنا بتحديث منظومة الغلايات ومحطات توليد البخار بأحدث التقنيات الموفرة للطاقة، ما أثمر عن خفض الانبعاثات الكربونية بشكل ملحوظ.</p>',
        content_en: '<p>Believing in the role of industry in protecting the planet, Elsalam has launched the <strong>Green Industry</strong> initiative.</p><p>We have updated our boiler systems with the latest energy-saving technologies, significantly reducing our carbon footprint.</p>',
        category: 'sustainability',
        featured_image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: true,
        published_at: new Date('2026-04-25T11:00:00Z'),
    },
    {
        slug: 'new-production-line',
        title_ar: 'افتتاح خط إنتاج جديد لتعبئة زيوت الطعام بطاقة مضاعفة',
        title_en: 'Opening a new cooking oil bottling line with double capacity',
        excerpt_ar: 'لضمان تلبية الطلب المتزايد محلياً وعالمياً، دشن مصنع السلام خط إنتاج آلي بالكامل يعمل وفق أحدث التكنولوجيا الألمانية.',
        excerpt_en: 'To meet growing local and global demand, Elsalam inaugurated a fully automated production line using the latest German technology.',
        content_ar: '<p>في حفل كبير حضره رواد الصناعة، تم الإعلان رسمياً عن بدء تشغيل خط التعبئة الآلي الجديد والذي يعمل بطاقة إنتاجية مضاعفة.</p><p>هذا الخط يضمن تدخلاً بشرياً منعدماً (Zero Human Contact) مما يحقق أقصى درجات النظافة والتعقيم لكل عبوة.</p>',
        content_en: '<p>In a grand ceremony attended by industry leaders, we officially announced the start of our new automated bottling line with double the production capacity.</p><p>This line ensures zero human contact, achieving maximum hygiene and sterilization.</p>',
        category: 'production',
        featured_image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: false,
        published_at: new Date('2026-04-20T14:15:00Z'),
    },
    {
        slug: 'gulfood-dubai-2026',
        title_ar: 'مشاركة بارزة لمصنع السلام في معرض جلفود دبي 2026',
        title_en: 'Prominent participation of Elsalam Factory in Gulfood Dubai 2026',
        excerpt_ar: 'تألق جناحنا في معرض جلفود دبي عبر عرض مجموعة متنوعة من الزيوت والسمن، ولقاءات مثمرة مع مستثمرين من جميع أنحاء العالم.',
        excerpt_en: 'Our pavilion shined at Gulfood Dubai by displaying a variety of oils and ghee, with fruitful meetings with investors worldwide.',
        content_ar: '<p>اختتم مصنع السلام مشاركته الناجحة في معرض <strong>جلفود دبي 2026</strong>، المعرض الأضخم في قطاع الأغذية والمشروبات.</p><p>وقد استقبل جناحنا مئات الزوار يومياً، وعُقدت صفقات مبدئية مع مستوردين من دول الخليج وشرق آسيا.</p>',
        content_en: '<p>Elsalam Factory concluded its successful participation in <strong>Gulfood Dubai 2026</strong>, the largest F&B exhibition.</p><p>Our pavilion welcomed hundreds of visitors daily, securing initial deals with importers from the Gulf and East Asia.</p>',
        category: 'events',
        featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: true,
        published_at: new Date('2026-04-15T12:00:00Z'),
    },
    {
        slug: 'launch-trans-fat-free-ghee',
        title_ar: 'إطلاق منتج "سمن السلام" الجديد بتقنية خالية من الدهون المتحولة',
        title_en: 'Launch of the new "Elsalam Ghee" with trans-fat-free technology',
        excerpt_ar: 'استجابة لمتطلبات الصحة الحديثة، نفخر بتقديم الجيل الجديد من السمن النباتي الصحي والخالي تماماً من الدهون المتحولة.',
        excerpt_en: 'In response to modern health demands, we are proud to introduce the new generation of healthy, trans-fat-free vegetable ghee.',
        content_ar: '<p>حرصاً على صحة عملائنا، قام قسم البحث والتطوير (R&D) لدينا بابتكار تركيبة فريدة لمنتج <strong>سمن السلام</strong> ليكون خالي تماماً من الدهون المتحولة (Trans-fat Free).</p><p>المنتج الجديد يوفر نفس الطعم الرائع والقوام الممتاز للطبخ والحلويات ولكن بفوائد صحية أكبر.</p>',
        content_en: '<p>Caring for our customers’ health, our R&D department has innovated a unique formula for <strong>Elsalam Ghee</strong> to be completely Trans-fat Free.</p><p>The new product offers the same great taste and texture for cooking and baking but with greater health benefits.</p>',
        category: 'news',
        featured_image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: false,
        published_at: new Date('2026-04-10T08:45:00Z'),
    },
    {
        slug: 'strategic-partnership-b2b',
        title_ar: 'شراكة استراتيجية مع كبرى مصانع الأغذية لتوريد شورتنج المخابز',
        title_en: 'Strategic partnership with major food factories to supply bakery shortening',
        excerpt_ar: 'تتويجاً لجهود قطاع المبيعات البينية (B2B)، تم توقيع عقد شراكة طويلة الأمد مع مجموعة من كبرى مصانع الحلويات والمخبوزات.',
        excerpt_en: 'Crowning the efforts of our B2B sector, a long-term partnership contract was signed with a group of major confectionery and bakery factories.',
        content_ar: '<p>أعلن قطاع المبيعات في مصنع السلام عن توقيع عقود توريد ضخمة لمنتجات <strong>الشورتنج المتخصص</strong> المستخدم في صناعة المخبوزات والحلويات.</p><p>تأتي هذه الخطوة لتؤكد أن السلام هو الشريك المفضل للكيانات الصناعية الكبرى التي تبحث عن الجودة المستدامة والاعتمادية.</p>',
        content_en: '<p>The sales sector at Elsalam announced the signing of massive supply contracts for <strong>Specialized Shortening</strong> used in the bakery and confectionery industry.</p><p>This step confirms that Elsalam is the preferred partner for large industrial entities seeking sustainable quality and reliability.</p>',
        category: 'news',
        featured_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: true,
        published_at: new Date('2026-04-05T15:30:00Z'),
    },
    {
        slug: 'elsalam-for-good-ramadan',
        title_ar: 'حملة "السلام للخير" لدعم المجتمع المحلي في شهر رمضان',
        title_en: '"Elsalam for Good" campaign to support the local community during Ramadan',
        excerpt_ar: 'توزيع الآلاف من كراتين المواد الغذائية التي تتضمن منتجاتنا على الأسر الأكثر احتياجاً كجزء من دورنا المجتمعي.',
        excerpt_en: 'Distributing thousands of food boxes featuring our products to families in need as part of our corporate social responsibility.',
        content_ar: '<p>استمراراً لنهج العطاء، أطلقت إدارة المصنع حملة <strong>السلام للخير</strong> بمناسبة شهر رمضان المبارك.</p><p>حيث شارك موظفونا في تعبئة وتوزيع آلاف الكراتين التموينية، مؤكدين أن نجاحنا الحقيقي يكمن في إحداث تأثير إيجابي في مجتمعنا المحيط.</p>',
        content_en: '<p>Continuing our tradition of giving, the factory administration launched the <strong>Elsalam for Good</strong> campaign on the occasion of the holy month of Ramadan.</p><p>Our employees participated in packing and distributing thousands of food boxes, proving our commitment to positive social impact.</p>',
        category: 'events',
        featured_image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: false,
        published_at: new Date('2026-03-25T13:20:00Z'),
    },
    {
        slug: 'technology-in-labs',
        title_ar: 'التكنولوجيا في خدمة الجودة: أحدث أجهزة الفحص في معامل السلام',
        title_en: 'Technology at the service of quality: Latest inspection devices in Elsalam labs',
        excerpt_ar: 'استثمارات بملايين الجنيهات لتجهيز معامل المصنع بأحدث أجهزة الكروماتوجرافيا لضمان نقاء الزيوت وخلوها من الشوائب.',
        excerpt_en: 'Multi-million investments to equip the factory’s labs with the latest chromatography devices to ensure oil purity.',
        content_ar: '<p>لضمان بقائنا في صدارة المنافسة، قمنا مؤخراً بتحديث شامل لمعامل الجودة المركزية داخل المصنع.</p><p>تم تزويد المعامل بأجهزة كروماتوجرافيا الغاز والسائل المتطورة جداً، والتي تستطيع تحليل مكونات الزيت بدقة متناهية والتأكد من مطابقتها القياسية.</p>',
        content_en: '<p>To ensure we remain at the forefront of competition, we recently undertook a comprehensive upgrade of our central quality labs.</p><p>The labs were equipped with highly advanced gas and liquid chromatography devices, analyzing oil components with extreme precision.</p>',
        category: 'quality',
        featured_image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: false,
        published_at: new Date('2026-03-15T09:00:00Z'),
    },
    {
        slug: 'industrial-excellence-award',
        title_ar: 'فوز مصنع السلام بجائزة التميز الصناعي للعام الثاني على التوالي',
        title_en: 'Elsalam Factory wins the Industrial Excellence Award for the second consecutive year',
        excerpt_ar: 'تكريم جديد يضاف لمسيرتنا من غرفة الصناعات الغذائية تقديراً لجهودنا في تطوير قطاع الزيوت النباتية في مصر.',
        excerpt_en: 'A new honor added to our journey by the Chamber of Food Industries in recognition of our efforts to develop the vegetable oils sector in Egypt.',
        content_ar: '<p>في حفل بهيج، تسلمت إدارة مصنع السلام <strong>جائزة التميز الصناعي</strong> لعام 2025/2026.</p><p>يعد هذا الفوز للعام الثاني على التوالي دليلاً قاطعاً على التزامنا برؤية مستدامة، وجودة لا تتزعزع، ومساهمة فعالة في الاقتصاد الوطني.</p>',
        content_en: '<p>In a joyful ceremony, Elsalam’s administration received the <strong>Industrial Excellence Award</strong> for the year 2025/2026.</p><p>Winning this for the second consecutive year is conclusive evidence of our sustainable vision, unwavering quality, and effective contribution to the national economy.</p>',
        category: 'news',
        featured_image: 'https://images.unsplash.com/photo-1561489422-45e3d9ecaeca?q=80&w=1200&auto=format&fit=crop',
        is_published: true,
        is_featured: true,
        published_at: new Date('2026-03-01T20:00:00Z'),
    }
];

async function main() {
    console.log('Seeding News data...');
    
    // Check if any news already exists to avoid duplication errors on unique slug
    for (const item of newsItems) {
        const existing = await prisma.news.findUnique({ where: { slug: item.slug } });
        if (!existing) {
            await prisma.news.create({ data: item });
            console.log(`Created: ${item.slug}`);
        } else {
            console.log(`Skipped (already exists): ${item.slug}`);
        }
    }
    
    console.log('News seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
