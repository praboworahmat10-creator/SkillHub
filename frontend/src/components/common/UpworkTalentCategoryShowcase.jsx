import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const categoryData = [
  {
    id: 'dev-it',
    name: 'Development & IT',
    slug: 'pengembangan-web',
    roles: [
      {
        title: 'Website Developers',
        rating: '4.8 on avg.',
        rate: 'Rp 150rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'pengembangan-web'
      },
      {
        title: 'AI Engineers',
        rating: '4.9 on avg.',
        rate: 'Rp 175rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'Ethical Hackers & DevOps',
        rating: '4.7 on avg.',
        rate: 'Rp 200rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'pemrograman-tech'
      },
      {
        title: 'Software Developers',
        rating: '4.8 on avg.',
        rate: 'Rp 160rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'pengembangan-web'
      },
      {
        title: 'Shopify & E-Commerce Devs',
        rating: '4.7 on avg.',
        rate: 'Rp 135rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'pengembangan-web'
      },
      {
        title: 'Wordpress & Mobile Devs',
        rating: '4.8 on avg.',
        rate: 'Rp 140rb/jam+',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
        slug: 'pemrograman-tech'
      }
    ]
  },
  {
    id: 'ai-services',
    name: 'AI Services',
    slug: 'ai-machine-learning',
    roles: [
      {
        title: 'ChatGPT & LLM Experts',
        rating: '4.9 on avg.',
        rate: 'Rp 180rb/jam+',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'Prompt Engineers',
        rating: '4.8 on avg.',
        rate: 'Rp 150rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'Computer Vision Devs',
        rating: '4.9 on avg.',
        rate: 'Rp 190rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'AI Chatbot Developers',
        rating: '4.8 on avg.',
        rate: 'Rp 165rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'Machine Learning Experts',
        rating: '5.0 on avg.',
        rate: 'Rp 210rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      },
      {
        title: 'Data Scientists',
        rating: '4.9 on avg.',
        rate: 'Rp 170rb/jam+',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        slug: 'ai-machine-learning'
      }
    ]
  },
  {
    id: 'design-creative',
    name: 'Design & Creative',
    slug: 'desain-grafis',
    roles: [
      {
        title: 'UI/UX Designers',
        rating: '5.0 on avg.',
        rate: 'Rp 125rb/jam+',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        slug: 'desain-grafis'
      },
      {
        title: 'Logo & Brand Designers',
        rating: '4.9 on avg.',
        rate: 'Rp 110rb/jam+',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        slug: 'desain-grafis'
      },
      {
        title: 'Motion Graphic Artists',
        rating: '4.8 on avg.',
        rate: 'Rp 100rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Figma Prototypers',
        rating: '5.0 on avg.',
        rate: 'Rp 130rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'desain-grafis'
      },
      {
        title: '3D & CAD Illustrators',
        rating: '4.9 on avg.',
        rate: 'Rp 145rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'desain-grafis'
      },
      {
        title: 'Product Designers',
        rating: '4.8 on avg.',
        rate: 'Rp 135rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'desain-grafis'
      }
    ]
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    slug: 'pemasaran-digital',
    roles: [
      {
        title: 'SEO Specialists',
        rating: '4.8 on avg.',
        rate: 'Rp 115rb/jam+',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
        slug: 'pemasaran-digital'
      },
      {
        title: 'Meta & Google Ads Managers',
        rating: '4.9 on avg.',
        rate: 'Rp 140rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'pemasaran-digital'
      },
      {
        title: 'Social Media Strategists',
        rating: '4.7 on avg.',
        rate: 'Rp 95rb/jam+',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        slug: 'pemasaran-digital'
      },
      {
        title: 'Content Marketers',
        rating: '4.8 on avg.',
        rate: 'Rp 100rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'pemasaran-digital'
      },
      {
        title: 'Copywriters',
        rating: '4.9 on avg.',
        rate: 'Rp 110rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'Email Marketing Experts',
        rating: '4.7 on avg.',
        rate: 'Rp 105rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'pemasaran-digital'
      }
    ]
  },
  {
    id: 'writing-translation',
    name: 'Writing & Translation',
    slug: 'penulisan-konten',
    roles: [
      {
        title: 'English - ID Translators',
        rating: '4.9 on avg.',
        rate: 'Rp 90rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'Technical Writers',
        rating: '4.8 on avg.',
        rate: 'Rp 120rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'SEO Article Writers',
        rating: '4.8 on avg.',
        rate: 'Rp 85rb/jam+',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'Proofreaders & Editors',
        rating: '4.9 on avg.',
        rate: 'Rp 80rb/jam+',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'Scriptwriters',
        rating: '4.7 on avg.',
        rate: 'Rp 95rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      },
      {
        title: 'Mandarin & JP Translators',
        rating: '5.0 on avg.',
        rate: 'Rp 130rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'penulisan-konten'
      }
    ]
  },
  {
    id: 'video-audio',
    name: 'Video & Animation',
    slug: 'video-animasi',
    roles: [
      {
        title: 'TikTok & Reels Editors',
        rating: '4.9 on avg.',
        rate: 'Rp 100rb/jam+',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Youtube Video Editors',
        rating: '4.8 on avg.',
        rate: 'Rp 110rb/jam+',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Voice Over Artists',
        rating: '5.0 on avg.',
        rate: 'Rp 120rb/jam+',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Colorists & Motion Artists',
        rating: '4.9 on avg.',
        rate: 'Rp 130rb/jam+',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Podcast Audio Engineers',
        rating: '4.8 on avg.',
        rate: 'Rp 95rb/jam+',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      },
      {
        title: 'Music Producers',
        rating: '4.7 on avg.',
        rate: 'Rp 140rb/jam+',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        slug: 'video-animasi'
      }
    ]
  },
  { id: 'admin-support', name: 'Admin & Support', slug: 'bisnis', roles: [] },
  { id: 'finance-acc', name: 'Finance & Accounting', slug: 'bisnis', roles: [] },
  { id: 'legal', name: 'Legal', slug: 'bisnis', roles: [] },
  { id: 'hr-training', name: 'HR & Training', slug: 'bisnis', roles: [] },
];

const UpworkTalentCategoryShowcase = () => {
  const [activeCatId, setActiveCatId] = useState('dev-it');
  const navigate = useNavigate();

  const activeCategory = categoryData.find(c => c.id === activeCatId) || categoryData[0];
  const activeRoles = activeCategory.roles.length > 0 ? activeCategory.roles : categoryData[0].roles;

  const handleRoleClick = (role) => {
    navigate(`/explore?cat=${role.slug}&type=freelancers&search=${encodeURIComponent(role.title)}`);
  };

  return (
    <section className="py-5 bg-white dark:bg-dark border-top border-bottom">
      <div className="container py-2">
        {/* Title */}
        <div className="mb-4">
          <span className="badge badge-pill-primary mb-2">Pilih Talenta Berdasarkan Kategori</span>
          <h2 className="fw-extrabold display-6 text-dark mb-0">Browse talent by category</h2>
        </div>

        {/* Upwork Style Category Selector Grid (2 rows of 5 cards) */}
        <div className="row g-3 mb-5">
          {categoryData.map((cat) => {
            const isActive = activeCatId === cat.id;
            return (
              <div key={cat.id} className="col-lg-2-4 col-md-4 col-sm-6">
                <div
                  onClick={() => setActiveCatId(cat.id)}
                  className={`upwork-cat-card ${isActive ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Talent Role Cards Grid (Upwork style images + subcategory titles) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCatId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="row g-4"
          >
            {activeRoles.map((role, idx) => (
              <div key={idx} className="col-lg-2 col-md-4 col-sm-6">
                <div
                  onClick={() => handleRoleClick(role)}
                  className="upwork-talent-card"
                >
                  <div className="upwork-talent-img-wrapper">
                    <img
                      src={role.image}
                      alt={role.title}
                      className="upwork-talent-img"
                    />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark text-truncate">{role.title}</h6>
                    <div className="d-flex align-items-center gap-1 text-muted text-xs mb-1">
                      <FiStar size={13} className="text-dark" style={{ fill: '#0F172A' }} />
                      <span className="fw-medium text-dark">{role.rating}</span>
                    </div>
                    <div className="text-muted text-xs fw-semibold">
                      {role.rate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UpworkTalentCategoryShowcase;
