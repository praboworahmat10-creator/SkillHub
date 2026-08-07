<?php

namespace App\Repositories\Contracts;

interface OrderRepositoryInterface
{
    public function paginate(int $userId, string $role, int $perPage = 10);
    public function findById(int $id);
    public function findByCode(string $code);
    public function create(array $data);
    public function updateStatus(int $id, string $status);
}
