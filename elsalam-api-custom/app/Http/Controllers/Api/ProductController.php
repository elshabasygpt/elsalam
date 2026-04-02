<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products?category={slug}&exportable=1
     */
    public function index(Request $request)
    {
        $query = Product::active()->with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->boolean('exportable')) {
            $query->where('is_exportable', true);
        }

        return ProductResource::collection($query->paginate(12));
    }

    /**
     * GET /api/products/featured
     */
    public function featured()
    {
        $products = Product::featured()->with('category')->limit(4)->get();
        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{slug}
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category', 'specs', 'images'])
            ->firstOrFail();

        return new ProductDetailResource($product);
    }
}
