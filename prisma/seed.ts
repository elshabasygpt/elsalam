import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@elsalam.com' },
        update: {},
        create: {
            email: 'admin@elsalam.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })
    console.log({ user })

    // Also seed initial site settings
    const settings = await prisma.siteSettings.create({
        data: {
            siteNameAr: 'مصنع السلام للزيوت النباتية',
            siteNameEn: 'Elsalam Vegetable Oils Factory',
            contactEmail: 'info@elsalamoils.com',
            contactPhone: '+20 123 456 7890',
        }
    })
    console.log({ settings })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
