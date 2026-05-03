import { Metadata } from 'next';
import { ProductionClient } from './production-client';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'قدراتنا الإنتاجية | مصنع السلام للزيوت النباتية',
    description: 'خطوط إنتاج متطورة وتقنيات تصنيع حديثة لتلبية احتياجات السوق المحلي والعالمي.',
};

export const dynamic = 'force-dynamic';

export default async function ProductionPage() {
    let cmsContent: Record<string, any> = {};
    
    try {
        const pageContent = await prisma.pageContent.findUnique({
            where: { pageSlug: "production" },
        });
        
        if (pageContent?.content) {
            cmsContent = JSON.parse(pageContent.content);
        }
    } catch (e) {
        console.error("Failed to load production page content:", e);
    }

    return <ProductionClient cmsContent={cmsContent} />;
}
