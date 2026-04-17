import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET all messages
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const starred = searchParams.get("starred");

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (type && type !== "all") where.type = type;
    if (starred === "true") where.isStarred = true;

    const messages = await prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const [total, newCount, read, replied, archived, starredCount] = await Promise.all([
        prisma.message.count(),
        prisma.message.count({ where: { status: "new" } }),
        prisma.message.count({ where: { status: "read" } }),
        prisma.message.count({ where: { status: "replied" } }),
        prisma.message.count({ where: { status: "archived" } }),
        prisma.message.count({ where: { isStarred: true } }),
    ]);

    const counts = { total, new: newCount, read, replied, archived, starred: starredCount };

    return NextResponse.json({ messages, counts });
}

// POST create new message (public — from contact form)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.email || !body.subject || !body.body) {
            return NextResponse.json({ error: "الاسم والبريد والموضوع والرسالة مطلوبون" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone || null,
                company: body.company || null,
                subject: body.subject,
                body: body.body,
                type: body.type || "inquiry",
                priority: body.priority || "normal",
            },
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
