import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 10 AI generations per minute per user (cost control)
    const limited = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const settings = await prisma.siteSettings.findFirst();
    // Use the provider configured in Admin Settings, fallback to huggingface
    const textAiProvider = (settings as any)?.textAiProvider || "huggingface";

    try {
        const { productName, category, features } = await req.json();

        if (!productName) {
            return NextResponse.json({ error: "Product name is required" }, { status: 400 });
        }

        // ✅ Prompt Injection Protection: strip instruction-like patterns from user inputs
        const sanitize = (input: string) => input
            .replace(/ignore\s+(previous|all|above|prior)/gi, '')
            .replace(/system\s*prompt/gi, '')
            .replace(/you\s+are\s+(now|a|an)/gi, '')
            .replace(/\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>/g, '')
            .replace(/\n{3,}/g, '\n')
            .trim()
            .substring(0, 300); // Hard cap per field

        const safeProductName = sanitize(String(productName));
        const safeCategory = category ? sanitize(String(category)) : '';
        const safeFeatures = features ? sanitize(String(features)) : '';

        const prompt = `
            أنت خبير تسويق لشركة متخصصة في المنتجات الغذائية والمواد الخام.
            قم بكتابة محتوى تسويقي احترافي وجذاب للمنتج التالي:
            - اسم المنتج: ${safeProductName}
            ${safeCategory ? `- التصنيف: ${safeCategory}` : ''}
            ${safeFeatures ? `- المميزات: ${safeFeatures}` : ''}
            
            المطلوب:
            1. "name_en": ترجمة احترافية ودقيقة لاسم المنتج إلى اللغة الإنجليزية.
            2. "short_ar": وصف قصير وجذاب باللغة العربية (جملتين كحد أقصى).
            3. "short_en": نفس الوصف القصير باللغة الإنجليزية.
            4. "long_ar": وصف تفصيلي باللغة العربية يشرح فوائد المنتج واستخداماته بشكل مرتب (فقرتين).
            5. "long_en": نفس الوصف التفصيلي باللغة الإنجليزية.
            6. "generated_features": مصفوفة (Array) تحتوي على 4 إلى 5 مميزات تسويقية قوية للمنتج.
            7. "generated_specifications": مصفوفة تحتوي على المواصفات الفنية المتوقعة للمنتج (مثل الوزن، مدة الصلاحية، المكونات، إلخ).
            8. "generated_certifications": مصفوفة بالشهادات المتوقعة لجودة هذا المنتج (مثل ISO, FDA, Halal).

            يجب أن يكون الرد بصيغة JSON صحيحة (Valid JSON) فقط، بدون أي نصوص إضافية أو علامات Markdown حوله.
            تأكد أن تبدأ بـ { وتنتهي بـ } فقط.
            مثال على الهيكل المطلوب:
            {
                "name_en": "...",
                "short_ar": "...",
                "short_en": "...",
                "long_ar": "...",
                "long_en": "...",
                "generated_features": [
                    { "feature_ar": "طبيعي 100%", "feature_en": "100% Natural" }
                ],
                "generated_specifications": [
                    { "spec_key_ar": "الوزن", "spec_value_ar": "1 كيلوجرام", "spec_key_en": "Weight", "spec_value_en": "1 kg" }
                ],
                "generated_certifications": [
                    { "cert_name": "ISO 9001" }
                ]
            }
        `;

        let generatedText = "";

        if (textAiProvider === "huggingface") {
            // @ts-ignore
            const HF_TOKEN = settings?.huggingFaceApiKey || process.env.HUGGINGFACE_API_KEY;
            if (!HF_TOKEN) {
                return NextResponse.json({ error: "Hugging Face token is missing. Please configure it in AI Settings." }, { status: 400 });
            }

            const hf = new HfInference(HF_TOKEN);
            const res = await hf.chatCompletion({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2000,
            });

            generatedText = res.choices[0].message.content || "";
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
            generatedText = result.response.text();
        }

        // Clean JSON markdown
        const cleanedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedJson = JSON.parse(cleanedText);

        return NextResponse.json(parsedJson);

    } catch (error: any) {
        console.error("AI Content Error:", error);

        let errorMessage = error.message || "Failed to generate content";
        let statusCode = 500;

        if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests") || errorMessage.includes("Quota exceeded")) {
            errorMessage = "عذراً، لقد استنفدت الحد المجاني لطلبات الذكاء الاصطناعي من جوجل (20 طلب). يرجى الانتظار، أو استخدام مفتاح API مدفوع في إعدادات النظام.";
            statusCode = 429;
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}
