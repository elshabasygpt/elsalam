import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await prisma.siteSettings.findFirst();

    try {
        const { text, targetLang, provider } = await req.json();

        // Use requested provider or fallback to settings
        const textAiProvider = provider || (settings as any)?.textAiProvider || "huggingface";

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const prompt = `Translate the following short text accurately to ${targetLang === 'en' ? 'English' : 'Arabic'}. Provide ONLY the translation without any quotes, explanations, or markdown.

Text to translate:
${text}`;

        let translatedText = "";

        if (textAiProvider === "huggingface") {
            // @ts-ignore
            const HF_TOKEN = settings?.huggingFaceApiKey || process.env.HUGGINGFACE_API_KEY;
            if (!HF_TOKEN) {
                return NextResponse.json({ error: "Hugging Face token is missing" }, { status: 400 });
            }

            const hf = new HfInference(HF_TOKEN);
            const res = await hf.chatCompletion({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            });

            translatedText = res.choices[0].message.content || "";
        } else {
            // Default to Gemini
            // @ts-ignore
            const GEMINI_API_KEY = settings?.geminiApiKey || process.env.GEMINI_API_KEY;
            if (!GEMINI_API_KEY) {
                return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
            }

            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent(prompt);
            translatedText = result.response.text();
        }

        // Clean any accidental quotes
        translatedText = translatedText.replace(/^["']|["']$/g, '').trim();

        return NextResponse.json({ translation: translatedText });

    } catch (error: any) {
        console.error("AI Translation Error:", error);
        
        let errorMessage = error.message || "Failed to translate";
        let statusCode = 500;

        if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests") || errorMessage.includes("Quota exceeded")) {
            errorMessage = "عذراً، لقد استنفدت الحد المجاني لطلبات الذكاء الاصطناعي من جوجل. يرجى التبديل إلى Hugging Face.";
            statusCode = 429;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}
