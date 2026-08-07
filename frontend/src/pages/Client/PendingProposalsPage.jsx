import React, { useState } from 'react';
import { FiFileText, FiMessageSquare, FiCheck, FiX, FiDownload, FiStar, FiFilter, FiUser } from 'react-icons/fi';

const proposalsData = [
  {
    id: 1,
    freelancer: 'Rizky Pratama',
    avatar: 'RP',
    color: '#3b82f6',
    jobTitle: 'Pengembangan API Backend Laravel',
    bid: 'Rp 7.500.000',
    duration: '14 Hari',
    coverLetter: 'Saya memiliki pengalaman 4 tahun di Laravel dan pernah mengerjakan sistem serupa. Saya siap memulai kapan saja.',
    rating: 4.8,
    jobsDone: 15,
    status: 'Menunggu'
  },
  {
    id: 2,
    freelancer: 'Diana Putri',
    avatar: 'DP',
    color: '#8b5cf6',
    jobTitle: 'Redesign UI/UX Dashboard Admin',
    bid: 'Rp 4.500.000',
    duration: '10 Hari',
    coverLetter: 'Halo! Saya spesialis UI/UX untuk B2B Dashboard. Saya lampirkan portofolio Dribbble saya di bawah.',
    rating: 5.0,
    jobsDone: 32,
    status: 'Menunggu'
  },
  {
    id: 3,
    freelancer: 'Budi Santoso',
    avatar: 'BS',
    color: '#ef4444',
    jobTitle: 'Pengembangan API Backend Laravel',
    bid: 'Rp 8.000.000',
    duration: '21 Hari',
    coverLetter: 'Saya bisa mengerjakan ini. Waktu mungkin sedikit lebih lama untuk memastikan kualitas tinggi dan keamanan.',
    rating: 4.5,
    jobsDone: 8,
    status: 'Menunggu'
  },
];

const PendingProposalsPage = () => {
  const [filterJob, setFilterJob] = useState('Semua');

  const jobs = ['Semua', ...new Set(proposalsData.map(p => p.jobTitle))];

  const filteredProposals = proposalsData.filter(p => {
    return filterJob === 'Semua' || p.jobTitle === filterJob;
  });

  return (
    <div className="container-fluid pb-5">
      {/* ── Page Header ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-2 px-4 py-3 rounded-4 shadow-sm gap-3"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <FiFileText size={24} style={{ color: '#f59e0b' }} />
            Penawaran Tertunda
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tinjau lamaran dan proposal dari freelancer untuk proyek Anda
          </p>
        </div>
        <button
          className="btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{
            borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem',
            background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)'
          }}
        >
          <FiDownload size={15} /> Export PDF
        </button>
      </div>

      {/* ── Filter ── */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="d-flex align-items-center gap-2">
          <FiFilter className="text-muted" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Filter Pekerjaan:</span>
          <select
            className="form-select border-0 shadow-none"
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-color)', color: 'var(--text-main)',
              borderRadius: '10px', fontSize: '0.9rem', maxWidth: '400px'
            }}
          >
            {jobs.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      </div>

      {/* ── Proposals List ── */}
      <div className="d-flex flex-column gap-3">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
            Belum ada penawaran untuk lowongan ini.
          </div>
        ) : (
          filteredProposals.map(proposal => (
            <div key={proposal.id} className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="row g-4 align-items-center">
                {/* User Info */}
                <div className="col-12 col-lg-4">
                  <div className="d-flex gap-3">
                    <div 
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: '56px', height: '56px', backgroundColor: proposal.color, fontSize: '1.2rem' }}
                    >
                      {proposal.avatar}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{proposal.freelancer}</h5>
                      <div className="d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span className="d-flex align-items-center gap-1" style={{ color: '#f59e0b' }}>
                          <FiStar className="fill-current" /> {proposal.rating}
                        </span>
                        <span>•</span>
                        <span>{proposal.jobsDone} Pekerjaan Selesai</span>
                      </div>
                      <button className="btn btn-sm text-primary p-0 fw-semibold shadow-none border-0 d-flex align-items-center gap-1">
                        <FiUser size={14} /> Lihat Profil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Proposal Detail */}
                <div className="col-12 col-lg-5">
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
                    Melamar untuk:
                  </div>
                  <div className="fw-semibold mb-3" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {proposal.jobTitle}
                  </div>
                  <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    <span className="fw-semibold text-primary">Cover Letter: </span>
                    "{proposal.coverLetter}"
                  </div>
                </div>

                {/* Bid & Actions */}
                <div className="col-12 col-lg-3 text-lg-end">
                  <div className="mb-3">
                    <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>
                      {proposal.bid}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Waktu Pengerjaan: <span className="fw-semibold" style={{ color: 'var(--text-main)' }}>{proposal.duration}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                    <button 
                      className="btn d-flex align-items-center justify-content-center gap-1 px-3"
                      style={{ borderRadius: '10px', backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', fontWeight: '600', fontSize: '0.85rem', border: 'none' }}
                    >
                      <FiMessageSquare size={14} /> Pesan
                    </button>
                    <button 
                      className="btn d-flex align-items-center justify-content-center gap-1 px-3"
                      style={{ borderRadius: '10px', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '600', fontSize: '0.85rem', border: 'none' }}
                    >
                      <FiCheck size={14} /> Terima
                    </button>
                    <button 
                      className="btn d-flex align-items-center justify-content-center px-3"
                      style={{ borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: '600', fontSize: '0.85rem', border: 'none' }}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingProposalsPage;
