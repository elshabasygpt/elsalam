import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// GET single message
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const message = await prisma.message.findUnique({ where: { id: parseInt(id) } });
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Auto mark as read
    if (message.status === "new") {
        await prisma.message.update({ where: { id: parseInt(id) }, data: { status: "read" } });
    }

    return NextResponse.json(message);
}

// PUT update message (reply, status, star, notes)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    try {
        const body = await req.json();
        const updateData: any = {};

        if (body.status !== undefined) updateData.status = body.status;
        if (body.isStarred !== undefined) updateData.isStarred = body.isStarred;
        if (body.priority !== undefined) updateData.priority = body.priority;
        if (body.notes !== undefined) updateData.notes = body.notes;

        // Handle reply — send email if SMTP configured
        if (body.reply) {
            updateData.reply = body.reply;
            updateData.status = "replied";
            updateData.repliedAt = new Date();
            updateData.repliedBy = (session.user as any)?.name || "Admin";

            // Try sending email
            try {
                const settings = await prisma.siteSettings.findFirst();
                if (settings?.smtpHost && settings.smtpUser && settings.smtpPass) {
                    const message = await prisma.message.findUnique({ where: { id: parseInt(id) } });
                    if (message) {
                        const transporter = nodemailer.createTransport({
                            host: settings.smtpHost,
                            port: settings.smtpPort || 587,
                            secure: settings.smtpSecure === "ssl",
                            auth: { user: settings.smtpUser, pass: settings.smtpPass },
                        });

                        await transporter.sendMail({
                            from: `"${settings.smtpFromName || settings.siteNameAr}" <${settings.smtpFrom || settings.smtpUser}>`,
                            to: message.email,
                            subject: `رد: ${message.subject}`,
                            html: `
                                <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                                    <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
                                        <h2 style="margin: 0;">مصنع السلام للزيوت النباتية</h2>
                                        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">رد على رسالتك</p>
                                    </div>
                                    <div style="background: #f8fafb; padding: 24px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
                                        <p style="color: #334155; font-size: 15px; line-height: 1.8;">${body.reply.replace(/\n/g, "<br/>")}</p>
                                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                                        <p style="color: #94a3b8; font-size: 12px;">رسالتك الأصلية: ${message.subject}</p>
                                        <p style="color: #94a3b8; font-size: 12px; background: #f1f5f9; padding: 12px; border-radius: 8px;">${message.body.substring(0, 200)}...</p>
                                    </div>
                                </div>
                            `,
                        });
                    }
                }
            } catch (emailErr) {
                console.error("Failed to send email reply:", emailErr);
                // Continue — save reply even if email fails
            }
        }

        const updated = await prisma.message.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE message
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    try {
        await prisma.message.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
