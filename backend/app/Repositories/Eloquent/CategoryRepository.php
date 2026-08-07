<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function all()
    {
        return Category::withCount('services')->orderBy('name')->get();
    }

    public function findById(int $id)
    {
        return Category::withCount('services')->findOrFail($id);
    }

    public function findBySlug(string $slug)
    {
        return Category::withCount('services')->where('slug', $slug)->firstOrFail();
    }
}
