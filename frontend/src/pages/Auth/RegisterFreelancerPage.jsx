import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiLayers, FiArrowLeft } from 'react-icons/fi';
import { registerFreelancerApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterFreelancerPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, userRole, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (userRole === 'freelancer') navigate('/dashboard/freelancer', { replace: true });
      else if (userRole === 'customer') navigate('/dashboard/client', { replace: true });
      else if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
    }
  }, [user, userRole, navigate]);

  const passwordVal = watch('password', '');

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[@$!%*?&_\-#]/.test(pass)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score: 25, label: 'Sangat Lemah', color: 'bg-danger' };
      case 3:
        return { score: 50, label: 'Sedang', color: 'bg-warning' };
      case 4:
        return { score: 75, label: 'Kuat', color: 'bg-info' };
      case 5:
        return { score: 100, label: 'Sangat Kuat', color: 'bg-success' };
      default:
        return { score: 0, label: 'Terlalu Pendek', color: 'bg-secondary' };
    }
  };

  const strength = calculateStrength(passwordVal);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        terms: data.terms,
      };

      const res = await registerFreelancerApi(payload);
      const isSuccess = res.success || res.status === 'success';
      const userData = res.data?.user || res.user;
      const userToken = res.data?.token || res.token;

      if (isSuccess && userToken) {
        login(userData, userToken);
        await Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil!',
          text: 'Selamat datang di SkillHub Indonesia.',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/freelancer/verify-email');
      } else {
        throw new Error(res.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error('Freelancer registration error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Pendaftaran gagal. Periksa kembali inputan Anda.';
      
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    if (provider === 'google') {
      window.location.href = `${backendUrl}/auth/google`;
    } else {
      Swal.fire({
        icon: 'info',
        title: `Login ${provider}`,
        text: `Fitur login cepat ${provider} sedang dihubungkan ke server OAuth. Anda dapat mengisi form email di bawah.`,
      });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between py-4 bg-light dark:bg-dark">
      {/* Top Bar Header */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-2 mb-4">
          <Link to="/" className="d-flex align-items-center fw-bold fs-4 text-decoration-none">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
              <FiLayers size={20} />
            </div>
            <span className="text-primary">Skill</span>
            <span className="text-dark dark:text-light">Hub</span>
          </Link>

          <div className="text-muted small">
            Ingin merekrut talenta?{' '}
            <Link to="/register/client" className="text-success fw-bold text-decoration-underline ms-1">
              Daftar sebagai Client
            </Link>
          </div>
        </div>
      </div>

      {/* Main Form Container (Upwork Style - Screenshot 4) */}
      <div className="container" style={{ maxWidth: '580px' }}>
        <div className="bg-white dark:bg-dark shadow-sm border border-light-subtle rounded-4 p-4 p-md-5">
          
          {/* Back button */}
          <div className="mb-4">
            <Link to="/register" className="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 hover-primary">
              <FiArrowLeft size={16} /> Kembali ke pilihan akun
            </Link>
          </div>

          <div className="text-center mb-4">
            <h3 className="fw-bold mb-2 text-dark dark:text-light" style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
              Daftar untuk Bekerja sebagai Freelancer
            </h3>
            <p className="text-muted small mb-0">
              Tawarkan keahlian digital Anda & dapatkan penghasilan dari ribuan klien
            </p>
          </div>

          {/* Social Auth Buttons (Google & Apple) */}
          <div className="d-flex flex-column gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="btn btn-outline-dark rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-3 border-secondary-subtle"
              style={{ fontSize: '0.95rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Lanjutkan dengan Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              className="btn btn-outline-dark rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-3 border-secondary-subtle"
              style={{ fontSize: '0.95rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.67-.82 1.12-1.96.99-3.09-.97.04-2.15.65-2.84 1.46-.61.71-1.15 1.87-1.01 2.98 1.09.08 2.19-.53 2.86-1.35z"/>
              </svg>
              Lanjutkan dengan Apple
            </button>
          </div>

          {/* Divider OR */}
          <div className="d-flex align-items-center mb-4">
            <hr className="flex-grow-1 my-0 text-muted" />
            <span className="px-3 text-muted text-xs font-monospace fw-bold">atau</span>
            <hr className="flex-grow-1 my-0 text-muted" />
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Nama Lengkap</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiUser size={18} /></span>
                <input
                  type="text"
                  className={`form-control bg-light border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Contoh: Gio Rahmat"
                  {...register('name', {
                    required: 'Nama lengkap wajib diisi',
                    minLength: { value: 3, message: 'Nama minimal 3 karakter' }
                  })}
                />
              </div>
              {errors.name && <div className="invalid-feedback d-block mt-1">{errors.name.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Email Profesional</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiMail size={18} /></span>
                <input
                  type="email"
                  className={`form-control bg-light border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="gio@email.com"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Format email tidak valid'
                    }
                  })}
                />
              </div>
              {errors.email && <div className="invalid-feedback d-block mt-1">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Nomor WhatsApp (Indonesia)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiPhone size={18} /></span>
                <input
                  type="text"
                  className={`form-control bg-light border-start-0 ps-0 ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="081234567890"
                  {...register('phone', {
                    required: 'Nomor WhatsApp wajib diisi',
                    pattern: {
                      value: /^(08|628|\+628)[0-9]{8,12}$/,
                      message: 'Format nomor HP Indonesia tidak valid (misal: 081234567890)'
                    }
                  })}
                />
              </div>
              {errors.phone && <div className="invalid-feedback d-block mt-1">{errors.phone.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Kata Sandi</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control bg-light border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Minimal 8 karakter"
                  {...register('password', {
                    required: 'Password wajib diisi',
                    minLength: { value: 8, message: 'Minimal 8 karakter' },
                    validate: (val) => {
                      if (!/[A-Z]/.test(val)) return 'Harus mengandung setidaknya 1 huruf besar';
                      if (!/[a-z]/.test(val)) return 'Harus mengandung setidaknya 1 huruf kecil';
                      if (!/[0-9]/.test(val)) return 'Harus mengandung setidaknya 1 angka';
                      if (!/[@$!%*?&_\-#]/.test(val)) return 'Harus mengandung setidaknya 1 karakter khusus (@$!%*?&_-#)';
                      return true;
                    }
                  })}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block mt-1">{errors.password.message}</div>}

              {passwordVal && (
                <div className="mt-2">
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar transition-all ${strength.color}`}
                      role="progressbar"
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Kekuatan Password: <span className="fw-bold text-dark">{strength.label}</span>
                  </small>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Konfirmasi Kata Sandi</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={18} /></span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control bg-light border-start-0 border-end-0 ps-0 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  placeholder="Ulangi kata sandi"
                  {...register('password_confirmation', {
                    required: 'Konfirmasi password wajib diisi',
                    validate: (val) => val === passwordVal || 'Konfirmasi password tidak cocok'
                  })}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password_confirmation && <div className="invalid-feedback d-block mt-1">{errors.password_confirmation.message}</div>}
            </div>

            <div className="mb-4 form-check">
              <input
                type="checkbox"
                className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                id="termsCheck"
                {...register('terms', {
                  required: 'Anda wajib menyetujui Syarat & Ketentuan.'
                })}
              />
              <label className="form-check-label small text-muted" htmlFor="termsCheck">
                Saya menyetujui <Link to="/terms" className="text-success text-decoration-none">Syarat & Ketentuan</Link> dan Kebijakan Privasi SkillHub.
              </label>
              {errors.terms && <div className="invalid-feedback d-block">{errors.terms.message}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-success w-100 py-3 rounded-pill fw-bold text-white shadow-sm"
              style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontSize: '1rem' }}
            >
              {loading ? 'Memproses Pendaftaran...' : 'Daftar sebagai Freelancer'}
            </button>
          </form>

        </div>
      </div>

      {/* Footer link */}
      <div className="container text-center py-3">
        <div className="text-muted small">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-success fw-bold text-decoration-underline ms-1">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterFreelancerPage;
