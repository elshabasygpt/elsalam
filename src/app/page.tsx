import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./home-page-client";

export const metadata = {
    title: "مصنع السلام للزيوت النباتية | الرئيسية",
    description: "مصنع السلام — الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج. أكثر من 25 عاماً من الخبرة، شهادات ISO و HACCP، تصدير لأكثر من 15 دولة.",
    openGraph: {
        title: "مصنع السلام للزيوت النباتية",
        description: "الريادة في عصر وإنتاج الزيوت النباتية، السمن، والشورتنج للسوق المحلي والتصدير.",
        type: "website",
        locale: "ar_EG",
    },
};

// force-dynamic means: never cache this page — always fetch fresh from DB
export const dynamic = "force-dynamic";

export default async function HomePage() {
    // Fetch CMS content from database (saved via admin panel)
    let cmsContent: Record<string, any> = {};
    try {
        const pageContent = await prisma.pageContent.findUnique({
            where: { pageSlug: "home" },
        });
        if (pageContent?.content) {
            cmsContent = JSON.parse(pageContent.content);
        }
    } catch (e) {
        // If DB fails, fall back to empty (i18n-only)
        console.error("Failed to load home page content:", e);
    }

    return <HomePageClient cmsContent={cmsContent} />;
}
