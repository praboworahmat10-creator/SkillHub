<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvailabilityController extends Controller
{
    /**
     * Get freelancer availability status.
     */
    public function get(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data' => [
                'availability_status' => $user->availability_status ?? 'AVAILABLE',
            ],
        ]);
    }

    /**
     * Update freelancer availability status.
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();

        $request->validate([
            'availability_status' => 'required|in:AVAILABLE,BUSY,NOT_AVAILABLE',
        ]);

        $user->update([
            'availability_status' => $request->input('availability_status'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status ketersediaan berhasil diperbarui.',
            'data' => [
                'availability_status' => $user->availability_status,
            ],
        ]);
    }
}
