import React, { useState } from 'react';
import { 
  FiMapPin, FiMail, FiPhone, FiGlobe, 
  FiBriefcase, FiStar, FiEdit3, FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const dummyPortfolio = [
  { 
    id: 1, 
    title: 'E-Commerce App Redesign', 
    category: 'UI/UX Design', 
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 
    description: 'Redesign of a major e-commerce platform, improving conversion rate by 30%.'
  },
  { 
    id: 2, 
    title: 'Finance Dashboard', 
    category: 'Web Development', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', 
    description: 'Real-time financial monitoring dashboard built with React and D3.js.' 
  },
  { 
    id: 3, 
    title: 'Brand Identity – Startup Fintech', 
    category: 'Graphic Design', 
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80', 
    description: 'Complete brand identity for an Indonesian Fintech startup from logo to guidelines.' 
  },
];

const dummyReviews = [
  { id: 1, name: 'Budi Santoso', initial: 'BS', color: '#3b82f6', rating: 5, date: '12 Ags 2026', comment: 'Hasil kerja sangat rapi dan selesai tepat waktu. Komunikasi juga sangat lancar!' },
  { id: 2, name: 'Siti Rahayu', initial: 'SR', color: '#10b981', rating: 4, date: '5 Jul 2026', comment: 'Desainnya bagus, hanya perlu sedikit revisi di awal. Overall sangat memuaskan.' },
];

const ProfilePage = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="container-fluid pb-5">
      
      {/* ── Profile Header Banner ── */}
      <div className="card border-0 rounded-4 shadow-sm overflow-hidden mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        {/* Cover */}
        <div style={{ 
          height: '180px', 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e40af 50%, #7c3aed 100%)',
          position: 'relative'
        }}>
          <button 
            className="btn btn-sm fw-semibold position-absolute d-flex align-items-center gap-2"
            style={{ 
              top: '20px', right: '20px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)'
            }}
          >
            <FiEdit3 size={14} /> Ubah Sampul
          </button>
        </div>
        
        <div className="px-4 pb-4 position-relative">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-3">
            <div className="d-flex align-items-end" style={{ marginTop: '-64px' }}>
              {/* Avatar */}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{ 
                  width: '128px', height: '128px', fontSize: '3rem', 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: '4px solid var(--card-bg)', zIndex: 1
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ms-3 mb-2">
                <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{user?.name || 'Nama Pengguna'}</h3>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <span className="badge text-capitalize" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontWeight: '600' }}>
                    {userRole || 'User'}
                  </span>
                  <span className="d-flex align-items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <FiMapPin size={14} /> Jakarta, Indonesia
                  </span>
                  <span className="d-flex align-items-center gap-1" style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: '600' }}>
                    <FiStar size={14} /> 4.9/5.0
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 mt-md-0 d-flex gap-2">
              <button className="btn fw-semibold px-4 shadow-sm" style={{ borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--bg-color)' }}>
                Bagikan
              </button>
              <button className="btn btn-primary fw-semibold px-4 shadow-sm" style={{ borderRadius: '10px' }}>
                <FiEdit3 className="me-2" size={15} /> Edit Profil
              </button>
            </div>
          </div>
          
          <p className="mb-3" style={{ color: 'var(--text-main)', fontSize: '0.95rem', maxWidth: '760px', lineHeight: '1.7' }}>
            Saya adalah seorang profesional berdedikasi dengan pengalaman lebih dari 5 tahun di bidang kreatif dan teknologi. Selalu berusaha memberikan hasil terbaik untuk klien dengan komunikasi yang transparan dan pekerjaan yang selesai tepat waktu.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* ── Left Sidebar ── */}
        <div className="col-12 col-lg-4">
          {/* Contact Info */}
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h6 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Informasi Kontak</h6>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: <FiMail size={16} />, label: 'Email', value: user?.email || 'email@example.com' },
                { icon: <FiPhone size={16} />, label: 'Telepon', value: '+62 812-3456-7890' },
                { icon: <FiGlobe size={16} />, label: 'Website', value: 'www.portfolio.com', isLink: true },
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1px' }}>{item.label}</div>
                    <div className="fw-semibold" style={{ color: item.isLink ? '#3b82f6' : 'var(--text-main)', fontSize: '0.88rem' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Keahlian Utama</h6>
            <div className="d-flex flex-wrap gap-2">
              {['UI/UX Design', 'React.js', 'Figma', 'Node.js', 'Tailwind CSS'].map(skill => (
                <span key={skill} className="badge fw-semibold" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '7px 12px', fontSize: '0.78rem' }}>
                  {skill}
                </span>
              ))}
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Statistik</h6>
            {[
              { icon: <FiCheckCircle size={15} />, label: 'Pekerjaan Selesai', value: '42' },
              { icon: <FiStar size={15} />, label: 'Rating Rata-rata', value: '4.9 / 5.0', valueColor: '#f59e0b' },
              { icon: <FiBriefcase size={15} />, label: 'Total Pengalaman', value: '5 Tahun' },
            ].map((stat, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {stat.icon} {stat.label}
                </span>
                <span className="fw-bold" style={{ color: stat.valueColor || 'var(--text-main)', fontSize: '0.9rem' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Content (Tabs) ── */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--card-bg)', minHeight: '480px' }}>
            {/* Tab Nav */}
            <div className="d-flex gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              {[
                { key: 'portfolio', label: `Portofolio (${dummyPortfolio.length})` },
                { key: 'reviews', label: `Ulasan (${dummyReviews.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="btn fw-semibold px-4"
                  style={{
                    borderRadius: '10px',
                    backgroundColor: activeTab === tab.key ? 'var(--primary-color)' : 'transparent',
                    color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                    border: 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="row g-4">
                {dummyPortfolio.map(item => (
                  <div key={item.id} className="col-12 col-sm-6 col-lg-4">
                    <div 
                      className="card border-0 rounded-3 overflow-hidden h-100"
                      style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', transition: 'transform 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      <div style={{ height: '160px', overflow: 'hidden', backgroundColor: 'var(--border-color)' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="p-3">
                        <div className="mb-1" style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: '600' }}>{item.category}</div>
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.4' }}>{item.title}</h6>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 0, lineHeight: '1.5' }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="d-flex flex-column gap-3">
                {dummyReviews.map(review => (
                  <div key={review.id} className="p-4 rounded-4" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: review.color, fontSize: '0.95rem' }}>
                          {review.initial}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{review.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{review.date}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-1" style={{ color: '#f59e0b' }}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={16} style={{ fill: i < review.rating ? '#f59e0b' : 'none' }} />
                        ))}
                      </div>
                    </div>
                    <p className="mb-0" style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.65', fontStyle: 'italic' }}>
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
