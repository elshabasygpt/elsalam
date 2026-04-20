import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

async function test() {
  console.log('1. Updating Settings to Ethereal SMTP...');
  const settings = await prisma.siteSettings.findFirst();
  await prisma.siteSettings.update({
    where: { id: settings?.id || 'default' },
    data: {
      smtpHost: 'smtp.ethereal.email',
      smtpPort: 587,
      smtpUser: 'ziokdd3zjdimjm7d@ethereal.email',
      smtpPass: 'zXnwS1FhaYHdtZTkJ2',
      smtpSecure: 'tls',
      smtpFrom: 'ziokdd3zjdimjm7d@ethereal.email',
      smtpFromName: 'Elsalam Factory System'
    }
  });

  console.log('\n2. Emulating Client Submit (New Message from UI)...');
  const newMsg = await prisma.message.create({
    data: {
      name: 'Ahmed Customer',
      email: 'ahmed@test.com',
      phone: '+201010101010',
      company: 'Food Traders LLC',
      subject: 'B2B Quote Request',
      body: 'We need 40 tons of Soybean oil.',
      type: 'quote',
      status: 'new'
    }
  });
  console.log('✅ Message saved in DB. ID:', newMsg.id);

  console.log('\n2.5 Sending Notification email to Admin (like in POST API)...');
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', port: 587, secure: false,
    auth: { user: 'ziokdd3zjdimjm7d@ethereal.email', pass: 'zXnwS1FhaYHdtZTkJ2' }
  });
  const notifyInfo = await transporter.sendMail({
    from: '"Elsalam Factory" <ziokdd3zjdimjm7d@ethereal.email>',
    to: 'admin@elsalam.com',
    subject: `New Request from ${newMsg.name}`,
    text: `Details: ${newMsg.body}`
  });
  console.log('🔔 Admin Notification Sent! Preview URL:', nodemailer.getTestMessageUrl(notifyInfo));

  console.log('\n3. Emulating Admin Reply (From Inbox)...');
  const replyText = 'Hello Ahmed, our quote is $40,000.';
  await prisma.message.update({
    where: { id: newMsg.id },
    data: { reply: replyText, status: 'replied', repliedAt: new Date() }
  });
  const replyInfo = await transporter.sendMail({
    from: '"Elsalam Factory" <ziokdd3zjdimjm7d@ethereal.email>',
    to: newMsg.email,
    subject: `رد: ${newMsg.subject}`,
    html: `<p>${replyText}</p>`
  });
  console.log('💌 Admin Reply Sent fully! Preview URL:', nodemailer.getTestMessageUrl(replyInfo));
}
test()
