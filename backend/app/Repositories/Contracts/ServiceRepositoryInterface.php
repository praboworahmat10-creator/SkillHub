<?php

namespace App\Repositories\Contracts;

use App\Models\Service;

interface ServiceRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 12);
    public function findById(int $id): ?Service;
    public function findBySlug(string $slug): ?Service;
    public function create(array $data): Service;
    public function update(int $id, array $data): Service;
    public function delete(int $id): bool;
    public function getFeatured(int $limit = 6);
    public function getByFreelancer(int $freelancerId);
}
