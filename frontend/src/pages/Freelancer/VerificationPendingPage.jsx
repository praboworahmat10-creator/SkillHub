import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiXCircle, FiArrowRight, FiRefreshCw, FiLayers, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getVerificationStatusApi } from '../../services/verificationService';

const VerificationPendingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getVerificationStatusApi();
      if (res.data) {
        setStatusData(res.data);
      }
    } catch (err) {
      console.warn('Status fetch error (demo fallback):', err);
      // Demo state fallback
      setStatusData({
        email_verified: true,
        phone_verified: true,
        profile_completed: true,
        identity_status: 'PENDING',
        overall_status: 'PENDING',
        rejection_reason: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isPending = statusData?.identity_status === 'PENDING';
  const isVerified = statusData?.identity_status === 'VERIFIED';
  const isRejected = statusData?.identity_status === 'REJECTED';

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark shadow-lg border-0 rounded-4 text-center">
              
              <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-4">
                <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
                  <FiLayers size={24} />
                </div>
                <span className="text-primary">Skill</span>
                <span className="text-dark dark:text-light">Hub</span>
              </Link>

              {/* Status Icon Header */}
              {isVerified ? (
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-4 mb-4">
                  <FiCheckCircle size={56} />
                </div>
              ) : isRejected ? (
                <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-4 mb-4">
                  <FiXCircle size={56} />
                </div>
              ) : (
                <div className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle p-4 mb-4">
                  <FiClock size={56} />
                </div>
              )}

              {/* Status Title */}
              {isVerified ? (
                <>
                  <h3 className="fw-bold mb-2 text-success">Verifikasi Disetujui! ✓</h3>
                  <p className="text-muted mb-4">Akun Anda telah resmi terverifikasi sebagai Freelancer SkillHub Indonesia.</p>
                </>
              ) : isRejected ? (
                <>
                  <h3 className="fw-bold mb-2 text-danger">Verifikasi Ditolak</h3>
                  <p className="text-muted mb-4">Pengajuan verifikasi identitas Anda memerlukan perbaikan data.</p>
                </>
              ) : (
                <>
                  <h3 className="fw-bold mb-2">Verifikasi Sedang Diproses</h3>
                  <p className="text-muted mb-4">Tim Admin SkillHub sedang meninjau data identitas dan dokumen yang Anda kirimkan.</p>
                </>
              )}

              {/* Verification Checklist */}
              <div className="bg-light dark:bg-dark-subtle p-4 rounded-4 text-start mb-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiShield className="text-primary" /> Status Progres Akun:
                </h6>
                
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent d-flex align-items-center justify-content-between px-0 py-2 border-0">
                    <span className="small text-muted">1. Email Terverifikasi</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">✓ Terverifikasi</span>
                  </li>
                  <li className="list-group-item bg-transparent d-flex align-items-center justify-content-between px-0 py-2 border-0">
                    <span className="small text-muted">2. Nomor WhatsApp Terverifikasi</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">✓ Terverifikasi</span>
                  </li>
                  <li className="list-group-item bg-transparent d-flex align-items-center justify-content-between px-0 py-2 border-0">
                    <span className="small text-muted">3. Onboarding Profil Lengkap</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">✓ Lengkap</span>
                  </li>
                  <li className="list-group-item bg-transparent d-flex align-items-center justify-content-between px-0 py-2 border-0">
                    <span className="small text-muted">4. Dokumen KTP &amp; Selfie</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">✓ Dikirim</span>
                  </li>
                  <li className="list-group-item bg-transparent d-flex align-items-center justify-content-between px-0 py-2 border-0">
                    <span className="small text-muted">5. Peninjauan Tim Admin</span>
                    {isVerified ? (
                      <span className="badge bg-success fw-bold">✓ Disetujui</span>
                    ) : isRejected ? (
                      <span className="badge bg-danger fw-bold">✕ Ditolak</span>
                    ) : (
                      <span className="badge bg-warning text-dark fw-bold">● Menunggu Review</span>
                    )}
                  </li>
                </ul>
              </div>

              {/* Rejection Detail Box */}
              {isRejected && (
                <div className="alert alert-danger border-0 rounded-4 text-start mb-4">
                  <h6 className="fw-bold mb-1">Alasan Penolakan:</h6>
                  <p className="small mb-1"><strong>Kategori:</strong> {statusData?.rejection_reason || 'Dokumen KTP kurang jelas'}</p>
                  {statusData?.rejection_notes && (
                    <p className="small mb-0"><strong>Catatan:</strong> {statusData.rejection_notes}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="d-grid gap-3">
                {isVerified ? (
                  <Link to="/dashboard/freelancer" className="btn btn-success btn-lg rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                    Masuk ke Dashboard Freelancer <FiArrowRight />
                  </Link>
                ) : isRejected ? (
                  <Link to="/freelancer/verification" className="btn btn-primary btn-lg rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2">
                    Perbaiki &amp; Ajukan Ulang Verifikasi <FiArrowRight />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={fetchStatus}
                      disabled={loading}
                      className="btn btn-outline-primary btn-lg rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      <FiRefreshCw className={loading ? 'spin' : ''} /> Cek Status Terbaru
                    </button>
                    
                    <Link to="/dashboard/freelancer" className="btn btn-light btn-lg rounded-3 fw-semibold">
                      Ke Dashboard (Akses Terbatas)
                    </Link>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
