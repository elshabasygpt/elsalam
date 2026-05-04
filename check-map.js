const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteSettings.findFirst().then(s => console.log(s.mapUrl)).finally(() => prisma.$disconnect());
