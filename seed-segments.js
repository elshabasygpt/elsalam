const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FALLBACK_SEGMENTS = [
    { title_en: "Food Manufacturers", title_ar: "مصانع الأغذية", desc_en: "Custom bulk solutions", desc_ar: "حلول بالجملة بمواصفات مخصصة", cta_en: "Request Quote", cta_ar: "طلب عرض سعر", link: "/b2b/quote", image: "/images/placeholder.svg" },
    { title_en: "Hotels & Restaurants", title_ar: "فنادق ومطاعم", desc_en: "HoReCa premium lines", desc_ar: "منتجات HoReCa بمواصفات عالمية", cta_en: "Contact Us", cta_ar: "تواصل معنا", link: "/contact", image: "/images/placeholder.svg" },
    { title_en: "Global Export", title_ar: "التصدير العالمي", desc_en: "Ready-to-export products", desc_ar: "منتجات جاهزة للتصدير", cta_en: "Export Inquiry", cta_ar: "استفسار تصدير", link: "/export", image: "/images/placeholder.svg" },
    { title_en: "Retail & Distribution", title_ar: "التجزئة والتوزيع", desc_en: "Direct to POS", desc_ar: "توصيل لنقاط البيع", cta_en: "Shop Now", cta_ar: "تسوق الآن", link: "/products", image: "/images/placeholder.svg" },
];

async function seed() {
    try {
        const payload = {
            title_ar: "كيف يمكننا خدمتك؟",
            title_en: "How can we serve you?",
            subtitle_ar: "نقدم حلولاً مخصصة لكل قطاع",
            subtitle_en: "Tailored solutions for every sector",
            items: FALLBACK_SEGMENTS
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

        // Merge segments
        contentObj.segments = payload;

        await prisma.pageContent.upsert({
            where: { pageSlug: "home" },
            update: { content: JSON.stringify(contentObj) },
            create: { pageSlug: "home", content: JSON.stringify(contentObj) }
        });
        
        console.log("Successfully seeded segments");
    } catch (error) {
        console.error("Error seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
