<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;

class OrderRepository implements OrderRepositoryInterface
{
    public function paginate(int $userId, string $role, int $perPage = 10)
    {
        $query = Order::with(['service.images', 'customer', 'freelancer'])
            ->orderBy('created_at', 'desc');

        if ($role === 'customer') {
            $query->where('customer_id', $userId);
        } else {
            $query->where('freelancer_id', $userId);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id)
    {
        return Order::with(['service.images', 'customer', 'freelancer', 'payment', 'review'])
            ->findOrFail($id);
    }

    public function findByCode(string $code)
    {
        return Order::with(['service', 'customer', 'freelancer', 'payment'])
            ->where('order_code', $code)
            ->firstOrFail();
    }

    public function create(array $data)
    {
        return Order::create($data);
    }

    public function updateStatus(int $id, string $status)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $status]);
        return $order->fresh();
    }
}
