<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LandingService;
use Illuminate\Http\JsonResponse;

class LandingController extends Controller
{
    public function __construct(private LandingService $landingService) {}

    public function index(): JsonResponse
    {
        $data = $this->landingService->getHomepageData();

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
