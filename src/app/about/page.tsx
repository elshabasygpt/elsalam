import { prisma } from "@/lib/prisma";
import { AboutPageClient } from "./about-page-client";

export const metadata = {
    title: "من نحن | مصنع السلام للزيوت النباتية",
    description: "أكثر من 25 عاماً من الريادة في صناعة الزيوت النباتية والسمن والشورتنج. تعرف على مسيرتنا وفريقنا وقيادتنا.",
};

export const dynamic = 'force-dynamic'; // Prevent aggressive caching in dev

export default async function AboutPage() {
    let cmsContent: Record<string, any> = {};
    
    try {
        const pageContent = await prisma.pageContent.findUnique({
            where: { pageSlug: "about" },
        });
        
        if (pageContent?.content) {
            cmsContent = JSON.parse(pageContent.content);
        }
    } catch (e) {
        console.error("Failed to load about page content:", e);
    }

    return <AboutPageClient cmsContent={cmsContent} />;
}
