import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPublicJobDetailApi } from '../../services/freelancerJobService';
import { useAuth } from '../../context/AuthContext';
import {
  FiArrowLeft, FiUser, FiCalendar, FiDollarSign, FiClock,
  FiBriefcase, FiCheckCircle, FiInfo, FiFileText, FiDownload, FiExternalLink, FiUsers
} from 'react-icons/fi';

const PublicJobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getPublicJobDetailApi(id);
        setJob(data?.data || data || null);
      } catch (err) {
        console.error('Failed to load public job detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleTawarkanPekerjaan = () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Ajukan Proposal Pekerjaan',
        text: 'Untuk melamar & menawarkan pekerjaan ini, silakan daftar atau masuk sebagai Akun Freelancer.',
        showCancelButton: true,
        confirmButtonText: 'Daftar Freelancer',
        cancelButtonText: 'Masuk',
        confirmButtonColor: '#2563eb',
      }).then((res) => {
        if (res.isConfirmed) {
          navigate('/register/freelancer');
        } else if (res.dismiss === Swal.DismissReason.cancel) {
          navigate('/login');
        }
      });
      return;
    }

    if (userRole === 'freelancer' || userRole === 'admin') {
      navigate(`/dashboard/freelancer/jobs/${id}`);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Akun Client',
        text: 'Anda sedang masuk sebagai akun Client. Pengajuan proposal khusus untuk akun Freelancer.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light dark:bg-dark d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading job detail...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-vh-100 bg-light dark:bg-dark py-5 text-center">
        <div className="container">
          <h4 className="fw-bold mb-2">Pekerjaan tidak ditemukan</h4>
          <p className="text-muted mb-4">Pekerjaan ini mungkin telah ditutup atau dihapus oleh client.</p>
          <Link to="/jobboard" className="btn btn-primary rounded-pill px-4">
            Kembali ke Jobboard
          </Link>
        </div>
      </div>
    );
  }

  const clientName = job.client?.name || 'Client SkillHub';
  const createdDate = new Date(job.created_at || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const proposalsList = job.interested_proposals || [];
  const proposalsCount = job.proposals_count || proposalsList.length || 0;

  // Mock sample interested freelancers if empty for demonstration transparency & branding
  const displayProposals = proposalsList.length > 0 ? proposalsList : [
    {
      id: 1,
      cover_letter: "Halo Kak, saya tertarik dengan tawaran pekerjaan yang saat ini sedang Kakak butuhkan. Saya merupakan lulusan pergantian pendidikan dan memiliki pengalaman serta portofolio di bidang ini.",
      proposed_price: job.budget_min || job.budget_max || 1500000,
      estimated_days: job.deadline_days || 14,
      freelancer: {
        id: 101,
        name: "Luthfiatur Rosid",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        title: "Script Writer & Content Specialist",
        rating: 4.9,
      }
    },
    {
      id: 2,
      cover_letter: "Halo, saya telah berpengalaman mengerjakan proyek serupa dengan hasil terbaik & pengerjaan cepat sesuai deadline.",
      proposed_price: job.budget_min || 1200000,
      estimated_days: 7,
      freelancer: {
        id: 102,
        name: "Ahmad Hidayat",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        title: "Digital Freelancer Pro",
        rating: 5.0,
      }
    }
  ];

  return (
    <div className="bg-light dark:bg-dark min-vh-100 py-4 py-md-5">
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Back Link */}
        <div className="mb-3">
          <Link to="/jobboard" className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 hover-primary">
            <FiArrowLeft size={16} /> Kembali ke Jobboard
          </Link>
        </div>

        {/* Main Fastwork Style Card Container (Exact Layout from Screenshot) */}
        <div className="bg-white dark:bg-dark border rounded-4 p-4 p-md-5 shadow-sm mb-5">
          
          {/* Status Badge */}
          <div className="mb-2">
            <span className="badge rounded-pill fw-semibold px-3 py-1.5" style={{ backgroundColor: '#d1fae5', color: '#059669', fontSize: '0.82rem' }}>
              Buka
            </span>
          </div>

          {/* Job Title */}
          <h2 className="fw-bold mb-3" style={{ color: '#2563eb', fontSize: '1.75rem', lineHeight: '1.35', letterSpacing: '-0.01em' }}>
            {job.title}
          </h2>

          {/* Posted By & Client Meta */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                {clientName.charAt(0).toUpperCase()}
              </div>
              <span>Posted by <strong>{clientName}</strong></span>
            </div>
            <span>&bull; {createdDate}</span>
          </div>

          <div className="text-muted small mb-4">
            Bergabung sejak {job.client?.created_at ? new Date(job.client.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '22 Nov 2022'}
          </div>

          <hr className="my-4 border-light-subtle" />

          {/* 2-Column Content (Exact Fastwork Layout from Screenshot) */}
          <div className="row g-4 g-lg-5">
            
            {/* Left Column: Job Description & Details */}
            <div className="col-12 col-lg-7">
              <h5 className="fw-bold mb-3 text-dark dark:text-light">Detail Pekerjaan</h5>
              
              <div
                className="text-dark dark:text-light"
                style={{ fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}
              >
                {job.description}
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold mb-2 text-dark dark:text-light">Keahlian yang Dibutuhkan:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {job.required_skills.map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-dark border px-3 py-1.5 font-monospace fw-normal">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Metadata & CTA Button (Fastwork Screenshot) */}
            <div className="col-12 col-lg-5">
              <div className="bg-light dark:bg-dark p-4 rounded-4 border">
                
                {/* Meta Grid */}
                <div className="row g-3 mb-4 text-xs" style={{ fontSize: '0.88rem' }}>
                  <div className="col-6">
                    <div className="text-muted mb-1">Contoh pekerjaan</div>
                    <div className="fw-bold text-dark dark:text-light">-</div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted mb-1">Tipe Bisnis</div>
                    <div className="fw-bold text-dark dark:text-light">{job.category?.name || 'Aplikasi & Software'}</div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted mb-1">Deadline</div>
                    <div className="fw-bold text-dark dark:text-light">{job.deadline_days ? `${job.deadline_days} Hari` : '-'}</div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted mb-1">Masa Akhir Pekerjaan</div>
                    <div className="fw-bold text-dark dark:text-light">
                      {job.deadline_days ? `Dalam ${job.deadline_days} hari` : 'Dalam sebulan'}
                    </div>
                  </div>

                  <div className="col-6 pt-2">
                    <div className="text-muted mb-1">Budget</div>
                    <div className="fw-extrabold text-primary" style={{ fontSize: '1.05rem', color: '#2563eb' }}>
                      Rp{(job.budget_min || job.budget_max || 0).toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="col-6 pt-2">
                    <div className="text-muted mb-1">Tipe pekerjaan</div>
                    <div className="fw-bold text-dark dark:text-light">
                      {job.job_type === 'contract' ? 'Kontrak kerja (bulanan/tahunan)' : 'Freelance'}
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button: Tawarkan Pekerjaan */}
                <button
                  onClick={handleTawarkanPekerjaan}
                  className="btn btn-primary w-100 py-3 rounded-3 fw-bold text-white shadow-sm"
                  style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', fontSize: '1rem' }}
                >
                  Tawarkan pekerjaan
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* ── INTERESTED FREELANCERS SECTION (Exact Fastwork Layout from Screenshot) ── */}
        <div className="mt-5">
          
          {/* Section Heading */}
          <h4 className="fw-bold mb-3" style={{ color: '#2563eb', fontSize: '1.35rem', lineHeight: '1.4' }}>
            Freelancer tertarik dengan - {job.title} ({displayProposals.length} orang telah mengajukan penawaran pekerjaan)
          </h4>

          {/* Security & Anti-Fraud Banner (Exact Fastwork Text from Screenshot) */}
          <div
            className="p-3.5 rounded-4 mb-4 d-flex align-items-start gap-3 border"
            style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af', fontSize: '0.9rem' }}
          >
            <div className="rounded-circle p-1 bg-primary text-white flex-shrink-0 mt-0.5" style={{ width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justify: 'center', fontSize: '0.75rem' }}>
              i
            </div>
            <div style={{ lineHeight: '1.5' }}>
              Direkomendasikan untuk melakukan komunikasi dan pembayaran melalui SkillHub untuk memastikan Anda terhindar dari penipuan! Kami membantu melindungi pembayaran Anda sampai Anda menerima pekerjaan dari freelancer.
            </div>
          </div>

          {/* List of Interested Freelancer Cards */}
          <div className="d-flex flex-column gap-4">
            {displayProposals.map((prop, idx) => (
              <div
                key={prop.id || idx}
                className="card border-1 shadow-sm rounded-4 p-4 p-md-5"
                style={{ backgroundColor: 'var(--card-bg, #ffffff)', borderColor: 'var(--border-color, #e2e8f0)' }}
              >
                <div className="row g-4">
                  
                  {/* Left Side: Freelancer Profile & Cover Letter */}
                  <div className="col-12 col-lg-8">
                    
                    {/* Freelancer Header */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        src={prop.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={prop.freelancer?.name}
                        className="rounded-circle object-fit-cover flex-shrink-0"
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div>
                        <h6 className="fw-bold mb-0 text-dark dark:text-light" style={{ fontSize: '1.05rem' }}>
                          {prop.freelancer?.name || 'Freelancer SkillHub'}
                        </h6>
                        <span className="text-muted text-xs">{prop.freelancer?.title || 'Professional Freelancer'}</span>
                      </div>
                    </div>

                    {/* Proposal Text */}
                    <p className="text-muted small mb-4" style={{ lineHeight: '1.65', fontSize: '0.92rem' }}>
                      "{prop.cover_letter}"
                    </p>

                    {/* Attachment Link */}
                    <div className="pt-2 border-top">
                      <div className="text-muted text-xs fw-semibold mb-1">Portofolio / Contoh pekerjaan</div>
                      <div className="d-inline-flex align-items-center gap-2 text-primary small fw-semibold">
                        <FiFileText size={16} />
                        <span>Portfolio Writer - {prop.freelancer?.name || 'Freelancer'}.pdf</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Side: Freelancer Gig Product & Action (Screenshot Right Box) */}
                  <div className="col-12 col-lg-4 border-start-lg ps-lg-4">
                    <div className="bg-light dark:bg-dark p-3 rounded-4 border">
                      <div className="text-muted text-xs fw-bold mb-2">Produk Freelancer</div>

                      {/* Mock Product Badge */}
                      <div className="rounded-3 p-3 bg-danger bg-opacity-10 text-danger text-center fw-bold mb-3" style={{ fontSize: '0.85rem' }}>
                        JASA PENULISAN & SKRIP PROYEK
                      </div>

                      <div className="fw-bold text-dark dark:text-light small mb-2">
                        Penulisan Puisi, Cerpen, & Script Proyek
                      </div>

                      <div className="d-flex justify-content-between align-items-center text-xs text-muted mb-3">
                        <span>Masa Kerja</span>
                        <strong className="text-dark dark:text-light">{prop.estimated_days || 14} hari</strong>
                      </div>

                      <button
                        onClick={() => navigate(`/freelancers/${prop.freelancer?.id || 1}`)}
                        className="btn btn-outline-primary btn-sm w-100 rounded-3 fw-bold d-inline-flex align-items-center justify-content-center gap-1.5"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <FiFileText size={14} /> Lihat portfolio freelancer
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PublicJobDetailPage;
