import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
        data: categories.map((c) => ({
            id: c.id,
            name_ar: c.name_ar,
            name_en: c.name_en,
            slug: c.slug,
            imageUrl: c.imageUrl,
            products_count: c._count.products,
        })),
    });
}
