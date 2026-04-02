import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name_ar: "asc" },
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-800">إضافة منتج جديد</h1>
                <p className="text-slate-500 mt-1">أكمل البيانات التالية لإضافة منتج جديد للموقع</p>
            </div>
            <ProductForm categories={categories} />
        </div>
    );
}
