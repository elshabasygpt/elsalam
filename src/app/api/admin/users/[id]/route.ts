import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

// PUT update user
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();

        // Check email uniqueness if changed
        if (body.email) {
            const existing = await prisma.user.findFirst({
                where: { email: body.email, NOT: { id } },
            });
            if (existing) {
                return NextResponse.json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
            }
        }

        const updateData: any = {
            name: body.name,
            email: body.email,
            role: body.role,
        };

        // Only hash password if a new one is provided
        if (body.password && body.password.trim()) {
            updateData.password = await hash(body.password, 12);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, image: true, createdAt: true, updatedAt: true },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE user
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if ((session.user as any).id === id) {
        return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص" }, { status: 400 });
    }

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
