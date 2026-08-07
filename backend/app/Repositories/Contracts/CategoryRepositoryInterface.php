<?php

namespace App\Repositories\Contracts;

interface CategoryRepositoryInterface
{
    public function all();
    public function findById(int $id);
    public function findBySlug(string $slug);
}
