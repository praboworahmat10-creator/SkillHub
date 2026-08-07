<?php

namespace App\Repositories\Eloquent;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;

class ServiceRepository implements ServiceRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 12)
    {
        $query = Service::with(['freelancer.profile', 'category', 'images'])
            ->where('status', 'active');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        $sortBy = $filters['sort'] ?? 'newest';
        match($sortBy) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular'    => $query->orderBy('sales_count', 'desc'),
            default      => $query->orderBy('created_at', 'desc'),
        };

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Service
    {
        return Service::with(['freelancer.profile', 'category', 'images', 'reviews.customer'])
            ->find($id);
    }

    public function findBySlug(string $slug): ?Service
    {
        return Service::with(['freelancer.profile', 'category', 'images', 'reviews.customer'])
            ->where('slug', $slug)
            ->first();
    }

    public function create(array $data): Service
    {
        return Service::create($data);
    }

    public function update(int $id, array $data): Service
    {
        $service = Service::findOrFail($id);
        $service->update($data);
        return $service->fresh(['freelancer.profile', 'category', 'images']);
    }

    public function delete(int $id): bool
    {
        return Service::findOrFail($id)->delete();
    }

    public function getFeatured(int $limit = 6)
    {
        return Service::with(['freelancer.profile', 'category', 'images'])
            ->where('status', 'active')
            ->orderBy('sales_count', 'desc')
            ->take($limit)
            ->get();
    }

    public function getByFreelancer(int $freelancerId)
    {
        return Service::with(['category', 'images'])
            ->where('freelancer_id', $freelancerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
