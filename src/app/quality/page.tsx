import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { QualityClient } from './quality-client';

export const metadata: Metadata = {
    title: 'نظام الجودة | مصنع السلام للزيوت النباتية',
    description: 'تعرف على معايير الجودة العالمية التي نطبقها في كل قطرة من منتجاتنا في مصنع السلام.',
};

export const revalidate = 60;

export default async function QualityPage() {
    let cmsContent: Record<string, any> = {};
    try {
        const [qualityContent, homeContent] = await Promise.all([
            prisma.pageContent.findUnique({ where: { pageSlug: "quality" } }),
            prisma.pageContent.findUnique({ where: { pageSlug: "home" } })
        ]);
        
        let parsedHome = {};
        if (homeContent?.content) {
            parsedHome = JSON.parse(homeContent.content);
        }

        if (qualityContent?.content) {
            cmsContent = { ...parsedHome, ...JSON.parse(qualityContent.content) };
        } else {
            cmsContent = parsedHome;
        }
    } catch (e) {
        console.error("Failed to load quality page content:", e);
    }

    return <QualityClient cmsContent={cmsContent} />;
}
