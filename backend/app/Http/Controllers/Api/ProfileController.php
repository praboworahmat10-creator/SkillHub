<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'profile', 'wallet', 'portfolios']);

        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'phone'  => 'sometimes|string|max:20',
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:2048',
            'bio'           => 'sometimes|string|max:1000',
            'skills'        => 'sometimes|string',
            'city'          => 'sometimes|string|max:100',
            'hourly_rate'   => 'sometimes|numeric|min:0',
            'website'       => 'sometimes|url|nullable',
            'linkedin'      => 'sometimes|url|nullable',
            'github'        => 'sometimes|url|nullable',
        ]);

        $user = $request->user();

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = Storage::url($path);
        }

        $user->update(array_intersect_key($validated, array_flip(['name', 'phone', 'avatar'])));

        // Update profile
        $profileData = array_intersect_key($validated, array_flip([
            'bio', 'skills', 'city', 'hourly_rate', 'website', 'linkedin', 'github'
        ]));

        if (!empty($profileData)) {
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data'    => $user->fresh(['role', 'profile', 'wallet']),
        ]);
    }

    public function freelancer(int $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);
        if (!$user || $user->role?->name !== 'freelancer') {
            abort(404, 'Freelancer tidak ditemukan.');
        }

        return response()->json([
            'success' => true,
            'data'    => $user->load(['profile', 'services.category', 'portfolios']),
        ]);
    }
}
