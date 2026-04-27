const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const data = await prisma.$queryRawUnsafe('SELECT * FROM "SiteSettings" LIMIT 1');
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  await prisma.$disconnect();
}

run();
