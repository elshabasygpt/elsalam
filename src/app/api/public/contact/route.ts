import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // 1. Save message to the database
        const message = await prisma.message.create({
            data: {
                name: body.name || "Unknown",
                email: body.email || "no-email@provided.com",
                phone: body.phone,
                company: body.company,
                subject: body.subject || "New Inquiry",
                body: body.body || "No details provided",
                type: body.type || "inquiry",
                status: "new",
            }
        });

        // 2. Try to send SMTP email notification if settings are provided
        const settings = await prisma.siteSettings.findFirst();
        
        // Check if basic SMTP fields exist
        if (settings?.smtpHost && settings?.smtpUser && settings?.smtpPass && settings?.smtpPort) {
            try {
                const transporter = nodemailer.createTransport({
                    host: settings.smtpHost,
                    port: settings.smtpPort,
                    secure: settings.smtpPort === 465 || settings.smtpSecure === "ssl",
                    auth: {
                        user: settings.smtpUser,
                        pass: settings.smtpPass,
                    },
                });

                // Set up email data
                const mailOptions = {
                    from: `"${settings.smtpFromName || settings.siteNameEn}" <${settings.smtpFrom || settings.smtpUser}>`,
                    to: settings.contactEmail || settings.smtpUser, // Send to site contact email, or back to self
                    subject: `New Request from ${message.name} - ${message.subject}`,
                    text: `
You have received a new ${message.type} request.

Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone || 'N/A'}
Company: ${message.company || 'N/A'}

Details:
${message.body}

---
Sent from Elsalam Oils Website API
                    `,
                };

                // Send mail
                await transporter.sendMail(mailOptions);
                console.log("SMTP notification email sent successfully.");
            } catch (smtpError) {
                // We don't want to crash the request if SMTP fails, just log it.
                // The message is already safely stored in our Dashboard DB!
                console.error("SMTP Mail Send Error:", smtpError);
            }
        }

        return NextResponse.json({ success: true, data: message }, { status: 201 });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { success: false, error: "حدث خطأ أثناء معالجة طلبك" },
            { status: 500 }
        );
    }
}
