<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\Portfolio;
use App\Models\Chat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FreelancerDashboardController extends Controller
{
    /**
     * Display dashboard data for the authenticated freelancer.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        // Services offered by freelancer (last 5)
        $services = Service::where('freelancer_id', $user->id)
            ->latest('created_at')
            ->take(5)
            ->get();

        // Recent orders/bookings (last 5)
        $orders = Order::where('freelancer_id', $user->id)
            ->latest('created_at')
            ->take(5)
            ->get();

        // Wallet balance
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);

        // Portfolio items (last 3)
        $portfolios = Portfolio::where('freelancer_id', $user->id)
            ->latest('created_at')
            ->take(3)
            ->get();

        // Recent chats (last 5)
        $chats = Chat::where('freelancer_id', $user->id)
            ->latest('last_message_at')
            ->take(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'services' => $services,
                'orders' => $orders,
                'wallet' => $wallet,
                'portfolios' => $portfolios,
                'chats' => $chats,
            ],
        ]);
    }
}
?>
