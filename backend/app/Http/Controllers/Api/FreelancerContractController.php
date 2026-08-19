<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FreelancerContractController extends Controller
{
    /**
     * List contracts for authenticated freelancer.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Contract::where('freelancer_id', $user->id)->with(['clientJob', 'client', 'proposal']);

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $contracts = $query->latest('created_at')->get();

        return response()->json([
            'success' => true,
            'data'    => $contracts,
        ]);
    }

    /**
     * View contract detail (Ownership Validated).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $contract = Contract::with(['clientJob', 'client', 'proposal'])->findOrFail($id);

        if ($contract->freelancer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke kontrak ini.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $contract,
        ]);
    }
}
