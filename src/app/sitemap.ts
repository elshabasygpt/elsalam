import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsalamoils.com';

    // 1. Fetch Dynamic Data from Database
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    });

    const news = await prisma.news.findMany({
        where: { is_published: true },
        select: { slug: true, updatedAt: true },
    });

    const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
    });

    // 2. Define High-Priority Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/quality',
        '/media',
        '/contact',
        '/register',
        '/login'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 3. Generate Dynamic Product Routes
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 4. Generate Dynamic Category Routes
    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/products?category=${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 5. Generate Dynamic News/Articles Routes
    const newsRoutes = news.map((article) => ({
        url: `${baseUrl}/media/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Return combined XML map
    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...newsRoutes];
}
