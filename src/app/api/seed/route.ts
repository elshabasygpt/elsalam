import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
    try {
        const password = await hash('admin123', 10);
        const user = await prisma.user.upsert({
            where: { email: 'admin@elsalam.com' },
            update: {},
            create: {
                email: 'admin@elsalam.com',
                name: 'Admin User',
                password,
                role: 'ADMIN',
            },
        });

        // Also seed initial site settings
        const settingsCount = await prisma.siteSettings.count();
        let settingsMsg = 'Settings already seeded.';
        if (settingsCount === 0) {
            await prisma.siteSettings.create({
                data: {
                    siteNameAr: 'مصنع السلام للزيوت النباتية',
                    siteNameEn: 'Elsalam Vegetable Oils Factory',
                    contactEmail: 'info@elsalamoils.com',
                    contactPhone: '+20 123 456 7890',
                }
            });
            settingsMsg = 'Seeded settings.';
        }

        return NextResponse.json({ success: true, user: user.email, settingsMsg });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
