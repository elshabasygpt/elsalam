import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    if (articles.length === 0) {
        console.log("No articles found in the database. I will create some sample articles.");
        
        await prisma.news.create({
            data: {
                slug: "new-factory-expansion",
                title_ar: "افتتاح خط الإنتاج الجديد في مصنع السلام",
                title_en: "Inauguration of the New Production Line at Elsalam Factory",
                excerpt_ar: "بناءً على التوسعات الاستراتيجية، أعلنت إدارة المصنع عن زيادة القدرة الإنتاجية لتلبية احتياجات السوق.",
                category: "news",
                featured_image: "/uploads/modern_oil_factory.png",
                is_published: true,
                published_at: new Date()
            }
        });
        await prisma.news.create({
            data: {
                slug: "premium-raw-materials-quality",
                title_ar: "الالتزام بأعلى معايير الجودة في اختيار الخامات",
                title_en: "Commitment to the Highest Quality Standards in Raw Materials",
                excerpt_ar: "نحن في مصنع السلام نضمن استخدام أفضل بذور دوار الشمس والصويا للحصول على زيوت نقية 100%.",
                category: "quality",
                featured_image: "/uploads/premium_oil_raw_materials.png",
                is_published: true,
                published_at: new Date()
            }
        });
        await prisma.news.create({
            data: {
                slug: "global-export-logistics-2026",
                title_ar: "فتح أسواق جديدة وتطوير قطاع التصدير الدولي",
                title_en: "Opening New Markets and Developing the Global Export Sector",
                excerpt_ar: "نجح المصنع في إبرام صفقات جديدة لتصدير الزيوت النباتية إلى دول إفريقيا وأوروبا الشرقية.",
                category: "export",
                featured_image: "/uploads/global_logistics_export.png",
                is_published: true,
                published_at: new Date()
            }
        });
        console.log("Created 3 sample articles with the images.");
    } else {
        const images = [
            "/uploads/modern_oil_factory.png",
            "/uploads/premium_oil_raw_materials.png",
            "/uploads/global_logistics_export.png"
        ];
        
        for (let i = 0; i < articles.length && i < images.length; i++) {
            await prisma.news.update({
                where: { id: articles[i].id },
                data: { featured_image: images[i] }
            });
            console.log(`Updated article ${articles[i].id} with image ${images[i]}`);
        }
    }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  });
