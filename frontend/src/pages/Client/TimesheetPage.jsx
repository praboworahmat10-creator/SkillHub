import React, { useState } from 'react';
import {
  FiClock, FiCalendar, FiUsers, FiTrendingUp,
  FiDownload, FiCheck, FiX, FiFilter, FiChevronDown
} from 'react-icons/fi';

/* ─── Data ─── */
const allData = [
  { id: 1, freelancer: 'Diana Putri',    avatar: 'DP', color: '#8b5cf6', project: 'UI Redesign Dashboard',    date: '2026-08-06', startTime: '09:00', endTime: '13:00', duration: 4,   status: 'Disetujui' },
  { id: 2, freelancer: 'Rizky Pratama',  avatar: 'RP', color: '#3b82f6', project: 'API Integration Backend',  date: '2026-08-06', startTime: '10:00', endTime: '15:30', duration: 5.5, status: 'Menunggu'  },
  { id: 3, freelancer: 'Diana Putri',    avatar: 'DP', color: '#8b5cf6', project: 'UI Redesign Dashboard',    date: '2026-08-05', startTime: '09:00', endTime: '17:00', duration: 8,   status: 'Disetujui' },
  { id: 4, freelancer: 'Andi Wijaya',    avatar: 'AW', color: '#f59e0b', project: 'Mobile App Development',   date: '2026-08-05', startTime: '08:00', endTime: '12:00', duration: 4,   status: 'Disetujui' },
  { id: 5, freelancer: 'Rizky Pratama',  avatar: 'RP', color: '#3b82f6', project: 'API Integration Backend',  date: '2026-08-04', startTime: '13:00', endTime: '18:00', duration: 5,   status: 'Disetujui' },
  { id: 6, freelancer: 'Budi Santoso',   avatar: 'BS', color: '#ef4444', project: 'Logo & Brand Identity',    date: '2026-08-04', startTime: '09:00', endTime: '11:00', duration: 2,   status: 'Ditolak'   },
  { id: 7, freelancer: 'Siti Rahayu',   avatar: 'SR', color: '#10b981', project: 'Content Writing Blog',     date: '2026-08-03', startTime: '10:00', endTime: '14:00', duration: 4,   status: 'Disetujui' },
  { id: 8, freelancer: 'Andi Wijaya',    avatar: 'AW', color: '#f59e0b', project: 'Mobile App Development',   date: '2026-08-03', startTime: '13:00', endTime: '17:30', duration: 4.5, status: 'Menunggu'  },
];

const statusCfg = {
  Disetujui: { bg: 'rgba(34,197,94,0.15)',  text: '#22c55e', dot: '#22c55e' },
  Menunggu:  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', dot: '#f59e0b' },
  Ditolak:   { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', dot: '#ef4444' },
};

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
    <div className="d-flex align-items-center gap-3">
      <div
        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: '48px', height: '48px', backgroundColor: bg, color }}
      >
        {icon}
      </div>
      <div>
        <p className="mb-1 fw-semibold" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.2 }}>
          {label}
        </p>
        <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>{value}</h4>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const TimesheetPage = () => {
  const [rows, setRows]           = useState(allData);
  const [filterFL, setFilterFL]   = useState('Semua');
  const [filterSt, setFilterSt]   = useState('Semua');

  const freelancers = ['Semua', ...new Set(allData.map(r => r.freelancer))];
  const statuses    = ['Semua', 'Disetujui', 'Menunggu', 'Ditolak'];

  const filtered = rows.filter(r => {
    const byFL = filterFL === 'Semua' || r.freelancer === filterFL;
    const bySt = filterSt === 'Semua' || r.status    === filterSt;
    return byFL && bySt;
  });

  const totalHours = filtered.reduce((a, r) => a + r.duration, 0);
  const approved   = filtered.filter(r => r.status === 'Disetujui').length;
  const pending    = filtered.filter(r => r.status === 'Menunggu').length;
  const uniqueFL   = new Set(filtered.map(r => r.freelancer)).size;

  const handleApprove = (id) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'Disetujui' } : r));
  const handleReject  = (id) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: 'Ditolak'   } : r));

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
            <FiClock size={24} style={{ color: '#3b82f6' }} />
            Timesheet
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Lacak & kelola jam kerja freelancer pada setiap proyek Anda
          </p>
        </div>
        <button
          className="btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{
            borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white', border: 'none',
          }}
        >
          <FiDownload size={15} /> Export CSV
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard label="Total Jam (Periode Ini)" value={`${totalHours} jam`}
            icon={<FiClock size={20} />} color="#3b82f6" bg="rgba(59,130,246,0.12)" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Entri Disetujui" value={approved}
            icon={<FiTrendingUp size={20} />} color="#16a34a" bg="rgba(34,197,94,0.12)" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Menunggu Persetujuan" value={pending}
            icon={<FiCalendar size={20} />} color="#d97706" bg="rgba(245,158,11,0.12)" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard label="Total Freelancer" value={uniqueFL}
            icon={<FiUsers size={20} />} color="#8b5cf6" bg="rgba(139,92,246,0.12)" />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <FiFilter size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>Freelancer:</span>
          <select
            className="form-select border-0 shadow-sm"
            value={filterFL}
            onChange={e => setFilterFL(e.target.value)}
            style={{
              backgroundColor: 'var(--card-bg)', color: 'var(--text-main)',
              borderRadius: '10px', fontSize: '0.88rem', minWidth: '160px',
            }}
          >
            {freelancers.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>Status:</span>
          <select
            className="form-select border-0 shadow-sm"
            value={filterSt}
            onChange={e => setFilterSt(e.target.value)}
            style={{
              backgroundColor: 'var(--card-bg)', color: 'var(--text-main)',
              borderRadius: '10px', fontSize: '0.88rem', minWidth: '140px',
            }}
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: 'auto' }}>
          Menampilkan {filtered.length} dari {allData.length} entri
        </span>
      </div>

      {/* ── Table ── */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', '--bs-table-bg': 'transparent' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                {[
                  { label: 'Freelancer',    width: '200px' },
                  { label: 'Proyek',        width: 'auto'  },
                  { label: 'Tanggal',       width: '120px' },
                  { label: 'Mulai',         width: '90px'  },
                  { label: 'Selesai',       width: '90px'  },
                  { label: 'Durasi',        width: '90px'  },
                  { label: 'Status',        width: '120px' },
                  { label: 'Aksi',          width: '140px' },
                ].map(({ label, width }) => (
                  <th
                    key={label}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--border-color)',
                      borderTop: 'none',
                      width,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-5" style={{ color: 'var(--text-muted)', borderTop: 'none' }}>
                    Tidak ada data yang cocok dengan filter ini.
                  </td>
                </tr>
              )}
              {filtered.map((row, idx) => {
                const sc = statusCfg[row.status];
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-color)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Freelancer */}
                    <td style={{ padding: '14px 20px', border: 'none' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: '34px', height: '34px', backgroundColor: row.color, fontSize: '0.7rem', letterSpacing: '0.03em' }}
                        >
                          {row.avatar}
                        </div>
                        <span className="fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                          {row.freelancer}
                        </span>
                      </div>
                    </td>

                    {/* Project */}
                    <td style={{ padding: '14px 20px', border: 'none', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {row.project}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 20px', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {row.date}
                    </td>

                    {/* Start Time */}
                    <td style={{ padding: '14px 20px', border: 'none', whiteSpace: 'nowrap' }}>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: '600', fontSize: '0.82rem' }}
                      >
                        {row.startTime}
                      </span>
                    </td>

                    {/* End Time */}
                    <td style={{ padding: '14px 20px', border: 'none', whiteSpace: 'nowrap' }}>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{ backgroundColor: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontWeight: '600', fontSize: '0.82rem' }}
                      >
                        {row.endTime}
                      </span>
                    </td>

                    {/* Duration */}
                    <td style={{ padding: '14px 20px', border: 'none', whiteSpace: 'nowrap' }}>
                      <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                        {row.duration} jam
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 20px', border: 'none' }}>
                      <span
                        className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                        style={{ backgroundColor: sc.bg, color: sc.text, fontWeight: '600', fontSize: '0.78rem' }}
                      >
                        <span
                          className="rounded-circle"
                          style={{ width: '6px', height: '6px', backgroundColor: sc.dot, display: 'inline-block', flexShrink: 0 }}
                        />
                        {row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', border: 'none' }}>
                      {row.status === 'Menunggu' ? (
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleApprove(row.id)}
                            className="btn btn-sm d-flex align-items-center gap-1"
                            style={{
                              borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.12)',
                              color: '#16a34a', fontSize: '0.78rem', fontWeight: '600', border: 'none',
                              padding: '5px 12px',
                            }}
                          >
                            <FiCheck size={13} /> Setujui
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            className="btn btn-sm d-flex align-items-center gap-1"
                            style={{
                              borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.12)',
                              color: '#dc2626', fontSize: '0.78rem', fontWeight: '600', border: 'none',
                              padding: '5px 12px',
                            }}
                          >
                            <FiX size={13} /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer total */}
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                  <td colSpan={5} style={{ padding: '12px 20px', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: '600' }}>
                    Total ({filtered.length} entri)
                  </td>
                  <td style={{ padding: '12px 20px', border: 'none' }}>
                    <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                      {totalHours} jam
                    </span>
                  </td>
                  <td colSpan={2} style={{ padding: '12px 20px', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {approved} disetujui · {pending} menunggu
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimesheetPage;
