<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use App\Models\ClientJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FreelancerProposalController extends Controller
{
    /**
     * List freelancer proposals with tab status filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Proposal::where('freelancer_id', $user->id)
            ->with(['clientJob.client']);

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $proposals = $query->latest('created_at')->get();

        return response()->json([
            'success' => true,
            'data'    => $proposals,
        ]);
    }

    /**
     * Submit proposal for a client job.
     */
    public function store(Request $request, int $jobId): JsonResponse
    {
        $user = Auth::user();

        // 1. Verify Job exists and is open
        $job = ClientJob::findOrFail($jobId);
        if ($job->status !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Pekerjaan ini sudah tidak menerima proposal.',
            ], 422);
        }

        // 2. Prevent duplicate proposals
        $existing = Proposal::where('client_job_id', $jobId)
            ->where('freelancer_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah mengirimkan proposal untuk pekerjaan ini.',
            ], 422);
        }

        // 3. Validation
        $validated = $request->validate([
            'cover_letter'     => 'required|string|min:20',
            'proposed_price'   => 'required|numeric|min:10000',
            'estimated_days'   => 'required|integer|min:1',
            'relevant_skills'  => 'nullable|array',
            'portfolio_ids'    => 'nullable|array',
            'additional_notes' => 'nullable|string',
        ]);

        $proposal = Proposal::create([
            'client_job_id'    => $jobId,
            'freelancer_id'    => $user->id,
            'cover_letter'     => $validated['cover_letter'],
            'proposed_price'   => $validated['proposed_price'],
            'estimated_days'   => $validated['estimated_days'],
            'relevant_skills'  => $validated['relevant_skills'] ?? [],
            'portfolio_ids'    => $validated['portfolio_ids'] ?? [],
            'additional_notes' => $validated['additional_notes'] ?? null,
            'status'           => 'sent',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Proposal berhasil dikirim.',
            'data'    => $proposal,
        ], 201);
    }

    /**
     * Display proposal details (Ownership Validated).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $proposal = Proposal::with(['clientJob.client', 'contract'])->findOrFail($id);

        // Ownership validation
        if ($proposal->freelancer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke proposal ini.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data'    => $proposal,
        ]);
    }

    /**
     * Withdraw a submitted proposal.
     */
    public function withdraw(Request $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $proposal = Proposal::findOrFail($id);

        // Ownership validation
        if ($proposal->freelancer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke proposal ini.',
            ], 403);
        }

        if (in_array($proposal->status, ['accepted', 'rejected', 'withdrawn'])) {
            return response()->json([
                'success' => false,
                'message' => 'Proposal dengan status ini tidak dapat ditarik kembali.',
            ], 422);
        }

        $proposal->update(['status' => 'withdrawn']);

        return response()->json([
            'success' => true,
            'message' => 'Proposal berhasil ditarik kembali.',
            'data'    => $proposal,
        ]);
    }
}
