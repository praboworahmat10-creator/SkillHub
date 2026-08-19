import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiAlertTriangle, FiClock, FiCheck, FiArrowRight, FiLock } from 'react-icons/fi';

const VerificationStatusBanner = ({ statusInfo }) => {
  if (!statusInfo) return null;

  const {
    is_verified,
    email_verified,
    phone_verified,
    profile_completed,
    identity_status = 'NOT_SUBMITTED',
    rejection_reason,
    rejection_notes,
    reviewed_at,
  } = statusInfo;

  // 1. SUSPENDED Status
  if (identity_status === 'SUSPENDED') {
    return (
      <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-danger bg-opacity-20 text-danger rounded-circle p-3 flex-shrink-0">
            <FiLock size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">Account Suspended</h5>
            <p className="mb-0 small text-danger">
              Akun Anda ditangguhkan karena pelanggaran ketentuan layanan SkillHub. Hubungi dukungkan tim kami.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. REJECTED Status
  if (identity_status === 'REJECTED') {
    return (
      <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-danger bg-opacity-20 text-danger rounded-circle p-3 flex-shrink-0">
            <FiAlertTriangle size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">⚠️ Verifikasi Ditolak</h5>
            <p className="mb-1 small text-danger">
              <strong>Alasan:</strong> {rejection_reason || 'Foto KTP atau dokumen identitas kurang jelas.'}
            </p>
            {rejection_notes && <p className="mb-1 small text-muted"><strong>Catatan Admin:</strong> {rejection_notes}</p>}
            {reviewed_at && <p className="mb-0 text-xs text-muted">Ditinjau pada: {new Date(reviewed_at).toLocaleString('id-ID')}</p>}
          </div>
        </div>
        <Link to="/freelancer/verification" className="btn btn-danger fw-bold rounded-3 px-4 py-2 flex-shrink-0">
          Perbaiki &amp; Kirim Ulang <FiArrowRight />
        </Link>
      </div>
    );
  }

  // 3. PENDING_VERIFICATION Status
  if (identity_status === 'PENDING' || identity_status === 'PENDING_VERIFICATION') {
    return (
      <div className="alert alert-info border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-info bg-opacity-20 text-info rounded-circle p-3 flex-shrink-0">
              <FiClock size={28} />
            </div>
            <div>
              <h5 className="fw-bold mb-1">Verifikasi Sedang Diproses</h5>
              <p className="mb-0 text-muted small">Dokumen identitas Anda sedang diperiksa oleh tim Admin SkillHub.</p>
            </div>
          </div>
          <Link to="/freelancer/verification/pending" className="btn btn-outline-info fw-bold rounded-3 px-4 py-2 flex-shrink-0">
            Lihat Status
          </Link>
        </div>
      </div>
    );
  }

  // 4. VERIFIED Status
  if (is_verified || identity_status === 'VERIFIED') {
    return (
      <div className="alert alert-success bg-success bg-opacity-10 border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2 text-success">
          <FiCheck size={20} className="fw-bold" />
          <span className="fw-bold">✓ Freelancer Terverifikasi</span>
          <span className="text-muted small ms-2 d-none d-md-inline">— Akun Anda telah diverifikasi dan dapat menggunakan seluruh fitur SkillHub.</span>
        </div>
      </div>
    );
  }

  // 5. UNVERIFIED / NOT_SUBMITTED / PROFILE_INCOMPLETE
  if (!email_verified) {
    return (
      <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-warning bg-opacity-20 text-dark rounded-circle p-3 flex-shrink-0">
            <FiShield size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">Verifikasi Email Anda</h5>
            <p className="mb-0 text-muted small">Verifikasi alamat email Anda untuk melanjutkan ke langkah berikutnya.</p>
          </div>
        </div>
        <Link to="/freelancer/verify-email" className="btn btn-warning text-dark fw-bold rounded-3 px-4 py-2 flex-shrink-0">
          Verifikasi Email Sekarang <FiArrowRight />
        </Link>
      </div>
    );
  }

  if (!phone_verified) {
    return (
      <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-warning bg-opacity-20 text-dark rounded-circle p-3 flex-shrink-0">
            <FiShield size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">Verifikasi WhatsApp / Telepon</h5>
            <p className="mb-0 text-muted small">Verifikasi nomor HP Anda via OTP untuk keamanan akun.</p>
          </div>
        </div>
        <Link to="/freelancer/verify-phone" className="btn btn-warning text-dark fw-bold rounded-3 px-4 py-2 flex-shrink-0">
          Verifikasi OTP <FiArrowRight />
        </Link>
      </div>
    );
  }

  if (!profile_completed) {
    return (
      <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-warning bg-opacity-20 text-dark rounded-circle p-3 flex-shrink-0">
            <FiShield size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">Profil Anda belum lengkap</h5>
            <p className="mb-0 text-muted small">Lengkapi data profil onboarding freelancer Anda.</p>
          </div>
        </div>
        <Link to="/freelancer/onboarding" className="btn btn-warning text-dark fw-bold rounded-3 px-4 py-2 flex-shrink-0">
          Lengkapi Profil <FiArrowRight />
        </Link>
      </div>
    );
  }

  // Fallback UNVERIFIED / NOT_SUBMITTED Identity
  return (
    <div className="alert alert-warning border-0 shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div className="d-flex align-items-center gap-3">
        <div className="bg-warning bg-opacity-20 text-dark rounded-circle p-3 flex-shrink-0">
          <FiShield size={28} />
        </div>
        <div>
          <h5 className="fw-bold mb-1">Akun Anda belum terverifikasi</h5>
          <p className="mb-0 text-muted small">Lengkapi verifikasi identitas untuk mendapatkan akses penuh ke fitur Freelancer SkillHub.</p>
        </div>
      </div>
      <Link to="/freelancer/verification" className="btn btn-warning text-dark fw-bold rounded-3 px-4 py-2 flex-shrink-0">
        Verifikasi Sekarang <FiArrowRight />
      </Link>
    </div>
  );
};

export default VerificationStatusBanner;
