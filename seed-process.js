const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PROCESS_STEPS = [
    {
        image: "/images/placeholder.svg",
        title_en: "Careful Seed Selection",
        title_ar: "اختيار أفضل البذور",
        description_en: "We source only the highest quality, non-GMO seeds from trusted global partners to ensure the foundation of our oils is flawless.",
        description_ar: "نعتمد على أجود أنواع البذور غير المعدلة وراثياً من موردين عالميين موثوقين، لنضمن أن أساس زيوتنا مثالي.",
    },
    {
        image: "/images/placeholder.svg",
        title_en: "Advanced Double Refining",
        title_ar: "تكرير متميز ومزدوج",
        description_en: "Utilizing state-of-the-art European machinery, our oil undergoes multiple stages of refining, neutralizing, and deodorizing for ultimate purity.",
        description_ar: "باستخدام أحدث الآلات الأوروبية، يمر زيتها بمراحل دقيقة من التكرير والتعادل وإزالة الرائحة لضمان النقاء المطلق.",
    },
    {
        image: "/images/placeholder.svg",
        title_en: "Rigorous Labs & QC",
        title_ar: "فحوصات الجودة الصارمة",
        description_en: "Every batch is meticulously analyzed in our on-site laboratories against strict international ISO & HACCP standards.",
        description_ar: "تُحلل كل دفعة إنتاجية بدقة متناهية في مختبراتنا المجهزة، وفقاً لأعلى معايير الأيزو ونظام الهاسب (HACCP).",
    },
    {
        image: "/images/placeholder.svg",
        title_en: "Touchless Packaging",
        title_ar: "تعبئة آلية معقمة",
        description_en: "100% automated, touchless packaging lines ensure maximum hygiene and dramatically extend the product shelf-life without preservatives.",
        description_ar: "خطوط تعبئة آلية 100% بدون أي تدخل بشري، مما يضمن أقصى درجات التعقيم ويطيل فترة الصلاحية بشكل طبيعي.",
    }
];

async function seed() {
    try {
        const payload = {
            badge_ar: "آلية الإنتاج والجودة",
            badge_en: "Our Process",
            title_ar: "من البذرة إلى المائدة.. رحلة الجودة",
            title_en: "From Seed to Shelf",
            subtitle_ar: "نميز أنفسنا بتشغيل أحد أكثر المنشآت تطوراً وأتمتة في المنطقة، لنضمن أن كل قطرة مطابقة للمعايير العالمية.",
            subtitle_en: "We operate one of the most technologically advanced automated facilities in the region, ensuring every drop meets global benchmarks.",
            steps: PROCESS_STEPS
        };

        const existing = await prisma.pageContent.findUnique({
            where: {
                pageSlug: "home"
            }
        });

        let contentObj = {};
        if (existing && existing.content) {
            try {
                contentObj = JSON.parse(existing.content);
            } catch (e) {
                console.error("Failed to parse existing JSON");
            }
        }

        // Merge ourProcess
        contentObj.ourProcess = payload;

        await prisma.pageContent.upsert({
            where: { pageSlug: "home" },
            update: { content: JSON.stringify(contentObj) },
            create: { pageSlug: "home", content: JSON.stringify(contentObj) }
        });
        
        console.log("Successfully seeded ourProcess");
    } catch (error) {
        console.error("Error seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
