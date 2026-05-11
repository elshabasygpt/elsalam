import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const remotePrisma = new PrismaClient({
    datasources: { db: { url: "postgresql://neondb_owner:npg_wxM8VQo6NfKS@ep-bold-darkness-aqvwj50a.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require" } }
});

async function check() {
    try {
        const home = await remotePrisma.pageContent.findUnique({ where: { pageSlug: 'home' } });
        if (home?.content) {
            fs.writeFileSync('remote-home-content.json', JSON.stringify(JSON.parse(home.content), null, 2));
            console.log("Wrote to remote-home-content.json");
        }
    } finally {
        await remotePrisma.$disconnect();
    }
}
check();
