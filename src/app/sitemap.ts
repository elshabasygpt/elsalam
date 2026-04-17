import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://elsalamoils.com";

    // Fetch dynamic content
    const [products, news] = await Promise.all([
        prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
        prisma.news.findMany({ where: { is_published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const staticRoutes = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/quality`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/production`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/export`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/media`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
        { url: `${baseUrl}/b2b`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/b2b/quote`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    ];

    const productRoutes = products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const newsRoutes = news.map((n) => ({
        url: `${baseUrl}/media/${n.slug}`,
        lastModified: n.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...newsRoutes];
}
