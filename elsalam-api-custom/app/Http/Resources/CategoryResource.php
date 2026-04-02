<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'products_count' => $this->whenCounted('products'),
            'products' => ProductResource::collection($this->whenLoaded('products')),
        ];
    }
}
