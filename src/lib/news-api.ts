const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface NewsItem {
    id: number;
    title_ar: string;
    title_en: string;
    slug: string;
    excerpt_ar: string | null;
    excerpt_en: string | null;
    featured_image: string | null;
    media_type: "image" | "youtube";
    category: "news" | "interviews" | "factory_tours" | "exhibitions";
    is_featured: boolean;
    published_at: string | null;
    reading_time: number | null;
}

export interface NewsDetail extends NewsItem {
    content_ar: string;
    content_en: string;
    youtube_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export async function getNewsList(params?: {
    category?: string;
    featured?: boolean;
    page?: number;
}): Promise<PaginatedResponse<NewsItem>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.featured) searchParams.set("featured", "1");
    if (params?.page) searchParams.set("page", params.page.toString());

    const res = await fetch(`${API_BASE}/news?${searchParams.toString()}`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error("Failed to fetch news");
    return res.json();
}

export async function getFeaturedNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE}/news/featured`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error("Failed to fetch featured news");
    const json = await res.json();
    return json.data;
}

export async function getNewsArticle(slug: string): Promise<NewsDetail> {
    const res = await fetch(`${API_BASE}/news/${slug}`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error("Failed to fetch article");
    const json = await res.json();
    return json.data;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
        /(?:youtu\.be\/)([^?\s]+)/,
        /(?:youtube\.com\/embed\/)([^?\s]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}
