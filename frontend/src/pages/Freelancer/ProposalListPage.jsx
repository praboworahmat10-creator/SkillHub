import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProposalsApi, withdrawProposalApi } from '../../services/proposalService';
import { FiFileText, FiClock, FiDollarSign, FiCheckCircle, FiXCircle, FiArrowRight, FiRotateCcw, FiEye } from 'react-icons/fi';

const ProposalListPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await getProposalsApi({ status: activeTab });
      setProposals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [activeTab]);

  const handleWithdraw = (proposalId) => {
    Swal.fire({
      title: 'Tarik Kembali Proposal?',
      text: 'Proposal ini akan ditarik dan tidak akan lagi diproses oleh client.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tarik Proposal',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await withdrawProposalApi(proposalId);
          Swal.fire('Berhasil', 'Proposal telah berhasil ditarik kembali.', 'success');
          fetchProposals();
        } catch (err) {
          console.error(err);
          Swal.fire('Gagal', err.response?.data?.message || 'Gagal menarik proposal.', 'error');
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill fw-semibold">✓ Diterima</span>;
      case 'shortlisted':
        return <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-semibold">⭐ Shortlisted</span>;
      case 'viewed':
        return <span className="badge bg-info bg-opacity-10 text-info px-3 py-1.5 rounded-pill fw-semibold">👀 Dilihat Client</span>;
      case 'rejected':
        return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-1.5 rounded-pill fw-semibold">✕ Ditolak</span>;
      case 'withdrawn':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1.5 rounded-pill fw-semibold">Ditarik</span>;
      case 'sent':
      default:
        return <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1.5 rounded-pill fw-semibold">Terkirim</span>;
    }
  };

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'sent', label: 'Terkirim' },
    { key: 'viewed', label: 'Dilihat' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'accepted', label: 'Diterima' },
    { key: 'rejected', label: 'Ditolak' },
    { key: 'withdrawn', label: 'Ditarik' },
  ];

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>📄 Proposal Terkirim</h2>
          <p className="text-muted mb-0">Kelola dan lacak status lamaran proposal pekerjaan Anda.</p>
        </div>
        <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-primary fw-bold rounded-3 px-4 py-2">
          + Cari Pekerjaan Baru
        </Link>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom mb-4 overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition ${activeTab === tab.key ? 'btn-primary' : 'btn-light text-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Proposal Cards List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : proposals.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {proposals.map((prop) => (
            <div key={prop.id} className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {getStatusBadge(prop.status)}
                    <span className="text-muted small ms-auto d-md-none">
                      {new Date(prop.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                    {prop.client_job?.title || `Proposal #${prop.id}`}
                  </h5>

                  <p className="text-muted small mb-3 line-clamp-2">
                    "{prop.cover_letter}"
                  </p>

                  <div className="d-flex flex-wrap gap-3 text-muted small pt-2 border-top">
                    <span>Penawaran: <strong className="text-primary">Rp {(prop.proposed_price || 0).toLocaleString('id-ID')}</strong></span>
                    <span>Waktu: <strong className="text-dark dark:text-light">{prop.estimated_days} Hari</strong></span>
                    <span>Client: <strong className="text-dark dark:text-light">{prop.client_job?.client?.name || 'Client SkillHub'}</strong></span>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-md-end justify-content-between gap-2 min-w-180">
                  <span className="text-muted text-xs d-none d-md-block">
                    Terkirim {new Date(prop.created_at).toLocaleDateString('id-ID')}
                  </span>

                  <div className="d-flex gap-2 w-100">
                    {prop.status === 'accepted' ? (
                      <Link to="/dashboard/freelancer/contracts" className="btn btn-success fw-bold rounded-3 btn-sm w-100">
                        Lihat Kontrak <FiArrowRight />
                      </Link>
                    ) : (
                      <>
                        {['sent', 'viewed', 'shortlisted'].includes(prop.status) && (
                          <button
                            onClick={() => handleWithdraw(prop.id)}
                            className="btn btn-outline-danger btn-sm rounded-3 fw-semibold flex-grow-1"
                          >
                            Tarik Proposal
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted" style={{ backgroundColor: 'var(--card-bg)' }}>
          <FiFileText size={48} className="mb-3 opacity-50 mx-auto" />
          <h5 className="fw-bold mb-1">Anda belum memiliki proposal pada status ini.</h5>
          <p className="small mb-3">Cari pekerjaan yang sesuai dan kirimkan proposal terbaik Anda!</p>
          <Link to="/dashboard/freelancer/browse-jobs" className="btn btn-primary rounded-3 px-4 mx-auto">
            Cari Pekerjaan Sekarang
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProposalListPage;
