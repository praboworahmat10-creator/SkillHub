<?php

namespace App\Services;

use App\Models\Role;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !password_verify($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user->load(['role', 'profile']),
            'token' => $token,
        ];
    }

    public function registerCustomer(array $data): array
    {
        $customerRole = Role::where('name', 'customer')->firstOrFail();

        $user = DB::transaction(function () use ($data, $customerRole) {
            $user = $this->userRepository->create([
                'role_id'  => $customerRole->id,
                'name'     => $data['name'],
                'email'    => $data['email'],
                'phone'    => $data['phone'] ?? null,
                'password' => $data['password'],
            ]);

            // Create wallet
            $user->wallet()->create(['balance' => 0]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user->load(['role', 'profile']),
            'token' => $token,
        ];
    }

    public function registerFreelancer(array $data): array
    {
        $freelancerRole = Role::where('name', 'freelancer')->firstOrFail();

        $user = DB::transaction(function () use ($data, $freelancerRole) {
            $user = $this->userRepository->create([
                'role_id'  => $freelancerRole->id,
                'name'     => $data['name'],
                'email'    => $data['email'],
                'phone'    => $data['phone'] ?? null,
                'password' => $data['password'],
            ]);

            // Create profile
            $user->profile()->create([
                'bio'           => $data['bio'] ?? null,
                'skills'        => $data['skills'] ?? null,
                'location'      => $data['location'] ?? $data['city'] ?? 'Indonesia',
                'hourly_rate'   => $data['hourly_rate'] ?? 0,
            ]);

            // Create wallet
            $user->wallet()->create(['balance' => 0]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user->load(['role', 'profile']),
            'token' => $token,
        ];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}
