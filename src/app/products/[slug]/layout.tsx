import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true }
    });

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The requested product does not exist.",
        };
    }

    const title = `${product.name_ar} | ${product.name_en}`;
    const description = product.short_description_ar || product.short_description_en || "";
    // Note: To truly support i18n metadata in a single-URL app, we often just use bilingual metadata or fallbacks.
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article", // or "product"
            url: `https://elsalamoils.com/products/${product.slug}`,
            // images: [{ url: productImage }] // add when image system is ready
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://elsalamoils.com/products/${product.slug}`
        }
    };
}

export default async function ProductLayout(props: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    // We also generate Product JSON-LD schema here for AIO/GEO
    const params = await props.params;
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true }
    });

    let jsonLd = null;
    if (product) {
        jsonLd = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name_en,
            "name-ar": product.name_ar, // Custom extensions can sometimes be included, though Google prefers standard
            "description": product.short_description_en,
            "sku": product.slug,
            "brand": {
                "@type": "Brand",
                "name": "Elsalam Oils"
            },
            "category": product.category?.name_en || "Vegetable Oils",
            "offers": {
                "@type": "Offer",
                "url": `https://elsalamoils.com/products/${product.slug}`,
                "priceCurrency": "EGP", // Adjust as necessary
                "price": product.price,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
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
