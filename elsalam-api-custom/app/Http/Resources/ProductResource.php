<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'short_description_ar' => $this->short_description_ar,
            'short_description_en' => $this->short_description_en,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'is_exportable' => $this->is_exportable,
            'is_featured' => $this->is_featured,
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
