<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSpec;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSettings();
        $this->seedCategories();
    }

    private function seedSettings(): void
    {
        $settings = [
            ['key' => 'site_name_ar', 'value' => 'مصنع السلام لعصر واستخلاص الزيوت النباتية', 'group' => 'general'],
            ['key' => 'site_name_en', 'value' => 'Elsalam Vegetable Oils', 'group' => 'general'],
            ['key' => 'founded_year', 'value' => '2002', 'group' => 'about'],
            ['key' => 'daily_capacity', 'value' => '500', 'group' => 'stats'],
            ['key' => 'export_countries', 'value' => '15', 'group' => 'stats'],
            ['key' => 'production_lines', 'value' => '8', 'group' => 'stats'],
            ['key' => 'phone', 'value' => '+20 123 456 7890', 'group' => 'contact'],
            ['key' => 'email', 'value' => 'info@elsalamoils.com', 'group' => 'contact'],
            ['key' => 'address_ar', 'value' => 'المنطقة الصناعية، المنوفية، مصر', 'group' => 'contact'],
            ['key' => 'address_en', 'value' => 'Industrial Zone, Menofia, Egypt', 'group' => 'contact'],
            ['key' => 'whatsapp', 'value' => '+201234567890', 'group' => 'contact'],
            ['key' => 'facebook', 'value' => 'https://facebook.com/elsalamoils', 'group' => 'social'],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }
    }

    private function seedCategories(): void
    {
        $categories = [
            [
                'name_ar' => 'زيوت نباتية', 'name_en' => 'Vegetable Oils', 'slug' => 'oils',
                'description_ar' => 'تشكيلة كاملة من الزيوت النباتية المكررة عالية الجودة.',
                'description_en' => 'Premium refined vegetable oils for industrial and consumer use.',
                'products' => [
                    ['name_ar' => 'زيت صويا مكرر', 'name_en' => 'Refined Soybean Oil', 'slug' => 'soybean-oil', 'short_description_ar' => 'زيت صويا نقي عالي الجودة للاستخدامات الصناعية والغذائية.', 'is_exportable' => true, 'is_featured' => true, 'packaging_sizes' => '1L, 5L, 18L, 200L'],
                    ['name_ar' => 'زيت عباد الشمس', 'name_en' => 'Sunflower Oil', 'slug' => 'sunflower-oil', 'short_description_ar' => 'زيت خفيف وصحي غني بفيتامين E وأوميجا 6.', 'is_exportable' => true, 'is_featured' => true, 'packaging_sizes' => '1L, 5L, 18L, 200L'],
                    ['name_ar' => 'زيت نخيل مكرر', 'name_en' => 'Refined Palm Oil', 'slug' => 'palm-oil', 'short_description_ar' => 'زيت نخيل RBD متعدد الاستخدامات.', 'is_exportable' => true, 'is_featured' => false, 'packaging_sizes' => '18L, 200L, Flexitank'],
                ],
            ],
            [
                'name_ar' => 'سمن نباتي', 'name_en' => 'Margarine', 'slug' => 'margarine',
                'description_ar' => 'سمن نباتي ممتاز للاستخدامات المنزلية والصناعية.',
                'description_en' => 'Premium margarine for household and industrial applications.',
                'products' => [
                    ['name_ar' => 'سمن نباتي ممتاز', 'name_en' => 'Premium Margarine', 'slug' => 'premium-margarine', 'short_description_ar' => 'سمن نباتي بقوام مثالي للطهي.', 'is_exportable' => false, 'is_featured' => true, 'packaging_sizes' => '500g, 1kg, 2kg, 15kg'],
                    ['name_ar' => 'سمن صناعي للمخابز', 'name_en' => 'Industrial Margarine', 'slug' => 'industrial-margarine', 'short_description_ar' => 'سمن مخصص للمخابز والحلويات.', 'is_exportable' => true, 'is_featured' => false, 'packaging_sizes' => '15kg, 25kg'],
                ],
            ],
            [
                'name_ar' => 'شورتنج', 'name_en' => 'Shortening', 'slug' => 'shortening',
                'description_ar' => 'شورتنج متخصص للمخابز والصناعات الغذائية.',
                'description_en' => 'Specialized shortening for bakeries and food industries.',
                'products' => [
                    ['name_ar' => 'شورتنج المخابز', 'name_en' => 'Bakery Shortening', 'slug' => 'bakery-shortening', 'short_description_ar' => 'شورتنج متخصص للمعجنات والحلويات.', 'is_exportable' => true, 'is_featured' => true, 'packaging_sizes' => '15kg, 25kg'],
                ],
            ],
            [
                'name_ar' => 'دهون صناعية', 'name_en' => 'Industrial Fats', 'slug' => 'industrial-fats',
                'description_ar' => 'دهون مخصصة للاستخدامات الصناعية.',
                'description_en' => 'Specialized fats for industrial applications.',
                'products' => [],
            ],
            [
                'name_ar' => 'زيوت طبية', 'name_en' => 'Medical Oils', 'slug' => 'medical-oils',
                'description_ar' => 'زيوت مخصصة للاستخدامات الطبية والصيدلانية.',
                'description_en' => 'Oils for medical and pharmaceutical applications.',
                'products' => [],
            ],
        ];

        foreach ($categories as $catData) {
            $products = $catData['products'];
            unset($catData['products']);
            $category = Category::updateOrCreate(['slug' => $catData['slug']], $catData);

            foreach ($products as $i => $productData) {
                $productData['category_id'] = $category->id;
                $productData['sort_order'] = $i;
                $productData['is_active'] = true;
                $product = Product::updateOrCreate(['slug' => $productData['slug']], $productData);

                // Add sample specs
                $product->specs()->delete();
                $product->specs()->createMany([
                    ['label_ar' => 'درجة الحموضة', 'label_en' => 'Acidity', 'value_ar' => '≤ 0.1%', 'value_en' => '≤ 0.1%', 'sort_order' => 0],
                    ['label_ar' => 'نقطة الدخان', 'label_en' => 'Smoke Point', 'value_ar' => '230°C', 'value_en' => '230°C', 'sort_order' => 1],
                    ['label_ar' => 'اللون', 'label_en' => 'Color', 'value_ar' => 'أصفر فاتح شفاف', 'value_en' => 'Light yellow, clear', 'sort_order' => 2],
                    ['label_ar' => 'العمر الافتراضي', 'label_en' => 'Shelf Life', 'value_ar' => '18 شهر', 'value_en' => '18 months', 'sort_order' => 3],
                ]);
            }
        }
    }
}
