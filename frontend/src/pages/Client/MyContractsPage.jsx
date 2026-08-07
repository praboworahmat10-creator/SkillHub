import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiCalendar, FiClock, FiDollarSign, FiMessageCircle, FiChevronRight, FiAlertCircle, FiCheck, FiLoader } from 'react-icons/fi';

const contractsData = [
  {
    id: 'CTR-2024-001',
    freelancer: 'Diana Putri',
    avatar: 'DP',
    color: '#8b5cf6',
    title: 'UI/UX Redesign Dashboard Admin',
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    budget: 'Rp 8.500.000',
    paid: 'Rp 3.400.000',
    remaining: 'Rp 5.100.000',
    progress: 40,
    status: 'Aktif',
    milestone: 'Wireframe & Prototype',
    nextDeadline: '2026-08-15',
  },
  {
    id: 'CTR-2024-002',
    freelancer: 'Rizky Pratama',
    avatar: 'RP',
    color: '#3b82f6',
    title: 'Backend API Development',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    budget: 'Rp 15.000.000',
    paid: 'Rp 5.000.000',
    remaining: 'Rp 10.000.000',
    progress: 30,
    status: 'Aktif',
    milestone: 'Autentikasi & Modul User',
    nextDeadline: '2026-08-20',
  },
  {
    id: 'CTR-2024-003',
    freelancer: 'Andi Wijaya',
    avatar: 'AW',
    color: '#f59e0b',
    title: 'Mobile App Flutter',
    startDate: '2026-06-01',
    endDate: '2026-08-10',
    budget: 'Rp 12.000.000',
    paid: 'Rp 9.600.000',
    remaining: 'Rp 2.400.000',
    progress: 80,
    status: 'Hampir Selesai',
    milestone: 'Final Testing & Deploy',
    nextDeadline: '2026-08-10',
  },
];

const statusConfig = {
  'Aktif':         { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', dot: '#3b82f6' },
  'Hampir Selesai':{ bg: 'rgba(245,158,11,0.1)', text: '#d97706', dot: '#f59e0b' },
  'Selesai':       { bg: 'rgba(34,197,94,0.1)',  text: '#16a34a', dot: '#22c55e' },
  'Ditangguhkan':  { bg: 'rgba(239,68,68,0.1)',  text: '#dc2626', dot: '#ef4444' },
};

const MyContractsPage = () => {
  const [selected, setSelected] = useState(null);

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
            <FiActivity className="me-2 text-primary" />
            Kontrak Saya
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Kelola semua kontrak berjalan dengan freelancer Anda
          </p>
        </div>
        <Link
          to="/dashboard/client/post-job"
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: '10px', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          + Buat Kontrak Baru
        </Link>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Kontrak Aktif', value: contractsData.filter(c => c.status !== 'Selesai').length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Total Anggaran', value: 'Rp 35.500.000', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Sudah Dibayar', value: 'Rp 18.000.000', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Sisa Pembayaran', value: 'Rp 17.500.000', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '500' }}>{s.label}</p>
              <h5 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Cards */}
      <div className="d-flex flex-column gap-4">
        {contractsData.map(contract => {
          const sc = statusConfig[contract.status] || statusConfig['Aktif'];
          const isExpanded = selected === contract.id;
          return (
            <div
              key={contract.id}
              className="card border-0 shadow-sm rounded-4 p-4"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              onClick={() => setSelected(isExpanded ? null : contract.id)}
            >
              <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '48px', height: '48px', backgroundColor: contract.color, fontSize: '0.9rem' }}
                  >
                    {contract.avatar}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{contract.title}</h6>
                    <small style={{ color: 'var(--text-muted)' }}>
                      {contract.freelancer} · {contract.id}
                    </small>
                  </div>
                </div>
                <span
                  className="badge rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                  style={{ backgroundColor: sc.bg, color: sc.text, fontSize: '0.78rem', fontWeight: '600' }}
                >
                  <span className="rounded-circle" style={{ width: '7px', height: '7px', backgroundColor: sc.dot, display: 'inline-block' }} />
                  {contract.status}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Progress: <strong style={{ color: 'var(--text-main)' }}>{contract.milestone}</strong></span>
                  <span className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>{contract.progress}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: 'var(--border-color)' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{ width: `${contract.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 mb-3">
                <div>
                  <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Periode</p>
                  <p className="mb-0 fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {contract.startDate} → {contract.endDate}
                  </p>
                </div>
                <div>
                  <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Anggaran</p>
                  <p className="mb-0 fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>{contract.budget}</p>
                </div>
                <div>
                  <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Deadline Berikutnya</p>
                  <p className="mb-0 fw-semibold" style={{ color: '#f59e0b', fontSize: '0.85rem' }}>⚠ {contract.nextDeadline}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="pt-3 mt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-color)' }}>
                        <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Sudah Dibayar</p>
                        <p className="mb-0 fw-bold" style={{ color: '#22c55e' }}>{contract.paid}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-color)' }}>
                        <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Sisa Tagihan</p>
                        <p className="mb-0 fw-bold" style={{ color: '#ef4444' }}>{contract.remaining}</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to="/dashboard/messages"
                      className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <FiMessageCircle size={14} /> Kirim Pesan
                    </Link>
                    <button
                      className="btn border"
                      style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                      onClick={e => e.stopPropagation()}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyContractsPage;
