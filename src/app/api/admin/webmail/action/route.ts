import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ImapFlow } from "imapflow";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { uid, action, folder = "INBOX" } = body;

        if (!uid || !action) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const settings = await prisma.siteSettings.findFirst() as any;
        const host = settings?.imapHost || settings?.smtpHost;
        const port = settings?.imapPort || 993;
        const secure = settings?.imapSecure === "tls" || settings?.imapSecure === "ssl" || port === 993;
        const user = settings?.imapUser || settings?.smtpUser;
        const pass = settings?.imapPass || settings?.smtpPass;

        if (!host || !user || !pass) {
            return NextResponse.json({ error: "IMAP config missing" }, { status: 400 });
        }

        const client = new ImapFlow({
            host: host,
            port: port,
            secure: secure,
            auth: { user, pass },
            logger: false,
        });

        await client.connect();

        let targetMailboxPath = "INBOX";
        if (folder === "Sent") {
            const list = await client.list();
            const sentBox = list.find(b => b.specialUse?.includes('\\Sent') || b.name.toLowerCase().includes('sent'));
            if (sentBox) targetMailboxPath = sentBox.path;
        }

        const lock = await client.getMailboxLock(targetMailboxPath);

        try {
            const sequenceStr = uid.toString();
            if (action === "markRead") {
                await client.messageFlagsAdd(sequenceStr, ['\\Seen'], { uid: true });
            } else if (action === "delete") {
                const list = await client.list();
                const trashBox = list.find(b => b.specialUse?.includes('\\Trash') || b.name.toLowerCase().includes('trash') || b.name.toLowerCase().includes('bin'));
                if (trashBox && trashBox.path !== targetMailboxPath) {
                    await client.messageMove(sequenceStr, trashBox.path, { uid: true });
                } else {
                    await client.messageFlagsAdd(sequenceStr, ['\\Deleted'], { uid: true });
                }
            }
        } finally {
            lock.release();
        }

        await client.logout();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("IMAP Action Error:", error);
        return NextResponse.json({ error: "فشل تنفيذ العملية", details: error.message }, { status: 500 });
    }
}
