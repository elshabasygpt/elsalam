import React from 'react';

interface ProductJsonLdProps {
    product: {
        name_ar: string;
        name_en: string;
        description_ar?: string | null;
        description_en?: string | null;
        featured_image?: string | null;
        price?: number | null;
        slug: string;
        category?: {
            name_ar: string;
            name_en: string;
        } | null;
    };
    locale: 'ar' | 'en';
}

/**
 * Technical SEO: Generates Structured Data (JSON-LD) for Products.
 * This directly impacts Google Rich Snippets (showing price, image, and availability in search results).
 */
export function ProductJsonLd({ product, locale }: ProductJsonLdProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsalamoils.com';
    
    const name = locale === 'ar' ? product.name_ar : product.name_en;
    const description = locale === 'ar' ? product.description_ar : product.description_en;
    const categoryName = product.category 
        ? (locale === 'ar' ? product.category.name_ar : product.category.name_en) 
        : 'Vegetable Oils';
    
    // Construct the Schema.org Product Object
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "image": product.featured_image ? [`${baseUrl}${product.featured_image}`] : [],
        "description": description || name,
        "sku": product.slug, // Using slug as SKU for unique identification
        "category": categoryName,
        "brand": {
            "@type": "Brand",
            "name": locale === 'ar' ? "مصنع السلام للزيوت النباتية" : "Elsalam Oils"
        },
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/products/${product.slug}`,
            "priceCurrency": "EGP",
            "price": product.price || 0,
            "availability": "https://schema.org/InStock", // Assuming B2B products are generally in stock
            "seller": {
                "@type": "Organization",
                "name": locale === 'ar' ? "مصنع السلام للزيوت النباتية" : "Elsalam Oils"
            }
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
