const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const r = await prisma.pageContent.findUnique({where: {pageSlug: 'contact'}});
  if(r) {
    const j = JSON.parse(r.content);
    console.log("Keys:", Object.keys(j));
    console.log("Branches:", JSON.stringify(j.branches, null, 2));
  } else {
    console.log('not found');
  }
}
main().finally(() => prisma.$disconnect());
