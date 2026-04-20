import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
    title: 'تواصل معنا | مصنع السلام للزيوت النباتية',
    description: 'تواصل مع مصنع السلام للزيوت النباتية للاستفسارات، المبيعات البينية، وعروض التصدير.',
};

export const revalidate = 60; // optionally revalidate every 60 seconds

export default async function ContactPage() {
    // Fetch site settings server-side to pass verified whatsapp / map urls
    const settings = await prisma.siteSettings.findFirst();

    return <ContactClient settings={settings} />;
}
