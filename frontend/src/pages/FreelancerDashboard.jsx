import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getVerificationStatusApi } from '../services/verificationService';
import VerificationStatusBanner from '../components/freelancer/VerificationStatusBanner';
import AvailabilityBadge from '../components/freelancer/AvailabilityBadge';
import Swal from 'sweetalert2';
import {
  FiTrendingUp, FiDollarSign, FiInbox, FiActivity, FiStar,
  FiCheck, FiChevronRight, FiBriefcase, FiSend, FiPlus,
  FiSearch, FiFileText, FiUser, FiArrowRight
} from 'react-icons/fi';

const FreelancerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, verRes] = await Promise.all([
        api.get('/freelancer/dashboard').catch((e) => {
          console.warn('Dashboard API fallback:', e);
          return null;
        }),
        getVerificationStatusApi().catch(() => null),
      ]);
      
      if (dashRes?.data?.data) {
        const data = dashRes.data.data;
        setDashboardData(data);
        // Use verification from dashboard response as primary source
        if (data.verification && !verRes) {
          setVerificationStatus(data.verification);
        }
      } else {
        setDashboardData({
          user: { name: user?.name || 'Freelancer', availability_status: 'AVAILABLE' },
          stats: { active_orders: 0, completed_orders: 0, total_earnings: 0, rating: 5.0, completion_rate: 100, services_count: 0, views: 0 },
          active_orders: [],
          recommended_jobs: [],
          recent_proposals: [],
        });
      }

      // verRes is already response.data (getVerificationStatusApi returns response.data directly)
      if (verRes) setVerificationStatus(verRes?.data ?? verRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setDashboardData({
        user: { name: user?.name || 'Freelancer', availability_status: 'AVAILABLE' },
        stats: { active_orders: 0, completed_orders: 0, total_earnings: 0, rating: 5.0, completion_rate: 100, services_count: 0, views: 0 },
        active_orders: [],
        recommended_jobs: [],
        recent_proposals: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRestrictedAction = (actionName, targetRoute) => {
    const isVerified = verificationStatus?.identity_status === 'VERIFIED';

    if (!isVerified && actionName !== 'Cari Pekerjaan') {
      Swal.fire({
        icon: 'warning',
        title: 'Verifikasi Identitas Diperlukan',
        text: `Fitur ${actionName} memerlukan akun terverifikasi resmi oleh tim SkillHub.`,
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

    if (targetRoute) navigate(targetRoute);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const {
    user: dashUser = {},
    stats = {},
    wallet = {},
    active_orders = [],
    recommended_jobs: recommendedJobs = [],
    recent_proposals = [],
  } = dashboardData || {};

  const isVerified = verificationStatus?.identity_status === 'VERIFIED';
  const displayName = user?.name || dashUser.name || 'Freelancer';
  const isProfileComplete = !!user?.profile_completed_at;

  return (
    <div className="container-fluid pb-5">

      {/* A. WELCOME HEADER */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <h2 className="fw-bold text-white mb-0">
                Selamat datang kembali, <span className="text-primary">{displayName}</span>! 👋
              </h2>
              {/* Availability Badge */}
              <AvailabilityBadge currentStatus={dashUser.availability_status || 'AVAILABLE'} />
            </div>
            <p className="text-white-50 mb-0">
              Temukan pekerjaan, kelola layanan, dan kembangkan karier freelance Anda di SkillHub.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/dashboard/freelancer/gigs" className="btn btn-primary rounded-3 fw-bold px-4 py-2.5 d-flex align-items-center gap-2 shadow-sm">
              <FiPlus /> + Tambah Layanan
            </Link>

            <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-outline-light rounded-3 fw-semibold px-4 py-2.5 d-flex align-items-center gap-2">
              <FiSearch /> 🔎 Cari Pekerjaan
            </Link>

            {!isProfileComplete && (
              <Link to="/freelancer/onboarding" className="btn btn-warning text-dark rounded-3 fw-bold px-4 py-2.5">
                Lengkapi Profil
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* B. VERIFICATION STATUS BANNER */}
      <VerificationStatusBanner statusInfo={verificationStatus} />

      {/* C. 4 STATISTICS CARDS */}
      <div className="row g-4 mb-5">
        {/* 1. Pesanan Aktif */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)', borderTop: '4px solid #2563eb' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Pesanan Aktif</p>
              <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                <FiInbox size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold mb-1" style={{ color: 'var(--text-main)' }}>{stats.active_orders || 0}</h3>
            <p className="text-muted text-xs mb-0">Dalam tahap pengerjaan</p>
          </div>
        </div>

        {/* 2. Pesanan Selesai */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Pesanan Selesai</p>
              <div className="rounded-3 p-2 bg-success bg-opacity-10 text-success">
                <FiCheck size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold mb-1" style={{ color: 'var(--text-main)' }}>{stats.completed_orders || 0}</h3>
            <p className="text-success text-xs mb-0 fw-semibold">✓ Sukses terkirim</p>
          </div>
        </div>

        {/* 3. Total Pendapatan */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Total Pendapatan</p>
              <div className="rounded-3 p-2 bg-warning bg-opacity-10 text-warning">
                <FiDollarSign size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold mb-1 text-primary">
              Rp {(stats.total_earnings || 0).toLocaleString('id-ID')}
            </h3>
            <p className="text-muted text-xs mb-0">Siap dicairkan ke bank</p>
          </div>
        </div>

        {/* 4. Rating */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Rating Reputasi</p>
              <div className="rounded-3 p-2 bg-purple bg-opacity-10 text-purple">
                <FiStar size={20} />
              </div>
            </div>
            <h3 className="fw-extrabold mb-1" style={{ color: 'var(--text-main)' }}>
              {stats.rating || '4.9'} ⭐
            </h3>
            <p className="text-muted text-xs mb-0">{stats.completion_rate || 98}% Job Success Rate</p>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="row g-4 mb-5">
        {/* Left 8 Columns */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">

          {/* D. RECOMMENDED JOBS SECTION */}
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
                🎯 Rekomendasi Pekerjaan Untuk Anda
              </h4>
              <Link to="/dashboard/freelancer/browse-jobs" className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                Lihat Semua <FiChevronRight />
              </Link>
            </div>

            {recommendedJobs.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="p-3.5 rounded-4 border bg-light dark:bg-dark-subtle hover-lift transition">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs fw-semibold">
                            {job.match_score}% Skill Match
                          </span>
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2.5 py-1 text-xs fw-semibold">
                            {job.job_type === 'fixed_price' ? 'Fixed Price' : 'Hourly'}
                          </span>
                        </div>
                        <Link to={`/dashboard/freelancer/jobs/${job.id}`} className="text-decoration-none">
                          <h6 className="fw-bold text-dark dark:text-light mb-1" style={{ color: 'var(--text-main)' }}>
                            {job.title}
                          </h6>
                        </Link>
                        <p className="text-muted text-xs line-clamp-2 mb-2">{job.description}</p>
                      </div>

                      <div className="text-md-end flex-shrink-0">
                        <span className="fw-extrabold text-primary fs-6">
                          Rp {(job.budget_min || 0).toLocaleString('id-ID')}
                        </span>
                        <div className="text-muted text-xs">{job.deadline_days} Hari</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top text-xs text-muted">
                      <span>Client: <strong>{job.client?.name}</strong></span>
                      <Link to={`/dashboard/freelancer/jobs/${job.id}`} className="fw-bold text-primary text-decoration-none">
                        Ajukan Proposal &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <FiBriefcase size={36} className="mb-2 opacity-50 mx-auto" />
                <p className="mb-0 small">Belum ada pekerjaan rekomendasi saat ini.</p>
              </div>
            )}
          </div>

          {/* E. ACTIVE ORDERS */}
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
                💼 Pesanan Pekerjaan Aktif
              </h4>
              <Link to="/dashboard/freelancer/orders" className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                Kelola Pesanan <FiChevronRight />
              </Link>
            </div>

            {active_orders.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {active_orders.map((ord) => (
                  <div key={ord.id} className="p-3 rounded-4 border bg-white dark:bg-dark d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">{ord.service?.title || `Pesanan #${ord.id}`}</h6>
                      <p className="text-muted text-xs mb-0">Client: {ord.client?.name || 'Client SkillHub'}</p>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold text-primary">Rp {(ord.amount || 0).toLocaleString('id-ID')}</span>
                      <div>
                        <Link to={`/dashboard/freelancer/orders/${ord.id}`} className="text-xs text-decoration-none font-semibold">
                          Detail &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <FiInbox size={36} className="mb-2 opacity-50 mx-auto" />
                <p className="mb-0 small">Belum ada pesanan aktif saat ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">

          {/* J. QUICK ACTIONS */}
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>⚡ Tindakan Cepat (Quick Actions)</h5>

            <div className="d-grid gap-2">
              <Link to="/dashboard/freelancer/gigs" className="btn btn-outline-primary rounded-3 text-start fw-semibold py-2 d-flex align-items-center justify-content-between">
                <span>+ Tambah Layanan</span> <FiChevronRight />
              </Link>

              <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-outline-primary rounded-3 text-start fw-semibold py-2 d-flex align-items-center justify-content-between">
                <span>🔎 Cari Pekerjaan</span> <FiChevronRight />
              </Link>

              <Link to="/dashboard/freelancer/proposals" className="btn btn-outline-secondary rounded-3 text-start fw-semibold py-2 d-flex align-items-center justify-content-between">
                <span>📄 Proposal Terkirim</span> <FiChevronRight />
              </Link>

              <Link to="/dashboard/freelancer/wallet" className="btn btn-outline-secondary rounded-3 text-start fw-semibold py-2 d-flex align-items-center justify-content-between">
                <span>💰 Dompet &amp; Penarikan</span> <FiChevronRight />
              </Link>

              <Link to="/profile" className="btn btn-outline-secondary rounded-3 text-start fw-semibold py-2 d-flex align-items-center justify-content-between">
                <span>👤 Kelola Profil Saya</span> <FiChevronRight />
              </Link>
            </div>
          </div>

          {/* I. PROFILE COMPLETION CHECKLIST */}
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>📋 Checklist Syarat Akun</h5>

            <div className="d-flex flex-column gap-2.5 text-xs text-muted mb-3">
              <div className="d-flex align-items-center gap-2">
                <FiCheck className="text-success" size={16} /> <span>Registrasi Akun</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiCheck className="text-success" size={16} /> <span>Verifikasi Email &amp; WhatsApp OTP</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiCheck className="text-success" size={16} /> <span>Foto Profil &amp; Bio Onboarding</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                {isVerified ? <FiCheck className="text-success" size={16} /> : <div className="rounded-circle border border-warning" style={{ width: '14px', height: '14px' }} />}
                <span className={isVerified ? '' : 'fw-bold text-dark dark:text-light'}>Verifikasi Dokumen Identitas (KTP)</span>
              </div>
            </div>

            {!isVerified && (
              <Link to="/freelancer/verification" className="btn btn-warning text-dark fw-bold rounded-3 py-2 btn-sm w-100">
                Verifikasi Identitas Sekarang
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
