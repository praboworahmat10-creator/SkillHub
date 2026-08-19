import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobDetailApi } from '../../services/freelancerJobService';
import { getVerificationStatusApi } from '../../services/verificationService';
import Swal from 'sweetalert2';
import { FiBriefcase, FiDollarSign, FiClock, FiMapPin, FiStar, FiCheckCircle, FiArrowLeft, FiShield, FiSend, FiFileText } from 'react-icons/fi';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, verRes] = await Promise.all([
          getJobDetailApi(id),
          getVerificationStatusApi().catch(() => null),
        ]);
        setJob(jobRes.data);
        if (verRes) setVerificationStatus(verRes.data);
      } catch (err) {
        console.error('Failed to load job detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApplyClick = () => {
    const isVerified = verificationStatus?.identity_status === 'VERIFIED';

    if (!isVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Verifikasi Identitas Diperlukan',
        text: 'Anda perlu menyelesaikan verifikasi identitas resmi sebelum dapat mengajukan proposal lamaran pekerjaan di SkillHub.',
        confirmButtonText: 'Verifikasi Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Tutup',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/freelancer/verification');
        }
      });
      return;
    }

    navigate(`/dashboard/freelancer/jobs/${id}/propose`);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!job) return (
    <div className="container py-5 text-center">
      <h4>Pekerjaan tidak ditemukan.</h4>
      <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-primary mt-3">Kembali ke Daftar Pekerjaan</Link>
    </div>
  );

  const { client } = job;

  return (
    <div className="container-fluid pb-5">
      {/* Back Button */}
      <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-link text-decoration-none p-0 mb-4 d-inline-flex align-items-center gap-2 fw-semibold">
        <FiArrowLeft /> Kembali ke Daftar Pekerjaan
      </Link>

      <div className="row g-4">
        {/* Left Column: Job Details */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-semibold">
                {job.job_type === 'fixed_price' ? 'Fixed Price' : 'Hourly Rate'}
              </span>
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill fw-semibold">
                {job.match_score}% Skill Match
              </span>
              <span className="text-muted small ms-auto">
                Diposting {new Date(job.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            <h2 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>{job.title}</h2>

            {/* Overview Stats Row */}
            <div className="row g-3 p-3 rounded-4 bg-light dark:bg-dark-subtle mb-4">
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Estimasi Budget</p>
                <h5 className="fw-bold text-primary mb-0">
                  Rp {(job.budget_min || 0).toLocaleString('id-ID')}
                </h5>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Tenggat Waktu</p>
                <h5 className="fw-bold mb-0">{job.deadline_days} Hari</h5>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Tingkat Pengalaman</p>
                <h5 className="fw-bold mb-0 text-capitalize">{job.experience_level}</h5>
              </div>
              <div className="col-6 col-md-3">
                <p className="text-muted small mb-1">Lokasi</p>
                <h5 className="fw-bold mb-0">{job.is_remote ? 'Remote' : job.location}</h5>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Deskripsi Pekerjaan</h5>
              <p className="text-muted leading-relaxed" style={{ whitespace: 'pre-line' }}>
                {job.description}
              </p>
            </div>

            {/* Scope of Work */}
            {job.scope_of_work && (
              <div className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Lingkup Pekerjaan (Scope)</h5>
                <p className="text-muted leading-relaxed">{job.scope_of_work}</p>
              </div>
            )}

            {/* Requirements & Deliverables */}
            {job.requirements && (
              <div className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Persyaratan</h5>
                <p className="text-muted leading-relaxed">{job.requirements}</p>
              </div>
            )}

            {job.deliverables && (
              <div className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Hasil yang Diharapkan (Deliverables)</h5>
                <p className="text-muted leading-relaxed">{job.deliverables}</p>
              </div>
            )}

            {/* Required Skills */}
            <div className="mb-4 pt-3 border-top">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Keahlian yang Dibutuhkan</h5>
              <div className="d-flex flex-wrap gap-2">
                {job.required_skills?.map((sk, idx) => (
                  <span key={idx} className="badge bg-primary bg-opacity-10 text-primary rounded-3 px-3 py-2 fw-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Client Public Info & Apply CTA */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Informasi Client</h5>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4 flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                {client?.name?.charAt(0) || 'K'}
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{client?.name}</h5>
                {client?.is_verified && (
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs fw-semibold">
                    <FiCheckCircle size={12} /> Client Terverifikasi
                  </span>
                )}
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mb-4 text-muted small pt-2 border-top">
              <div className="d-flex justify-content-between">
                <span>Rating Client:</span>
                <span className="fw-semibold text-dark dark:text-light">⭐ {client?.rating || '4.8'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Proyek Selesai:</span>
                <span className="fw-semibold text-dark dark:text-light">{client?.completed_projects || 12} Proyek</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Bergabung Sejak:</span>
                <span className="fw-semibold text-dark dark:text-light">{client?.member_since || '2024'}</span>
              </div>
            </div>

            {/* Apply Button */}
            {job.has_submitted_proposal ? (
              <div className="alert alert-success border-0 rounded-3 text-center py-2.5 mb-0 fw-semibold">
                ✓ Proposal Sudah Terkirim
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="btn btn-primary btn-lg rounded-3 fw-bold w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <FiSend /> Ajukan Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
