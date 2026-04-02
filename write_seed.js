// This Node.js script writes a minimal seed PHP file then runs it
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const apiDir = path.join(__dirname, "elsalam-api");

const seedPhp = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\\\\Contracts\\\\Console\\\\Kernel')->bootstrap();

use App\\Models\\Category;
use App\\Models\\Product;
use App\\Models\\ProductPackaging;
use App\\Models\\ProductSpec;
use App\\Models\\Promotion;

echo "Starting seed...\\n";

$oils = Category::create(['name_ar'=>'\\u{632}\\u{64a}\\u{648}\\u{62a} \\u{646}\\u{628}\\u{627}\\u{62a}\\u{64a}\\u{629}','name_en'=>'Vegetable Oils','slug'=>'oils','description_ar'=>'Oils AR','description_en'=>'Refined vegetable oils','sort_order'=>1]);
$marg = Category::create(['name_ar'=>'\\u{633}\\u{645}\\u{646} \\u{646}\\u{628}\\u{627}\\u{62a}\\u{64a}','name_en'=>'Vegetable Ghee','slug'=>'margarine','description_ar'=>'Ghee AR','description_en'=>'Vegetable ghee','sort_order'=>2]);
$short = Category::create(['name_ar'=>'\\u{634}\\u{648}\\u{631}\\u{62a}\\u{646}\\u{62c}','name_en'=>'Shortening','slug'=>'shortening','description_ar'=>'Short AR','description_en'=>'Industrial shortening','sort_order'=>3]);
echo "Categories done\\n";
`;

// Actually, let me just use a simpler approach with ASCII-only content
const seedContent = [
    '<?php',
    "require __DIR__ . '/vendor/autoload.php';",
    "$app = require_once __DIR__ . '/bootstrap/app.php';",
    "$app->make('Illuminate\\\\Contracts\\\\Console\\\\Kernel')->bootstrap();",
    '',
    'use App\\Models\\Category;',
    'use App\\Models\\Product;',
    'use App\\Models\\ProductPackaging;',
    'use App\\Models\\ProductSpec;',
    'use App\\Models\\Promotion;',
    '',
    'echo "Starting seed...\\n";',
    '',
    "// Categories",
    "$oils = Category::create(['name_ar' => json_decode('\"\\\\u0632\\\\u064a\\\\u0648\\\\u062a \\\\u0646\\\\u0628\\\\u0627\\\\u062a\\\\u064a\\\\u0629\"'), 'name_en' => 'Vegetable Oils', 'slug' => 'oils', 'description_ar' => 'AR', 'description_en' => 'Refined vegetable oils', 'sort_order' => 1]);",
].join('\n');

// This approach is getting too complex. Let me just write valid PHP directly.
// The key insight: use Buffer.from with utf8 encoding to write the file

const phpCode = Buffer.from(`<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\\\\Contracts\\\\Console\\\\Kernel')->bootstrap();
use App\\Models\\Category;
use App\\Models\\Product;
use App\\Models\\ProductPackaging;
use App\\Models\\ProductSpec;
use App\\Models\\Promotion;

echo "=== SEED START ===\\n";

$oils = Category::create(['name_ar' => 'زيوت نباتية', 'name_en' => 'Vegetable Oils', 'slug' => 'oils', 'description_ar' => 'مجموعة من الزيوت', 'description_en' => 'Refined vegetable oils', 'sort_order' => 1]);
$marg = Category::create(['name_ar' => 'سمن نباتي', 'name_en' => 'Vegetable Ghee', 'slug' => 'margarine', 'description_ar' => 'سمن نباتي بجودة عالية', 'description_en' => 'Vegetable ghee', 'sort_order' => 2]);
$short = Category::create(['name_ar' => 'شورتنج', 'name_en' => 'Shortening', 'slug' => 'shortening', 'description_ar' => 'شورتنج صناعي', 'description_en' => 'Industrial shortening', 'sort_order' => 3]);
echo "Categories: " . Category::count() . "\\n";

$p1 = Product::create(['category_id'=>$oils->id,'name_ar'=>'زيت صويا مكرر','name_en'=>'Refined Soybean Oil','slug'=>'refined-soybean-oil','short_description_ar'=>'زيت صويا نقي','short_description_en'=>'Pure soybean oil','long_description_ar'=>'زيت الصويا المكرر من إنتاج مصنع السلام','long_description_en'=>'Elsalam refined soybean oil','price'=>85,'price_unit_ar'=>'لتر','price_unit_en'=>'Liter','features_ar'=>json_encode(['خالي من الكوليسترول','مناسب للقلي العميق','معتمد دولياً','نقطة دخان عالية']),'features_en'=>json_encode(['Cholesterol Free','Deep Frying','Certified','High Smoke Point']),'certifications'=>json_encode(['ISO 9001','ISO 22000','HACCP','Halal']),'icon'=>'droplets','gradient_from'=>'from-green-700','gradient_to'=>'to-emerald-900','is_exportable'=>true,'is_featured'=>true,'sort_order'=>1]);

$p2 = Product::create(['category_id'=>$oils->id,'name_ar'=>'زيت عباد الشمس','name_en'=>'Sunflower Oil','slug'=>'sunflower-oil','short_description_ar'=>'زيت خفيف صحي','short_description_en'=>'Light healthy oil','long_description_ar'=>'زيت عباد الشمس يتميز بخفته','long_description_en'=>'Elsalam sunflower oil','price'=>92,'price_unit_ar'=>'لتر','price_unit_en'=>'Liter','features_ar'=>json_encode(['غني بفيتامين E','لون ذهبي شفاف']),'features_en'=>json_encode(['Rich in Vitamin E','Golden Color','Trans Fat Free']),'certifications'=>json_encode(['ISO 9001','ISO 22000','HACCP','Halal']),'icon'=>'droplets','gradient_from'=>'from-amber-600','gradient_to'=>'to-amber-900','is_exportable'=>true,'is_featured'=>true,'sort_order'=>2]);

$p3 = Product::create(['category_id'=>$oils->id,'name_ar'=>'زيت نخيل مكرر','name_en'=>'Refined Palm Oil','slug'=>'refined-palm-oil','short_description_ar'=>'زيت نخيل RBD','short_description_en'=>'RBD palm oil','long_description_ar'=>'زيت النخيل المكرر','long_description_en'=>'Refined palm oil','price'=>72,'price_unit_ar'=>'لتر','price_unit_en'=>'Liter','features_ar'=>json_encode(['ثبات حراري عالي','متعدد الاستخدامات']),'features_en'=>json_encode(['High Thermal Stability','Versatile']),'certifications'=>json_encode(['ISO 9001','HACCP','Halal']),'icon'=>'droplets','gradient_from'=>'from-orange-700','gradient_to'=>'to-orange-950','is_exportable'=>true,'sort_order'=>3]);

$p4 = Product::create(['category_id'=>$oils->id,'name_ar'=>'زيت خلطات مخصصة','name_en'=>'Custom Oil Blends','slug'=>'custom-oil-blends','short_description_ar'=>'خلطات زيوت مخصصة','short_description_en'=>'Custom oil blends','long_description_ar'=>'نقدم خلطات زيوت مخصصة','long_description_en'=>'Custom oil blends','features_ar'=>json_encode(['تصنيع حسب الطلب','مواصفات مخصصة']),'features_en'=>json_encode(['Made to Order','Custom Specs']),'certifications'=>json_encode(['ISO 9001','HACCP']),'icon'=>'droplets','gradient_from'=>'from-teal-700','gradient_to'=>'to-teal-950','sort_order'=>4]);

$p5 = Product::create(['category_id'=>$marg->id,'name_ar'=>'سمن نباتي ممتاز','name_en'=>'Premium Vegetable Ghee','slug'=>'premium-vegetable-ghee','short_description_ar'=>'سمن نباتي بقوام مثالي','short_description_en'=>'Premium vegetable ghee','long_description_ar'=>'السمن النباتي الممتاز يتميز بقوامه الكريمي','long_description_en'=>'Premium Vegetable Ghee','price'=>120,'price_unit_ar'=>'كجم','price_unit_en'=>'KG','features_ar'=>json_encode(['نكهة غنية','ثبات عالي','قوام كريمي','مثالي للحلويات']),'features_en'=>json_encode(['Rich Flavor','High Stability','Creamy Texture','Ideal for Sweets']),'certifications'=>json_encode(['ISO 9001','HACCP','Halal']),'icon'=>'cakeslice','gradient_from'=>'from-yellow-700','gradient_to'=>'to-yellow-950','is_featured'=>true,'sort_order'=>5]);

$p6 = Product::create(['category_id'=>$marg->id,'name_ar'=>'سمن نباتي صناعي','name_en'=>'Industrial Margarine','slug'=>'industrial-margarine','short_description_ar'=>'سمن مخصص للمخابز','short_description_en'=>'Margarine for bakeries','long_description_ar'=>'سمن نباتي صناعي للمخابز','long_description_en'=>'Industrial margarine','price'=>95,'price_unit_ar'=>'كجم','price_unit_en'=>'KG','features_ar'=>json_encode(['نقطة ذوبان مضبوطة','سهل التشكيل']),'features_en'=>json_encode(['Controlled Melting Point','Easy to Shape']),'certifications'=>json_encode(['ISO 9001','ISO 22000','HACCP','Halal']),'icon'=>'cakeslice','gradient_from'=>'from-amber-700','gradient_to'=>'to-amber-950','is_exportable'=>true,'sort_order'=>6]);

$p7 = Product::create(['category_id'=>$short->id,'name_ar'=>'شورتنج المخابز','name_en'=>'Bakery Shortening','slug'=>'bakery-shortening','short_description_ar'=>'شورتنج للحلويات','short_description_en'=>'Shortening for pastries','long_description_ar'=>'شورتنج المخابز','long_description_en'=>'Bakery Shortening','price'=>110,'price_unit_ar'=>'كجم','price_unit_en'=>'KG','features_ar'=>json_encode(['مثالي للفطائر','ثبات حراري','هشاشة استثنائية']),'features_en'=>json_encode(['Ideal for Pies','Thermal Stability','Flakiness']),'certifications'=>json_encode(['ISO 9001','HACCP','Halal']),'icon'=>'flame','gradient_from'=>'from-orange-700','gradient_to'=>'to-red-900','is_exportable'=>true,'is_featured'=>true,'sort_order'=>7]);

$p8 = Product::create(['category_id'=>$short->id,'name_ar'=>'شورتنج القلي العميق','name_en'=>'Deep Frying Shortening','slug'=>'deep-frying-shortening','short_description_ar'=>'شورتنج مقاوم للحرارة','short_description_en'=>'Heat-resistant shortening','long_description_ar'=>'شورتنج القلي العميق','long_description_en'=>'Deep Frying Shortening','price'=>98,'price_unit_ar'=>'كجم','price_unit_en'=>'KG','features_ar'=>json_encode(['مقاوم للحرارة','عمر افتراضي طويل']),'features_en'=>json_encode(['Heat Resistant','Long Shelf Life']),'certifications'=>json_encode(['ISO 9001','HACCP','Halal']),'icon'=>'flame','gradient_from'=>'from-red-700','gradient_to'=>'to-red-950','is_exportable'=>true,'sort_order'=>8]);

echo "Products: " . Product::count() . "\\n";

// Packagings
foreach([
    [$p1->id,'1 لتر','1 Liter',85],[$p1->id,'2 لتر','2 Liters',160],[$p1->id,'5 لتر','5 Liters',380],[$p1->id,'18 لتر','18 Liters',1250],[$p1->id,'برميل 200 لتر','200L Barrel',12500],
    [$p2->id,'1 لتر','1 Liter',92],[$p2->id,'2 لتر','2 Liters',175],[$p2->id,'5 لتر','5 Liters',420],
    [$p3->id,'18 لتر','18 Liters',1100],[$p3->id,'برميل 200 لتر','200L Barrel',11000],
    [$p5->id,'500 جم','500g',65],[$p5->id,'1 كجم','1 KG',120],[$p5->id,'2 كجم','2 KG',230],[$p5->id,'4 كجم','4 KG',440],[$p5->id,'16 كجم','16 KG',1700],
    [$p6->id,'1 كجم','1 KG',95],[$p6->id,'5 كجم','5 KG',450],[$p6->id,'25 كجم','25 KG',2100],
    [$p7->id,'1 كجم','1 KG',110],[$p7->id,'5 كجم','5 KG',520],[$p7->id,'15 كجم','15 KG',1500],
    [$p8->id,'5 كجم','5 KG',470],[$p8->id,'15 كجم','15 KG',1350],
] as $i => $pk) {
    ProductPackaging::create(['product_id'=>$pk[0],'size_ar'=>$pk[1],'size_en'=>$pk[2],'price'=>$pk[3],'sort_order'=>$i]);
}
echo "Packagings: " . ProductPackaging::count() . "\\n";

// Specs
foreach([
    [$p1->id,'نسبة الحموضة','Acidity','≤ 0.1%','≤ 0.1%'],[$p1->id,'اللون','Color','أصفر فاتح','Light Yellow'],[$p1->id,'نقطة الدخان','Smoke Point','230°C','230°C'],[$p1->id,'العمر الافتراضي','Shelf Life','18 شهر','18 Months'],
    [$p2->id,'نسبة الحموضة','Acidity','≤ 0.1%','≤ 0.1%'],[$p2->id,'نقطة الدخان','Smoke Point','225°C','225°C'],
    [$p3->id,'نقطة الدخان','Smoke Point','235°C','235°C'],
    [$p5->id,'نسبة الحموضة','Acidity','≤ 0.2%','≤ 0.2%'],[$p5->id,'نقطة الدخان','Smoke Point','210°C','210°C'],
    [$p7->id,'اللون','Color','أبيض كريمي','Creamy White'],
    [$p8->id,'نقطة الدخان','Smoke Point','240°C','240°C'],
] as $i => $sp) {
    ProductSpec::create(['product_id'=>$sp[0],'label_ar'=>$sp[1],'label_en'=>$sp[2],'value_ar'=>$sp[3],'value_en'=>$sp[4],'sort_order'=>$i]);
}
echo "Specs: " . ProductSpec::count() . "\\n";

// Promotions
Promotion::create(['product_id'=>$p1->id,'title_ar'=>'عرض رمضان — خصم 15%','title_en'=>'Ramadan Special — 15% Off Soybean Oil','description_ar'=>'خصم 15% على جميع عبوات زيت الصويا المكرر','description_en'=>'15% off all Refined Soybean Oil packages','discount_type'=>'percentage','discount_value'=>15,'original_price'=>85,'promo_price'=>72.25,'badge_ar'=>'خصم 15%','badge_en'=>'15% OFF','starts_at'=>now()->subDays(5),'ends_at'=>now()->addDays(25),'is_active'=>true,'sort_order'=>1]);
Promotion::create(['product_id'=>$p5->id,'title_ar'=>'اشتري 10 واحصل على 1 مجاناً','title_en'=>'Buy 10 Get 1 Free','description_ar'=>'عرض خاص على السمن النباتي','description_en'=>'Buy 10 cartons get 1 free','discount_type'=>'bundle','discount_value'=>0,'original_price'=>120,'promo_price'=>109,'badge_ar'=>'10+1 مجاناً','badge_en'=>'Buy 10 Get 1','starts_at'=>now()->subDays(2),'ends_at'=>now()->addDays(30),'is_active'=>true,'sort_order'=>2]);
Promotion::create(['product_id'=>null,'title_ar'=>'شحن مجاني فوق 5000 جنيه','title_en'=>'Free Shipping Above 5000 EGP','description_ar'=>'شحن مجاني على الطلبات فوق 5000 جنيه','description_en'=>'Free shipping on orders above 5000 EGP','discount_type'=>'fixed','discount_value'=>0,'badge_ar'=>'شحن مجاني','badge_en'=>'Free Shipping','starts_at'=>now()->subDays(10),'ends_at'=>now()->addDays(20),'is_active'=>true,'sort_order'=>3]);
echo "Promotions: " . Promotion::count() . "\\n";

echo "=== SEED COMPLETE ===\\n";
`, 'utf8');

const seedPath = path.join(apiDir, "do_seed.php");
fs.writeFileSync(seedPath, phpCode);
console.log("Written seed file:", seedPath, "Size:", phpCode.length, "bytes");

// Verify first bytes
const written = fs.readFileSync(seedPath);
console.log("First 5 bytes:", written[0], written[1], written[2], written[3], written[4]);
console.log("First chars:", written.toString('utf8', 0, 10));
