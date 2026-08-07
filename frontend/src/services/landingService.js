import api from './api';

export const getCategoriesApi = async () => {
  try {
    const response = await api.get('/categories');
    if (response.data && response.data.data && response.data.data.length > 0) {
      return {
        status: 'success',
        data: response.data.data.map(cat => ({
          ...cat,
          count: cat.services_count || 12,
        }))
      };
    }
  } catch (err) {
    console.warn('Backend categories fallback triggered:', err);
  }

  // Fallback static data
  return {
    status: 'success',
    data: [
      { id: 1, name: 'Website Development', slug: 'website-development', icon: 'FiCode', count: 124, description: 'React, Laravel, WordPress & Custom Web Apps' },
      { id: 2, name: 'Mobile Development', slug: 'mobile-development', icon: 'FiSmartphone', count: 86, description: 'Flutter, React Native, iOS & Android Native' },
      { id: 3, name: 'UI UX Design', slug: 'ui-ux', icon: 'FiLayout', count: 152, description: 'Figma Prototyping, Design System & User Research' },
      { id: 4, name: 'Graphic Design', slug: 'graphic-design', icon: 'FiPenTool', count: 210, description: 'Logo, Branding, Illustration & Banners' },
      { id: 5, name: 'Video Editing', slug: 'video-editing', icon: 'FiVideo', count: 94, description: 'Reels, Youtube, Color Grading & Motion Graphics' },
      { id: 6, name: 'Photography', slug: 'photography', icon: 'FiCamera', count: 68, description: 'Product Photography, Portrait & Commercial' },
      { id: 7, name: 'Digital Marketing', slug: 'digital-marketing', icon: 'FiTrendingUp', count: 115, description: 'SEO, Meta Ads, Google Ads & Content Strategy' },
      { id: 8, name: 'Voice Over', slug: 'voice-over', icon: 'FiMic', count: 45, description: 'Indonesian & English Dubbing, Commercial Voice' },
      { id: 9, name: 'Translation', slug: 'translation', icon: 'FiGlobe', count: 52, description: 'Dokumen Bahasa Indonesia, Inggris, Mandarin & Jepang' },
      { id: 10, name: 'Writing & Copywriting', slug: 'writing', icon: 'FiFileText', count: 130, description: 'Artikel SEO, Copywriting Iklan & Scriptwriting' },
      { id: 11, name: 'AI Services', slug: 'ai-services', icon: 'FiCpu', count: 77, description: 'Prompt Engineering, ChatGPT Integration & Custom AI Models' },
    ]
  };
};

export const getPopularServicesApi = async () => {
  try {
    const response = await api.get('/landing');
    if (response.data && response.data.data && response.data.data.featured_services?.length > 0) {
      const services = response.data.data.featured_services.map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        price: parseFloat(s.price),
        delivery_time_days: s.delivery_time_days,
        rating_avg: s.rating_avg || 4.9,
        reviews_count: s.reviews_count || 12,
        image: s.images && s.images[0] ? s.images[0].image_path : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        category: typeof s.category === 'object' ? s.category?.name : s.category,
        freelancer: {
          name: s.freelancer?.name || 'Budi Santoso',
          title: s.freelancer?.profile?.title || 'Senior Fullstack Developer',
          avatar: s.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          rating: s.freelancer?.profile?.rating_avg || 4.9,
          location: s.freelancer?.profile?.location || 'Jakarta, Indonesia'
        }
      }));
      return { status: 'success', data: services };
    }
  } catch (err) {
    console.warn('Backend services fallback triggered:', err);
  }

  return {
    status: 'success',
    data: [
      {
        id: 101,
        title: 'Pengembangan Website Company Profile & E-commerce Modern dengan React & Laravel',
        slug: 'website-company-profile-react-laravel',
        price: 2500000,
        delivery_time_days: 5,
        rating_avg: 4.9,
        reviews_count: 38,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        category: 'Website Development',
        freelancer: {
          name: 'Budi Santoso',
          title: 'Senior Fullstack Developer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          rating: 4.9,
          location: 'Jakarta'
        }
      },
      {
        id: 102,
        title: 'Desain UI/UX Mobile App & Dashboard Web Interaktif Menggunakan Figma',
        slug: 'ui-ux-mobile-app-figma',
        price: 1800000,
        delivery_time_days: 3,
        rating_avg: 5.0,
        reviews_count: 52,
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
        category: 'UI UX Design',
        freelancer: {
          name: 'Siti Rahma',
          title: 'Lead Product Designer',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          rating: 5.0,
          location: 'Bandung'
        }
      },
      {
        id: 103,
        title: 'Pembuatan Aplikasi Android & iOS Cross-Platform dengan Flutter Clean Architecture',
        slug: 'aplikasi-android-ios-flutter',
        price: 4500000,
        delivery_time_days: 7,
        rating_avg: 4.8,
        reviews_count: 24,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
        category: 'Mobile Development',
        freelancer: {
          name: 'Reza Pratama',
          title: 'Mobile Engineer Expert',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          rating: 4.8,
          location: 'Surabaya'
        }
      },
      {
        id: 104,
        title: 'Editing Video Content Tiktok, Reels Instagram & Youtube Professional Cinematic',
        slug: 'editing-video-tiktok-reels-youtube',
        price: 750000,
        delivery_time_days: 2,
        rating_avg: 4.9,
        reviews_count: 67,
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
        category: 'Video Editing',
        freelancer: {
          name: 'Dimas Wijaya',
          title: 'Video Creator & Motion Graphic',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          rating: 4.9,
          location: 'Yogyakarta'
        }
      },
      {
        id: 105,
        title: 'Branding Kit Complete: Logo Vector, Style Guide, & Social Media Template',
        slug: 'branding-kit-logo-vector-style-guide',
        price: 1200000,
        delivery_time_days: 4,
        rating_avg: 5.0,
        reviews_count: 41,
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
        category: 'Graphic Design',
        freelancer: {
          name: 'Anisa Putri',
          title: 'Brand Identity Specialist',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          rating: 5.0,
          location: 'Bali'
        }
      },
      {
        id: 106,
        title: 'Integrasi AI Assistant ChatGPT API & Custom Knowledge Base pada Website',
        slug: 'integrasi-ai-assistant-chatgpt-api',
        price: 3200000,
        delivery_time_days: 4,
        rating_avg: 4.9,
        reviews_count: 19,
        image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
        category: 'AI Services',
        freelancer: {
          name: 'Fikri Hidayat',
          title: 'AI & Data Specialist',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
          rating: 4.9,
          location: 'Jakarta'
        }
      }
    ]
  };
};

export const getTopFreelancersApi = async () => {
  try {
    const response = await api.get('/landing');
    if (response.data && response.data.data && response.data.data.top_freelancers?.length > 0) {
      const freelancers = response.data.data.top_freelancers.map(f => ({
        id: f.id,
        name: f.name,
        title: f.profile?.title || 'Freelancer Professional',
        avatar: f.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: f.profile?.rating_avg || 5.0,
        reviews_count: f.profile?.reviews_count || 12,
        location: f.profile?.location || 'Indonesia',
        hourly_rate: f.profile?.hourly_rate || 150000,
        skills: Array.isArray(f.profile?.skills) ? f.profile.skills : ['Laravel', 'React', 'Tailwind', 'REST API']
      }));
      return { status: 'success', data: freelancers };
    }
  } catch (err) {
    console.warn('Backend top freelancers fallback triggered:', err);
  }

  return {
    status: 'success',
    data: [
      {
        id: 1,
        name: 'Budi Santoso',
        title: 'Senior Fullstack Engineer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviews_count: 84,
        location: 'Jakarta',
        hourly_rate: 150000,
        skills: ['React', 'Laravel', 'Node.js', 'PostgreSQL']
      },
      {
        id: 2,
        name: 'Siti Rahma',
        title: 'Lead UI/UX Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviews_count: 112,
        location: 'Bandung',
        hourly_rate: 125000,
        skills: ['Figma', 'User Research', 'Design System', 'Prototyping']
      },
      {
        id: 3,
        name: 'Reza Pratama',
        title: 'Mobile Engineer Expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviews_count: 65,
        location: 'Surabaya',
        hourly_rate: 140000,
        skills: ['Flutter', 'Dart', 'React Native', 'Firebase']
      },
      {
        id: 4,
        name: 'Dimas Wijaya',
        title: 'Video Creator & Motion Specialist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviews_count: 95,
        location: 'Yogyakarta',
        hourly_rate: 100000,
        skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve']
      }
    ]
  };
};

export const getCategoryDetailApi = async (slug) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    if (response.data && response.data.success) {
      return { status: 'success', data: response.data.data };
    }
  } catch (err) {
    console.warn(`Backend getCategoryDetailApi error for ${slug}:`, err);
  }
  return { status: 'error', data: null };
};

