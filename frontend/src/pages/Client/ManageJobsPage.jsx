import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';

const jobsData = [
  {
    id: 1,
    title: 'Redesign UI/UX Dashboard Admin',
    category: 'UI/UX Design',
    postedAt: '2026-08-01',
    budget: 'Rp 5.000.000',
    status: 'Aktif',
    proposalsCount: 12,
    views: 145,
  },
  {
    id: 2,
    title: 'Pengembangan API Backend Laravel',
    category: 'Web Development',
    postedAt: '2026-07-28',
    budget: 'Rp 8.000.000',
    status: 'Selesai',
    proposalsCount: 8,
    views: 89,
  },
  {
    id: 3,
    title: 'Pembuatan Logo Startup Fintech',
    category: 'Graphic Design',
    postedAt: '2026-08-05',
    budget: 'Rp 2.500.000',
    status: 'Aktif',
    proposalsCount: 24,
    views: 312,
  },
  {
    id: 4,
    title: 'Penulisan Artikel SEO Blog Teknologi',
    category: 'Content Writing',
    postedAt: '2026-08-06',
    budget: 'Rp 1.000.000',
    status: 'Draft',
    proposalsCount: 0,
    views: 0,
  }
];

const statusColor = {
  'Aktif': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', dot: '#22c55e' },
  'Selesai': { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', dot: '#3b82f6' },
  'Draft': { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', dot: '#94a3b8' }
};

const ManageJobsPage = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('Semua');

  /* Sync search state jika URL param berubah (mis. dari navbar search) */
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  const filteredJobs = jobsData.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || job.status === filterStatus;
    return matchSearch && matchStatus;
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
            <FiBriefcase size={24} style={{ color: '#3b82f6' }} />
            Lowongan & Proposal
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Kelola semua pekerjaan yang Anda posting dan tinjau statusnya
          </p>
        </div>
        <Link
          to="/dashboard/client/post-job"
          className="btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{
            borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white', border: 'none', textDecoration: 'none'
          }}
        >
          <FiPlus size={16} /> Posting Pekerjaan Baru
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="d-flex flex-wrap gap-3">
          <div className="position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
            <FiSearch className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Cari lowongan pekerjaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-color)', color: 'var(--text-main)',
                paddingLeft: '40px', borderRadius: '10px', fontSize: '0.9rem',
                border: search ? '1.5px solid var(--primary-color)' : '1.5px solid transparent',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <FiFilter className="text-muted" />
            <select
              className="form-select border-0 shadow-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-color)', color: 'var(--text-main)',
                borderRadius: '10px', fontSize: '0.9rem', minWidth: '150px'
              }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      <div className="row g-4">
        {filteredJobs.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div style={{ color: 'var(--text-muted)' }}>Belum ada lowongan pekerjaan yang ditemukan.</div>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const sc = statusColor[job.status];
            return (
              <div key={job.id} className="col-12 col-md-6 col-xl-4">
                <div 
                  className="card border-0 shadow-sm rounded-4 h-100 p-4" 
                  style={{ backgroundColor: 'var(--card-bg)', transition: 'transform 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span 
                      className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
                      style={{ backgroundColor: sc.bg, color: sc.text, fontWeight: '600', fontSize: '0.75rem' }}
                    >
                      <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: sc.dot }} />
                      {job.status}
                    </span>
                    <button className="btn btn-link text-muted p-0 shadow-none border-0">
                      <FiMoreVertical size={20} />
                    </button>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.4' }}>
                    {job.title}
                  </h5>
                  <p className="mb-3" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>
                    {job.category}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>Budget</div>
                      <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{job.budget}</div>
                    </div>
                    <div className="text-end">
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>Diposting</div>
                      <div className="fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{job.postedAt}</div>
                    </div>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '0 -24px 16px -24px', opacity: 1 }} />

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4">
                      <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <FiEye size={16} /> {job.views}
                      </div>
                      <Link 
                        to="/dashboard/client/proposals" 
                        className="d-flex align-items-center gap-2 text-decoration-none" 
                        style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        <FiBriefcase size={16} /> {job.proposalsCount} Proposal
                      </Link>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', borderRadius: '8px', padding: '6px' }}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', padding: '6px' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageJobsPage;
