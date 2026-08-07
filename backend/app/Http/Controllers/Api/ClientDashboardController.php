<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ClientDashboardController extends Controller
{
    /**
     * Display dashboard data for the authenticated client.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        // Recent orders (last 5)
        $orders = Order::where('client_id', $user->id)
            ->latest('created_at')
            ->take(5)
            ->get();

        // Wallet balance (ensure wallet exists)
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);

        // Average rating from reviews (if any)
        $ratingAvg = $user->reviews()->avg('rating');

        return response()->json([
            'status' => 'success',
            'data' => [
                'orders' => $orders,
                'wallet' => $wallet,
                'rating_average' => $ratingAvg,
            ],
        ]);
    }
}
?>
