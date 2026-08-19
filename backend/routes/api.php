<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LandingController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\KtpOcrController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\FreelancerDashboardController;
use App\Http\Controllers\Api\FreelancerJobController;
use App\Http\Controllers\Api\FreelancerProposalController;
use App\Http\Controllers\Api\FreelancerOrderController;
use App\Http\Controllers\Api\FreelancerContractController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Middleware\EnsureFreelancerVerified;
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

// Public Jobs / Jobboard
Route::get('/jobs',              [FreelancerJobController::class, 'index']);
Route::get('/jobs/{id}',         [FreelancerJobController::class, 'show']);

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

    // Verification & Onboarding Flow
    Route::prefix('verification')->group(function () {
        Route::get('/status',               [VerificationController::class, 'status']);
        Route::post('/email/resend',        [VerificationController::class, 'resendEmail']);
        Route::post('/email/verify',        [VerificationController::class, 'verifyEmail']);
        Route::post('/phone/send-otp',      [VerificationController::class, 'sendOtp']);
        Route::post('/phone/verify-otp',    [VerificationController::class, 'verifyOtp']);
        Route::post('/onboarding',          [VerificationController::class, 'submitOnboarding']);
        Route::post('/identity/submit',     [VerificationController::class, 'submitIdentity']);
        Route::post('/identity/resubmit',   [VerificationController::class, 'submitIdentity']);
        Route::post('/ktp/ocr',             [KtpOcrController::class, 'extract']);
    });

    // ─── Freelancer Workspace API Endpoints ────────────────────────────────────
    Route::prefix('freelancer')->group(function () {
        // Dashboard Home Aggregation
        Route::get('/dashboard',              [FreelancerDashboardController::class, 'index']);

        // Availability Status
        Route::get('/availability',           [AvailabilityController::class, 'get']);
        Route::post('/availability',          [AvailabilityController::class, 'update']);

        // Client Jobs Marketplace
        Route::get('/jobs',                   [FreelancerJobController::class, 'index']);
        Route::get('/jobs/{id}',              [FreelancerJobController::class, 'show']);

        // Proposals (Read operations)
        Route::get('/proposals',              [FreelancerProposalController::class, 'index']);
        Route::get('/proposals/{id}',         [FreelancerProposalController::class, 'show']);
        Route::post('/proposals/{id}/withdraw',[FreelancerProposalController::class, 'withdraw']);

        // Proposals Submit (Protected by Verification Gate)
        Route::middleware(EnsureFreelancerVerified::class)->group(function () {
            Route::post('/jobs/{id}/proposals', [FreelancerProposalController::class, 'store']);
            Route::post('/withdrawals',         [WalletController::class, 'withdraw']);
        });

        // Services / Gigs (Freelancer Management)
        Route::get('/services',               [ServiceController::class, 'myServices']);
        Route::post('/services',              [ServiceController::class, 'store']);
        Route::post('/services/{id}',         [ServiceController::class, 'update']);
        Route::delete('/services/{id}',       [ServiceController::class, 'destroy']);

        // Orders
        Route::get('/orders',                 [FreelancerOrderController::class, 'index']);
        Route::get('/orders/{id}',            [FreelancerOrderController::class, 'show']);
        Route::post('/orders/{id}/status',     [FreelancerOrderController::class, 'updateStatus']);

        // Contracts
        Route::get('/contracts',              [FreelancerContractController::class, 'index']);
        Route::get('/contracts/{id}',         [FreelancerContractController::class, 'show']);

        // Earnings & Wallet
        Route::get('/earnings',               [WalletController::class, 'show']);
        Route::get('/transactions',           [WalletController::class, 'show']);
    });

    // Legacy Dashboard Endpoints (for compatibility)
    Route::get('/dashboard/client',     [App\Http\Controllers\Api\ClientDashboardController::class, 'index']);
    Route::get('/dashboard/freelancer', [FreelancerDashboardController::class, 'index']);

    // Admin Verification Endpoints (Protected for admin role)
    Route::prefix('admin')->group(function () {
        Route::get('/verifications',                    [VerificationController::class, 'adminIndex']);
        Route::get('/verifications/{id}',               [VerificationController::class, 'adminShow']);
        Route::get('/verifications/document/{docId}',   [VerificationController::class, 'adminGetDocument']);
        Route::post('/verifications/{id}/approve',      [VerificationController::class, 'adminApprove']);
        Route::post('/verifications/{id}/reject',       [VerificationController::class, 'adminReject']);
        Route::post('/verifications/{id}/request-revision', [VerificationController::class, 'adminRequestRevision']);
    });
});
