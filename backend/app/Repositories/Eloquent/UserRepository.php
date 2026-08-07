<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::with(['role', 'profile', 'wallet'])->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::with('role')->where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function getTopFreelancers(int $limit = 6)
    {
        return User::whereHas('role', function ($q) {
            $q->where('name', 'freelancer');
        })
        ->with(['profile', 'portfolios', 'services.category'])
        ->take($limit)
        ->get();
    }
}

