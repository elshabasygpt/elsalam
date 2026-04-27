import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const settingsList = await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "SiteSettings" LIMIT 1');
        const settings = settingsList?.[0] || null;

        if (!settings) {
            return NextResponse.json({
                invoiceShowLogo: true,
                invoiceNotesAr: "",
                invoiceNotesEn: ""
            });
        }

        return NextResponse.json({
            invoiceShowLogo: (settings as any).invoiceShowLogo,
            invoiceNotesAr: (settings as any).invoiceNotesAr || "",
            invoiceNotesEn: (settings as any).invoiceNotesEn || "",
            invoiceLogoUrl: (settings as any).invoiceLogoUrl || "",
            invoiceLogoSize: (settings as any).invoiceLogoSize || 64,
            invoiceColor: (settings as any).invoiceColor || "#15803d",
            invoiceSubtitle: (settings as any).invoiceSubtitle !== null && (settings as any).invoiceSubtitle !== undefined ? (settings as any).invoiceSubtitle : "Industrial High-Quality Oils & Fats",
            invoiceWebsiteUrl: (settings as any).invoiceWebsiteUrl !== null && (settings as any).invoiceWebsiteUrl !== undefined ? (settings as any).invoiceWebsiteUrl : "www.elsalamoils.com",
            invoiceCompanyDetails: (settings as any).invoiceCompanyDetails || "",
        });
    } catch (error) {
        console.error("[INVOICE_SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { invoiceShowLogo, invoiceNotesAr, invoiceNotesEn, invoiceLogoUrl, invoiceLogoSize, invoiceColor, invoiceSubtitle, invoiceWebsiteUrl, invoiceCompanyDetails } = body;

        const existingSettings = await prisma.siteSettings.findFirst() as any;

        if (existingSettings) {
            // Using raw SQL to bypass the outdated Prisma Client loaded in memory
            await prisma.$executeRawUnsafe(
                `UPDATE "SiteSettings" SET "invoiceShowLogo" = $1, "invoiceNotesAr" = $2, "invoiceNotesEn" = $3, "invoiceLogoUrl" = $4, "invoiceLogoSize" = $5, "invoiceColor" = $6, "invoiceSubtitle" = $7, "invoiceWebsiteUrl" = $8, "invoiceCompanyDetails" = $9 WHERE id = $10`,
                invoiceShowLogo,
                invoiceNotesAr,
                invoiceNotesEn,
                invoiceLogoUrl,
                parseInt(invoiceLogoSize) || 64,
                invoiceColor,
                invoiceSubtitle,
                invoiceWebsiteUrl,
                invoiceCompanyDetails,
                existingSettings.id
            );
            return NextResponse.json({ success: true });
        } else {
            return new NextResponse("Settings record not found. Please create one from general settings first.", { status: 400 });
        }
    } catch (error) {
        console.error("[INVOICE_SETTINGS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
