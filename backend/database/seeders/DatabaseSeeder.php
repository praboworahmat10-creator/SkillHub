<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Roles ──────────────────────────────────────────────────────────
        $roles = [
            ['name' => 'admin',      'display_name' => 'Administrator'],
            ['name' => 'freelancer', 'display_name' => 'Freelancer'],
            ['name' => 'customer',   'display_name' => 'Customer'],
        ];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }

        // ─── Categories ─────────────────────────────────────────────────────
        $categories = [
            ['name' => 'Desain Grafis',        'icon' => '🎨', 'is_popular' => true],
            ['name' => 'Pengembangan Web',      'icon' => '💻', 'is_popular' => true],
            ['name' => 'Penulisan Konten',      'icon' => '✍️',  'is_popular' => true],
            ['name' => 'Pemasaran Digital',     'icon' => '📢', 'is_popular' => true],
            ['name' => 'Video & Animasi',       'icon' => '🎬', 'is_popular' => true],
            ['name' => 'Musik & Audio',         'icon' => '🎵', 'is_popular' => false],
            ['name' => 'Pemrograman & Tech',    'icon' => '⚙️',  'is_popular' => true],
            ['name' => 'Bisnis',                'icon' => '💼', 'is_popular' => false],
            ['name' => 'AI & Machine Learning', 'icon' => '🤖', 'is_popular' => true],
            ['name' => 'Fotografi',             'icon' => '📸', 'is_popular' => false],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                array_merge($cat, ['slug' => Str::slug($cat['name'])])
            );
        }

        // ─── Admin user ─────────────────────────────────────────────────────
        $adminRole = Role::where('name', 'admin')->first();
        $admin = User::firstOrCreate(
            ['email' => 'admin@skillhub.id'],
            [
                'role_id'  => $adminRole->id,
                'name'     => 'Admin SkillHub',
                'password' => bcrypt('password123'),
                'phone'    => '08123456789',
            ]
        );

        // ─── Demo Freelancers & Profiles ─────────────────────────────────────
        $freelancerRole = Role::where('name', 'freelancer')->first();

        $freelancersData = [
            [
                'email'       => 'budi@skillhub.id',
                'name'        => 'Budi Santoso',
                'title'       => 'Senior Full-Stack Engineer',
                'bio'         => 'Full-stack developer 5+ tahun pengalaman di React, Laravel, & MySQL. Siap membangun sistem scalable.',
                'skills'      => ['React', 'Laravel', 'MySQL', 'Tailwind CSS', 'TypeScript'],
                'location'    => 'Jakarta, Indonesia',
                'hourly_rate' => 150000,
                'avatar'      => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'services'    => [
                    [
                        'category_slug' => 'pengembangan-web',
                        'title'         => 'Pembuatan Website Landing Page Modern React & Laravel',
                        'slug'          => 'pembuatan-website-landing-page-modern-abcde',
                        'description'   => 'Landing page modern, responsif, dan SEO-friendly menggunakan React + Tailwind. Fitur lengkap & aman.',
                        'price'         => 500000,
                        'days'          => 5,
                        'revisions'     => 3,
                    ]
                ],
                'portfolios'  => [
                    [
                        'title'       => 'SaaS Dashboard Analytics App',
                        'description' => 'Platform analisis data bisnis real-time berbasis Web Socket & Laravel React.',
                        'image_path'  => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://example.com/saas-dashboard'
                    ],
                    [
                        'title'       => 'E-Commerce Marketplace Kuliner',
                        'description' => 'Aplikasi web pemesanan makanan online lengkap dengan integrasi Midtrans.',
                        'image_path'  => 'https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://example.com/culinary-store'
                    ]
                ]
            ],
            [
                'email'       => 'siti@skillhub.id',
                'name'        => 'Siti Rahma',
                'title'       => 'Lead UI/UX & Product Designer',
                'bio'         => 'Product Designer spesialis Figma prototyping, Design System, & Mobile App UX.',
                'skills'      => ['Figma', 'User Research', 'Design System', 'Wireframing', 'Prototyping'],
                'location'    => 'Bandung, Indonesia',
                'hourly_rate' => 125000,
                'avatar'      => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'services'    => [
                    [
                        'category_slug' => 'desain-grafis',
                        'title'         => 'Desain UI/UX Mobile App & Dashboard Web Interaktif Figma',
                        'slug'          => 'desain-ui-ux-mobile-app-figma',
                        'description'   => 'Desain UI UX modern, konsisten, serta ramah pengguna untuk aplikasi Android/iOS dan Web.',
                        'price'         => 1800000,
                        'days'          => 3,
                        'revisions'     => 5,
                    ]
                ],
                'portfolios'  => [
                    [
                        'title'       => 'Banking & Wallet Mobile App Concept',
                        'description' => 'Redesain aplikasi finansial digital dengan fokus kemudahan transaksi pengguna.',
                        'image_path'  => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://figma.com/file/sample-wallet'
                    ]
                ]
            ],
            [
                'email'       => 'reza@skillhub.id',
                'name'        => 'Reza Pratama',
                'title'       => 'Mobile Engineer Specialist',
                'bio'         => 'Pengembang aplikasi iOS & Android menggunakan Flutter & React Native dengan performa tinggi.',
                'skills'      => ['Flutter', 'Dart', 'React Native', 'Firebase', 'REST API'],
                'location'    => 'Surabaya, Indonesia',
                'hourly_rate' => 140000,
                'avatar'      => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'services'    => [
                    [
                        'category_slug' => 'pemrograman-tech',
                        'title'         => 'Aplikasi Android & iOS Cross-Platform Flutter Clean Architecture',
                        'slug'          => 'aplikasi-android-ios-flutter',
                        'description'   => 'Aplikasi mobile berperforma tinggi, responsif, dan siap rilis di Play Store / App Store.',
                        'price'         => 4500000,
                        'days'          => 7,
                        'revisions'     => 4,
                    ]
                ],
                'portfolios'  => [
                    [
                        'title'       => 'Logistics Tracking App Flutter',
                        'description' => 'Aplikasi kurir dan pelacakan pengiriman barang secara real-time berbasis GPS.',
                        'image_path'  => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://example.com/logistics-app'
                    ]
                ]
            ],
            [
                'email'       => 'dimas@skillhub.id',
                'name'        => 'Dimas Wijaya',
                'title'       => 'Video Editor & Motion Creator',
                'bio'         => 'Editor video kreatif untuk Reels TikTok, Youtube, Commercial Ads, & Motion Graphics.',
                'skills'      => ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading'],
                'location'    => 'Yogyakarta, Indonesia',
                'hourly_rate' => 100000,
                'avatar'      => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'services'    => [
                    [
                        'category_slug' => 'video-animasi',
                        'title'         => 'Editing Video TikTok, Reels Instagram & Youtube Cinematic',
                        'slug'          => 'editing-video-tiktok-reels-youtube',
                        'description'   => 'Pengeditan video tajam, cinematic, efek suara memukau, dan animasi subtitle kekinian.',
                        'price'         => 750000,
                        'days'          => 2,
                        'revisions'     => 3,
                    ]
                ],
                'portfolios'  => [
                    [
                        'title'       => 'Company Video Profile & Commercial Ad',
                        'description' => 'Video promosi korporat dengan teknik color grading DaVinci Resolve.',
                        'image_path'  => 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://youtube.com/watch?v=sample'
                    ]
                ]
            ],
            [
                'email'       => 'fikri@skillhub.id',
                'name'        => 'Fikri Hidayat',
                'title'       => 'AI & Machine Learning Engineer',
                'bio'         => 'Integrasi AI Assistant, Prompt Engineering, ChatGPT API, & Custom AI Model.',
                'skills'      => ['Python', 'OpenAI API', 'PyTorch', 'FastAPI', 'LangChain'],
                'location'    => 'Jakarta, Indonesia',
                'hourly_rate' => 175000,
                'avatar'      => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
                'services'    => [
                    [
                        'category_slug' => 'ai-machine-learning',
                        'title'         => 'Integrasi AI Assistant ChatGPT API & Custom Knowledge Base Web',
                        'slug'          => 'integrasi-ai-assistant-chatgpt-api',
                        'description'   => 'Integrasikan AI pintar ke dalam aplikasi bisnis Anda untuk customer support otomatis 24/7.',
                        'price'         => 3200000,
                        'days'          => 4,
                        'revisions'     => 3,
                    ]
                ],
                'portfolios'  => [
                    [
                        'title'       => 'AI Customer Support Bot for E-Commerce',
                        'description' => 'Chatbot AI cerdas yang memahami konteks katalog produk dan pesanan pengguna.',
                        'image_path'  => 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
                        'project_url' => 'https://example.com/ai-bot-demo'
                    ]
                ]
            ]
        ];

        foreach ($freelancersData as $fData) {
            $user = User::firstOrCreate(
                ['email' => $fData['email']],
                [
                    'role_id'  => $freelancerRole->id,
                    'name'     => $fData['name'],
                    'password' => bcrypt('password123'),
                    'phone'    => '081' . rand(10000000, 99999999),
                    'avatar'   => $fData['avatar'],
                ]
            );

            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'title'       => $fData['title'],
                    'bio'         => $fData['bio'],
                    'skills'      => $fData['skills'],
                    'location'    => $fData['location'],
                    'hourly_rate' => $fData['hourly_rate'],
                ]
            );

            $user->wallet()->firstOrCreate(['user_id' => $user->id], ['balance' => 0]);

            // Add Services
            foreach ($fData['services'] as $sData) {
                $cat = Category::where('slug', $sData['category_slug'])->first();
                if ($cat) {
                    \App\Models\Service::updateOrCreate(
                        ['slug' => $sData['slug']],
                        [
                            'freelancer_id'      => $user->id,
                            'category_id'        => $cat->id,
                            'title'              => $sData['title'],
                            'description'        => $sData['description'],
                            'price'              => $sData['price'],
                            'delivery_time_days' => $sData['days'],
                            'revision_count'     => $sData['revisions'],
                            'status'             => 'active',
                            'rating_avg'         => 4.9,
                            'reviews_count'      => rand(10, 50),
                            'sales_count'        => rand(20, 100),
                        ]
                    );
                }
            }

            // Add Portfolios
            foreach ($fData['portfolios'] as $pData) {
                \App\Models\Portfolio::updateOrCreate(
                    ['freelancer_id' => $user->id, 'title' => $pData['title']],
                    [
                        'description' => $pData['description'],
                        'image_path'  => $pData['image_path'],
                        'project_url' => $pData['project_url'],
                    ]
                );
            }
        }

        // ─── Demo Customer ──────────────────────────────────────────────────
        $customerRole = Role::where('name', 'customer')->first();
        $customer = User::firstOrCreate(
            ['email' => 'customer@skillhub.id'],
            [
                'role_id'  => $customerRole->id,
                'name'     => 'Siti Rahayu',
                'password' => bcrypt('password123'),
                'phone'    => '08222333444',
            ]
        );
        $customer->wallet()->firstOrCreate(['user_id' => $customer->id], ['balance' => 500000]);

        $this->command->info('✅ SkillHub seeder selesai! Demo data berhasil dibuat.');
    }
}

