<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'pdf_datasheet' => $this->pdf_datasheet ? asset('storage/' . $this->pdf_datasheet) : null,
            'packaging_sizes' => $this->packaging_sizes,
            'is_exportable' => $this->is_exportable,
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
        ];
    }
}
