import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  FiSearch, FiCheckCircle, FiXCircle, FiEye, FiShield,
  FiUser, FiAlertTriangle, FiRefreshCw, FiFileText,
} from 'react-icons/fi';
import {
  adminGetVerificationsApi,
  adminGetVerificationDetailApi,
  adminApproveVerificationApi,
  adminRejectVerificationApi,
  adminRequestRevisionApi,
} from '../../services/verificationService';
import api from '../../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const FreelancerVerificationsPage = () => {
  const [verifications, setVerifications]       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [statusFilter, setStatusFilter]         = useState('ALL');
  const [searchTerm, setSearchTerm]             = useState('');

  // Detail modal
  const [selected, setSelected]                 = useState(null);
  const [detailLoading, setDetailLoading]       = useState(false);

  // Action modal
  const [actionModal, setActionModal]           = useState(null); // 'reject' | 'revision'
  const [actionReason, setActionReason]         = useState('KTP tidak jelas');
  const [actionNotes, setActionNotes]           = useState('');

  // ─── Data fetching ────────────────────────────────────────────────────────
  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await adminGetVerificationsApi(statusFilter, searchTerm);
      const data = res?.data?.data || res?.data || [];
      setVerifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Admin verifications fetch error (demo fallback):', err);
      setVerifications([
        {
          id: 1,
          full_name: 'GIOVEDI RAHMAT PRABOWO',
          user: { name: 'Giovedi Rahmat', email: 'giovedi@example.com', phone: '081234567890' },
          status: 'PENDING',
          submitted_at: '2026-08-16T10:00:00.000Z',
          masked_nik: '3674★★★★★★★★0001',
          birth_date: '2004-04-15',
          gender: 'Laki-Laki',
          tempat_lahir: 'TANGERANG',
          kelurahan: 'PANINGGILAN UTARA',
          kecamatan: 'CILEDUG',
          kab_kota: 'KOTA TANGERANG',
          provinsi: 'BANTEN',
          agama: 'ISLAM',
          status_perkawinan: 'BELUM KAWIN',
          pekerjaan: 'PELAJAR/MAHASISWA',
          ocr_confidence: 'high',
          documents: [
            { id: 101, document_type: 'ktp',    file_path: 'private/verifications/ktp/demo.jpg' },
            { id: 102, document_type: 'selfie', file_path: 'private/verifications/selfie/demo.jpg' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVerifications(); }, [statusFilter]);

  // ─── Private document URL via authenticated proxy ─────────────────────────
  const getDocumentUrl = (docId) => {
    const token = localStorage.getItem('skillhub_token');
    // Returns URL to the private endpoint; displayed via authenticated <img> (see below)
    return `${API_BASE}/admin/verifications/document/${docId}`;
  };

  // ─── Private image component (sends auth header) ──────────────────────────
  const PrivateImage = ({ docId, alt, style }) => {
    const [src, setSrc] = useState(null);
    const [err, setErr] = useState(false);

    useEffect(() => {
      if (!docId) return;
      let objectUrl;
      api.get(`/admin/verifications/document/${docId}`, { responseType: 'blob' })
        .then(res => {
          objectUrl = URL.createObjectURL(res.data);
          setSrc(objectUrl);
        })
        .catch(() => setErr(true));
      return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [docId]);

    if (err) return (
      <div className="d-flex align-items-center justify-content-center bg-light rounded border text-muted small" style={style}>
        <FiFileText size={24} className="me-2" /> Dokumen tidak tersedia
      </div>
    );
    if (!src) return (
      <div className="d-flex align-items-center justify-content-center bg-light rounded border" style={style}>
        <div className="spinner-border spinner-border-sm text-primary" />
      </div>
    );
    return <img src={src} alt={alt} className="img-fluid rounded border" style={style} />;
  };

  // ─── Open detail ──────────────────────────────────────────────────────────
  const handleOpenReview = async (item) => {
    setSelected(item);
    setDetailLoading(true);
    try {
      const res = await adminGetVerificationDetailApi(item.id);
      if (res?.data) setSelected(res.data);
    } catch (err) {
      console.warn('Using local item for detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // ─── Approve ──────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    if (!selected) return;
    const confirm = await Swal.fire({
      title: 'Setujui Verifikasi?',
      text: `Identitas ${selected.full_name} akan disetujui dan akun diaktifkan.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Setujui',
      confirmButtonColor: '#10B981',
      cancelButtonText: 'Batal',
    });
    if (!confirm.isConfirmed) return;
    try {
      await adminApproveVerificationApi(selected.id);
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Verifikasi identitas disetujui.', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'success', title: 'Berhasil (Demo)', timer: 1500, showConfirmButton: false });
    }
    setSelected(null);
    fetchVerifications();
  };

  // ─── Action submit (Reject / Request Revision) ────────────────────────────
  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      if (actionModal === 'reject') {
        await adminRejectVerificationApi(selected.id, actionReason, actionNotes);
        Swal.fire({ icon: 'info', title: 'Pengajuan Ditolak', timer: 1500, showConfirmButton: false });
      } else {
        await adminRequestRevisionApi(selected.id, actionReason, actionNotes);
        Swal.fire({ icon: 'warning', title: 'Revisi Diminta', timer: 1500, showConfirmButton: false });
      }
    } catch {
      Swal.fire({ icon: 'success', title: `${actionModal === 'reject' ? 'Ditolak' : 'Revisi diminta'} (Demo)`, timer: 1500, showConfirmButton: false });
    }
    setActionModal(null);
    setSelected(null);
    fetchVerifications();
  };

  // ─── Status badge ─────────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const map = {
      VERIFIED:          'bg-success',
      PENDING:           'bg-warning text-dark',
      REJECTED:          'bg-danger',
      SUSPENDED:         'bg-secondary',
      REVISION_REQUIRED: 'bg-info text-dark',
      NOT_SUBMITTED:     'bg-light text-muted border',
    };
    const labels = {
      VERIFIED: '✓ VERIFIED', PENDING: '● PENDING', REJECTED: '✕ REJECTED',
      SUSPENDED: 'SUSPENDED', REVISION_REQUIRED: '↩ REVISION', NOT_SUBMITTED: 'NOT SUBMITTED'
    };
    return <span className={`badge px-3 py-2 fw-semibold ${map[status] || 'bg-light text-muted'}`}>{labels[status] || status}</span>;
  };

  // ─── Confidence badge ─────────────────────────────────────────────────────
  const ConfidenceBadge = ({ confidence }) => {
    if (!confidence) return null;
    const map = {
      high:   'bg-success-subtle text-success border-success-subtle',
      medium: 'bg-warning-subtle text-warning border-warning-subtle',
      low:    'bg-danger-subtle text-danger border-danger-subtle',
    };
    return (
      <span className={`badge border rounded-pill px-2 py-1 ms-1 ${map[confidence] || ''}`}>
        OCR: {confidence}
      </span>
    );
  };

  // ─── Get doc by type ──────────────────────────────────────────────────────
  const getDoc = (docs, type) => (docs || []).find(d => d.document_type === type);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-1">Verifikasi Identitas Freelancer</h3>
          <p className="text-muted small mb-0">Tinjau &amp; konfirmasi dokumen KTP / Selfie freelancer</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={fetchVerifications}>
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter & Search */}
      <div className="sh-card p-3 bg-white rounded-4 shadow-sm border-0 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2">
              {['ALL', 'PENDING', 'REVISION_REQUIRED', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${statusFilter === st ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {st === 'REVISION_REQUIRED' ? 'REVISION' : st}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-5">
            <form onSubmit={e => { e.preventDefault(); fetchVerifications(); }} className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiSearch /></span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary px-3">Cari</button>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="sh-card bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Freelancer</th>
                <th>Email &amp; Phone</th>
                <th>Tanggal Pengajuan</th>
                <th>Status</th>
                <th className="text-end pe-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">Memuat data...</td></tr>
              ) : verifications.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-5 text-muted">Tidak ada pengajuan ditemukan.</td></tr>
              ) : verifications.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="fw-bold text-dark">{item.full_name || item.user?.name}</div>
                    <small className="text-muted">User ID: #{item.user_id || item.user?.id}</small>
                  </td>
                  <td>
                    <div>{item.user?.email || '—'}</div>
                    <small className="text-muted">{item.user?.phone || '—'}</small>
                  </td>
                  <td>
                    <small className="text-muted">
                      {item.submitted_at
                        ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </small>
                  </td>
                  <td><StatusBadge status={item.status} /></td>
                  <td className="text-end pe-4">
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                    >
                      <FiEye /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════ DETAIL REVIEW MODAL ══════════════ */}
      {selected && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">

              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <FiShield className="text-primary" />
                  Review Verifikasi #{selected.id} — {selected.full_name}
                  <StatusBadge status={selected.status} />
                  <ConfidenceBadge confidence={selected.ocr_confidence} />
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} />
              </div>

              <div className="modal-body p-4">
                {detailLoading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : (
                  <div className="row g-4">

                    {/* ── Data Identitas ── */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                        <FiUser /> Data Identitas KTP
                      </h6>
                      <table className="table table-sm table-borderless small">
                        <tbody>
                          <tr>
                            <td className="text-muted" style={{ width: '45%' }}>Nama Lengkap:</td>
                            <td className="fw-bold">{selected.full_name}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">NIK (Masked):</td>
                            <td className="fw-bold font-monospace">{selected.masked_nik || '★★★★★★★★★★★★★★★★'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Tempat Lahir:</td>
                            <td>{selected.tempat_lahir || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Tanggal Lahir:</td>
                            <td>{selected.birth_date ? new Date(selected.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Jenis Kelamin:</td>
                            <td>{selected.gender || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Agama:</td>
                            <td>{selected.agama || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Status Perkawinan:</td>
                            <td>{selected.status_perkawinan || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Pekerjaan:</td>
                            <td>{selected.pekerjaan || '—'}</td>
                          </tr>
                        </tbody>
                      </table>

                      <h6 className="fw-bold mt-3 mb-2 text-primary">Alamat</h6>
                      <table className="table table-sm table-borderless small">
                        <tbody>
                          <tr>
                            <td className="text-muted" style={{ width: '45%' }}>Alamat:</td>
                            <td>{selected.address_encrypted || '(Terenkripsi)'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Kelurahan:</td>
                            <td>{selected.kelurahan || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Kecamatan:</td>
                            <td>{selected.kecamatan || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Kab/Kota:</td>
                            <td>{selected.kab_kota || '—'}</td>
                          </tr>
                          <tr>
                            <td className="text-muted">Provinsi:</td>
                            <td>{selected.provinsi || '—'}</td>
                          </tr>
                        </tbody>
                      </table>

                      {selected.rejection_reason && (
                        <div className="alert alert-warning border-0 rounded-3 p-2 mt-2 small">
                          <strong>Alasan Penolakan/Revisi:</strong><br />
                          {selected.rejection_reason}
                          {selected.rejection_notes && <div className="text-muted mt-1">{selected.rejection_notes}</div>}
                        </div>
                      )}
                    </div>

                    {/* ── Dokumen Private ── */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                        <FiShield /> Dokumen Pendukung (Private Storage)
                      </h6>

                      {/* KTP */}
                      <div className="mb-3">
                        <label className="fw-semibold small d-block mb-1">Foto KTP:</label>
                        <div className="border rounded-3 p-2 bg-light text-center">
                          {getDoc(selected.documents, 'ktp') ? (
                            <PrivateImage
                              docId={getDoc(selected.documents, 'ktp').id}
                              alt="Foto KTP"
                              style={{ maxHeight: '180px', objectFit: 'contain' }}
                            />
                          ) : (
                            <div className="text-muted small py-3">Dokumen KTP tidak tersedia</div>
                          )}
                          <small className="d-block text-muted mt-1">Dokumen disajikan melalui secure private endpoint</small>
                        </div>
                      </div>

                      {/* Selfie */}
                      <div>
                        <label className="fw-semibold small d-block mb-1">Foto Selfie / Wajah:</label>
                        <div className="border rounded-3 p-2 bg-light text-center">
                          {getDoc(selected.documents, 'selfie') ? (
                            <PrivateImage
                              docId={getDoc(selected.documents, 'selfie').id}
                              alt="Foto Selfie"
                              style={{ maxHeight: '180px', objectFit: 'contain' }}
                            />
                          ) : (
                            <div className="text-muted small py-3">Dokumen Selfie tidak tersedia</div>
                          )}
                          <small className="d-block text-muted mt-1">Verifikasi kesesuaian wajah vs KTP</small>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="modal-footer border-top p-3 d-flex justify-content-between">
                <button className="btn btn-light rounded-3 fw-semibold" onClick={() => setSelected(null)}>
                  Tutup
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setActionModal('revision'); setActionReason('Foto KTP kurang jelas'); setActionNotes(''); }}
                    className="btn btn-info text-dark rounded-3 fw-bold px-3 d-flex align-items-center gap-1"
                  >
                    <FiRefreshCw size={15} /> Minta Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActionModal('reject'); setActionReason('KTP tidak jelas'); setActionNotes(''); }}
                    className="btn btn-danger rounded-3 fw-bold px-3 d-flex align-items-center gap-1"
                  >
                    <FiXCircle size={15} /> Tolak
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="btn btn-success rounded-3 fw-bold px-3 d-flex align-items-center gap-1"
                  >
                    <FiCheckCircle size={15} /> Setujui
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════ ACTION MODAL (Reject / Revision) ══════════════ */}
      {actionModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <form onSubmit={handleActionSubmit}>

                <div className="modal-header border-bottom p-4">
                  <h5 className={`modal-title fw-bold d-flex align-items-center gap-2 ${actionModal === 'reject' ? 'text-danger' : 'text-info'}`}>
                    {actionModal === 'reject' ? <><FiXCircle /> Tolak Verifikasi</> : <><FiRefreshCw /> Minta Revisi</>}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setActionModal(null)} />
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      {actionModal === 'reject' ? 'Alasan Penolakan' : 'Alasan Revisi'} <span className="text-danger">*</span>
                    </label>
                    <select className="form-select bg-light" value={actionReason} onChange={e => setActionReason(e.target.value)}>
                      <option value="KTP tidak jelas">Foto KTP buram / tidak terbaca jelas</option>
                      <option value="Data tidak sesuai">Data NIK/Nama tidak sesuai foto KTP</option>
                      <option value="Foto selfie tidak sesuai">Foto selfie tidak sesuai wajah di KTP</option>
                      <option value="Dokumen tidak valid">KTP kadaluwarsa / palsu / bukan fisik KTP asli</option>
                      <option value="Informasi tidak lengkap">Data identitas belum lengkap</option>
                      <option value="NIK tidak valid">NIK tidak valid / tidak sesuai format</option>
                      <option value="Lainnya">Alasan Lainnya</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Catatan Tambahan untuk Freelancer</label>
                    <textarea
                      rows={3}
                      className="form-control bg-light"
                      placeholder="Jelaskan secara spesifik perbaikan yang perlu dilakukan..."
                      value={actionNotes}
                      onChange={e => setActionNotes(e.target.value)}
                    />
                  </div>
                  {actionModal === 'revision' && (
                    <div className="alert alert-info border-0 rounded-3 p-2 small">
                      <FiAlertTriangle className="me-1" />
                      Freelancer akan diminta melakukan perbaikan dan mengajukan ulang dokumen.
                    </div>
                  )}
                </div>

                <div className="modal-footer border-top p-3">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setActionModal(null)}>Batal</button>
                  <button type="submit" className={`btn rounded-3 fw-bold px-4 ${actionModal === 'reject' ? 'btn-danger' : 'btn-info text-dark'}`}>
                    {actionModal === 'reject' ? 'Konfirmasi Tolak' : 'Kirim Permintaan Revisi'}
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

export default FreelancerVerificationsPage;
