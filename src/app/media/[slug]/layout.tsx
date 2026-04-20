import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
    });

    if (!news) {
        return {
            title: "Article Not Found",
            description: "The requested article does not exist.",
        };
    }

    const title = `${news.title_ar} | ${news.title_en}`;
    const description = news.excerpt_ar || news.excerpt_en || "Elsalam Oils News";
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            url: `https://elsalamoils.com/media/${news.slug}`,
            publishedTime: news.createdAt.toISOString(),
            // images: [{ url: news.image_url }] // if you have an image system
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://elsalamoils.com/media/${news.slug}`
        }
    };
}

export default async function NewsLayout(props: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug }
    });

    let jsonLd = null;
    if (news) {
        jsonLd = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title_en,
            "alternativeHeadline": news.title_ar,
            "datePublished": news.createdAt.toISOString(),
            "dateModified": news.updatedAt.toISOString(),
            "description": news.excerpt_en || news.excerpt_ar,
            // "image": [news.image_url], // if available
            "author": [{
                "@type": "Organization",
                "name": "Elsalam Oils",
                "url": "https://elsalamoils.com"
            }],
            "publisher": {
                "@type": "Organization",
                "name": "Elsalam Oils",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://elsalamoils.com/images/logo.png"
                }
            }
        };
    }

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {props.children}
        </>
    );
}
