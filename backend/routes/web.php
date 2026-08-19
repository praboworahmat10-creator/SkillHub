<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocialAuthController;

Route::get('/', function () {
    return response()->json(['message' => 'SkillHub API is running']);
});

// ─── OAuth Social Login Routes ─────────────────────────────────────────────
// These need to be in web.php so browser redirect/session works correctly
Route::prefix('api/auth/{provider}')->group(function () {
    Route::get('/redirect', [SocialAuthController::class, 'redirect'])
        ->name('social.redirect');
    Route::get('/callback', [SocialAuthController::class, 'callback'])
        ->name('social.callback');
});
