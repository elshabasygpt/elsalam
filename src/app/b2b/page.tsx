import { Metadata } from 'next';
import { B2BClient } from './b2b-client';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'شراكات B2B والمصانع | مصنع السلام للزيوت النباتية',
    description: 'نوفر حلولاً متكاملة وتوريدات الجملة لشركائنا من المصانع وشركات الأغذية.',
};

export const dynamic = 'force-dynamic';

export default async function B2BPage() {
    let cmsContent: Record<string, any> = {};
    
    try {
        const [b2bContent, homeContent] = await Promise.all([
            prisma.pageContent.findUnique({ where: { pageSlug: "b2b" } }),
            prisma.pageContent.findUnique({ where: { pageSlug: "home" } })
        ]);
        
        if (b2bContent?.content) {
            cmsContent = JSON.parse(b2bContent.content);
        }

        if (homeContent?.content) {
            const parsedHome = JSON.parse(homeContent.content);
            if (parsedHome.clientLogos) {
                cmsContent.clientLogos = parsedHome.clientLogos;
            }
        }
    } catch (e) {
        console.error("Failed to load b2b page content:", e);
    }

    return <B2BClient cmsContent={cmsContent} />;
}
