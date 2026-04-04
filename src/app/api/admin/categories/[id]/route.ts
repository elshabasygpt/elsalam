import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name_ar, name_en, slug } = body;
        const p = await params;
        const id = parseInt(p.id);

        if (!name_ar || !name_en || !slug) {
            return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name_ar, name_en, slug },
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "حدث خطأ أثناء تعديل التصنيف" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const p = await params;
        const id = parseInt(p.id);
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "لا يمكن حذف تصنيف مرتبط بمنتجات" }, { status: 500 });
    }
}
