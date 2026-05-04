# Elsalam Oils - B2B Enterprise Platform 🏭

**Bilingual (English & Arabic) Next.js 14 E-commerce & CMS Platform for Vegetable Oils Export.**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

---

## 🌍 Overview (نظرة عامة)

**[English]** 
Elsalam Oils Platform is a state-of-the-art B2B web application engineered for high availability, security, and performance. Built to handle international export requests, quotation workflows, and dynamic CMS management with enterprise-grade safeguards.

**[العربية]**
منصة مصنع السلام للزيوت هي تطبيق ويب B2B متطور مصمم لتحمل الضغط العالي وتوفير أقصى درجات الأمان والأداء. تم بناء المنصة للتعامل مع طلبات التصدير الدولية، دورات عروض الأسعار (RFQ)، ونظام إدارة محتوى ديناميكي بمعايير المؤسسات الكبرى.

---

## 🏗️ Technical Architecture (المعمارية التقنية)

- **Framework:** Next.js 14 (App Router) - Utilizing Server Components & Server Actions.
- **Database:** PostgreSQL with Prisma ORM (Serverless Connection Pooling Ready).
- **State Management:** Zustand (Persisted & Hydration Mismatch Safe).
- **Styling:** Tailwind CSS (High-Density B2B UI, Accessibility Compliant).
- **Authentication:** NextAuth.js (JWT-based Edge Auth).
- **Security:** In-memory Rate Limiting, OWASP Headers, Strict RBAC Middleware.

---

## ⭐ Exclusive Enterprise Features (الميزات الحصرية)

### 1. Edge Security & WAF (حماية متقدمة على الحافة)
- **Edge Middleware:** A robust firewall that validates JWT tokens before requests even hit the Node.js server.
- **DDoS/Spam Protection:** In-memory Rate Limiting protecting Contact and Export inquiry APIs.
- **Strict RBAC:** Role-Based Access Control ensuring only users with the `ADMIN` role can access dashboard routes.

### 2. B2B Quotation Engine (نظام عروض الأسعار للشركات)
- **Draft to RFQ:** Replaces traditional B2C checkouts. Users build high-volume carts and submit them as Requests for Quotation (RFQ).
- **Admin Discounts & Control:** Admins can review RFQs, apply custom volume discounts, add private notes, and approve/reject orders securely using atomic `prisma.$transaction`.
- **High-Density Data Grid:** Excel-like table interfaces (QuickOrderTable) allowing merchants to order dozens of products in seconds.

### 3. Bulletproof CMS Versioning (نظام إصدارات المحتوى ضد الأخطاء)
- **Snapshot Archiving:** Every page content update automatically archives the previous state in the database.
- **1-Click Rollback:** Admins can instantly revert to older content versions safely without data corruption.
- **Storage Optimization:** Auto-pruning of old historical versions to prevent database bloat over time.

### 4. Technical SEO & Observability (محركات البحث والمراقبة)
- **Dynamic XML Sitemap:** Auto-generates based on real-time DB products, categories, and news articles.
- **JSON-LD Schema:** Injects Google Rich Snippets automatically for products to increase Click-Through Rates (CTR).
- **SRE Ready:** Implements a Global Error Boundary UI and APM placeholder (Sentry via `instrumentation.ts`) for proactive disaster detection.

---

## 💻 Local Setup (التشغيل المحلي)

**[English]**
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your PostgreSQL URL and NEXTAUTH_SECRET.
3. Sync the database schema and generate the Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

**[العربية]**
1. قم بتثبيت المكتبات الخاصة بالمشروع:
   `npm install`
2. انسخ ملف البيئة `.env.example` إلى `.env` وضع روابط قاعدة البيانات (PostgreSQL) الخاصة بك.
3. قم ببناء الجداول في قاعدة البيانات وتوليد مكتبة Prisma:
   `npx prisma db push` 
   ثم
   `npx prisma generate`
4. شغل سيرفر التطوير محلياً عبر أمر:
   `npm run dev`

---

## 🚀 Deployment Commands (أوامر الرفع للإنتاج)

When deploying to Vercel, AWS Amplify, or Docker, ensure you use the following command in the **Build Settings** to guarantee database synchronization and type safety before compilation:

**Build Command:**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

**⚠️ Critical Vercel Environment Variables:**
- `DATABASE_URL`: Must include `?pgbouncer=true&connection_limit=1` to prevent connection exhaustion under heavy load.
- `DIRECT_URL`: Clean DB URL for `migrate deploy` without pgbouncer.
- `NEXT_PUBLIC_SITE_URL`: Required for accurate absolute URLs in the XML sitemap (e.g., `https://elsalamoils.com`).

---
*Developed with ❤️ using Next.js App Router & Prisma.*
