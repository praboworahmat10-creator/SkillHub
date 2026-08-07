<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(private ServiceService $serviceService) {}

    public function index(Request $request): JsonResponse
    {
        $services = $this->serviceService->list($request->only([
            'search', 'category_id', 'min_price', 'max_price', 'sort'
        ]));

        return response()->json([
            'success' => true,
            'data'    => $services,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $service = $this->serviceService->show($slug);

        return response()->json([
            'success' => true,
            'data'    => $service,
        ]);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = $this->serviceService->store(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil dibuat.',
            'data'    => $service,
        ], 201);
    }

    public function update(UpdateServiceRequest $request, int $id): JsonResponse
    {
        $service = $this->serviceService->update(
            $id,
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil diperbarui.',
            'data'    => $service,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->serviceService->destroy($id, $request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil dihapus.',
        ]);
    }

    public function myServices(Request $request): JsonResponse
    {
        $services = $this->serviceService->getByFreelancer($request->user()->id);

        return response()->json([
            'success' => true,
            'data'    => $services,
        ]);
    }
}
