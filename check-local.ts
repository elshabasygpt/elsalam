import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const localPrisma = new PrismaClient({
    datasources: { db: { url: "postgresql://postgres@localhost:5432/elsalam_db" } }
});

async function check() {
    try {
        const home = await localPrisma.pageContent.findUnique({ where: { pageSlug: 'home' } });
        if (home?.content) {
            fs.writeFileSync('local-home-content.json', JSON.stringify(JSON.parse(home.content), null, 2));
            console.log("Wrote to local-home-content.json");
        }
    } finally {
        await localPrisma.$disconnect();
    }
}
check();
