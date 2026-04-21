// Use relative URL so it works on any port (dev: 3000/3001, prod: 80/443)
const API_BASE = typeof window !== "undefined"
    ? `${window.location.origin}/api/public`
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/public");

export interface ProductCategory {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
}

export interface ActivePromotion {
    id: number;
    badge_ar: string | null;
    badge_en: string | null;
    promo_price: number | null;
    original_price: number | null;
    discount_type: string;
    discount_value: number;
    ends_at: string;
}

export interface ProductItem {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    short_description_ar: string | null;
    short_description_en: string | null;
    featured_image: string | null;
    price: number | null;
    price_unit_ar: string | null;
    price_unit_en: string | null;
    is_exportable: boolean;
    is_featured: boolean;
    stock: number;
    icon: string | null;
    gradient_from: string | null;
    gradient_to: string | null;
    category: ProductCategory | null;
    active_promotion: ActivePromotion | null;
}

export interface ProductPackaging {
    id: number;
    size_ar: string;
    size_en: string;
    price: number | null;
}

export interface ProductSpec {
    label_ar: string;
    label_en: string;
    value_ar: string;
    value_en: string;
}

export interface ProductDetail extends Omit<ProductItem, 'active_promotion'> {
    description_ar: string | null;
    description_en: string | null;
    long_description_ar: string | null;
    long_description_en: string | null;
    features_ar: string[] | null;
    features_en: string[] | null;
    certifications: string[] | null;
    pdf_datasheet: string | null;
    meta_title: string | null;
    meta_description: string | null;
    specs: ProductSpec[];
    technical_specs: {
        id: number;
        property_ar: string;
        property_en: string;
        value_ar: string;
        value_en: string;
        unit_ar: string | null;
        unit_en: string | null;
    }[];
    images: { url: string; alt_text: string | null }[];
    packagings: ProductPackaging[];
    promotions: {
        id: number;
        title_ar: string;
        title_en: string;
        badge_ar: string | null;
        badge_en: string | null;
        discount_type: string;
        discount_value: number;
        original_price: number | null;
        promo_price: number | null;
        ends_at: string;
    }[];
}

export interface PromotionItem {
    id: number;
    product_id: number | null;
    title_ar: string;
    title_en: string;
    description_ar: string | null;
    description_en: string | null;
    discount_type: string;
    discount_value: number;
    original_price: number | null;
    promo_price: number | null;
    badge_ar: string | null;
    badge_en: string | null;
    featured_image: string | null;
    starts_at: string;
    ends_at: string;
    product: {
        slug: string;
        name_ar: string;
        name_en: string;
    } | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export async function getProducts(params?: {
    category?: string;
    featured?: boolean;
    page?: number;
}): Promise<PaginatedResponse<ProductItem>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.featured) searchParams.set("featured", "1");
    if (params?.page) searchParams.set("page", params.page.toString());

    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function getProductDetail(slug: string): Promise<ProductDetail> {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    const json = await res.json();
    return json.data;
}

export async function getCategories(): Promise<ProductCategory[]> {
    const res = await fetch(`${API_BASE}/categories`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data;
}

export async function getPromotions(): Promise<PromotionItem[]> {
    const res = await fetch(`${API_BASE}/promotions`, {
        cache: "no-store",
    });
    if (!res.ok) return []; // graceful fallback
    const json = await res.json();
    return json.data;
}
