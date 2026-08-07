<?php

namespace App\Services;

use App\Models\ServiceImage;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ServiceService
{
    public function __construct(
        private ServiceRepositoryInterface $serviceRepository
    ) {}

    public function list(array $filters): mixed
    {
        return $this->serviceRepository->paginate($filters);
    }

    public function show(string $slug): mixed
    {
        $service = $this->serviceRepository->findBySlug($slug);
        if (!$service) abort(404, 'Layanan tidak ditemukan.');
        return $service;
    }

    public function store(array $data, int $freelancerId): mixed
    {
        $data['freelancer_id'] = $freelancerId;
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);

        $images = $data['images'] ?? [];
        unset($data['images']);

        $service = $this->serviceRepository->create($data);

        foreach ($images as $image) {
            $path = $image->store('services', 'public');
            ServiceImage::create([
                'service_id' => $service->id,
                'image_url'  => Storage::url($path),
            ]);
        }

        return $service->load(['category', 'images']);
    }

    public function update(int $id, array $data, int $freelancerId): mixed
    {
        $service = $this->serviceRepository->findById($id);
        if (!$service || $service->freelancer_id !== $freelancerId) {
            abort(403, 'Tidak diizinkan.');
        }

        if (!empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }

        return $this->serviceRepository->update($id, $data);
    }

    public function destroy(int $id, int $freelancerId): void
    {
        $service = $this->serviceRepository->findById($id);
        if (!$service || $service->freelancer_id !== $freelancerId) {
            abort(403, 'Tidak diizinkan.');
        }
        $this->serviceRepository->delete($id);
    }

    public function getByFreelancer(int $freelancerId): mixed
    {
        return $this->serviceRepository->getByFreelancer($freelancerId);
    }
}
