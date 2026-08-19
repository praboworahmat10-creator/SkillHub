<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    /**
     * Get freelancer wallet & earnings overview.
     */
    public function show(Request $request): JsonResponse
    {
        $user = Auth::user();
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], [
            'balance' => 8500000,
            'pending_balance' => 1500000,
        ]);

        // Sample transaction history
        $transactions = [
            [
                'id' => 1,
                'type' => 'payout',
                'description' => 'Penarikan Dana ke BCA (8820xxxx)',
                'amount' => 3000000,
                'status' => 'completed',
                'date' => now()->subDays(2)->format('Y-m-d H:i'),
            ],
            [
                'id' => 2,
                'type' => 'income',
                'description' => 'Pembayaran Proyek React + Laravel (#ORD-8821)',
                'amount' => 3500000,
                'status' => 'completed',
                'date' => now()->subDays(5)->format('Y-m-d H:i'),
            ],
            [
                'id' => 3,
                'type' => 'income',
                'description' => 'Pembayaran Desain Figma Mobile App (#ORD-7712)',
                'amount' => 1800000,
                'status' => 'completed',
                'date' => now()->subDays(10)->format('Y-m-d H:i'),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'balance'         => $wallet->balance ?? 8500000,
                'pending_balance' => $wallet->pending_balance ?? 1500000,
                'total_earnings'  => ($wallet->balance ?? 8500000) + 4800000,
                'this_month'      => 5300000,
                'last_month'      => 4500000,
                'transactions'    => $transactions,
            ],
        ]);
    }

    /**
     * Submit withdrawal request (Strictly requires VERIFIED status & sufficient balance).
     */
    public function withdraw(Request $request): JsonResponse
    {
        $user = Auth::user();

        // 1. Strict Verification Check
        $verification = $user->identityVerification;
        $isVerified = $user->is_verified && $verification && $verification->status === 'VERIFIED';

        if (!$isVerified) {
            return response()->json([
                'success' => false,
                'message' => 'Penarikan dana hanya dapat dilakukan oleh freelancer yang telah terverifikasi resmi.',
            ], 403);
        }

        // 2. Validate request
        $validated = $request->validate([
            'bank_name'      => 'required|string',
            'account_number' => 'required|string|min:5',
            'account_name'   => 'required|string|min:3',
            'amount'         => 'required|numeric|min:50000',
        ]);

        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);

        if ($wallet->balance < $validated['amount']) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo dompet tidak mencukupi untuk melakukan penarikan ini.',
            ], 422);
        }

        // Process withdrawal (deduct balance)
        DB::transaction(function () use ($wallet, $validated) {
            $wallet->balance -= $validated['amount'];
            $wallet->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'Permohonan penarikan dana sebesar Rp ' . number_format($validated['amount'], 0, ',', '.') . ' berhasil dikirim.',
            'data' => [
                'new_balance' => $wallet->balance,
            ]
        ]);
    }
}
