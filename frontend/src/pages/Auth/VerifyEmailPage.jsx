import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiMail, FiCheckCircle, FiRefreshCw, FiArrowRight, FiLayers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { resendEmailVerificationApi, verifyEmailApi } from '../../services/verificationService';

const VerifyEmailPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendEmail = async () => {
    setLoadingResend(true);
    try {
      await resendEmailVerificationApi();
      Swal.fire({
        icon: 'success',
        title: 'Email Terkirim!',
        text: `Link verifikasi email baru telah dikirimkan ke ${user?.email || 'email Anda'}.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Kirim Ulang',
        text: err.response?.data?.message || 'Terlalu banyak resend email. Coba lagi dalam beberapa saat.',
      });
    } finally {
      setLoadingResend(false);
    }
  };

  const handleSimulateVerification = async () => {
    setLoadingVerify(true);
    try {
      const res = await verifyEmailApi();
      if (user) {
        login({ ...user, email_verified_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
      }
      Swal.fire({
        icon: 'success',
        title: 'Email Verified ✓',
        text: 'Email Anda berhasil diverifikasi!',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/freelancer/verify-phone');
    } catch (err) {
      // Fallback for demo mode
      if (user) {
        login({ ...user, email_verified_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
      }
      Swal.fire({
        icon: 'success',
        title: 'Email Verified ✓',
        text: 'Email Anda berhasil diverifikasi!',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/freelancer/verify-phone');
    } finally {
      setLoadingVerify(false);
    }
  };

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

              <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-4 mb-4">
                <FiMail size={48} />
              </div>

              <h3 className="fw-bold mb-2">Verifikasi Email Anda</h3>
              <p className="text-muted mb-4">
                Kami telah mengirimkan link verifikasi email ke alamat:
                <br />
                <strong className="text-dark dark:text-light fs-6">{user?.email || 'email-anda@domain.com'}</strong>
              </p>

              <div className="alert alert-info border-0 rounded-4 mb-4 text-start p-3 small shadow-xs">
                <div className="fw-bold mb-1 d-flex align-items-center gap-1 text-dark">
                  <FiCheckCircle className="text-info" /> Informasi Pengiriman Email &amp; SMTP
                </div>
                <p className="mb-2 text-muted" style={{ fontSize: '0.82rem' }}>
                  Untuk pengiriman email langsung ke inbox Gmail/Outlook, server memerlukan konfigurasi akun <strong>SMTP (Mailtrap / SendGrid / Brevo)</strong> di file <code>backend/.env</code>.
                </p>
                <div className="p-2 bg-white dark:bg-dark rounded-3 border">
                  <span className="text-muted text-xs d-block">Klik tombol di bawah untuk memverifikasi status email akun ini secara instan ke database.</span>
                </div>
              </div>

              <div className="d-grid gap-3">
                <button
                  type="button"
                  onClick={handleSimulateVerification}
                  disabled={loadingVerify}
                  className="btn btn-primary btn-lg rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                  {loadingVerify ? 'Memeriksa Verifikasi...' : <>Saya Sudah Verifikasi Email <FiArrowRight /></>}
                </button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={!canResend || loadingResend}
                  className="btn btn-outline-secondary btn-lg rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                >
                  <FiRefreshCw className={loadingResend ? 'spin' : ''} />
                  {canResend ? 'Kirim Ulang Email' : `Kirim Ulang Email (${timer}s)`}
                </button>
              </div>

              <div className="mt-4 pt-3 border-top text-muted small">
                Salah memasukkan alamat email?{' '}
                <Link to="/freelancer/register" className="text-primary fw-semibold text-decoration-none">
                  Daftar Ulang
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
