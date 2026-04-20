const { PrismaClient } = require('@prisma/client');
const { ImapFlow } = require('imapflow');
const prisma = new PrismaClient();

async function run() {
  const settings = await prisma.siteSettings.findFirst();
  const client = new ImapFlow({
    host: settings.imapHost,
    port: settings.imapPort,
    secure: settings.imapPort === 993 || settings.imapSecure === 'ssl' || settings.imapSecure === 'tls',
    auth: { user: settings.imapUser, pass: settings.imapPass },
    logger: false,
  });
  await client.connect();
  const list = await client.list();
  console.log(list.map((b) => ({ name: b.name, path: b.path, specialUse: b.specialUse })));
  await client.logout();
}

run().catch(console.error);
