<?php

namespace App\Services;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;

class LandingService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository,
        private ServiceRepositoryInterface  $serviceRepository,
        private UserRepositoryInterface     $userRepository
    ) {}

    public function getHomepageData(): array
    {
        return [
            'featured_services'  => $this->serviceRepository->getFeatured(6),
            'categories'         => $this->categoryRepository->all(),
            'top_freelancers'    => $this->userRepository->getTopFreelancers(4),
            'stats'              => $this->getStats(),
        ];
    }

    private function getStats(): array
    {
        return [
            'total_services'     => \App\Models\Service::where('status', 'active')->count(),
            'total_freelancers'  => \App\Models\User::whereHas('role', fn($q) => $q->where('name', 'freelancer'))->count(),
            'total_orders'       => \App\Models\Order::where('status', 'completed')->count(),
            'total_categories'   => \App\Models\Category::count(),
        ];
    }
}
