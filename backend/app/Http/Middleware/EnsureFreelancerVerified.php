<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFreelancerVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Check if freelancer identity is verified
        $verification = $user->identityVerification;
        $isVerified = $user->is_verified && $verification && $verification->status === 'VERIFIED';

        if (!$isVerified) {
            return response()->json([
                'success' => false,
                'message' => 'Akun freelancer harus terverifikasi untuk menggunakan fitur ini.',
                'verification_status' => $verification ? $verification->status : 'NOT_SUBMITTED'
            ], 403);
        }

        return $next($request);
    }
}
