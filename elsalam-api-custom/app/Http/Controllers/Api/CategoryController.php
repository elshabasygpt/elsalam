<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     */
    public function index()
    {
        $categories = Category::active()->withCount('products')->get();
        return CategoryResource::collection($categories);
    }

    /**
     * GET /api/categories/{slug}
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with('products')
            ->withCount('products')
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
