<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FreelancerJobController extends Controller
{
    /**
     * Browse / Search Client Jobs with pagination and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ClientJob::where('status', 'open')->with(['client', 'category']);

        // Search Keyword
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category Filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Budget Filter
        if ($request->filled('min_budget')) {
            $query->where('budget_min', '>=', $request->input('min_budget'));
        }
        if ($request->filled('max_budget')) {
            $query->where('budget_max', '<=', $request->input('max_budget'));
        }

        // Job Type Filter
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->input('job_type'));
        }

        // Experience Level
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->input('experience_level'));
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'budget_high':
                $query->orderBy('budget_max', 'desc');
                break;
            case 'budget_low':
                $query->orderBy('budget_min', 'asc');
                break;
            case 'deadline':
                $query->orderBy('deadline_days', 'asc');
                break;
            case 'latest':
            default:
                $query->latest('created_at');
                break;
        }

        $jobs = $query->paginate($request->input('per_page', 10));

        $userSkills = $request->user()?->profile?->skills ?? ['React', 'Laravel', 'MySQL'];

        // Format and enforce Client Privacy
        $formattedData = $jobs->through(function ($job) use ($userSkills) {
            $jobSkills = $job->required_skills ?? [];
            $matchedSkills = array_intersect($userSkills, $jobSkills);
            $matchScore = count($jobSkills) > 0 ? round((count($matchedSkills) / count($jobSkills)) * 100) : 75;

            return [
                'id'               => $job->id,
                'title'            => $job->title,
                'description'      => $job->description,
                'budget_min'       => $job->budget_min,
                'budget_max'       => $job->budget_max,
                'deadline_days'    => $job->deadline_days,
                'job_type'         => $job->job_type,
                'experience_level' => $job->experience_level,
                'is_remote'        => $job->is_remote,
                'location'         => $job->location,
                'required_skills'  => $job->required_skills,
                'created_at'       => $job->created_at,
                'match_score'      => $matchScore,
                'proposals_count'  => $job->proposals()->count(),
                'category'         => $job->category,
                // Client Public Profile ONLY
                'client' => [
                    'id'                 => $job->client?->id,
                    'name'               => $job->client?->name ?? 'Client SkillHub',
                    'avatar'             => $job->client?->avatar,
                    'is_verified'        => $job->client?->is_verified ?? true,
                    'rating'             => 4.8,
                    'completed_projects' => 12,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $formattedData,
        ]);
    }

    /**
     * Display Client Job detail.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $job = ClientJob::with(['client', 'category', 'proposals.freelancer.profile'])->findOrFail($id);
        $user = $request->user();
        $userSkills = $user?->profile?->skills ?? [];

        $jobSkills = $job->required_skills ?? [];
        $matchedSkills = array_intersect($userSkills, $jobSkills);
        $matchScore = count($jobSkills) > 0 ? round((count($matchedSkills) / count($jobSkills)) * 100) : 75;

        // Check if current freelancer already submitted proposal
        $hasSubmittedProposal = $user ? $job->proposals()->where('freelancer_id', $user->id)->exists() : false;

        $interestedProposals = $job->proposals->map(function ($prop) {
            return [
                'id'             => $prop->id,
                'cover_letter'   => $prop->cover_letter,
                'proposed_price' => $prop->proposed_price,
                'estimated_days' => $prop->estimated_days,
                'created_at'     => $prop->created_at,
                'freelancer'     => [
                    'id'       => $prop->freelancer?->id,
                    'name'     => $prop->freelancer?->name ?? 'Freelancer SkillHub',
                    'avatar'   => $prop->freelancer?->avatar,
                    'title'    => $prop->freelancer?->profile?->title ?? 'Professional Freelancer',
                    'rating'   => $prop->freelancer?->profile?->rating ?? 4.9,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'id'                     => $job->id,
                'title'                  => $job->title,
                'description'            => $job->description,
                'scope_of_work'          => $job->scope_of_work,
                'requirements'           => $job->requirements,
                'deliverables'           => $job->deliverables,
                'budget_min'             => $job->budget_min,
                'budget_max'             => $job->budget_max,
                'deadline_days'          => $job->deadline_days,
                'job_type'               => $job->job_type,
                'experience_level'       => $job->experience_level,
                'is_remote'              => $job->is_remote,
                'location'               => $job->location,
                'required_skills'        => $job->required_skills,
                'attachments'            => $job->attachments,
                'created_at'             => $job->created_at,
                'match_score'            => $matchScore,
                'proposals_count'        => $job->proposals()->count(),
                'has_submitted_proposal' => $hasSubmittedProposal,
                'interested_proposals'   => $interestedProposals,
                'category'               => $job->category,
                // Client Public Info ONLY (Privacy Protected)
                'client' => [
                    'id'                 => $job->client?->id,
                    'name'               => $job->client?->name ?? 'Client SkillHub',
                    'avatar'             => $job->client?->avatar,
                    'is_verified'        => $job->client?->is_verified ?? true,
                    'rating'             => 4.8,
                    'completed_projects' => 12,
                    'member_since'       => $job->client?->created_at?->format('Y-m-d'),
                ],
            ],
        ]);
    }
}
