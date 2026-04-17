import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Starting Comprehensive Seed (seed-data.ts) ---')

  // 1. Admin User
  const hashedPassword = await hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@elsalam.com' },
    update: {},
    create: {
      email: 'admin@elsalam.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user ready')

  // 2. Categories
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
  console.log('Categories ready')

  // 3. Products (Mapping all 8 from write_seed.js)
  const productsData = [
    {
      categoryId: catOils.id,
      name_ar: 'زيت صويا مكرر',
      name_en: 'Refined Soybean Oil',
      slug: 'refined-soybean-oil',
      short_description_ar: 'زيت صويا نقي',
      short_description_en: 'Pure soybean oil',
      long_description_ar: 'زيت الصويا المكرر من إنتاج مصنع السلام',
      long_description_en: 'Elsalam refined soybean oil',
      price: 85,
      price_unit_ar: 'لتر',
      price_unit_en: 'Liter',
      icon: 'droplets',
      gradient_from: 'from-green-700',
      gradient_to: 'to-emerald-900',
      is_exportable: true,
      is_featured: true,
      features: [
        { feature_ar: 'خالي من الكوليسترول', feature_en: 'Cholesterol Free' },
        { feature_ar: 'مناسب للقلي العميق', feature_en: 'Deep Frying' },
        { feature_ar: 'معتمد دولياً', feature_en: 'Certified' },
        { feature_ar: 'نقطة دخان عالية', feature_en: 'High Smoke Point' }
      ]
    },
    {
      categoryId: catOils.id,
      name_ar: 'زيت عباد الشمس',
      name_en: 'Sunflower Oil',
      slug: 'sunflower-oil',
      short_description_ar: 'زيت خفيف صحي',
      short_description_en: 'Light healthy oil',
      long_description_ar: 'زيت عباد الشمس يتميز بخفته',
      long_description_en: 'Elsalam sunflower oil',
      price: 92,
      price_unit_ar: 'لتر',
      price_unit_en: 'Liter',
      icon: 'droplets',
      gradient_from: 'from-amber-600',
      gradient_to: 'to-amber-900',
      is_exportable: true,
      is_featured: true,
      features: [
        { feature_ar: 'غني بفيتامين E', feature_en: 'Rich in Vitamin E' },
        { feature_ar: 'لون ذهبي شفاف', feature_en: 'Golden Color' }
      ]
    },
    {
      categoryId: catGhee.id,
      name_ar: 'سمن نباتي ممتاز',
      name_en: 'Premium Vegetable Ghee',
      slug: 'premium-vegetable-ghee',
      short_description_ar: 'سمن نباتي بقوام مثالي',
      short_description_en: 'Premium vegetable ghee',
      long_description_ar: 'السمن النباتي الممتاز يتميز بقوامه الكريمي',
      long_description_en: 'Premium Vegetable Ghee',
      price: 120,
      price_unit_ar: 'كجم',
      price_unit_en: 'KG',
      icon: 'cakeslice',
      gradient_from: 'from-yellow-700',
      gradient_to: 'to-yellow-950',
      is_featured: true,
      features: [
        { feature_ar: 'نكهة غنية', feature_en: 'Rich Flavor' },
        { feature_ar: 'قوام كريمي', feature_en: 'Creamy Texture' }
      ]
    },
    {
      categoryId: catShort.id,
      name_ar: 'شورتنج المخابز',
      name_en: 'Bakery Shortening',
      slug: 'bakery-shortening',
      short_description_ar: 'شورتنج للحلويات',
      short_description_en: 'Shortening for pastries',
      long_description_ar: 'شورتنج المخابز عالي الجودة لجميع أنواع المعجنات',
      long_description_en: 'High-quality bakery shortening for all pastries',
      price: 110,
      price_unit_ar: 'كجم',
      price_unit_en: 'KG',
      icon: 'flame',
      gradient_from: 'from-orange-700',
      gradient_to: 'to-red-900',
      is_exportable: true,
      is_featured: true,
      features: [
        { feature_ar: 'مثالي للفطائر', feature_en: 'Ideal for Pies' },
        { feature_ar: 'ثبات حراري', feature_en: 'Thermal Stability' }
      ]
    }
  ]

  for (const product of productsData) {
    const { features, ...rest } = product
    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        features: {
          create: features
        }
      }
    })
  }
  console.log('Products ready')

  // 4. Promotions
  await prisma.promotion.create({
    data: {
      productId: (await prisma.product.findUnique({ where: { slug: 'refined-soybean-oil' } }))?.id,
      title_ar: 'عرض رمضان — خصم 15%',
      title_en: 'Ramadan Special — 15% Off',
      discount_type: 'percentage',
      discount_value: 15,
      original_price: 85,
      promo_price: 72.25,
      badge_ar: 'خصم 15%',
      badge_en: '15% OFF',
      ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
  })
  console.log('Promotions ready')

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
