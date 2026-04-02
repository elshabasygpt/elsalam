const fs = require("fs");
const path = require("path");

const base = "d:/mohamed projects/elsalam website/elsalam-api";

const files = {
    "app/Http/Resources/PromotionResource.php": `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PromotionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'original_price' => $this->original_price,
            'promo_price' => $this->promo_price,
            'badge_ar' => $this->badge_ar,
            'badge_en' => $this->badge_en,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'starts_at' => $this->starts_at?->toISOString(),
            'ends_at' => $this->ends_at?->toISOString(),
            'product' => $this->whenLoaded('product', fn() => [
                'slug' => $this->product->slug,
                'name_ar' => $this->product->name_ar,
                'name_en' => $this->product->name_en,
            ]),
        ];
    }
}
`,

    "app/Http/Resources/NewsResource.php": `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'excerpt_ar' => $this->excerpt_ar,
            'excerpt_en' => $this->excerpt_en,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'category' => $this->category,
            'is_featured' => $this->is_featured,
            'media_type' => $this->media_type,
            'published_at' => $this->published_at?->toISOString(),
            'reading_time' => $this->reading_time,
        ];
    }
}
`,

    "app/Http/Resources/NewsDetailResource.php": `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class NewsDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'content_ar' => $this->content_ar,
            'content_en' => $this->content_en,
            'excerpt_ar' => $this->excerpt_ar,
            'excerpt_en' => $this->excerpt_en,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'youtube_url' => $this->youtube_url,
            'category' => $this->category,
            'is_featured' => $this->is_featured,
            'media_type' => $this->media_type,
            'published_at' => $this->published_at?->toISOString(),
            'reading_time' => $this->reading_time,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
        ];
    }
}
`,
};

Object.entries(files).forEach(([relPath, content]) => {
    const fullPath = path.join(base, relPath);
    fs.writeFileSync(fullPath, content, "utf8");
    const size = fs.statSync(fullPath).size;
    console.log(`Written: ${relPath} (${size} bytes)`);
});
