import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const settings = await prisma.siteSettings.findFirst() as any;
        
        const host = settings?.imapHost || settings?.smtpHost;
        const port = settings?.imapPort || 993;
        const secure = settings?.imapSecure === "tls" || settings?.imapSecure === "ssl" || port === 993;
        const user = settings?.imapUser || settings?.smtpUser;
        const pass = settings?.imapPass || settings?.smtpPass;

        if (!host || !user || !pass) {
            return NextResponse.json({ error: "لم يتم تكوين إعدادات خادم البريد (IMAP/SMTP). يرجى إضافتها من الإعدادات." }, { status: 400 });
        }

        const client = new ImapFlow({
            host: host,
            port: port,
            secure: secure,
            auth: { user, pass },
            logger: false,
        });

        await client.connect();
        
        const folderParam = req.nextUrl.searchParams.get("folder") || "INBOX";

        let targetMailboxPath = "INBOX";

        if (folderParam === "Sent") {
            const list = await client.list();
            const sentBox = list.find(b => b.specialUse?.includes('\\Sent') || b.name.toLowerCase().includes('sent'));
            if (sentBox) targetMailboxPath = sentBox.path;
        }

        // Select and lock Target Mailbox
        const lock = await client.getMailboxLock(targetMailboxPath);
        const emails: any[] = [];
        
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
        const search = req.nextUrl.searchParams.get("search") || "";
        const limit = 20;

        let sequenceToFetch = "";
        let totalMailboxMessages = 0;
        
        try {
            if (search) {
                // Search by subject or from
                const searchResults = await client.search({ or: [{ subject: search }, { from: search }] });
                const results: number[] = searchResults === false ? [] : searchResults;
                totalMailboxMessages = results.length;
                if (totalMailboxMessages === 0) {
                    return NextResponse.json({ emails: [], total: 0, page, totalPages: 0 });
                }
                
                results.sort((a: number, b: number) => a - b); // Ascending sequences
                
                // Pagination slice (remember, results are ascending, so newest is at the end)
                // We want descending order
                results.reverse();
                
                const pagedSeqs = results.slice((page - 1) * limit, page * limit);
                if (pagedSeqs.length === 0) {
                    return NextResponse.json({ emails: [], total: totalMailboxMessages, page, totalPages: Math.ceil(totalMailboxMessages / limit) });
                }
                
                sequenceToFetch = pagedSeqs.join(",");
            } else {
                const mailbox = client.mailbox;
                totalMailboxMessages = (mailbox !== false && mailbox.exists) ? mailbox.exists : 0;
                
                if (totalMailboxMessages === 0) {
                    return NextResponse.json({ emails: [], total: 0, page, totalPages: 0 });
                }

                const toSeq = Math.max(1, totalMailboxMessages - ((page - 1) * limit));
                const fromSeq = Math.max(1, totalMailboxMessages - (page * limit) + 1);
                
                if (toSeq < fromSeq && toSeq < 1) {
                    return NextResponse.json({ emails: [], total: totalMailboxMessages, page, totalPages: Math.ceil(totalMailboxMessages / limit) });
                }
                
                sequenceToFetch = `${fromSeq}:${toSeq}`;
            }
            
            for await (const message of client.fetch(sequenceToFetch, { source: true, uid: true, envelope: true, flags: true })) {
                if (message.source) {
                    const parsed = await simpleParser(message.source);
                    emails.push({
                        uid: message.uid,
                        subject: parsed.subject || "(بدون عنوان)",
                        from: parsed.from?.value[0]?.address || "Unknown",
                        fromName: parsed.from?.value[0]?.name || "",
                        to: parsed.to,
                        date: parsed.date,
                        html: parsed.html || parsed.textAsHtml || parsed.text || "",
                        text: parsed.text || "",
                        isRead: message.flags?.has('\\Seen'),
                        attachments: parsed.attachments?.map(att => ({
                            filename: att.filename,
                            contentType: att.contentType,
                            size: att.size,
                            contentUrl: `data:${att.contentType};base64,${att.content.toString('base64')}`
                        })) || [],
                    });
                }
            }
        } finally {
            lock.release();
        }
        
        await client.logout();
        
        // Reverse so newest is first
        const returnedEmails = emails.reverse();
        return NextResponse.json({ 
            emails: returnedEmails, 
            total: totalMailboxMessages,
            page,
            totalPages: Math.ceil(totalMailboxMessages / limit)
        });

    } catch (error: any) {
        console.error("IMAP Error:", error);
        return NextResponse.json({ error: "فشل الاتصال بخادم البريد الوارد IMAP", details: error.message }, { status: 500 });
    }
}
