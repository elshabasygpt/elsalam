import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage({
    searchParams,
}: {
    searchParams: Promise<{ clone?: string }>;
}) {
    const params = await searchParams;
    
    const categories = await prisma.category.findMany({
        orderBy: { name_ar: "asc" },
    });

    let initialData = undefined;

    if (params.clone) {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(params.clone) },
            include: {
                features: true,
                technical_specs: true,
                packagings: true,
                certifications: true,
                images: true,
            },
        });

        if (product) {
            initialData = {
                ...product,
                id: undefined,
                slug: `${product.slug}-copy-${Math.floor(Math.random() * 1000)}`,
                name_ar: `${product.name_ar} (نسخة)`,
                name_en: `${product.name_en} (Copy)`,
            };
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800">
                    {params.clone ? "تكرار منتج" : "إضافة منتج جديد"}
                </h1>
                <p className="text-slate-500 mt-1">
                    {params.clone ? "قم بتعديل بيانات المنتج المنسوخ وحفظه كمنتج جديد" : "أكمل البيانات التالية لإضافة منتج جديد للموقع"}
                </p>
            </div>
            <ProductForm categories={categories} initialData={initialData as any} />
        </div>
    );
}
