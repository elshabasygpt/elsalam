import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name_ar, name_en, slug, imageUrl, sortOrder } = body;

        if (!name_ar || !name_en || !slug) {
            return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name_ar, name_en, slug, imageUrl, sortOrder: sortOrder ? parseInt(sortOrder) : 0 },
        });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء إنشاء التصنيف" }, { status: 500 });
    }
}
