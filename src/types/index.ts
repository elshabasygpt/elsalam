// TypeScript interfaces matching Laravel API responses

export interface Category {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    description_ar: string;
    description_en: string;
    image: string | null;
    products_count?: number;
    products?: Product[];
}

export interface Product {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
    description_ar?: string;
    description_en?: string;
    short_description_ar: string;
    short_description_en?: string;
    featured_image: string | null;
    pdf_datasheet?: string | null;
    packaging_sizes?: string;
    is_exportable: boolean;
    is_featured: boolean;
    meta_title?: string;
    meta_description?: string;
    category?: Category;
    specs?: ProductSpec[];
    technical_specs?: ProductTechnicalSpec[];
    images?: ProductImage[];
    packagings?: ProductPackaging[];
    promotions?: Promotion[];
    price?: string | null;
    price_unit_ar?: string | null;
    price_unit_en?: string | null;
}

export interface ProductTechnicalSpec {
    id: number;
    property_ar: string;
    property_en: string;
    value_ar: string;
    value_en: string;
    unit_ar: string | null;
    unit_en: string | null;
}

export interface ProductPackaging {
    id: number;
    size_ar: string;
    size_en: string;
    price: string | null;
}

export interface Promotion {
    id: number;
    title_ar: string;
    title_en: string;
    badge_ar: string;
    badge_en: string;
    discount_type: string;
    discount_value: string;
    original_price: string;
    promo_price: string;
    ends_at: string | null;
}

export interface ProductSpec {
    label_ar: string;
    label_en: string;
    value_ar: string;
    value_en: string;
}

export interface ProductImage {
    url: string;
    alt_text: string;
}

export interface MessagePayload {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject?: string;
    message: string;
    type: "contact" | "quote" | "export";
    product_id?: number;
}

export interface SiteSettings {
    general: Record<string, string>;
    contact: Record<string, string>;
    social: Record<string, string>;
    stats: Record<string, string>;
    about: Record<string, string>;
}
