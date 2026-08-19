import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FiStar, FiMapPin, FiCheckCircle, FiClock, FiMessageCircle,
  FiBriefcase, FiAward, FiArrowLeft, FiShare2, FiHeart, FiFileText, FiLayers, FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const mockFreelancersData = {
  1: {
    id: 1,
    name: 'Diana Putri',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    title: 'Senior UI/UX Specialist & Product Designer',
    rating: 5.0,
    reviewsCount: 32,
    rate: 'Rp 150.000 / jam',
    location: 'Jakarta Selatan, Indonesia',
    bio: 'Desainer UI/UX berpengalaman 6+ tahun fokus pada pembuatan aplikasi mobile & dashboard enterprise yang intuitif, estetis, serta memiliki konversi tinggi.',
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design System', 'User Research', 'Mobile App Design'],
    stats: {
      completedJobs: 48,
      hoursWorked: 840,
      jobSuccess: '99%',
      onTime: '100%',
    },
    portfolio: [
      {
        id: 101,
        title: 'Redesign Aplikasi Banking & E-Wallet Modern',
        category: 'Mobile App Design',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        description: 'Meningkatkan UX pendaftaran dan transaksi perbankan dengan kenaikan konversi 40%.',
      },
      {
        id: 102,
        title: 'Dashboard Analytics & CRM Enterprise',
        category: 'UI/UX Dashboard',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
        description: 'Desain SaaS dashboard dengan fitur real-time monitoring data & dark mode.',
      },
      {
        id: 103,
        title: 'Design System & Pattern Library E-Commerce',
        category: 'Design System',
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
        description: 'Membangun 100+ reusable UI components untuk mempercepat proses dev aplikasi.',
      },
    ],
    reviews: [
      { name: 'Budi Santoso', rating: 5, date: '1 minggu lalu', comment: 'Mba Diana sangat cepat dalam pengerjaan dan wireframe yang diberikan sangat mudah diimplementasikan tim dev.' },
      { name: 'Ahmad Rizky', rating: 5, date: '1 bulan lalu', comment: 'Sangat menguasai Figma dan design system. Komunikasi sangat lancar!' }
    ]
  },
  2: {
    id: 2,
    name: 'Rizky Pratama',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    title: 'Full Stack Web Developer (Laravel & React)',
    rating: 4.9,
    reviewsCount: 18,
    rate: 'Rp 120.000 / jam',
    location: 'Surabaya, Indonesia',
    bio: 'Developer berpengalaman dalam membangun arsitektur web modern yang skalabel, aman, dan performa tinggi menggunakan Laravel & React/Next.js.',
    skills: ['React', 'Laravel', 'REST API', 'MySQL', 'Node.js', 'TailwindCSS'],
    stats: {
      completedJobs: 35,
      hoursWorked: 620,
      jobSuccess: '98%',
      onTime: '97%',
    },
    portfolio: [
      {
        id: 201,
        title: 'Platform Marketplace Jobboard SkillHub',
        category: 'Fullstack Web App',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        description: 'Sistem marketplace jobboard dengan autentikasi multi-role dan payment gateway.',
      },
      {
        id: 202,
        title: 'Sistem Inventoris & ERP Perusahaan Logistic',
        category: 'Backend System',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        description: 'Pengembangan backend API dengan arsitektur mikroservices dan skema database teroptimasi.',
      },
    ],
    reviews: [
      { name: 'Siti Aminah', rating: 5, date: '2 minggu lalu', comment: 'Kodenya sangat rapi dan dokumentasi API-nya lengkap. Mantap!' }
    ]
  },
  3: {
    id: 3,
    name: 'Siti Aisyah',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    title: 'Brand Identity & Visual Specialist',
    rating: 5.0,
    reviewsCount: 45,
    rate: 'Rp 100.000 / jam',
    location: 'Bandung, Indonesia',
    bio: 'Desainer grafis spesialis perancangan identitas brand, panduan visual logo, serta packaging kreatif untuk produk startup & UMKM.',
    skills: ['Brand Identity', 'Adobe Illustrator', 'Logo Design', 'Typography', 'Social Media Graphics'],
    stats: {
      completedJobs: 62,
      hoursWorked: 950,
      jobSuccess: '100%',
      onTime: '100%',
    },
    portfolio: [
      {
        id: 301,
        title: 'Visual Identity & Packaging Coffee Shop Brand',
        category: 'Branding',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
        description: 'Perancangan logo, kemasan produk, dan brand guideline untuk jaringan kedai kopi.',
      }
    ],
    reviews: [
      { name: 'Doni Pratama', rating: 5, date: '3 hari lalu', comment: 'Desain logo sangat estetik dan menggambarkan karakter bisnis kami.' }
    ]
  },
  4: {
    id: 4,
    name: 'Andi Wijaya',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    title: 'Mobile App Developer (Flutter & iOS)',
    rating: 4.8,
    reviewsCount: 12,
    rate: 'Rp 90.000 / jam',
    location: 'Yogyakarta, Indonesia',
    bio: 'Spesialis aplikasi mobile cross-platform Flutter dengan performa 60fps yang responsif untuk platform Android dan iOS.',
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management', 'REST API'],
    stats: {
      completedJobs: 24,
      hoursWorked: 410,
      jobSuccess: '96%',
      onTime: '98%',
    },
    portfolio: [
      {
        id: 401,
        title: 'Aplikasi E-Commerce Delivery Fast',
        category: 'Flutter Mobile App',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
        description: 'Aplikasi belanja online dengan fitur real-time GPS tracking driver.',
      }
    ],
    reviews: [
      { name: 'Rina Wijaya', rating: 5, date: '1 bulan lalu', comment: 'Aplikasi sangat mulus dan bebas bug. Terima kasih Mas Andi!' }
    ]
  }
};

const FreelancerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  const freelancer = mockFreelancersData[id] || mockFreelancersData[1];

  const handleRekrutClick = () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Rekrut Talent',
        text: 'Silakan masuk atau daftar sebagai Akun Client untuk menawarkan kontrak pekerjaan.',
        showCancelButton: true,
        confirmButtonText: 'Daftar Client',
        cancelButtonText: 'Masuk',
        confirmButtonColor: '#2563eb',
      }).then((res) => {
        if (res.isConfirmed) {
          navigate('/register/client');
        } else if (res.dismiss === Swal.DismissReason.cancel) {
          navigate('/login');
        }
      });
      return;
    }

    if (userRole === 'customer' || userRole === 'admin') {
      navigate('/dashboard/client/post-job');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Akun Freelancer',
        text: 'Anda sedang masuk sebagai Akun Freelancer.',
      });
    }
  };

  return (
    <div className="bg-light dark:bg-dark min-vh-100 py-4 py-md-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Back Link */}
        <div className="mb-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-muted p-0 text-decoration-none small d-inline-flex align-items-center gap-1 hover-primary border-0 bg-transparent"
          >
            <FiArrowLeft size={16} /> Kembali
          </button>
        </div>

        {/* Top Profile Card Container */}
        <div className="bg-white dark:bg-dark border rounded-4 p-4 p-md-5 shadow-sm mb-4">
          <div className="row g-4 align-items-center">
            
            {/* Avatar & Basic Info */}
            <div className="col-12 col-md-8">
              <div className="d-flex flex-column flex-sm-row align-items-start gap-4">
                <div className="position-relative flex-shrink-0">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="rounded-circle object-fit-cover shadow-sm border"
                    style={{ width: '100px', height: '100px' }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                    style={{ width: '16px', height: '16px' }}
                    title="Online & Ready for Hire"
                  ></span>
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h3 className="fw-extrabold mb-0 text-dark dark:text-light" style={{ letterSpacing: '-0.01em' }}>
                      {freelancer.name}
                    </h3>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs fw-bold">
                      ✓ Terverifikasi
                    </span>
                  </div>

                  <h6 className="fw-semibold text-primary mb-2" style={{ fontSize: '1rem' }}>
                    {freelancer.title}
                  </h6>

                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted text-xs mb-3">
                    <span className="d-inline-flex align-items-center gap-1">
                      <FiMapPin size={14} /> {freelancer.location}
                    </span>
                    <span>&bull;</span>
                    <span className="d-inline-flex align-items-center gap-1 fw-bold text-warning">
                      <FiStar size={14} className="fill-warning" /> {freelancer.rating} ({freelancer.reviewsCount} ulasan)
                    </span>
                  </div>

                  {/* Skills Pills */}
                  <div className="d-flex flex-wrap gap-1.5">
                    {freelancer.skills.map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-dark border px-2.5 py-1 fw-normal text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Tarif & Action Buttons */}
            <div className="col-12 col-md-4 text-md-end border-start-md ps-md-4">
              <div className="text-muted text-xs mb-1">Tarif Layanan / Jam</div>
              <h4 className="fw-extrabold text-primary mb-3" style={{ fontSize: '1.5rem', color: '#2563eb' }}>
                {freelancer.rate}
              </h4>

              <div className="d-flex flex-column gap-2">
                <button
                  onClick={handleRekrutClick}
                  className="btn btn-primary rounded-pill py-2.5 fw-bold text-white shadow-sm hover-lift"
                  style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '0.92rem' }}
                >
                  Rekrut Talent Ini
                </button>
                <button
                  onClick={() => navigate('/dashboard/messages')}
                  className="btn btn-outline-primary rounded-pill py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-1.5"
                  style={{ fontSize: '0.88rem' }}
                >
                  <FiMessageCircle size={15} /> Kirim Pesan
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Grid Bar */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="bg-white dark:bg-dark border rounded-4 p-3 text-center shadow-2xs">
              <div className="text-muted text-xs mb-1">Total Proyek Selesai</div>
              <h5 className="fw-extrabold text-dark dark:text-light mb-0">{freelancer.stats.completedJobs}+</h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white dark:bg-dark border rounded-4 p-3 text-center shadow-2xs">
              <div className="text-muted text-xs mb-1">Total Jam Kerja</div>
              <h5 className="fw-extrabold text-dark dark:text-light mb-0">{freelancer.stats.hoursWorked} Jam</h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white dark:bg-dark border rounded-4 p-3 text-center shadow-2xs">
              <div className="text-muted text-xs mb-1">Tingkat Kepuasan (Job Success)</div>
              <h5 className="fw-extrabold text-success mb-0">{freelancer.stats.jobSuccess}</h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-white dark:bg-dark border rounded-4 p-3 text-center shadow-2xs">
              <div className="text-muted text-xs mb-1">Ketepatan Waktu</div>
              <h5 className="fw-extrabold text-primary mb-0">{freelancer.stats.onTime}</h5>
            </div>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="bg-white dark:bg-dark border rounded-4 p-4 shadow-sm">
          
          <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-4">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition ${
                activeTab === 'portfolio' ? 'btn-primary text-white' : 'btn-light text-muted'
              }`}
            >
              📁 Portofolio & Hasil Kerja ({freelancer.portfolio.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition ${
                activeTab === 'about' ? 'btn-primary text-white' : 'btn-light text-muted'
              }`}
            >
              👤 Profil & Pengalaman
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition ${
                activeTab === 'reviews' ? 'btn-primary text-white' : 'btn-light text-muted'
              }`}
            >
              ⭐ Ulasan Klien ({freelancer.reviews.length})
            </button>
          </div>

          {/* TAB 1: PORTFOLIO GALLERY */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="row g-4">
                {freelancer.portfolio.map((item) => (
                  <div key={item.id} className="col-12 col-md-6">
                    <div className="border rounded-4 overflow-hidden shadow-2xs hover-lift h-100 bg-white dark:bg-dark">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-100 object-fit-cover"
                        style={{ height: '210px' }}
                      />
                      <div className="p-4">
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2.5 py-1 text-xs fw-semibold mb-2">
                          {item.category}
                        </span>
                        <h6 className="fw-bold text-dark dark:text-light mb-2" style={{ fontSize: '1rem' }}>
                          {item.title}
                        </h6>
                        <p className="text-muted text-xs mb-0" style={{ lineHeight: '1.6' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & BIO */}
          {activeTab === 'about' && (
            <div>
              <h6 className="fw-bold mb-2 text-dark dark:text-light">Tentang Freelancer:</h6>
              <p className="text-muted mb-4" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                {freelancer.bio}
              </p>

              <h6 className="fw-bold mb-2 text-dark dark:text-light">Keahlian & Kemampuan Utama:</h6>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {freelancer.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-light text-dark border px-3 py-2 fw-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="d-flex flex-column gap-3">
              {freelancer.reviews.map((rev, idx) => (
                <div key={idx} className="p-3 border rounded-3 bg-light dark:bg-dark">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark dark:text-light small">{rev.name}</strong>
                    <span className="text-warning small fw-bold">⭐ {rev.rating}.0</span>
                  </div>
                  <p className="text-muted text-xs mb-1">"{rev.comment}"</p>
                  <span className="text-muted text-xs opacity-75">{rev.date}</span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default FreelancerDetailPage;
