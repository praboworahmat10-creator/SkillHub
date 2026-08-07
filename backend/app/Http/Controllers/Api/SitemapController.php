<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index(): JsonResponse
    {
        $base = url('/');
        $urls = [];

        // Static pages
        $static = [
            '/' => ['freq' => 'daily', 'prio' => '1.0'],
            '/explore' => ['freq' => 'daily', 'prio' => '0.9'],
            '/login' => ['freq' => 'monthly', 'prio' => '0.5'],
            '/register-customer' => ['freq' => 'monthly', 'prio' => '0.6'],
            '/register-freelancer' => ['freq' => 'monthly', 'prio' => '0.6'],
        ];
        foreach ($static as $path => $opt) {
            $urls[] = [
                'loc' => $base . $path,
                'lastmod' => Carbon::now()->toDateString(),
                'changefreq' => $opt['freq'],
                'priority' => $opt['prio'],
            ];
        }

        // Categories
        Category::all()->each(function ($c) use (&$urls, $base) {
            $urls[] = [
                'loc' => $base . "/explore?cat={$c->slug}",
                'lastmod' => $c->updated_at->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        });

        // Services
        Service::all()->each(function ($s) use (&$urls, $base) {
            $urls[] = [
                'loc' => $base . "/services/{$s->slug}",
                'lastmod' => $s->updated_at->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        });

        // Freelancer profiles (users with role "freelancer")
        User::whereHas('role', fn($q) => $q->where('name', 'freelancer'))
            ->with('profile')
            ->get()
            ->each(function ($u) use (&$urls, $base) {
                if (isset($u->profile) && property_exists($u->profile, 'slug')) {
                    $urls[] = [
                        'loc' => $base . "/freelancers/{$u->profile->slug}",
                        'lastmod' => $u->updated_at->toDateString(),
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            });

        // Portfolios (optional)
        Portfolio::all()->each(function ($p) use (&$urls, $base) {
            $urls[] = [
                'loc' => $base . "/portfolio/{$p->id}",
                'lastmod' => $p->updated_at->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        });

        return response()->json(['urls' => $urls]);
    }
}
