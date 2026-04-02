import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst() as any;
        return NextResponse.json({ logoUrl: settings?.logoUrl || null });
    } catch {
        return NextResponse.json({ logoUrl: null });
    }
}
