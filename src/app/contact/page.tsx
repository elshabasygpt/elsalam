import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
    title: 'تواصل معنا | مصنع السلام للزيوت النباتية',
    description: 'تواصل مع مصنع السلام للزيوت النباتية للاستفسارات، المبيعات البينية، وعروض التصدير.',
};

export const revalidate = 60; // optionally revalidate every 60 seconds

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    // Fetch site settings server-side to pass verified whatsapp / map urls
    const settings = await prisma.siteSettings.findFirst();

    let cmsContent: Record<string, any> = {};
    
    try {
        const contactContent = await prisma.pageContent.findUnique({ where: { pageSlug: "contact" } });
        if (contactContent?.content) {
            cmsContent = JSON.parse(contactContent.content);
        }
    } catch (e) {
        console.error("Failed to load contact page content:", e);
    }

    return <ContactClient settings={settings} cmsContent={cmsContent} />;
}
