<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FreelancerOrderController extends Controller
{
    /**
     * List orders for authenticated freelancer.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Order::where('freelancer_id', $user->id)->with(['service', 'client']);

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->latest('updated_at')->get();

        return response()->json([
            'success' => true,
            'data'    => $orders,
        ]);
    }

    /**
     * View order detail (Ownership Validated).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $order = Order::with(['service', 'client', 'payment'])->findOrFail($id);

        if ($order->freelancer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke pesanan ini.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $order,
        ]);
    }

    /**
     * Update order status (Accept, Start Work, Submit Work).
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);

        if ($order->freelancer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke pesanan ini.',
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:active,in_progress,submitted,completed',
            'notes'  => 'nullable|string',
        ]);

        $order->update(['status' => $request->input('status')]);

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui.',
            'data'    => $order,
        ]);
    }
}
