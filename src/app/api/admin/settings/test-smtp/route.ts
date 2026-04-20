import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, imapHost, imapPort, imapUser, imapPass, imapSecure } = body;

        let messages = [];

        // 1. Test SMTP
        if (smtpHost && smtpPort && smtpUser && smtpPass) {
            try {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: Number(smtpPort),
                    secure: Number(smtpPort) === 465 || smtpSecure === "ssl",
                    auth: { user: smtpUser, pass: smtpPass },
                    connectionTimeout: 10000,
                });
                await transporter.verify();
                messages.push("نجح اتصال الإرسال (SMTP)");
            } catch (err: any) {
                return NextResponse.json({ error: "فشل اتفاقية الإرسال SMTP: " + err.message }, { status: 500 });
            }
        }

        // 2. Test IMAP
        if (imapHost && imapPort && imapUser && imapPass) {
            try {
                const client = new ImapFlow({
                    host: imapHost,
                    port: Number(imapPort),
                    secure: imapSecure === "ssl" || imapSecure === "tls" || Number(imapPort) === 993,
                    auth: { user: imapUser, pass: imapPass },
                    logger: false,
                });
                await client.connect();
                await client.logout();
                messages.push("نجح اتصال الاستقبال (IMAP)");
            } catch (err: any) {
                return NextResponse.json({ error: "فشل اتفاقية الاستقبال IMAP: " + err.message }, { status: 500 });
            }
        }

        if (messages.length === 0) {
            return NextResponse.json({ error: "الرجاء إدخال بيانات الـ SMTP أو الـ IMAP ليتم اختبارها." }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: messages.join(" و ") }, { status: 200 });

    } catch (error: any) {
        console.error("SMTP Test Error:", error);
        return NextResponse.json(
            { error: "فشل الاتصال بالخادم. يرجى مراجعة البيانات المدخلة والمحاولة مجدداً.", details: error.message },
            { status: 500 }
        );
    }
}
