import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET current settings
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json({ data: settings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update settings
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        let settings = await prisma.siteSettings.findFirst();

        if (settings) {
            const updateData: any = {
                siteNameAr: body.siteNameAr,
                siteNameEn: body.siteNameEn,
                    siteDescriptionAr: body.siteDescriptionAr || null,
                    siteDescriptionEn: body.siteDescriptionEn || null,
                    contactEmail: body.contactEmail || null,
                    contactPhone: body.contactPhone || null,
                    addressAr: body.addressAr || null,
                    addressEn: body.addressEn || null,
                    facebookUrl: body.facebookUrl || null,
                    twitterUrl: body.twitterUrl || null,
                    instagramUrl: body.instagramUrl || null,
                    linkedinUrl: body.linkedinUrl || null,
                    smtpHost: body.smtpHost || null,
                    smtpPort: body.smtpPort ? parseInt(body.smtpPort) : null,
                    smtpUser: body.smtpUser || null,
                    smtpPass: body.smtpPass || null,
                    smtpFrom: body.smtpFrom || null,
                    smtpFromName: body.smtpFromName || null,
                    smtpSecure: body.smtpSecure || null,
                    imapHost: body.imapHost || null,
                    imapPort: body.imapPort ? parseInt(body.imapPort) : null,
                    imapSecure: body.imapSecure || null,
                    imapUser: body.imapUser || null,
                    imapPass: body.imapPass || null,
                    logoUrl: body.logoUrl || null,
                    googleAnalyticsId: body.googleAnalyticsId || null,
            };
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: updateData,
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    siteNameAr: body.siteNameAr,
                    siteNameEn: body.siteNameEn,
                    contactEmail: body.contactEmail,
                    contactPhone: body.contactPhone,
                },
            });
        }

        return NextResponse.json({ data: settings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
