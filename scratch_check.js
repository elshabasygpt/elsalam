const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const page = await prisma.pageContent.findUnique({ where: { pageSlug: 'about' } });
    console.log(JSON.stringify(JSON.parse(page.content).ceo.careerStations, null, 2));
    await prisma.$disconnect();
}
main();
