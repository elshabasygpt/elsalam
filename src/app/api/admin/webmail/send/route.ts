import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { to, cc, bcc, subject, html, attachments } = body;

        if (!to || !subject || !html) {
            return NextResponse.json({ error: "يجب ملء حقل المرسل إليه، الموضوع، والرسالة." }, { status: 400 });
        }

        const settings = await prisma.siteSettings.findFirst() as any;
        if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPass) {
            return NextResponse.json({ error: "إعدادات SMTP غير مكتملة." }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort || 587,
            secure: settings.smtpPort === 465 || settings.smtpSecure === "ssl",
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPass,
            },
        });

        const mailOptions: any = {
            from: `"${settings.smtpFromName || settings.siteNameAr}" <${settings.smtpFrom || settings.smtpUser}>`,
            to: to,
            subject: subject,
            html: html,
        };

        if (cc) mailOptions.cc = cc;
        if (bcc) mailOptions.bcc = bcc;

        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            mailOptions.attachments = attachments.map((att: any) => ({
                filename: att.filename,
                content: att.contentUrl.split("base64,")[1],
                encoding: "base64",
            }));
        }

        await transporter.sendMail(mailOptions);

        // Append to Sent folder via IMAP
        try {
            const imapHost = settings?.imapHost || settings?.smtpHost;
            const imapPort = settings?.imapPort || 993;
            const imapSecure = settings?.imapSecure === "tls" || settings?.imapSecure === "ssl" || imapPort === 993;
            const imapUser = settings?.imapUser || settings?.smtpUser;
            const imapPass = settings?.imapPass || settings?.smtpPass;

            if (imapHost && imapUser && imapPass) {
                const MailComposer = require('nodemailer/lib/mail-composer');
                const mail = new MailComposer(mailOptions);
                const rawMessage = await mail.compile().build();

                const client = new ImapFlow({
                    host: imapHost,
                    port: imapPort,
                    secure: imapSecure,
                    auth: { user: imapUser, pass: imapPass },
                    logger: false,
                });
                
                await client.connect();
                const list = await client.list();
                const sentBox = list.find((b: any) => b.specialUse?.includes('\\Sent') || b.name.toLowerCase().includes('sent'));
                
                if (sentBox) {
                    await client.append(sentBox.path, rawMessage, ['\\Seen']);
                }
                
                await client.logout();
            }
        } catch (appendErr) {
            console.error("Failed to append to Sent:", appendErr);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webmail Send Error:", error);
        return NextResponse.json({ error: "فشل الإرسال: " + error.message }, { status: 500 });
    }
}
