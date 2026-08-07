<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LandingController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — SkillHub Marketplace
|--------------------------------------------------------------------------
*/

// ─── Public Routes ────────────────────────────────────────────────────────────

// Landing / Homepage
Route::get('/landing', [LandingController::class, 'index']);

// Auth
Route::prefix('auth')->group(function () {
    Route::post('/login',                [AuthController::class, 'login']);
    Route::post('/register-customer',    [AuthController::class, 'registerCustomer']);
    Route::post('/register-freelancer',  [AuthController::class, 'registerFreelancer']);
});

// Categories
Route::get('/categories',        [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Services (public browse)
Route::get('/services',          [ServiceController::class, 'index']);
Route::get('/services/{slug}',   [ServiceController::class, 'show']);

// Freelancer public profile
Route::get('/freelancers/{id}',  [ProfileController::class, 'freelancer']);
Route::get('sitemap', [SitemapController::class, 'index']);
// ─── Authenticated Routes ─────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me',     [AuthController::class, 'me']);
        Route::post('/logout',[AuthController::class, 'logout']);
    });

    // Profile
    Route::get('/profile',    [ProfileController::class, 'show']);
    Route::post('/profile',   [ProfileController::class, 'update']);   // POST for multipart/form-data

    // Services (CRUD for freelancers)
    Route::prefix('services')->group(function () {
        Route::get('/my',         [ServiceController::class, 'myServices']);
        Route::post('/',          [ServiceController::class, 'store']);
        Route::post('/{id}',      [ServiceController::class, 'update']);   // POST for file upload
        Route::delete('/{id}',    [ServiceController::class, 'destroy']);
    }); // end services group

    // Dashboard routes
    Route::get('/dashboard/client', [App\Http\Controllers\Api\ClientDashboardController::class, 'index']);
    Route::get('/dashboard/freelancer', [App\Http\Controllers\Api\FreelancerDashboardController::class, 'index']);
});

