import type { Product, Category, MessagePayload, SiteSettings } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/public";

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
            signal: controller.signal,
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        return json.data ?? json;
    } finally {
        clearTimeout(timeout);
    }
}

// ────────────────────────────────────────────
// Categories
// ────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    return fetchAPI<Category[]>("/categories");
}

export async function getCategory(slug: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/${slug}`);
}

// ────────────────────────────────────────────
// Products
// ────────────────────────────────────────────

export async function getProducts(params?: {
    category?: string;
    exportable?: boolean;
}): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.exportable) searchParams.set("exportable", "1");

    const query = searchParams.toString();
    return fetchAPI<Product[]>(`/products${query ? `?${query}` : ""}`);
}

export async function getFeaturedProducts(): Promise<Product[]> {
    return fetchAPI<Product[]>("/products/featured");
}

export async function getProduct(slug: string): Promise<Product> {
    return fetchAPI<Product>(`/products/${slug}`);
}

// ────────────────────────────────────────────
// Messages (form submissions)
// ────────────────────────────────────────────

export async function submitMessage(
    payload: MessagePayload
): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
    });

    return res.json();
}

// ────────────────────────────────────────────
// Settings
// ────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings> {
    return fetchAPI<SiteSettings>("/settings");
}

// ────────────────────────────────────────────
// Company Stats
// ────────────────────────────────────────────

export interface CompanyStatData {
    experience: number;
    production: number;
    exports: number;
    clients: number;
    lines: number;
    certifications: number;
}

export async function getCompanyStats(): Promise<CompanyStatData> {
    return fetchAPI<CompanyStatData>("/company-stats");
}
