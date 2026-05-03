import { Metadata } from 'next';
import { ExportClient } from './export-client';

import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'تصدير حول العالم | مصنع السلام للزيوت النباتية',
    description: 'نفخر بتصدير منتجاتنا لأكثر من ١٥ دولة حول العالم بأعلى معايير الشحن والمطابقة.',
};

export const dynamic = 'force-dynamic';

export default async function ExportPage() {
    let cmsContent: Record<string, any> = {};
    
    try {
        const pageContent = await prisma.pageContent.findUnique({
            where: { pageSlug: "export" },
        });
        
        if (pageContent?.content) {
            cmsContent = JSON.parse(pageContent.content);
        }
    } catch (e) {
        console.error("Failed to load export page content:", e);
    }

    return <ExportClient cmsContent={cmsContent} />;
}
