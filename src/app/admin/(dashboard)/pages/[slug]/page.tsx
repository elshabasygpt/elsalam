import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VisualPageEditor } from "../visual-page-editor";
import { getPageSectionsConfig } from "../page-sections-loader";
import { FileText } from "lucide-react";
import { getHomePageDefaultContent } from "../home-default-content";
import { getAboutPageDefaultContent } from "../about-default-content";
import { getQualityPageDefaultContent } from "../quality-default-content";
import { getProductionPageDefaultContent } from "../production-default-content";
import { getExportPageDefaultContent } from "../export-default-content";
import { getB2bPageDefaultContent } from "../b2b-default-content";
import { getContactPageDefaultContent } from "../contact-default-content";

const PAGES_CONFIG: Record<string, { nameAr: string; nameEn: string; emoji: string }> = {
    home: { nameAr: "الصفحة الرئيسية", nameEn: "Home Page", emoji: "🏠" },
    about: { nameAr: "من نحن", nameEn: "About Us", emoji: "ℹ️" },
    quality: { nameAr: "معايير الجودة", nameEn: "Quality Standards", emoji: "✅" },
    production: { nameAr: "مراحل الإنتاج", nameEn: "Production", emoji: "🏭" },
    export: { nameAr: "التصدير العالمي", nameEn: "Export", emoji: "🌍" },
    b2b: { nameAr: "شراكات B2B", nameEn: "B2B Partnerships", emoji: "🤝" },
    contact: { nameAr: "تواصل معنا", nameEn: "Contact Us", emoji: "📞" },
};

export default async function EditPageContentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageConfig = PAGES_CONFIG[slug];
    const sections = await getPageSectionsConfig(slug);

    if (!pageConfig || sections.length === 0) notFound();

    const pageContent = await prisma.pageContent.findUnique({
        where: { pageSlug: slug },
    });

    // Use DB content if exists, otherwise provide default content from i18n
    let initialContent: string;
    if (pageContent?.content) {
        initialContent = pageContent.content;
    } else if (slug === "home") {
        // Pre-fill with current website content so user sees what's on the site
        initialContent = JSON.stringify(getHomePageDefaultContent(), null, 2);
    } else if (slug === "about") {
        initialContent = JSON.stringify(getAboutPageDefaultContent(), null, 2);
    } else if (slug === "quality") {
        initialContent = JSON.stringify(getQualityPageDefaultContent(), null, 2);
    } else if (slug === "production") {
        initialContent = JSON.stringify(getProductionPageDefaultContent(), null, 2);
    } else if (slug === "export") {
        initialContent = JSON.stringify(getExportPageDefaultContent(), null, 2);
    } else if (slug === "b2b") {
        initialContent = JSON.stringify(getB2bPageDefaultContent(), null, 2);
    } else if (slug === "contact") {
        initialContent = JSON.stringify(getContactPageDefaultContent(), null, 2);
    } else {
        initialContent = JSON.stringify({}, null, 2);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="text-3xl">{pageConfig.emoji}</span>
                <div>
                    <h1 className="text-2xl font-black text-slate-800">تعديل: {pageConfig.nameAr}</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{pageConfig.nameEn}</p>
                </div>
            </div>

            <VisualPageEditor
                slug={slug}
                pageNameAr={pageConfig.nameAr}
                pageNameEn={pageConfig.nameEn}
                sections={sections}
                initialContent={initialContent}
            />
        </div>
    );
}
