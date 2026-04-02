<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\MessageController as AdminMessageController;

/* |-------------------------------------------------------------------------- | Public API Routes |-------------------------------------------------------------------------- */

Route::get('/categories', [CategoryController::class , 'index']);
Route::get('/categories/{slug}', [CategoryController::class , 'show']);

Route::get('/products', [ProductController::class , 'index']);
Route::get('/products/featured', [ProductController::class , 'featured']);
Route::get('/products/{slug}', [ProductController::class , 'show']);

Route::get('/pages/{slug}', [PageController::class , 'show']);
Route::get('/settings', [SettingController::class , 'index']);

Route::post('/messages', [MessageController::class , 'store']);

/* |-------------------------------------------------------------------------- | Admin API Routes (protected by auth middleware) |-------------------------------------------------------------------------- */

Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('products', AdminProductController::class);
    Route::get('/messages', [AdminMessageController::class , 'index']);
    Route::patch('/messages/{message}/read', [AdminMessageController::class , 'markRead']);
});
