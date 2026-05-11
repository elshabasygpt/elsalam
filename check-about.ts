import { PrismaClient } from '@prisma/client';

const localPrisma = new PrismaClient({
    datasources: { db: { url: "postgresql://postgres@localhost:5432/elsalam_db" } }
});

async function check() {
    try {
        const about = await localPrisma.pageContent.findUnique({ where: { pageSlug: 'about' } });
        if (about?.content) {
            const parsed = JSON.parse(about.content);
            console.log("CEO Image URL:", parsed.ceo?.image);
        }
    } finally {
        await localPrisma.$disconnect();
    }
}
check();
