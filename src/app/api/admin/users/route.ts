import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

// GET all users
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, image: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
}

// POST create user
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ error: "الاسم والبريد وكلمة المرور مطلوبون" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email: body.email } });
        if (existing) {
            return NextResponse.json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
        }

        const hashedPassword = await hash(body.password, 12);

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                role: body.role || "USER",
                image: body.image || null,
            },
            select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
