<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductDetailResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->orderByDesc('created_at')->paginate(15);
        return ProductDetailResource::collection($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'short_description_ar' => 'nullable|string',
            'short_description_en' => 'nullable|string',
            'packaging_sizes' => 'nullable|string',
            'is_exportable' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['name_en']);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('products', 'public');
        }

        if ($request->hasFile('pdf_datasheet')) {
            $validated['pdf_datasheet'] = $request->file('pdf_datasheet')->store('datasheets', 'public');
        }

        $product = Product::create($validated);

        return new ProductDetailResource($product->load(['category', 'specs', 'images']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name_ar' => 'sometimes|string|max:255',
            'name_en' => 'sometimes|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'short_description_ar' => 'nullable|string',
            'short_description_en' => 'nullable|string',
            'packaging_sizes' => 'nullable|string',
            'is_exportable' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('products', 'public');
        }

        if ($request->hasFile('pdf_datasheet')) {
            $validated['pdf_datasheet'] = $request->file('pdf_datasheet')->store('datasheets', 'public');
        }

        $product->update($validated);

        return new ProductDetailResource($product->fresh(['category', 'specs', 'images']));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted.']);
    }
}
