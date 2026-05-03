import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// @ts-ignore
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await prisma.siteSettings.findFirst();
        
        if (!settings) {
            return NextResponse.json({
                geminiApiKey: "",
                stabilityApiKey: "",
                huggingFaceApiKey: "",
                textAiProvider: "gemini",
                imageAiProvider: "pollinations"
            });
        }

        return NextResponse.json({
            // @ts-ignore
            geminiApiKey: settings.geminiApiKey || "",
            // @ts-ignore
            stabilityApiKey: settings.stabilityApiKey || "",
            // @ts-ignore
            huggingFaceApiKey: settings.huggingFaceApiKey || "",
            // @ts-ignore
            textAiProvider: settings.textAiProvider || "gemini",
            // @ts-ignore
            imageAiProvider: settings.imageAiProvider || "pollinations"
        });
    } catch (error) {
        console.error("API Settings GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { geminiApiKey, stabilityApiKey, huggingFaceApiKey, textAiProvider, imageAiProvider } = await req.json();

        let settings = await prisma.siteSettings.findFirst();
        
        if (settings) {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    geminiApiKey,
                    stabilityApiKey,
                    huggingFaceApiKey,
                    textAiProvider,
                    imageAiProvider
                } as any
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    geminiApiKey,
                    stabilityApiKey,
                    huggingFaceApiKey,
                    textAiProvider,
                    imageAiProvider
                } as any
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Settings POST Error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
