import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FiActivity, FiCalendar, FiClock, FiDollarSign, FiMessageCircle,
  FiChevronRight, FiAlertCircle, FiCheck, FiLoader, FiAlertTriangle, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const initialContractsData = [
  {
    id: 'CTR-2024-001',
    freelancer: 'Diana Putri',
    freelancerTitle: 'UI/UX Specialist',
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
    reportStatus: 'ceklis', // 'ceklis' (✅ Sesuai) or 'x' (❌ Belum Sesuai)
    revisionsCount: 0,
    complaintNote: '',
  },
  {
    id: 'CTR-2024-002',
    freelancer: 'Rizky Pratama',
    freelancerTitle: 'Backend Developer',
    avatar: 'RP',
    color: '#3b82f6',
    title: 'Backend API Development',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    budget: 'Rp 15.000.000',
    paid: 'Rp 5.000.000',
    remaining: 'Rp 10.000.000',
    progress: 30,
    status: 'Dalam Revisi',
    milestone: 'Autentikasi & Modul User',
    nextDeadline: '2026-08-20',
    reportStatus: 'x',
    revisionsCount: 1,
    complaintNote: 'Response endpoint auth belum menyertakan refresh token.',
  },
  {
    id: 'CTR-2024-003',
    freelancer: 'Andi Wijaya',
    freelancerTitle: 'Flutter Developer',
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
    reportStatus: 'ceklis',
    revisionsCount: 0,
    complaintNote: '',
  },
];

const statusConfig = {
  'Aktif':         { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', dot: '#3b82f6' },
  'Dalam Revisi':  { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', dot: '#ef4444' },
  'Hampir Selesai':{ bg: 'rgba(245,158,11,0.1)', text: '#d97706', dot: '#f59e0b' },
  'Selesai':       { bg: 'rgba(34,197,94,0.1)',  text: '#16a34a', dot: '#22c55e' },
};

const MyContractsPage = () => {
  const { user } = useAuth();
  const clientIdDisplay = user ? `#CLT-${String(user.id).padStart(5, '0')}` : '#CLT-84920';

  const [contracts, setContracts] = useState(initialContractsData);
  const [selectedContractId, setSelectedContractId] = useState(null);
  
  // Complaint / Revision Modal State
  const [activeComplaintContract, setActiveComplaintContract] = useState(null);
  const [complaintCategory, setComplaintCategory] = useState('Hasil Tidak Sesuai Brief');
  const [complaintText, setComplaintText] = useState('');

  const toggleReportStatus = (contractId, e) => {
    e.stopPropagation();
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const nextStatus = c.reportStatus === 'ceklis' ? 'x' : 'ceklis';
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: nextStatus === 'ceklis' ? 'success' : 'warning',
          title: nextStatus === 'ceklis' ? 'Hasil Ditandai: ✅ Sesuai' : 'Hasil Ditandai: ❌ Belum Sesuai',
          showConfirmButton: false,
          timer: 2000
        });
        return { ...c, reportStatus: nextStatus };
      }
      return c;
    }));
  };

  const handleOpenComplaintModal = (contract, e) => {
    e.stopPropagation();
    setActiveComplaintContract(contract);
    setComplaintText(contract.complaintNote || '');
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: 'Mohon isi detail catatan komplain atau instruksi revisi proyek.',
      });
      return;
    }

    setContracts(prev => prev.map(c => {
      if (c.id === activeComplaintContract.id) {
        return {
          ...c,
          status: 'Dalam Revisi',
          reportStatus: 'x',
          revisionsCount: c.revisionsCount + 1,
          complaintNote: `[${complaintCategory}] ${complaintText}`,
        };
      }
      return c;
    }));

    Swal.fire({
      icon: 'success',
      title: 'Komplain & Revisi Dikirim',
      text: `Permintaan revisi berhasil dikirim kepada ${activeComplaintContract.freelancer}. Kontrak kini berstatus Dalam Revisi.`,
      confirmButtonColor: '#2563eb',
    });

    setActiveComplaintContract(null);
    setComplaintText('');
  };

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
              <FiActivity className="me-2 text-primary" />
              Kontrak & Proyek Saya
            </h2>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold border border-primary border-opacity-20" style={{ fontSize: '0.82rem' }}>
              ID Client: {clientIdDisplay}
            </span>
          </div>
          <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
            Kelola semua kontrak berjalan, verifikasi hasil pekerjaan, dan ajukan revisi/komplain jika hasil belum sesuai
          </p>
        </div>

        <Link
          to="/dashboard/client/post-job"
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-3 shadow-sm fw-semibold"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          + Buat Kontrak Baru
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Kontrak Aktif', value: contracts.filter(c => c.status !== 'Selesai').length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Proyek Dalam Revisi', value: contracts.filter(c => c.status === 'Dalam Revisi').length, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Total Anggaran', value: 'Rp 35.500.000', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Sisa Pembayaran', value: 'Rp 17.500.000', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <p className="mb-1 text-muted" style={{ fontSize: '0.78rem', fontWeight: '500' }}>{s.label}</p>
              <h5 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Cards List */}
      <div className="d-flex flex-column gap-4">
        {contracts.map(contract => {
          const sc = statusConfig[contract.status] || statusConfig['Aktif'];
          const isExpanded = selectedContractId === contract.id;
          
          return (
            <div
              key={contract.id}
              className="card border-0 shadow-sm rounded-4 p-4"
              style={{ cursor: 'pointer', transition: 'all 0.2s', backgroundColor: 'var(--card-bg, #ffffff)' }}
              onClick={() => setSelectedContractId(isExpanded ? null : contract.id)}
            >
              {/* Header: Title, Freelancer & Status */}
              <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '48px', height: '48px', backgroundColor: contract.color, fontSize: '0.9rem' }}
                  >
                    {contract.avatar}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark dark:text-light" style={{ fontSize: '1.05rem' }}>
                      {contract.title}
                    </h6>
                    <div className="text-muted text-xs">
                      {contract.freelancer} ({contract.freelancerTitle}) &bull; <span className="fw-bold text-primary">ID Client: {clientIdDisplay}</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* Status Verification Emoji Toggle (✅ Sesuai / ❌ Belum Sesuai) */}
                  <button
                    onClick={(e) => toggleReportStatus(contract.id, e)}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5 transition ${
                      contract.reportStatus === 'ceklis'
                        ? 'btn-success text-white'
                        : 'btn-danger text-white'
                    }`}
                    style={{ fontSize: '0.82rem' }}
                    title="Klik untuk mengubah verifikasi hasil pekerjaan"
                  >
                    {contract.reportStatus === 'ceklis' ? (
                      <>✅ Sesuai</>
                    ) : (
                      <>❌ Belum Sesuai</>
                    )}
                  </button>

                  <span
                    className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                    style={{ backgroundColor: sc.bg, color: sc.text, fontSize: '0.78rem', fontWeight: '600' }}
                  >
                    <span className="rounded-circle" style={{ width: '7px', height: '7px', backgroundColor: sc.dot, display: 'inline-block' }} />
                    {contract.status}
                  </span>
                </div>
              </div>

              {/* Complaint Note Alert Box if in Revision */}
              {contract.status === 'Dalam Revisi' && contract.complaintNote && (
                <div className="p-3 rounded-3 mb-3 border border-danger border-opacity-30 bg-danger bg-opacity-10 text-danger text-xs">
                  <strong>⚠ Status Revisi / Komplain Ditambahkan:</strong>
                  <div className="mt-1">{contract.complaintNote}</div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted text-xs">Milestone: <strong className="text-dark dark:text-light">{contract.milestone}</strong></span>
                  <span className="fw-bold text-dark dark:text-light text-xs">{contract.progress}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: '7px', backgroundColor: 'var(--border-color, #e2e8f0)' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{ width: `${contract.progress}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  />
                </div>
              </div>

              {/* Dates & Budget Bar */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pt-2">
                <div>
                  <p className="mb-0 text-muted text-xs">Periode Kontrak</p>
                  <p className="mb-0 fw-semibold text-dark dark:text-light small">{contract.startDate} → {contract.endDate}</p>
                </div>
                <div>
                  <p className="mb-0 text-muted text-xs">Total Anggaran</p>
                  <p className="mb-0 fw-bold text-primary small">{contract.budget}</p>
                </div>
                <div>
                  <p className="mb-0 text-muted text-xs">Deadline Berikutnya</p>
                  <p className="mb-0 fw-semibold text-warning small">⚠ {contract.nextDeadline}</p>
                </div>

                {/* Complain / Revision Button */}
                <div>
                  <button
                    onClick={(e) => handleOpenComplaintModal(contract, e)}
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <FiAlertTriangle size={14} /> Ajukan Komplain / Revisi
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="pt-3 mt-1 border-top">
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light dark:bg-dark">
                        <p className="mb-1 text-muted text-xs">Sudah Dibayar</p>
                        <p className="mb-0 fw-bold text-success">{contract.paid}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light dark:bg-dark">
                        <p className="mb-1 text-muted text-xs">Sisa Tagihan</p>
                        <p className="mb-0 fw-bold text-danger">{contract.remaining}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Link
                      to="/dashboard/messages"
                      className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-3 text-white fw-bold py-2"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', fontSize: '0.88rem' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <FiMessageCircle size={15} /> Kirim Pesan Ke Freelancer
                    </Link>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ── MODAL AJUKAN KOMPLAIN / REVISI KONTRAK ── */}
      {activeComplaintContract && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              
              <div className="modal-header bg-danger text-white p-4">
                <div>
                  <h5 className="modal-title fw-bold text-white mb-0">
                    ⚡ Form Ajukan Komplain & Revisi Proyek
                  </h5>
                  <small className="opacity-90">Kontrak: {activeComplaintContract.title} ({activeComplaintContract.id})</small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setActiveComplaintContract(null)}
                ></button>
              </div>

              <form onSubmit={handleSubmitComplaint}>
                <div className="modal-body p-4">
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Freelancer Terkait:</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={`${activeComplaintContract.freelancer} (ID Client: ${clientIdDisplay})`}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Kategori Komplain / Revisi:</label>
                    <select
                      className="form-select"
                      value={complaintCategory}
                      onChange={e => setComplaintCategory(e.target.value)}
                    >
                      <option value="Hasil Tidak Sesuai Brief">Hasil Tidak Sesuai Brief</option>
                      <option value="Terlambat Dari Deadline">Terlambat Dari Deadline</option>
                      <option value="Kualitas Pekerjaan Kurang Baik">Kualitas Pekerjaan Kurang Baik</option>
                      <option value="Komunikasi Tidak Responsif">Komunikasi Tidak Responsif</option>
                      <option value="Permintaan Fitur Tambahan / Revisi">Permintaan Fitur Tambahan / Revisi</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Detail Catatan Revisi & Poin Komplain:</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Jelaskan secara rinci bagian mana yang belum sesuai dan apa instruksi perbaikannya..."
                      value={complaintText}
                      onChange={e => setComplaintText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="p-3 bg-light rounded-3 text-muted text-xs border">
                    💡 <strong>Informasi:</strong> Mengirimkan form ini akan mengubah status proyek menjadi <strong>Dalam Revisi</strong> dan memberi tahu freelancer untuk segera memperbaiki hasil pengerjaan.
                  </div>

                </div>

                <div className="modal-footer bg-light p-3">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setActiveComplaintContract(null)}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger rounded-pill px-4 fw-bold"
                  >
                    Kirim Komplain & Revisi
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyContractsPage;
