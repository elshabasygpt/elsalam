import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsalamoils.com';

    return {
        rules: {
            userAgent: '*',
            // Allow all public crawlers to index the site
            allow: '/',
            // Block search engines from crawling Admin panels and APIs to save Crawl Budget
            disallow: [
                '/admin/', 
                '/api/admin/', 
                '/my-account/',
                '/api/auth/',
                '/login',
                '/register'
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
