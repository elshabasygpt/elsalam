import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "../../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) notFound();

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            features: true,
            technical_specs: true,
            packagings: true,
            certifications: true,
            images: true,
        },
    });

    if (!product) notFound();

    const categories = await prisma.category.findMany({
        orderBy: { name_ar: "asc" },
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800">تعديل المنتج</h1>
                <p className="text-slate-500 mt-1">تعديل بيانات: {product.name_ar}</p>
            </div>
            <ProductForm
                categories={categories}
                initialData={{
                    id: product.id,
                    name_ar: product.name_ar,
                    name_en: product.name_en,
                    slug: product.slug,
                    short_description_ar: product.short_description_ar || "",
                    short_description_en: product.short_description_en || "",
                    description_ar: product.description_ar || "",
                    description_en: product.description_en || "",
                    categoryId: product.categoryId,
                    is_featured: product.is_featured,
                    is_exportable: product.is_exportable,
                    featured_image: product.featured_image || "",
                    price: product.price ? Number(product.price) : null,
                    price_unit_ar: product.price_unit_ar || "",
                    price_unit_en: product.price_unit_en || "",
                    features: product.features.map(f => ({
                        feature_ar: f.feature_ar,
                        feature_en: f.feature_en,
                    })),
                    technical_specs: product.technical_specs.map(s => ({
                        property_ar: s.property_ar,
                        property_en: s.property_en,
                        value_ar: s.value_ar,
                        value_en: s.value_en,
                    })),
                    packagings: product.packagings.map(p => ({
                        size_ar: p.size_ar,
                        size_en: p.size_en,
                        price: p.price?.toString() || "",
                    })),
                    certifications: product.certifications.map(c => ({
                        name: c.name,
                    })),
                    images: product.images.map(img => ({
                        url: img.url,
                    })),
                }}
            />
        </div>
    );
}
