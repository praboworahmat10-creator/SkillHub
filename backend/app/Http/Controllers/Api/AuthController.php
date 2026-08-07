<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterCustomerRequest;
use App\Http\Requests\Auth\RegisterFreelancerRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => $result,
        ]);
    }

    public function registerCustomer(RegisterCustomerRequest $request): JsonResponse
    {
        $result = $this->authService->registerCustomer($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil.',
            'data'    => $result,
        ], 201);
    }

    public function registerFreelancer(RegisterFreelancerRequest $request): JsonResponse
    {
        $result = $this->authService->registerFreelancer($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registrasi freelancer berhasil.',
            'data'    => $result,
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user()->load(['role', 'profile', 'wallet']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }
}
