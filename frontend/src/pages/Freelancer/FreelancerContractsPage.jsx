import React, { useEffect, useState } from 'react';
import { getContractsApi } from '../../services/contractService';
import { FiBriefcase, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';

const FreelancerContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const res = await getContractsApi();
        setContracts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="container-fluid pb-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>📑 Kontrak Pekerjaan</h2>
        <p className="text-muted mb-0">Daftar kontrak kerja resmi antara Anda dan client di SkillHub.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : contracts.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {contracts.map((cnt) => (
            <div key={cnt.id} className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div>
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill fw-bold mb-2">
                    KONTRAK #{cnt.id} &bull; {cnt.status?.toUpperCase()}
                  </span>
                  <h5 className="fw-bold mb-1">{cnt.client_job?.title || `Kontrak Proyek #${cnt.id}`}</h5>
                  <p className="text-muted small mb-0">Client: {cnt.client?.name || 'Client SkillHub'}</p>
                </div>

                <div className="text-md-end">
                  <h4 className="fw-bold text-primary mb-1">Rp {(cnt.amount || 0).toLocaleString('id-ID')}</h4>
                  <p className="text-muted text-xs mb-0">Mulai: {new Date(cnt.start_date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted" style={{ backgroundColor: 'var(--card-bg)' }}>
          <FiFileText size={48} className="mb-3 opacity-50 mx-auto" />
          <h5 className="fw-bold mb-1">Belum ada kontrak pekerjaan aktif.</h5>
          <p className="small mb-0">Ajukan proposal pada pekerjaan client untuk mendapatkan kontrak kerja baru!</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerContractsPage;
