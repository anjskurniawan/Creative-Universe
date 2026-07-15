<?php

use App\Http\Controllers\Api\Generator\Pricetag\CategoryController;
use App\Http\Controllers\Api\Generator\Pricetag\GenerationController;
use App\Http\Controllers\Api\Generator\Pricetag\ImportController;
use App\Http\Controllers\Api\Generator\Pricetag\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'app:generator'])->prefix('generator/pricetag')->group(function () {
    Route::middleware('can:access-pricetag')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{product}', [ProductController::class, 'show']);
        Route::post('/generations/single', [GenerationController::class, 'single']);
        Route::post('/generations/checklist', [GenerationController::class, 'checklist']);
        Route::post('/generations/csv', [GenerationController::class, 'csv']);
        Route::get('/batches', [GenerationController::class, 'index']);
        Route::get('/batches/{batch}', [GenerationController::class, 'show']);
        Route::get('/batches/{batch}/download', [GenerationController::class, 'downloadZip']);
    });

    Route::middleware('can:pricetag.manage')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::patch('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::patch('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::post('/imports/products', [ImportController::class, 'products']);
    });
});
