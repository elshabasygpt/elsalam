import { handleApiError } from "@/lib/error-handler";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        
        if (settings) {
            // Remove ALL sensitive credentials before sending to client
            const { 
                smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpFromName, smtpSecure,
                imapHost, imapPort, imapUser, imapPass, imapSecure,
                geminiApiKey, stabilityApiKey, huggingFaceApiKey,
                ...safeSettings 
            } = settings as any;
            return NextResponse.json(safeSettings);
        }
        
        return NextResponse.json(settings);
    } catch (error: any) {
        return handleApiError(error);
    }
}
