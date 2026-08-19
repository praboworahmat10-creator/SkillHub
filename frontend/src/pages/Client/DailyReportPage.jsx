import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  FiFileText, FiCalendar, FiUser, FiPlus, FiDownload, FiCheck,
  FiVideo, FiImage, FiEye, FiXCircle, FiCheckCircle, FiX, FiPlay, FiClock
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const initialDailyReportsData = [
  {
    id: 1,
    freelancer: 'Diana Putri',
    freelancerTitle: 'Senior UI/UX Designer',
    avatar: 'DP',
    color: '#8b5cf6',
    project: 'UI Redesign Dashboard',
    clientId: 'CLT-84920',
    date: '2026-08-06',
    summary: 'Menyelesaikan desain halaman dashboard utama dan komponen card statistik. Revisi warna dan typography sesuai brief.',
    tasks: ['Desain halaman beranda dashboard', 'Revisi card statistik', 'Diskusi brief dengan tim'],
    hours: 4,
    progress: 65,
    statusCheck: 'ceklis', // 'ceklis' (✅ Sesuai) or 'x' (❌ Belum Sesuai)
    photos: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoTitle: 'Demonstrasi_Fitur_Dashboard_UX.mp4'
  },
  {
    id: 2,
    freelancer: 'Rizky Pratama',
    freelancerTitle: 'Fullstack Laravel Developer',
    avatar: 'RP',
    color: '#3b82f6',
    project: 'API Integration Backend',
    clientId: 'CLT-84920',
    date: '2026-08-06',
    summary: 'Implementasi endpoint autentikasi dan integrasi JWT token. Testing unit untuk modul user management.',
    tasks: ['Setup JWT middleware', 'Buat endpoint /auth/login dan /auth/register', 'Unit testing autentikasi'],
    hours: 5.5,
    progress: 40,
    statusCheck: 'x',
    photos: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: '',
    videoTitle: ''
  },
  {
    id: 3,
    freelancer: 'Diana Putri',
    freelancerTitle: 'Senior UI/UX Designer',
    avatar: 'DP',
    color: '#8b5cf6',
    project: 'UI Redesign Dashboard',
    clientId: 'CLT-84920',
    date: '2026-08-05',
    summary: 'Pengerjaan wireframe mobile responsif dan dokumentasi design system. Finalisasi color palette dark mode.',
    tasks: ['Wireframe mobile view', 'Dokumentasi design system', 'Finalisasi dark mode palette'],
    hours: 8,
    progress: 55,
    statusCheck: 'ceklis',
    photos: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoTitle: 'Preview_Mobile_Wireframe_Walkthrough.mp4'
  },
  {
    id: 4,
    freelancer: 'Andi Wijaya',
    freelancerTitle: 'Flutter App Engineer',
    avatar: 'AW',
    color: '#f59e0b',
    project: 'Mobile App Development',
    clientId: 'CLT-84920',
    date: '2026-08-05',
    summary: 'Implementasi screen onboarding dan integrasi API profil pengguna pada aplikasi Flutter.',
    tasks: ['Buat screen onboarding', 'Integrasi API profil', 'Fix bug navigasi bottom bar'],
    hours: 4,
    progress: 30,
    statusCheck: 'ceklis',
    photos: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80'
    ],
    videoUrl: '',
    videoTitle: ''
  },
];

const DailyReportPage = () => {
  const { user } = useAuth();
  const clientIdDisplay = user ? `#CLT-${String(user.id).padStart(5, '0')}` : '#CLT-84920';

  const [reports, setReports] = useState(initialDailyReportsData);
  const [expandedId, setExpandedId] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [activeModalReport, setActiveModalReport] = useState(null);

  const toggleStatusCheck = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.statusCheck === 'ceklis' ? 'x' : 'ceklis';
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: nextStatus === 'ceklis' ? 'success' : 'warning',
          title: nextStatus === 'ceklis' ? 'Laporan ditandai: ✅ Sesuai' : 'Laporan ditandai: ❌ Belum Sesuai',
          showConfirmButton: false,
          timer: 2000
        });
        return { ...r, statusCheck: nextStatus };
      }
      return r;
    }));
  };

  const filtered = filterDate
    ? reports.filter(r => r.date === filterDate)
    : reports;

  return (
    <div className="container-fluid pb-5">
      
      {/* Page Header with Client ID Badge */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 pt-4 pb-3 px-4 rounded-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
              <FiFileText className="me-2 text-primary" />
              Laporan Harian Pekerjaan
            </h2>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold border border-primary border-opacity-20" style={{ fontSize: '0.82rem' }}>
              ID Client: {clientIdDisplay}
            </span>
          </div>
          <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
            Pantau dokumentasi foto, video, dan verifikasi status pengerjaan harian dari freelancer Anda
          </p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-3 shadow-sm fw-semibold"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          <FiDownload size={16} /> Export Laporan PDF
        </button>
      </div>

      {/* Filter Bar */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <FiCalendar style={{ color: 'var(--text-muted)' }} />
        <input
          type="date"
          className="form-control border-0 shadow-sm"
          style={{ maxWidth: '200px', backgroundColor: 'var(--card-bg)', color: 'var(--text-main)', borderRadius: '10px', fontSize: '0.9rem' }}
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        {filterDate && (
          <button className="btn btn-sm border-0" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }} onClick={() => setFilterDate('')}>
            Reset
          </button>
        )}
        <span className="text-muted small ms-auto">{filtered.length} laporan ditemukan</span>
      </div>

      {/* Report Cards List */}
      <div className="d-flex flex-column gap-4">
        {filtered.map(report => (
          <div
            key={report.id}
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{ backgroundColor: 'var(--card-bg, #ffffff)', transition: 'all 0.2s' }}
          >
            {/* Card Header & Client ID Info */}
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
              
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: report.color, fontSize: '0.95rem' }}
                >
                  {report.avatar}
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark dark:text-light" style={{ fontSize: '1rem' }}>
                    {report.freelancer}
                  </h6>
                  <div className="text-muted text-xs">
                    {report.freelancerTitle} &bull; Proyek: <strong className="text-primary">{report.project}</strong>
                  </div>
                </div>
              </div>

              {/* Status Verification Toggle Button (✅ Sesuai / ❌ Belum Sesuai) */}
              <div className="d-flex align-items-center gap-2 ms-auto">
                <div className="text-muted text-xs me-1">Verifikasi:</div>
                <button
                  onClick={() => toggleStatusCheck(report.id)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 transition ${
                    report.statusCheck === 'ceklis'
                      ? 'btn-success text-white'
                      : 'btn-danger text-white'
                  }`}
                  style={{ fontSize: '0.85rem' }}
                  title="Klik untuk mengubah verifikasi laporan"
                >
                  {report.statusCheck === 'ceklis' ? (
                    <>✅ Sesuai</>
                  ) : (
                    <>❌ Belum Sesuai</>
                  )}
                </button>
              </div>

            </div>

            {/* Date & Hours Badges */}
            <div className="d-flex align-items-center gap-3 mb-3 text-xs text-muted">
              <span className="d-inline-flex align-items-center gap-1">
                <FiCalendar size={14} /> {report.date}
              </span>
              <span>&bull;</span>
              <span className="d-inline-flex align-items-center gap-1 fw-bold text-dark dark:text-light">
                <FiClock size={14} /> {report.hours} Jam Kerja
              </span>
              <span>&bull;</span>
              <span className="badge bg-light text-dark border">Client ID: {clientIdDisplay}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted text-xs">Progress Proyek:</span>
                <span className="fw-bold text-dark dark:text-light text-xs">{report.progress}%</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'var(--border-color, #e2e8f0)' }}>
                <div
                  className="progress-bar rounded-pill"
                  style={{ width: `${report.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                />
              </div>
            </div>

            {/* Summary Excerpt */}
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              {report.summary}
            </p>

            {/* Documentation Badges Preview (Foto & Video) */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
              
              <div className="d-flex align-items-center gap-3">
                {report.photos && report.photos.length > 0 && (
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '0.8rem' }}>
                    <FiImage size={14} /> {report.photos.length} Foto Dokumentasi
                  </span>
                )}
                {report.videoUrl && (
                  <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '0.8rem' }}>
                    <FiVideo size={14} /> 1 Video Demo Projek
                  </span>
                )}
              </div>

              {/* Action: Open Detail Report Modal */}
              <button
                onClick={() => setActiveModalReport(report)}
                className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: '0.85rem' }}
              >
                <FiEye size={14} /> Detail Report
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* ── DETAIL REPORT MODAL WITH PHOTO & VIDEO DOCUMENTATION ── */}
      {activeModalReport && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              
              {/* Modal Header */}
              <div className="modal-header bg-primary text-white p-4">
                <div>
                  <span className="badge bg-white text-primary rounded-pill px-3 py-1 fw-bold text-xs mb-1">
                    DETAIL REPORT HARIAN
                  </span>
                  <h5 className="modal-title fw-extrabold text-white mb-0">
                    Laporan oleh {activeModalReport.freelancer} &bull; {activeModalReport.date}
                  </h5>
                  <small className="opacity-90">ID Client: {clientIdDisplay} | Proyek: {activeModalReport.project}</small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setActiveModalReport(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                
                {/* Verification Status Banner */}
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4 border" style={{ backgroundColor: activeModalReport.statusCheck === 'ceklis' ? '#f0fdf4' : '#fef2f2', borderColor: activeModalReport.statusCheck === 'ceklis' ? '#bbf7d0' : '#fecaca' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '1.2rem' }}>
                      {activeModalReport.statusCheck === 'ceklis' ? '✅' : '❌'}
                    </span>
                    <div>
                      <strong className={activeModalReport.statusCheck === 'ceklis' ? 'text-success' : 'text-danger'}>
                        Status Verifikasi: {activeModalReport.statusCheck === 'ceklis' ? 'Sesuai' : 'Belum Sesuai'}
                      </strong>
                      <div className="text-muted text-xs">Anda dapat mengubah status verifikasi kapan saja.</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toggleStatusCheck(activeModalReport.id);
                      setActiveModalReport(prev => ({
                        ...prev,
                        statusCheck: prev.statusCheck === 'ceklis' ? 'x' : 'ceklis'
                      }));
                    }}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${activeModalReport.statusCheck === 'ceklis' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  >
                    Ubah ke {activeModalReport.statusCheck === 'ceklis' ? '❌ Belum Sesuai' : '✅ Sesuai'}
                  </button>
                </div>

                {/* Summary Section */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Ringkasan Aktivitas:</h6>
                  <p className="text-muted" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {activeModalReport.summary}
                  </p>
                </div>

                {/* Tasks List */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Tugas Selesai Hari Ini:</h6>
                  <div className="d-flex flex-column gap-2 bg-light p-3 rounded-3 border">
                    {activeModalReport.tasks.map((task, i) => (
                      <div key={i} className="d-flex align-items-center gap-2">
                        <FiCheck className="text-success" size={16} />
                        <span className="small text-dark fw-medium">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Documentation Gallery (Foto Dokumentasi Pengerjaan) */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2 d-flex align-items-center gap-1.5">
                    <FiImage className="text-primary" /> Foto Dokumentasi Pengerjaan Proyek:
                  </h6>

                  {activeModalReport.photos && activeModalReport.photos.length > 0 ? (
                    <div className="row g-3">
                      {activeModalReport.photos.map((photoUrl, idx) => (
                        <div key={idx} className="col-12 col-md-6">
                          <div className="border rounded-3 overflow-hidden shadow-2xs">
                            <img
                              src={photoUrl}
                              alt={`Dokumentasi ${idx + 1}`}
                              className="w-100 object-fit-cover"
                              style={{ height: '200px' }}
                            />
                            <div className="p-2 bg-light text-muted text-xs text-center border-top">
                              Screenshot Progress #{idx + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-muted small bg-light rounded-3">Tidak ada foto lampiran untuk hari ini.</div>
                  )}
                </div>

                {/* Video Documentation Player (Video Dokumentasi Pengerjaan) */}
                <div className="mb-3">
                  <h6 className="fw-bold mb-2 d-flex align-items-center gap-1.5">
                    <FiVideo className="text-danger" /> Video Dokumentasi / Walkthrough Pengerjaan:
                  </h6>

                  {activeModalReport.videoUrl ? (
                    <div className="border rounded-3 overflow-hidden shadow-2xs bg-black text-center">
                      <video
                        controls
                        className="w-100"
                        style={{ maxHeight: '320px' }}
                        src={activeModalReport.videoUrl}
                      >
                        Browser Anda tidak mendukung player video HTML5.
                      </video>
                      <div className="p-2 bg-dark text-white-50 text-xs d-flex align-items-center justify-content-between px-3">
                        <span>📹 {activeModalReport.videoTitle || 'Video_Demo_Pengerjaan.mp4'}</span>
                        <a href={activeModalReport.videoUrl} target="_blank" rel="noreferrer" className="text-white text-decoration-none">
                          Buka di tab baru ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-muted small bg-light rounded-3">Tidak ada rekaman video lampiran untuk hari ini.</div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light p-3">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setActiveModalReport(null)}
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DailyReportPage;
