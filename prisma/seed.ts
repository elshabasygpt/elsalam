import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Starting Seed ---')

  // 1. Admin User
  const password = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elsalam.com' },
    update: {},
    create: {
      email: 'admin@elsalam.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created/updated')

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteNameAr: 'مصنع السلام للزيوت النباتية',
      siteNameEn: 'Elsalam Vegetable Oils Factory',
      siteDescriptionAr: 'الريادة في إنتاج الزيوت النباتية والسمن النباتي منذ عام 2000',
      siteDescriptionEn: 'Leader in vegetable oil and ghee production since 2000',
      contactEmail: 'info@elsalamoils.com',
      contactPhone: '+201234567890',
      addressAr: 'العاشر من رمضان، المنطقة الصناعية',
      addressEn: '10th of Ramadan City, Industrial Zone',
      facebookUrl: 'https://facebook.com/elsalamoils',
      logoUrl: '/images/logo.png',
    },
  })
  console.log('Site settings created/updated')

  // 3. Categories
  const catOils = await prisma.category.upsert({
    where: { slug: 'oils' },
    update: {},
    create: {
      name_ar: 'زيوت نباتية',
      name_en: 'Vegetable Oils',
      slug: 'oils',
    },
  })

  const catGhee = await prisma.category.upsert({
    where: { slug: 'margarine' },
    update: {},
    create: {
      name_ar: 'سمن نباتي',
      name_en: 'Vegetable Ghee',
      slug: 'margarine',
    },
  })

  const catShort = await prisma.category.upsert({
    where: { slug: 'shortening' },
    update: {},
    create: {
      name_ar: 'شورتنج',
      name_en: 'Shortening',
      slug: 'shortening',
    },
  })
  console.log('Categories seeded')

  // 4. Products
  // Product 1: Soybean Oil
  const p1 = await prisma.product.upsert({
    where: { slug: 'refined-soybean-oil' },
    update: {},
    create: {
      name_ar: 'زيت صويا مكرر',
      name_en: 'Refined Soybean Oil',
      slug: 'refined-soybean-oil',
      short_description_ar: 'زيت صويا نقي وعالي الجودة',
      short_description_en: 'High-quality pure soybean oil',
      long_description_ar: 'زيت الصويا المكرر من إنتاج مصنع السلام يتميز بالنقاء العالي واللون الذهبي الشفاف، مثالي للطهي والقلي العميق.',
      long_description_en: 'Elsalam refined soybean oil is characterized by high purity and a clear golden color, ideal for cooking and deep frying.',
      price: 85,
      price_unit_ar: 'لتر',
      price_unit_en: 'Liter',
      is_exportable: true,
      is_featured: true,
      icon: 'droplets',
      gradient_from: 'from-green-700',
      gradient_to: 'to-emerald-900',
      categoryId: catOils.id,
      features: {
        create: [
          { feature_ar: 'خالي من الكوليسترول', feature_en: 'Cholesterol Free' },
          { feature_ar: 'مناسب للقلي العميق', feature_en: 'Deep Frying' },
          { feature_ar: 'معتمد دولياً', feature_en: 'Internationally Certified' },
        ],
      },
      certifications: {
        create: [
          { name: 'ISO 22000' },
          { name: 'HACCP' },
          { name: 'Halal' },
        ],
      },
      specs: {
        create: [
          { label_ar: 'نسبة الحموضة', label_en: 'Acidity', value_ar: '≤ 0.1%', value_en: '≤ 0.1%' },
          { label_ar: 'اللون', label_en: 'Color', value_ar: 'أصفر فاتح', value_en: 'Light Yellow' },
        ],
      },
      packagings: {
        create: [
          { size_ar: '1 لتر', size_en: '1 Liter', price: 85 },
          { size_ar: '5 لتر', size_en: '5 Liters', price: 380 },
          { size_ar: '18 لتر', size_en: '18 Liters', price: 1250 },
        ],
      },
      images: {
        create: [
          { url: '/images/products/soybean-oil.jpg', alt_text: 'Refined Soybean Oil Bottle' },
        ],
      },
    },
  })

  // Product 2: Premium Ghee
  const p2 = await prisma.product.upsert({
    where: { slug: 'premium-vegetable-ghee' },
    update: {},
    create: {
      name_ar: 'سمن نباتي ممتاز',
      name_en: 'Premium Vegetable Ghee',
      slug: 'premium-vegetable-ghee',
      short_description_ar: 'سمن نباتي بقوام كريمي ونكهة غنية',
      short_description_en: 'Vegetable ghee with creamy texture and rich flavor',
      long_description_ar: 'السمن النباتي الممتاز من السلام يوفر النكهة التقليدية الغنية مع فوائد الزيوت النباتية الصحية، مثالي لجميع أنواع الطبخ والحلويات الشرقية.',
      long_description_en: 'Premium Vegetable Ghee from Elsalam provides a rich traditional flavor with the benefits of healthy vegetable oils.',
      price: 120,
      price_unit_ar: 'كجم',
      price_unit_en: 'KG',
      is_featured: true,
      icon: 'cakeslice',
      gradient_from: 'from-yellow-700',
      gradient_to: 'to-yellow-950',
      categoryId: catGhee.id,
      features: {
        create: [
          { feature_ar: 'نكهة غنية', feature_en: 'Rich Flavor' },
          { feature_ar: 'ثبات حراري عالي', feature_en: 'High Stability' },
        ],
      },
      packagings: {
        create: [
          { size_ar: '1 كجم', size_en: '1 KG', price: 120 },
          { size_ar: '2 كجم', size_en: '2 KG', price: 230 },
        ],
      },
    },
  })

  console.log('Products seeded')

  // 5. News
  await prisma.news.upsert({
    where: { slug: 'new-production-line-2026' },
    update: {},
    create: {
      slug: 'new-production-line-2026',
      title_ar: 'افتتاح خط إنتاج جديد بطاقة استيعابية مضاعفة',
      title_en: 'Inauguration of a new production line with double capacity',
      excerpt_ar: 'احتفل مصنع السلام بافتتاح أحدث خطوطه للإنتاج لزيادة تلبية احتياجات السوق المحلي والدولي.',
      excerpt_en: 'Elsalam Factory celebrated the opening of its latest production line to meet local and international market needs.',
      content_ar: 'كجزء من خطتنا الاستراتيجية 2030، قمنا باستيراد أحدث المعدات العالمية لزيادة طاقتنا الإنتاجية...',
      content_en: 'As part of our 2030 strategic plan, we have imported the latest global equipment to increase our production capacity...',
      is_featured: true,
      is_published: true,
      published_at: new Date(),
    },
  })
  console.log('News seeded')

  console.log('--- Seed Complete ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
