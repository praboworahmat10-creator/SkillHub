import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiArrowRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Semua');

  /* ── Modal State ── */
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm]           = useState({ rating: 0, hoverRating: 0, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);


  /* ── DATA ── */
  const categories = ['Semua', 'UI/UX Design', 'Web Development', 'Mobile Apps', 'Brand & Logo'];

  const freelancers = [
    { name: 'Diana Putri',   initial: 'DP', color: '#3b82f6', role: 'UI/UX Specialist',  skills: ['Figma', 'Prototyping'], rating: 5.0,  reviews: 32, rate: 'Rp 150rb/jam' },
    { name: 'Rizky Pratama', initial: 'RP', color: '#10b981', role: 'Full Stack Dev',     skills: ['React', 'Laravel'],     rating: 4.9,  reviews: 18, rate: 'Rp 120rb/jam' },
    { name: 'Siti Aisyah',   initial: 'SA', color: '#f59e0b', role: 'Brand Designer',     skills: ['Illustrator', 'Branding'], rating: 5.0, reviews: 45, rate: 'Rp 100rb/jam' },
    { name: 'Andi Wijaya',   initial: 'AW', color: '#8b5cf6', role: 'SEO Specialist',     skills: ['Copywriting', 'SEO'],   rating: 4.8,  reviews: 12, rate: 'Rp 90rb/jam'  },
  ];

  const activeProjects = [
    { name: 'Company Website Redesign',  freelancer: 'Diana Putri',   deadline: '5 Jun 2026',  progress: 80,  progressColor: '#3b82f6' },
    { name: 'Mobile App Development',    freelancer: 'Rizky Pratama',  deadline: '12 Jun 2026', progress: 60,  progressColor: '#3b82f6' },
    { name: 'Brand Identity Design',     freelancer: 'Siti Aisyah',   deadline: '7 Jun 2026',  progress: 40,  progressColor: '#f59e0b' },
  ];

  const [reviews, setReviews] = useState([
    { name: 'Ahmad Hidayat', initial: 'AH', color: '#3b82f6', badge: 'Klien Terverifikasi', time: '2 jam yang lalu',    rating: 5, text: '"Proses sistem rekber di website SkillHub sangat transparan dan aman. Navigasi pencarian talenta sangat cepat, sehingga proyek saya selesai tepat waktu tanpa kendala pembayaran."' },
    { name: 'Budi Santoso',  initial: 'BS', color: '#ef4444', badge: 'Pemilik UMKM',        time: '5 jam yang lalu',    rating: 5, text: '"Fitur kelola proyek dan invoice otomatis di platform ini sangat membantu operasional bisnis kami. Customer support-nya juga sangat responsif saat kami butuh bantuan."' },
    { name: 'Clara Melani',  initial: 'CM', color: '#10b981', badge: 'Product Owner',        time: '1 minggu yang lalu', rating: 4, text: '"Secara keseluruhan antarmuka websitenya sangat ramah pengguna. Sangat mudah memantau progres freelancer dari dashboard utama."' },
  ]);

  /* ── Helper: submit new review ── */
  const handleSubmitReview = () => {
    if (!reviewForm.rating || !reviewForm.text.trim()) return;
    const name    = user?.name || 'Anda';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const colors  = ['#3b82f6','#ef4444','#10b981','#8b5cf6','#f59e0b'];
    const newReview = {
      name,
      initial: initials,
      color:   colors[Math.floor(Math.random() * colors.length)],
      badge:   'Klien Terverifikasi',
      time:    'Baru saja',
      rating:  reviewForm.rating,
      text:    `"${reviewForm.text.trim()}"`,
    };
    setReviews(prev => [newReview, ...prev]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setReviewForm({ rating: 0, hoverRating: 0, text: '' });
    }, 1800);
  };


  return (
    <>
    <div className="container-fluid pb-5">

      {/* ── Top Quick Stats Bar ── */}
      <div 
        className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 mt-2 px-4 py-3 rounded-4 border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="d-flex flex-wrap gap-4">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Proyek Aktif: <span className="fw-bold" style={{ color: 'var(--text-main)' }}>5 Proyek</span>
          </div>
          <div className="vr d-none d-md-block" style={{ backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Pengeluaran Bulan Ini: <span className="fw-bold" style={{ color: 'var(--text-main)' }}>Rp 4.250.000</span>
          </div>
          <div className="vr d-none d-md-block" style={{ backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tagihan Belum Ditembus: <Link to="/dashboard/billing" className="fw-bold text-decoration-none" style={{ color: '#ef4444' }}>Rp 3.150.000</Link>
          </div>
        </div>
        <Link
          to="/dashboard/client/post-job"
          className="btn btn-primary fw-bold px-4 py-2 shadow-sm d-flex align-items-center gap-2 text-decoration-none"
          style={{ borderRadius: '10px', whiteSpace: 'nowrap' }}
        >
          + Buat Proyek
        </Link>
      </div>

      {/* ── Kategori Layanan Populer ── */}
      <section className="mb-5">
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Kategori Layanan Populer</h5>
        <div className="d-flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="btn fw-semibold px-4 py-2"
              style={{
                borderRadius: '20px',
                backgroundColor: activeCategory === cat ? 'var(--primary-color)' : 'var(--card-bg)',
                color: activeCategory === cat ? 'white' : 'var(--text-main)',
                border: `1px solid ${activeCategory === cat ? 'var(--primary-color)' : 'var(--border-color)'}`,
                fontSize: '0.88rem',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Rekomendasi Talent Terbaik ── */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Rekomendasi Talent Terbaik</h5>
          <Link to="/dashboard/talent" className="fw-semibold text-decoration-none d-flex align-items-center gap-1" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
            Lihat Semua Talent <FiArrowRight size={15} />
          </Link>
        </div>

        <div className="row g-3">
          {freelancers.map((f, i) => (
            <div key={i} className="col-12 col-sm-6 col-lg-3">
              <div 
                className="card border-0 rounded-4 p-3 h-100"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s, box-shadow 0.2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Avatar + Name */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{ width: '48px', height: '48px', backgroundColor: f.color, fontSize: '1rem' }}
                  >
                    {f.initial}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{f.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{f.role}</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {f.skills.map(sk => (
                    <span key={sk} className="badge fw-normal" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '0.75rem', padding: '4px 10px' }}>
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Rating & Rate */}
                <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Rating & Tarif
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="d-flex align-items-center gap-1 fw-semibold" style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                    <FiStar size={14} style={{ fill: '#f59e0b' }} /> {f.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({f.reviews})</span>
                  </span>
                  <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.88rem' }}>{f.rate}</span>
                </div>

                {/* CTA */}
                <button
                  className="btn w-100 fw-semibold"
                  onClick={() => navigate('/dashboard/talent')}
                  style={{ borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.88rem', padding: '8px' }}
                >
                  Rekrut Talent
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proyek Berjalan Saya ── */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Proyek Berjalan Saya</h5>
          <Link to="/dashboard/client/jobs" className="fw-semibold text-decoration-none d-flex align-items-center gap-1" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
            Kelola Semua Proyek <FiArrowRight size={15} />
          </Link>
        </div>

        <div className="card border-0 rounded-4 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {activeProjects.map((p, i) => (
            <div 
              key={i} 
              className="d-flex flex-wrap align-items-center gap-3 px-4 py-3"
              style={{ 
                borderBottom: i < activeProjects.length - 1 ? `1px solid var(--border-color)` : 'none',
              }}
            >
              {/* Project Info */}
              <div style={{ minWidth: '200px', flex: 1 }}>
                <div className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{p.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Freelancer: {p.freelancer} &bull; Tenggat: {p.deadline}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: '200px', maxWidth: '340px' }}>
                <div className="flex-grow-1" style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: p.progressColor, borderRadius: '10px', transition: 'width 0.4s ease' }}></div>
                </div>
                <span className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{p.progress}%</span>
              </div>

              {/* CTA */}
              <Link
                to="/dashboard/client/contracts"
                className="btn fw-semibold text-decoration-none"
                style={{ borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.85rem', whiteSpace: 'nowrap', padding: '7px 18px' }}
              >
                Detail Proyek
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ulasan Klien ── */}
      <section className="mb-4">
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Ulasan Klien untuk SkillHub</h5>
        
        {/* Rating Summary */}
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
            <span className="fw-bold" style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★ 4.9 / 5.0</span>
            <span style={{ color: 'var(--text-muted)' }}>(Berdasarkan {reviews.length > 3 ? `1.28${reviews.length - 3}+` : '1.280+'} ulasan pengguna)</span>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn btn-sm fw-semibold d-inline-flex align-items-center gap-1"
            style={{ backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '50px', fontSize: '0.85rem', padding: '6px 14px', border: 'none' }}
          >
            <FiStar size={13} /> Tulis Ulasan
          </button>
        </div>

        {/* Review Cards */}
        <div className="card border-0 rounded-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {reviews.map((r, i) => (
            <div 
              key={i} 
              className="px-4 py-4"
              style={{ borderBottom: i < reviews.length - 1 ? `1px solid var(--border-color)` : 'none' }}
            >
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '44px', height: '44px', backgroundColor: r.color, fontSize: '0.9rem' }}>
                  {r.initial}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                    <span className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{r.name}</span>
                    <span className="badge fw-semibold" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.72rem' }}>{r.badge}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>· {r.time}</span>
                  </div>
                  <p className="mb-0" style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.65' }}>{r.text}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Link to="/profile?tab=reviews" className="btn btn-link fw-semibold text-decoration-none d-inline-flex align-items-center gap-1" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
              Lihat Seluruh Ulasan ({reviews.length > 3 ? `1.28${reviews.length - 3}+` : '1.280+'}) <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>

    {/* ─────────── MODAL TULIS ULASAN ─────────── */}
    {showReviewModal && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) { setShowReviewModal(false); setReviewForm({ rating: 0, hoverRating: 0, text: '' }); setReviewSubmitted(false); } }}
      >
        <div
          className="rounded-4 shadow-lg p-4 position-relative"
          style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '480px', margin: '0 16px', border: '1px solid var(--border-color)' }}
        >
          {/* Close */}
          <button
            onClick={() => { setShowReviewModal(false); setReviewForm({ rating: 0, hoverRating: 0, text: '' }); setReviewSubmitted(false); }}
            className="btn position-absolute top-0 end-0 mt-3 me-3 p-1 d-flex align-items-center justify-content-center"
            style={{ background: 'var(--bg-color)', borderRadius: '50%', width: '32px', height: '32px', border: '1px solid var(--border-color)' }}
          >
            <FiX size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

          {reviewSubmitted ? (
            /* ── Success State ── */
            <div className="text-center py-3">
              <FiCheckCircle size={52} style={{ color: '#10b981' }} className="mb-3" />
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Ulasan Terkirim!</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Terima kasih atas masukan Anda untuk SkillHub.</p>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Tulis Ulasan</h5>
              <p className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bagikan pengalaman Anda menggunakan SkillHub</p>

              {/* Star Rating Picker */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Rating Anda</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="btn p-0"
                      style={{ fontSize: '2rem', lineHeight: 1, background: 'none', border: 'none', color: (reviewForm.hoverRating || reviewForm.rating) >= star ? '#f59e0b' : 'var(--border-color)', transition: 'color 0.15s ease', cursor: 'pointer' }}
                      onMouseEnter={() => setReviewForm(f => ({ ...f, hoverRating: star }))}
                      onMouseLeave={() => setReviewForm(f => ({ ...f, hoverRating: 0 }))}
                      onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {reviewForm.rating > 0 && (
                  <small style={{ color: 'var(--text-muted)' }}>
                    {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa!'][reviewForm.rating]}
                  </small>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Ulasan Anda</label>
                <textarea
                  className="form-control shadow-none"
                  rows={4}
                  placeholder="Ceritakan pengalaman Anda menggunakan SkillHub..."
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '12px', fontSize: '0.9rem', resize: 'vertical' }}
                />
                <small className="d-block text-end mt-1" style={{ color: 'var(--text-muted)' }}>{reviewForm.text.length} / 500</small>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 justify-content-end">
                <button
                  onClick={() => { setShowReviewModal(false); setReviewForm({ rating: 0, hoverRating: 0, text: '' }); }}
                  className="btn fw-semibold"
                  style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '50px', padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewForm.rating || !reviewForm.text.trim()}
                  className="btn fw-semibold"
                  style={{ backgroundColor: reviewForm.rating && reviewForm.text.trim() ? 'var(--primary-color)' : 'var(--border-color)', color: '#fff', borderRadius: '50px', padding: '8px 24px', fontSize: '0.85rem', border: 'none', opacity: reviewForm.rating && reviewForm.text.trim() ? 1 : 0.6 }}
                >
                  Kirim Ulasan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}
  </>);
};

export default ClientDashboard;
