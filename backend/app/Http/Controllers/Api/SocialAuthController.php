<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    protected array $allowedProviders = ['google', 'github'];

    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(string $provider)
    {
        if (!in_array($provider, $this->allowedProviders)) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5174') . '/freelancer?error=invalid_provider');
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle the OAuth provider callback.
     */
    public function callback(string $provider)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5174');

        if (!in_array($provider, $this->allowedProviders)) {
            return redirect("$frontendUrl/auth/social/callback?error=invalid_provider");
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return redirect("$frontendUrl/auth/social/callback?error=oauth_failed&message=" . urlencode($e->getMessage()));
        }

        DB::beginTransaction();
        try {
            // Find or create user by email
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // Get freelancer role
                $role = Role::where('name', 'freelancer')->first();

                $user = User::create([
                    'name'              => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email'             => $socialUser->getEmail(),
                    'phone'             => '',
                    'password'          => bcrypt(Str::random(32)),
                    'role_id'           => $role?->id,
                    'avatar'            => $socialUser->getAvatar(),
                    'provider'          => $provider,
                    'provider_id'       => $socialUser->getId(),
                    'email_verified_at' => now(), // Social login = email sudah terverifikasi
                ]);
            } else {
                // Update provider info if missing
                if (!$user->provider) {
                    $user->update([
                        'provider'    => $provider,
                        'provider_id' => $socialUser->getId(),
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                }
            }

            DB::commit();

            // Create Sanctum token
            $token = $user->createToken('social-auth-token')->plainTextToken;

            // Build user payload for frontend
            $userPayload = urlencode(json_encode([
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'avatar' => $user->avatar,
                'role'   => $user->role?->name ?? 'freelancer',
            ]));

            return redirect("$frontendUrl/auth/social/callback?token={$token}&user={$userPayload}&provider={$provider}");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect("$frontendUrl/auth/social/callback?error=server_error&message=" . urlencode($e->getMessage()));
        }
    }
}
