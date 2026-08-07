import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiStar, FiClock, FiCheckCircle, FiShare2, FiHeart,
  FiMapPin, FiMessageCircle, FiShield, FiRefreshCw, FiArrowLeft, FiUser
} from 'react-icons/fi';
import { getPopularServicesApi } from '../../services/landingService';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

/* ─── Mock reviews ─── */
const MOCK_REVIEWS = [
  { id: 1, name: 'Ahmad Rizky', avatar: 'https://i.pravatar.cc/60?img=11', rating: 5, date: '2 minggu lalu', comment: 'Hasil kerja luar biasa! Sangat profesional dan responsif. Akan saya rekomendasikan ke teman-teman.' },
  { id: 2, name: 'Maya Sari', avatar: 'https://i.pravatar.cc/60?img=5', rating: 5, date: '1 bulan lalu', comment: 'Pengerjaan cepat dan sesuai brief. Komunikasi sangat baik selama proses berlangsung.' },
  { id: 3, name: 'Bagas Nugroho', avatar: 'https://i.pravatar.cc/60?img=8', rating: 4, date: '1 bulan lalu', comment: 'Kualitas bagus, hanya ada sedikit revisi yang butuh waktu. Overall sangat puas!' },
];

/* ─── Star component ─── */
const Stars = ({ rating, size = 14 }) => (
  <span className="d-inline-flex align-items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <FiStar
        key={i}
        size={size}
        style={{ fill: i <= Math.round(rating) ? '#F59E0B' : 'none', color: '#F59E0B' }}
      />
    ))}
  </span>
);

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPopularServicesApi();
        const found = res.data?.find(s => s.slug === slug);
        setService(found || null);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '60vh' }}>
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h4 className="fw-bold mt-3">Layanan tidak ditemukan</h4>
        <p className="text-muted mb-4">Layanan ini mungkin sudah tidak tersedia atau URL salah.</p>
        <button className="btn btn-primary px-4" onClick={() => navigate('/dashboard/talent')}>
          <FiArrowLeft className="me-2" /> Kembali ke Pencarian
        </button>
      </div>
    );
  }

  const packages = {
    basic:    { label: 'Paket Dasar',     price: service.price,               desc: 'Termasuk fitur dasar sesuai brief awal.',         delivery: service.delivery_time_days,     revisions: 2 },
    standard: { label: 'Paket Standar',   price: service.price * 1.6,         desc: 'Semua fitur dasar + revisi lebih banyak.',        delivery: service.delivery_time_days + 2, revisions: 5 },
    premium:  { label: 'Paket Premium',   price: service.price * 2.5,         desc: 'Fitur lengkap, prioritas, free konsultasi 1 jam.', delivery: service.delivery_time_days + 5, revisions: 99 },
  };
  const pkg = packages[selectedPackage];

  return (
    <div className="container-fluid py-4 px-lg-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
          <li className="breadcrumb-item">
            <Link to="/dashboard/client" className="text-decoration-none text-primary">Beranda</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/dashboard/talent" className="text-decoration-none text-primary">Cari Talent</Link>
          </li>
          <li className="breadcrumb-item text-muted">{service.category}</li>
          <li className="breadcrumb-item active text-muted text-truncate" style={{ maxWidth: '200px' }}>{service.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* ── Left Column ── */}
        <div className="col-12 col-lg-8">

          {/* Title & Actions */}
          <div className="mb-4">
            <span className="badge rounded-pill mb-2 px-3 py-2" style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.78rem' }}>
              {service.category}
            </span>
            <h2 className="fw-bold mb-3" style={{ lineHeight: '1.35', color: '#0f172a' }}>{service.title}</h2>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <img src={service.freelancer.avatar} alt={service.freelancer.name} className="rounded-circle border" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{service.freelancer.name}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Stars rating={service.rating_avg} />
                <span className="fw-bold small">{service.rating_avg}</span>
                <span className="text-muted small">({service.reviews_count} ulasan)</span>
              </div>
              <div className="d-flex align-items-center gap-1 text-muted small">
                <FiMapPin size={13} style={{ color: '#3b82f6' }} />
                {service.freelancer.location}, Indonesia
              </div>

              {/* Action buttons */}
              <div className="ms-auto d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={() => setIsFavorite(!isFavorite)}>
                  <FiHeart size={15} style={{ fill: isFavorite ? '#ef4444' : 'none', color: isFavorite ? '#ef4444' : undefined }} />
                  {isFavorite ? 'Disimpan' : 'Simpan'}
                </button>
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                  <FiShare2 size={15} /> Bagikan
                </button>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ height: '380px' }}>
            <img src={service.image} alt={service.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
          </div>

          {/* Description */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Deskripsi Layanan</h5>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              Saya menyediakan layanan <strong>{service.title}</strong> dengan kualitas profesional dan pengalaman lebih dari 3 tahun di bidang ini.
              Setiap proyek dikerjakan dengan dedikasi penuh, memastikan hasil yang sesuai dengan kebutuhan dan ekspektasi klien.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              Dengan pendekatan yang terstruktur dan komunikasi aktif selama pengerjaan, saya memastikan setiap detail terpenuhi.
              Tidak perlu khawatir soal revisi — kepuasan Anda adalah prioritas utama saya.
            </p>
            <ul className="mt-3 d-flex flex-column gap-2 ps-0 list-unstyled">
              {['Komunikasi aktif selama proses pengerjaan', 'Revisi sesuai paket yang dipilih', 'File final dikirim dalam format yang diminta', 'Support 7 hari setelah pengiriman'].map((item, i) => (
                <li key={i} className="d-flex align-items-center gap-2 text-muted small">
                  <FiCheckCircle size={16} style={{ color: '#16a34a', flexShrink: 0 }} /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <h5 className="fw-bold mb-0">Ulasan Klien</h5>
              <div className="d-flex align-items-center gap-2">
                <Stars rating={service.rating_avg} size={16} />
                <span className="fw-bold">{service.rating_avg}</span>
                <span className="text-muted small">({service.reviews_count} ulasan)</span>
              </div>
            </div>
            <div className="d-flex flex-column gap-4">
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className="d-flex gap-3">
                  <img src={r.avatar} alt={r.name} className="rounded-circle flex-shrink-0" style={{ width: '44px', height: '44px', objectFit: 'cover' }} />
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{r.name}</span>
                      <Stars rating={r.rating} size={12} />
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{r.date}</span>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column (Sticky) ── */}
        <div className="col-12 col-lg-4">
          <div className="sticky-top" style={{ top: '90px' }}>

            {/* Package selector */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
              {/* Tabs */}
              <div className="d-flex border-bottom">
                {Object.entries(packages).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    className={`btn flex-fill py-3 rounded-0 fw-semibold border-0 ${selectedPackage === key ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                    style={{ fontSize: '0.82rem', borderBottom: selectedPackage === key ? '3px solid #2563eb' : '3px solid transparent' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="fw-bold fs-4" style={{ color: '#2563eb' }}>{formatRupiah(pkg.price)}</span>
                  <div className="d-flex align-items-center gap-1 text-muted small">
                    <FiClock size={14} />
                    <span>{pkg.delivery} Hari Pengiriman</span>
                  </div>
                </div>

                <p className="text-muted small mb-3">{pkg.desc}</p>

                <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                  <li className="d-flex align-items-center gap-2 small">
                    <FiCheckCircle size={15} style={{ color: '#16a34a' }} />
                    <span className="text-muted">{pkg.delivery} hari pengiriman</span>
                  </li>
                  <li className="d-flex align-items-center gap-2 small">
                    <FiCheckCircle size={15} style={{ color: '#16a34a' }} />
                    <span className="text-muted">{pkg.revisions === 99 ? 'Revisi tidak terbatas' : `${pkg.revisions}x revisi`}</span>
                  </li>
                  <li className="d-flex align-items-center gap-2 small">
                    <FiCheckCircle size={15} style={{ color: '#16a34a' }} />
                    <span className="text-muted">Source file disertakan</span>
                  </li>
                  {selectedPackage === 'premium' && (
                    <li className="d-flex align-items-center gap-2 small">
                      <FiCheckCircle size={15} style={{ color: '#16a34a' }} />
                      <span className="text-muted">Konsultasi 1 jam gratis</span>
                    </li>
                  )}
                </ul>

                <button
                  className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-2"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', fontSize: '1rem' }}
                  onClick={() => alert('Fitur pemesanan akan segera tersedia!')}
                >
                  Pesan Sekarang — {formatRupiah(pkg.price)}
                </button>
                <button className="btn btn-outline-primary w-100 py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2">
                  <FiMessageCircle size={16} /> Hubungi Freelancer
                </button>
              </div>
            </div>

            {/* Freelancer Info */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
              <h6 className="fw-bold mb-3">Tentang Freelancer</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="position-relative">
                  <img src={service.freelancer.avatar} alt={service.freelancer.name} className="rounded-circle border-2 border-white shadow-sm" style={{ width: '52px', height: '52px', objectFit: 'cover' }} />
                  <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white" style={{ width: '12px', height: '12px' }}></span>
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.95rem' }}>{service.freelancer.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{service.freelancer.title || 'Freelancer Professional'}</div>
                </div>
              </div>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between text-muted small">
                  <span className="d-flex align-items-center gap-1"><FiStar size={13} style={{ color: '#F59E0B' }} /> Rating</span>
                  <span className="fw-semibold text-dark">{service.rating_avg} / 5.0</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span className="d-flex align-items-center gap-1"><FiUser size={13} /> Total Ulasan</span>
                  <span className="fw-semibold text-dark">{service.reviews_count}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span className="d-flex align-items-center gap-1"><FiMapPin size={13} /> Lokasi</span>
                  <span className="fw-semibold text-dark">{service.freelancer.location}, ID</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="card border-0 rounded-4 p-3" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FiShield size={15} style={{ color: '#16a34a' }} />
                  <span>Pembayaran aman via escrow</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FiRefreshCw size={15} style={{ color: '#16a34a' }} />
                  <span>Garansi uang kembali jika tidak sesuai</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FiCheckCircle size={15} style={{ color: '#16a34a' }} />
                  <span>Freelancer terverifikasi SkillHub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
