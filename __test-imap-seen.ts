import { PrismaClient } from '@prisma/client';
import { ImapFlow } from 'imapflow';

const prisma = new PrismaClient();

async function test() {
    console.log("1. Fetching Settings...");
    const settings = await prisma.siteSettings.findFirst() as any;
    if (!settings) return console.log("Missing settings.");

    const host = settings.imapHost || settings.smtpHost;
    const port = settings.imapPort || 993;
    const secure = settings.imapSecure === "tls" || settings.imapSecure === "ssl" || port === 993;
    const user = settings.imapUser || settings.smtpUser;
    const pass = settings.imapPass || settings.smtpPass;

    console.log(`2. Connecting IMAP (Host: ${host}, User: ${user})...`);
    const client = new ImapFlow({ host, port, secure, auth: { user, pass }, logger: false });
    await client.connect();

    console.log("3. Locking INBOX...");
    const lock = await client.getMailboxLock('INBOX');

    try {
        const mailbox: any = client.mailbox;
        if (!mailbox || !mailbox.exists) { console.log('Empty mailbox.'); return; }
        
        console.log(`4. Total messages: ${mailbox.exists}. Fetching the last message UID & Flags...`);
        let lastMsgUid = null;
        let isSeen = false;
        
        for await (let msg of client.fetch(`${mailbox.exists}`, { uid: true, flags: true })) {
            lastMsgUid = msg.uid;
            isSeen = msg.flags ? msg.flags.has('\\Seen') : false;
            console.log(`=> UID: ${lastMsgUid}, Seen: ${isSeen}`);
        }

        if (lastMsgUid) {
            console.log(`5. Forcing \\Seen flag on UID: ${lastMsgUid} using exact API method (uid.toString())...`);
            try {
               await client.messageFlagsAdd(lastMsgUid.toString(), ['\\Seen'], { uid: true });
            } catch (e) {
               console.error("Failed to add flag:", e);
            }

            console.log(`6. Verifying again by fetching UID: ${lastMsgUid}...`);
            let verifiedSeen = false;
            for await (let msg of client.fetch(`${lastMsgUid}`, { uid: true, flags: true })) {
                if (msg.flags) verifiedSeen = msg.flags.has('\\Seen');
                console.log(`=> VERIFIED -> Seen: ${verifiedSeen}`);
            }
        }
    } finally {
        lock.release();
    }
    await client.logout();
    console.log("Done.");
}

test().catch(console.error);
