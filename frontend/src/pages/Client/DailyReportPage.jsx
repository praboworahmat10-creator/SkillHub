import React, { useState } from 'react';
import { FiFileText, FiCalendar, FiUser, FiPlus, FiDownload, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const dailyReportsData = [
  {
    id: 1,
    freelancer: 'Diana Putri',
    avatar: 'DP',
    color: '#8b5cf6',
    project: 'UI Redesign Dashboard',
    date: '2026-08-06',
    summary: 'Menyelesaikan desain halaman dashboard utama dan komponen card statistik. Revisi warna dan typography sesuai brief.',
    tasks: ['Desain halaman beranda dashboard', 'Revisi card statistik', 'Diskusi brief dengan tim'],
    hours: 4,
    progress: 65,
  },
  {
    id: 2,
    freelancer: 'Rizky Pratama',
    avatar: 'RP',
    color: '#3b82f6',
    project: 'API Integration Backend',
    date: '2026-08-06',
    summary: 'Implementasi endpoint autentikasi dan integrasi JWT token. Testing unit untuk modul user management.',
    tasks: ['Setup JWT middleware', 'Buat endpoint /auth/login dan /auth/register', 'Unit testing autentikasi'],
    hours: 5.5,
    progress: 40,
  },
  {
    id: 3,
    freelancer: 'Diana Putri',
    avatar: 'DP',
    color: '#8b5cf6',
    project: 'UI Redesign Dashboard',
    date: '2026-08-05',
    summary: 'Pengerjaan wireframe mobile responsif dan dokumentasi design system. Finalisasi color palette dark mode.',
    tasks: ['Wireframe mobile view', 'Dokumentasi design system', 'Finalisasi dark mode palette'],
    hours: 8,
    progress: 55,
  },
  {
    id: 4,
    freelancer: 'Andi Wijaya',
    avatar: 'AW',
    color: '#f59e0b',
    project: 'Mobile App Development',
    date: '2026-08-05',
    summary: 'Implementasi screen onboarding dan integrasi API profil pengguna pada aplikasi Flutter.',
    tasks: ['Buat screen onboarding', 'Integrasi API profil', 'Fix bug navigasi bottom bar'],
    hours: 4,
    progress: 30,
  },
];

const DailyReportPage = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  const filtered = filterDate
    ? dailyReportsData.filter(r => r.date === filterDate)
    : dailyReportsData;

  return (
    <div className="container-fluid pb-5">
      {/* Page Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 pt-4 pb-3 px-4 rounded-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            <FiFileText className="me-2 text-primary" />
            Laporan Harian
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Catatan aktivitas harian dari freelancer yang bekerja dengan Anda
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: '10px', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          <FiDownload size={16} /> Export Laporan
        </button>
      </div>

      {/* Filter */}
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
        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{filtered.length} laporan ditemukan</span>
      </div>

      {/* Report Cards */}
      <div className="d-flex flex-column gap-4">
        {filtered.map(report => (
          <div
            key={report.id}
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
          >
            {/* Card Header */}
            <div className="d-flex align-items-start justify-content-between mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ width: '44px', height: '44px', backgroundColor: report.color, fontSize: '0.9rem' }}
                >
                  {report.avatar}
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{report.freelancer}</h6>
                  <small style={{ color: 'var(--text-muted)' }}>{report.project}</small>
                </div>
              </div>
              <div className="text-end">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FiCalendar size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{report.date}</span>
                </div>
                <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.88rem' }}>{report.hours} jam</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}>Progress Proyek</span>
                <span className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>{report.progress}%</span>
              </div>
              <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'var(--border-color)' }}>
                <div
                  className="progress-bar rounded-pill"
                  style={{ width: `${report.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                />
              </div>
            </div>

            {/* Summary */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '12px' }}>
              {report.summary}
            </p>

            {/* Toggle Tasks */}
            <button
              className="btn btn-sm border-0 d-flex align-items-center gap-2 p-0"
              style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600', background: 'none' }}
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
            >
              {expandedId === report.id ? '↑ Sembunyikan tugas' : '↓ Lihat detail tugas'}
            </button>

            {/* Task List */}
            {expandedId === report.id && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="fw-semibold mb-2" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Tugas yang Dikerjakan:</p>
                <div className="d-flex flex-column gap-2">
                  {report.tasks.map((task, i) => (
                    <div key={i} className="d-flex align-items-start gap-2">
                      <FiCheck size={15} style={{ color: '#22c55e', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyReportPage;
