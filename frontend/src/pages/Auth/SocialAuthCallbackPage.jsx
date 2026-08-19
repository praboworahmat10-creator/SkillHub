import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * SocialAuthCallbackPage
 * 
 * Halaman ini menerima redirect dari backend setelah OAuth berhasil.
 * URL format: /auth/social/callback?token=xxx&user=xxx&provider=google
 * 
 * Handles:
 * - Sukses: simpan token + user ke AuthContext, redirect ke dashboard
 * - Error: tampilkan pesan error, redirect kembali ke /freelancer
 */
const SocialAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const error = searchParams.get('error');

    if (error || !token || !userRaw) {
      const msg = searchParams.get('message') || 'Login social gagal. Silakan coba lagi.';
      setErrorMessage(decodeURIComponent(msg));
      setStatus('error');
      setTimeout(() => navigate('/freelancer'), 3500);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      login(user, token);
      setStatus('success');

      const role = user.role;
      setTimeout(() => {
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'freelancer') navigate('/dashboard/freelancer');
        else navigate('/dashboard/client');
      }, 1500);
    } catch (e) {
      setErrorMessage('Terjadi kesalahan saat memproses data login.');
      setStatus('error');
      setTimeout(() => navigate('/freelancer'), 3500);
    }
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%)' }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-5 text-center"
        style={{ maxWidth: '420px', width: '100%' }}
      >
        {status === 'loading' && (
          <>
            <div className="spinner-border text-primary mb-4" style={{ width: '3rem', height: '3rem' }} role="status" />
            <h5 className="fw-bold text-dark mb-2">Memverifikasi Akun...</h5>
            <p className="text-muted small">Mohon tunggu sebentar, kami sedang menghubungkan akun Anda.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-4 mx-auto"
              style={{ width: '72px', height: '72px', background: '#dcfce7' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h5 className="fw-bold text-dark mb-2">Berhasil Masuk! 🎉</h5>
            <p className="text-muted small">Anda akan diarahkan ke dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-4 mx-auto"
              style={{ width: '72px', height: '72px', background: '#fee2e2' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h5 className="fw-bold text-dark mb-2">Login Gagal</h5>
            <p className="text-muted small mb-3">{errorMessage}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Mengalihkan kembali...</p>
          </>
        )}

        <div className="mt-4 pt-3 border-top">
          <span className="fw-bold text-primary" style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
            Skill<span style={{ color: '#6366f1' }}>Hub</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthCallbackPage;
