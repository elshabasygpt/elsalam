/**
 * migrate-to-postgres.mjs
 * ========================
 * يقرأ كل البيانات من SQLite (dev.db) ويكتبها في PostgreSQL
 * يُشغَّل مرة واحدة فقط بعد إنشاء جداول PostgreSQL بـ prisma migrate
 *
 * Usage:
 *   node prisma/migrate-to-postgres.mjs
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------- Load better-sqlite3 (for reading SQLite) ----------
let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  console.error('\n❌ قم بتثبيت better-sqlite3 أولاً:');
  console.error('   npm install --save-dev better-sqlite3');
  process.exit(1);
}

// ---------- Load Prisma Client (for writing to PostgreSQL) ----------
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sqlitePath = join(__dirname, 'dev.db');
const db = new Database(sqlitePath, { readonly: true });

// ─── Helper to safely parse dates from SQLite ───────────────────────────────
function toDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

// ─── Helper to run a step with logging ──────────────────────────────────────
async function step(label, fn) {
  process.stdout.write(`  ⏳ ${label}...`);
  try {
    const count = await fn();
    console.log(` ✅ ${count ?? ''}`);
  } catch (err) {
    console.log(` ❌`);
    console.error(`     ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log('\n🐘 بدء نقل البيانات من SQLite → PostgreSQL\n');

  // ── 1. Users ───────────────────────────────────────────────────────────────
  await step('Users', async () => {
    const rows = db.prepare('SELECT * FROM "User"').all();
    for (const r of rows) {
      await prisma.user.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          name: r.name,
          email: r.email,
          emailVerified: toDate(r.emailVerified),
          image: r.image,
          password: r.password,
          role: r.role || 'USER',
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    return rows.length;
  });

  // ── 2. SiteSettings ────────────────────────────────────────────────────────
  await step('SiteSettings', async () => {
    const rows = db.prepare('SELECT * FROM "SiteSettings"').all();
    for (const r of rows) {
      await prisma.siteSettings.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          siteNameAr: r.siteNameAr,
          siteNameEn: r.siteNameEn,
          siteDescriptionAr: r.siteDescriptionAr,
          siteDescriptionEn: r.siteDescriptionEn,
          contactEmail: r.contactEmail,
          contactPhone: r.contactPhone,
          addressAr: r.addressAr,
          addressEn: r.addressEn,
          facebookUrl: r.facebookUrl,
          twitterUrl: r.twitterUrl,
          instagramUrl: r.instagramUrl,
          linkedinUrl: r.linkedinUrl,
          smtpHost: r.smtpHost,
          smtpPort: r.smtpPort ? Number(r.smtpPort) : null,
          smtpUser: r.smtpUser,
          smtpPass: r.smtpPass,
          smtpFrom: r.smtpFrom,
          smtpFromName: r.smtpFromName,
          smtpSecure: r.smtpSecure,
          logoUrl: r.logoUrl,
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    return rows.length;
  });

  // ── 3. PageContent ─────────────────────────────────────────────────────────
  await step('PageContent', async () => {
    const rows = db.prepare('SELECT * FROM "PageContent"').all();
    for (const r of rows) {
      await prisma.pageContent.upsert({
        where: { pageSlug: r.pageSlug },
        update: { content: r.content },
        create: {
          id: r.id,
          pageSlug: r.pageSlug,
          content: r.content,
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    return rows.length;
  });

  // ── 4. Categories ──────────────────────────────────────────────────────────
  await step('Categories', async () => {
    const rows = db.prepare('SELECT * FROM "Category"').all();
    for (const r of rows) {
      await prisma.category.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          name_ar: r.name_ar,
          name_en: r.name_en,
          slug: r.slug,
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    // Fix PostgreSQL sequence after manual ID inserts
    if (rows.length > 0) {
      await prisma.$executeRawUnsafe(
        `SELECT setval('"Category_id_seq"', (SELECT MAX(id) FROM "Category"));`
      );
    }
    return rows.length;
  });

  // ── 5. Products ────────────────────────────────────────────────────────────
  await step('Products', async () => {
    const rows = db.prepare('SELECT * FROM "Product"').all();
    for (const r of rows) {
      await prisma.product.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          slug: r.slug,
          name_ar: r.name_ar,
          name_en: r.name_en,
          short_description_ar: r.short_description_ar,
          short_description_en: r.short_description_en,
          description_ar: r.description_ar,
          description_en: r.description_en,
          long_description_ar: r.long_description_ar,
          long_description_en: r.long_description_en,
          featured_image: r.featured_image,
          price: r.price ? Number(r.price) : null,
          price_unit_ar: r.price_unit_ar,
          price_unit_en: r.price_unit_en,
          is_exportable: Boolean(r.is_exportable),
          is_featured: Boolean(r.is_featured),
          icon: r.icon,
          gradient_from: r.gradient_from,
          gradient_to: r.gradient_to,
          categoryId: r.categoryId ? Number(r.categoryId) : null,
          activePromotionId: r.activePromotionId ? Number(r.activePromotionId) : null,
          pdf_datasheet: r.pdf_datasheet,
          meta_title: r.meta_title,
          meta_description: r.meta_description,
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    if (rows.length > 0) {
      await prisma.$executeRawUnsafe(
        `SELECT setval('"Product_id_seq"', (SELECT MAX(id) FROM "Product"));`
      );
    }
    return rows.length;
  });

  // ── 6. ProductFeatures ─────────────────────────────────────────────────────
  await step('ProductFeatures', async () => {
    const rows = db.prepare('SELECT * FROM "ProductFeature"').all();
    for (const r of rows) {
      await prisma.productFeature.upsert({
        where: { id: r.id },
        update: {},
        create: { id: r.id, productId: r.productId, feature_ar: r.feature_ar, feature_en: r.feature_en },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"ProductFeature_id_seq"', (SELECT MAX(id) FROM "ProductFeature"));`);
    return rows.length;
  });

  // ── 7. ProductCertifications ───────────────────────────────────────────────
  await step('ProductCertifications', async () => {
    const rows = db.prepare('SELECT * FROM "ProductCertification"').all();
    for (const r of rows) {
      await prisma.productCertification.upsert({
        where: { id: r.id },
        update: {},
        create: { id: r.id, productId: r.productId, name: r.name },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"ProductCertification_id_seq"', (SELECT MAX(id) FROM "ProductCertification"));`);
    return rows.length;
  });

  // ── 8. ProductSpecs ────────────────────────────────────────────────────────
  await step('ProductSpecs', async () => {
    const rows = db.prepare('SELECT * FROM "ProductSpec"').all();
    for (const r of rows) {
      await prisma.productSpec.upsert({
        where: { id: r.id },
        update: {},
        create: { id: r.id, productId: r.productId, label_ar: r.label_ar, label_en: r.label_en, value_ar: r.value_ar, value_en: r.value_en },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"ProductSpec_id_seq"', (SELECT MAX(id) FROM "ProductSpec"));`);
    return rows.length;
  });

  // ── 9. TechnicalSpecs ─────────────────────────────────────────────────────
  await step('TechnicalSpecs', async () => {
    const rows = db.prepare('SELECT * FROM "TechnicalSpec"').all();
    for (const r of rows) {
      await prisma.technicalSpec.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id, productId: r.productId,
          property_ar: r.property_ar, property_en: r.property_en,
          value_ar: r.value_ar, value_en: r.value_en,
          unit_ar: r.unit_ar, unit_en: r.unit_en,
        },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"TechnicalSpec_id_seq"', (SELECT MAX(id) FROM "TechnicalSpec"));`);
    return rows.length;
  });

  // ── 10. ProductImages ─────────────────────────────────────────────────────
  await step('ProductImages', async () => {
    const rows = db.prepare('SELECT * FROM "ProductImage"').all();
    for (const r of rows) {
      await prisma.productImage.upsert({
        where: { id: r.id },
        update: {},
        create: { id: r.id, productId: r.productId, url: r.url, alt_text: r.alt_text },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"ProductImage_id_seq"', (SELECT MAX(id) FROM "ProductImage"));`);
    return rows.length;
  });

  // ── 11. ProductPackagings ─────────────────────────────────────────────────
  await step('ProductPackagings', async () => {
    const rows = db.prepare('SELECT * FROM "ProductPackaging"').all();
    for (const r of rows) {
      await prisma.productPackaging.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id, productId: r.productId,
          size_ar: r.size_ar, size_en: r.size_en,
          price: r.price ? Number(r.price) : null,
        },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"ProductPackaging_id_seq"', (SELECT MAX(id) FROM "ProductPackaging"));`);
    return rows.length;
  });

  // ── 12. Promotions ────────────────────────────────────────────────────────
  await step('Promotions', async () => {
    const rows = db.prepare('SELECT * FROM "Promotion"').all();
    for (const r of rows) {
      await prisma.promotion.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          productId: r.productId ? Number(r.productId) : null,
          title_ar: r.title_ar,
          title_en: r.title_en,
          description_ar: r.description_ar,
          description_en: r.description_en,
          discount_type: r.discount_type,
          discount_value: Number(r.discount_value),
          original_price: r.original_price ? Number(r.original_price) : null,
          promo_price: r.promo_price ? Number(r.promo_price) : null,
          badge_ar: r.badge_ar,
          badge_en: r.badge_en,
          featured_image: r.featured_image,
          starts_at: toDate(r.starts_at),
          ends_at: toDate(r.ends_at) || new Date(),
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"Promotion_id_seq"', (SELECT MAX(id) FROM "Promotion"));`);
    return rows.length;
  });

  // ── 13. News ──────────────────────────────────────────────────────────────
  await step('News', async () => {
    const rows = db.prepare('SELECT * FROM "News"').all();
    for (const r of rows) {
      await prisma.news.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          slug: r.slug,
          title_ar: r.title_ar,
          title_en: r.title_en,
          excerpt_ar: r.excerpt_ar,
          excerpt_en: r.excerpt_en,
          content_ar: r.content_ar,
          content_en: r.content_en,
          category: r.category || 'news',
          tags: r.tags,
          featured_image: r.featured_image,
          image_alt: r.image_alt,
          meta_title: r.meta_title,
          meta_description: r.meta_description,
          is_featured: Boolean(r.is_featured),
          is_published: Boolean(r.is_published),
          published_at: toDate(r.published_at),
          scheduled_at: toDate(r.scheduled_at),
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"News_id_seq"', (SELECT MAX(id) FROM "News"));`);
    return rows.length;
  });

  // ── 14. Messages ──────────────────────────────────────────────────────────
  await step('Messages', async () => {
    const rows = db.prepare('SELECT * FROM "Message"').all();
    for (const r of rows) {
      await prisma.message.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          company: r.company,
          subject: r.subject,
          body: r.body,
          type: r.type || 'inquiry',
          status: r.status || 'new',
          priority: r.priority || 'normal',
          reply: r.reply,
          repliedAt: toDate(r.repliedAt),
          repliedBy: r.repliedBy,
          notes: r.notes,
          isStarred: Boolean(r.isStarred),
          createdAt: toDate(r.createdAt) || new Date(),
          updatedAt: toDate(r.updatedAt) || new Date(),
        },
      });
    }
    if (rows.length > 0) await prisma.$executeRawUnsafe(`SELECT setval('"Message_id_seq"', (SELECT MAX(id) FROM "Message"));`);
    return rows.length;
  });

  console.log('\n🎉 تم نقل جميع البيانات بنجاح إلى PostgreSQL!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ خطأ أثناء النقل:', e.message);
    process.exit(1);
  })
  .finally(() => {
    db.close();
    prisma.$disconnect();
  });
