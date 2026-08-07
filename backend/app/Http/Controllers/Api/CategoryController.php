<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categoryRepository->all();

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = \App\Models\Category::withCount('services')
            ->where('slug', $slug)
            ->first();

        if (!$category) {
            // Support lookup by name slug fallback
            $category = \App\Models\Category::withCount('services')->get()->first(function($c) use ($slug) {
                return \Illuminate\Support\Str::slug($c->name) === $slug;
            });
        }

        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Kategori tidak ditemukan'], 404);
        }

        $services = \App\Models\Service::with(['freelancer.profile', 'category', 'images'])
            ->where('category_id', $category->id)
            ->where('status', 'active')
            ->get();

        $freelancerIds = $services->pluck('freelancer_id')->unique();

        $freelancers = \App\Models\User::whereIn('id', $freelancerIds)
            ->with(['profile', 'portfolios'])
            ->get();

        $portfolios = \App\Models\Portfolio::whereIn('freelancer_id', $freelancerIds)
            ->with(['freelancer.profile'])
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'category'    => $category,
                'services'    => $services,
                'freelancers' => $freelancers,
                'portfolios'  => $portfolios,
            ],
        ]);
    }
}

