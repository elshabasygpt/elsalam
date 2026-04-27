import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_HISTORY = 20;

// GET /api/admin/pages/history?slug=home  — returns last N versions
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const history = await prisma.pageContentHistory.findMany({
        where: { pageSlug: slug },
        orderBy: { savedAt: "desc" },
        take: MAX_HISTORY,
        select: { id: true, label: true, savedAt: true },
    });

    return NextResponse.json({ history });
}

// POST /api/admin/pages/history  — save a new version snapshot
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug, content, label } = await req.json();
    if (!slug || !content) return NextResponse.json({ error: "slug and content required" }, { status: 400 });

    // Save new snapshot
    await prisma.pageContentHistory.create({
        data: {
            pageSlug: slug,
            content,
            label: label || new Date().toLocaleString("ar-EG"),
        },
    });

    // Prune old entries beyond MAX_HISTORY
    const all = await prisma.pageContentHistory.findMany({
        where: { pageSlug: slug },
        orderBy: { savedAt: "desc" },
        select: { id: true },
    });
    if (all.length > MAX_HISTORY) {
        const toDelete = all.slice(MAX_HISTORY).map((r) => r.id);
        await prisma.pageContentHistory.deleteMany({ where: { id: { in: toDelete } } });
    }

    return NextResponse.json({ ok: true });
}
