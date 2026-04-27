import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settingsList = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "SiteSettings" LIMIT 1');
        const settings = settingsList?.[0] || null;
        
        if (settings) {
            // Remove sensitive SMTP credentials before sending to client
            const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpFromName, smtpSecure, ...safeSettings } = settings as any;
            return NextResponse.json(safeSettings);
        }
        
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
