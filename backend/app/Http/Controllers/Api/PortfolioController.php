<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PortfolioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $portfolios = Portfolio::where('freelancer_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $portfolios,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_url' => 'nullable|url',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'image_url'   => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi portofolio gagal.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $imagePath = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('portfolios', 'public');
            $imagePath = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $portfolio = Portfolio::create([
            'freelancer_id' => $user->id,
            'title'         => $request->title,
            'description'   => $request->description,
            'project_url'   => $request->project_url,
            'image_path'    => $imagePath ?: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Portofolio berhasil ditambahkan.',
            'data'    => $portfolio,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $portfolio = Portfolio::where('freelancer_id', $user->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'project_url' => 'nullable|url',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'image_url'   => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi perubahan portofolio gagal.',
                'errors'  => $validator->errors()
            ], 422);
        }

        if ($request->hasFile('image')) {
            if ($portfolio->image_path && str_contains($portfolio->image_path, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $portfolio->image_path));
            }
            $path = $request->file('image')->store('portfolios', 'public');
            $portfolio->image_path = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $portfolio->image_path = $request->image_url;
        }

        if ($request->has('title')) $portfolio->title = $request->title;
        if ($request->has('description')) $portfolio->description = $request->description;
        if ($request->has('project_url')) $portfolio->project_url = $request->project_url;

        $portfolio->save();

        return response()->json([
            'success' => true,
            'message' => 'Portofolio berhasil diperbarui.',
            'data'    => $portfolio,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $portfolio = Portfolio::where('freelancer_id', $user->id)->findOrFail($id);

        if ($portfolio->image_path && str_contains($portfolio->image_path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $portfolio->image_path));
        }

        $portfolio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portofolio berhasil dihapus.',
        ]);
    }
}
