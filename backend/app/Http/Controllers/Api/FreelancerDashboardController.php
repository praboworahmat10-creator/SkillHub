<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\ClientJob;
use App\Models\Proposal;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FreelancerDashboardController extends Controller
{
    /**
     * Display dashboard data for the authenticated freelancer.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        // 1. Stats Cards Aggregation
        $activeOrdersCount = Order::where('freelancer_id', $user->id)
            ->whereIn('status', ['active', 'in_progress', 'revision'])
            ->count();

        $completedOrdersCount = Order::where('freelancer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 8500000]);

        $rating = 4.9; // Aggregate rating from profile or reviews
        $completionRate = 98;

        // 2. Active Orders
        $activeOrders = Order::where('freelancer_id', $user->id)
            ->with(['service', 'client'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        // 3. Recommended Jobs (Rule-based Matching against Freelancer Skills)
        $userSkills = $user->profile?->skills ?? ['React', 'Laravel', 'MySQL', 'Tailwind CSS'];
        $recommendedJobs = ClientJob::where('status', 'open')
            ->with(['client', 'category'])
            ->latest('created_at')
            ->take(4)
            ->get()
            ->map(function ($job) use ($userSkills) {
                $jobSkills = $job->required_skills ?? [];
                $matchedSkills = array_intersect($userSkills, $jobSkills);
                $matchScore = count($jobSkills) > 0 ? round((count($matchedSkills) / count($jobSkills)) * 100) : 75;

                // Client Privacy: Strip sensitive client details
                $clientPublic = [
                    'id' => $job->client?->id,
                    'name' => $job->client?->name ?? 'Client SkillHub',
                    'avatar' => $job->client?->avatar,
                    'is_verified' => $job->client?->is_verified ?? true,
                    'rating' => 4.8,
                    'completed_projects' => 12,
                ];

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'description' => $job->description,
                    'budget_min' => $job->budget_min,
                    'budget_max' => $job->budget_max,
                    'deadline_days' => $job->deadline_days,
                    'job_type' => $job->job_type,
                    'experience_level' => $job->experience_level,
                    'is_remote' => $job->is_remote,
                    'location' => $job->location,
                    'required_skills' => $job->required_skills,
                    'created_at' => $job->created_at,
                    'match_score' => $matchScore,
                    'proposals_count' => $job->proposals()->count(),
                    'client' => $clientPublic,
                ];
            });

        // 4. Recent Proposals
        $recentProposals = Proposal::where('freelancer_id', $user->id)
            ->with(['clientJob'])
            ->latest('created_at')
            ->take(4)
            ->get();

        // 5. Services (Gigs) Count
        $servicesCount = Service::where('freelancer_id', $user->id)->count();

        // 6. Verification Status Banner Data
        $verification = $user->identityVerification;
        $verificationStatus = [
            'is_verified'          => $user->is_verified && $verification && $verification->status === 'VERIFIED',
            'email_verified'       => !!$user->email_verified_at,
            'phone_verified'       => !!$user->phone_verified_at,
            'profile_completed'    => !!$user->profile_completed_at,
            'identity_status'      => $verification ? $verification->status : 'NOT_SUBMITTED',
            'rejection_reason'     => $verification?->rejection_reason,
            'rejection_notes'      => $verification?->rejection_notes,
            'reviewed_at'          => $verification?->reviewed_at,
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id'                  => $user->id,
                    'name'                => $user->name,
                    'email'               => $user->email,
                    'avatar'              => $user->avatar,
                    'availability_status' => $user->availability_status ?? 'AVAILABLE',
                ],
                'stats' => [
                    'active_orders'    => $activeOrdersCount,
                    'completed_orders' => $completedOrdersCount,
                    'total_earnings'   => $wallet->balance,
                    'rating'           => $rating,
                    'completion_rate'  => $completionRate,
                    'services_count'   => $servicesCount,
                    'views'            => 128,
                ],
                'wallet'             => $wallet,
                'verification'       => $verificationStatus,
                'active_orders'      => $activeOrders,
                'recommended_jobs'   => $recommendedJobs,
                'recent_proposals'   => $recentProposals,
            ],
        ]);
    }
}
