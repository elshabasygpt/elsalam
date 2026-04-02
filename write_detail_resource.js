const fs = require("fs");
const path = require("path");

const base = "d:/mohamed projects/elsalam website/elsalam-api";

const detailResource = `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'short_description_ar' => $this->short_description_ar,
            'short_description_en' => $this->short_description_en,
            'long_description_ar' => $this->long_description_ar,
            'long_description_en' => $this->long_description_en,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'pdf_datasheet' => $this->pdf_datasheet ? asset('storage/' . $this->pdf_datasheet) : null,
            'price' => $this->price,
            'price_unit_ar' => $this->price_unit_ar,
            'price_unit_en' => $this->price_unit_en,
            'features_ar' => $this->features_ar,
            'features_en' => $this->features_en,
            'certifications' => $this->certifications,
            'icon' => $this->icon,
            'gradient_from' => $this->gradient_from,
            'gradient_to' => $this->gradient_to,
            'is_exportable' => $this->is_exportable,
            'is_featured' => $this->is_featured,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'specs' => $this->whenLoaded('specs', fn() =>
                $this->specs->map(fn($s) => [
                    'label_ar' => $s->label_ar,
                    'label_en' => $s->label_en,
                    'value_ar' => $s->value_ar,
                    'value_en' => $s->value_en,
                ])
            ),
            'images' => $this->whenLoaded('images', fn() =>
                $this->images->map(fn($img) => [
                    'url' => asset('storage/' . $img->image_path),
                    'alt_text' => $img->alt_text,
                ])
            ),
            'packagings' => $this->whenLoaded('packagings', fn() =>
                $this->packagings->map(fn($p) => [
                    'id' => $p->id,
                    'size_ar' => $p->size_ar,
                    'size_en' => $p->size_en,
                    'price' => $p->price,
                ])
            ),
            'promotions' => $this->whenLoaded('activePromotions', fn() =>
                $this->activePromotions->map(fn($p) => [
                    'id' => $p->id,
                    'title_ar' => $p->title_ar,
                    'title_en' => $p->title_en,
                    'badge_ar' => $p->badge_ar,
                    'badge_en' => $p->badge_en,
                    'discount_type' => $p->discount_type,
                    'discount_value' => $p->discount_value,
                    'original_price' => $p->original_price,
                    'promo_price' => $p->promo_price,
                    'ends_at' => $p->ends_at?->toISOString(),
                ])
            ),
        ];
    }
}
`;

const filePath = path.join(base, "app/Http/Resources/ProductDetailResource.php");
fs.writeFileSync(filePath, detailResource, "utf8");
const size = fs.statSync(filePath).size;
console.log("Written ProductDetailResource.php:", size, "bytes");
