import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiX, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { loginApi, registerFreelancerApi } from '../../services/authService';

const FreelancerAuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Sync mode when initialMode prop changes (e.g., route changes)
  useEffect(() => {
    setMode(initialMode);
    reset();
  }, [initialMode]);

  if (!isOpen) return null;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginApi(data);
        const isSuccess = res.success || res.status === 'success';
        const userData = res.data?.user || res.user;
        const userToken = res.data?.token || res.token;

        if (isSuccess && userToken) {
          login(userData, userToken);
          await Swal.fire({
            icon: 'success',
            title: 'Selamat Datang!',
            text: `Berhasil masuk sebagai ${userData.name}`,
            timer: 1500,
            showConfirmButton: false,
          });

          onClose();
          const role = userData.role?.name || userData.role;
          if (role === 'freelancer') navigate('/dashboard/freelancer');
          else if (role === 'admin') navigate('/admin/dashboard');
          else navigate('/dashboard/client');
        } else {
          throw new Error(res.message || 'Login gagal');
        }
      } else {
        // Register Mode
        const payload = {
          name: data.name || (data.email?.includes('@') ? data.email.split('@')[0] : 'Freelancer'),
          email: data.email,
          phone: data.phone || null,
          password: data.password,
          password_confirmation: data.password,
          terms: true,
        };
        const res = await registerFreelancerApi(payload);
        const isSuccess = res.success || res.status === 'success';
        const userData = res.data?.user || res.user;
        const userToken = res.data?.token || res.token;

        if (isSuccess && userToken) {
          login(userData, userToken);
          await Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Selamat datang di SkillHub Freelancer.',
            timer: 1500,
            showConfirmButton: false,
          });
          onClose();
          navigate('/dashboard/freelancer');
        } else {
          throw new Error(res.message || 'Pendaftaran gagal');
        }
      }
    } catch (err) {
      console.error('Auth Modal Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengautentikasi.';
      Swal.fire({
        icon: 'error',
        title: mode === 'login' ? 'Gagal Masuk' : 'Gagal Mendaftar',
        text: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.65)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 1080 
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-dark shadow-2xl overflow-hidden position-relative w-100 animate-fadeIn"
        style={{ 
          maxWidth: '840px', 
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px', zIndex: 10, backgroundColor: '#ffffff', color: '#1e293b' }}
          aria-label="Close modal"
        >
          <FiX size={20} />
        </button>

        <div className="row g-0">
          {/* Left Column: Auth Form */}
          <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              {/* Header Title */}
              <div className="mb-4">
                <h3 className="fw-bold text-dark dark:text-light mb-1" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
                  {mode === 'login' ? 'Masuk Freelancer,' : 'Daftar Freelancer,'}
                </h3>
                <h3 className="fw-bold mb-3" style={{ color: '#3b82f6', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
                  Kini Lebih Efisien
                </h3>
                
                {/* Switcher Mode Tabs */}
                <div className="d-flex gap-2 p-1 bg-light dark:bg-dark-subtle rounded-3 mb-3" style={{ width: 'fit-content' }}>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className={`btn btn-sm fw-semibold rounded-2 px-3 transition-all ${mode === 'login' ? 'bg-white text-primary shadow-xs' : 'text-muted'}`}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className={`btn btn-sm fw-semibold rounded-2 px-3 transition-all ${mode === 'register' ? 'bg-white text-primary shadow-xs' : 'text-muted'}`}
                  >
                    Daftar Akun Baru
                  </button>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {mode === 'register' && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted mb-1">Nama Lengkap</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiUser size={18} /></span>
                      <input
                        type="text"
                        className={`form-control bg-light border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Nama Lengkap"
                        {...register('name', { required: mode === 'register' ? 'Nama wajib diisi' : false })}
                      />
                    </div>
                    {errors.name && <div className="text-danger text-xs mt-1">{errors.name.message}</div>}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted mb-1">Email Profesional</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <FiMail size={18} />
                    </span>
                    <input
                      type="email"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder={mode === 'login' ? 'freelancer@skillhub.id' : 'freelancer@email.com'}
                      {...register('email', { required: 'Email wajib diisi' })}
                    />
                  </div>
                  {errors.email && <div className="text-danger text-xs mt-1">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small text-muted mb-0">Kata Sandi</label>
                    {mode === 'login' && (
                      <Link to="/forgot-password" onClick={onClose} className="text-primary text-xs text-decoration-none">
                        Lupa Password?
                      </Link>
                    )}
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={18} /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control bg-light border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Password minimal 6 karakter' } })}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.password && <div className="text-danger text-xs mt-1">{errors.password.message}</div>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4 shadow-sm"
                  style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" />Memproses...</>
                  ) : (
                    <>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'} <FiArrowRight /></>
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="position-relative text-center my-4">
                <hr className="text-muted opacity-25" />
                <span
                  className="position-absolute top-50 start-50 translate-middle px-3 text-muted"
                  style={{ fontSize: '0.75rem', backgroundColor: '#fff', whiteSpace: 'nowrap' }}
                >
                  Atau lanjutkan dengan
                </span>
              </div>

              {/* Real Social Login Buttons */}
              <div className="d-flex gap-2">
                {/* Google */}
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google/redirect`}
                  className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3"
                  style={{ fontSize: '0.85rem', padding: '10px 0' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </a>

                {/* GitHub */}
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/github/redirect`}
                  className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3"
                  style={{ fontSize: '0.85rem', padding: '10px 0' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </a>
              </div>

            </div>

            {/* Terms Footer Text */}
            <div className="mt-3 text-center text-muted text-xs">
              Dengan melanjutkan, kamu menyetujui <span className="text-primary cursor-pointer">Syarat &amp; Ketentuan</span> serta <span className="text-primary cursor-pointer">Kebijakan Privasi</span> SkillHub.
            </div>
          </div>

          {/* Right Column: Illustration Banner */}
          <div 
            className="col-12 col-md-5 d-none d-md-flex flex-column align-items-center justify-content-center p-5 text-white position-relative"
            style={{ 
              background: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 40%, #6366f1 100%)',
              minHeight: '480px'
            }}
          >
            {/* Playful Floating Illustration / Mascot Artwork */}
            <div className="text-center position-relative my-auto">
              <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <circle cx="100" cy="100" r="75" fill="white" fillOpacity="0.25"/>
                {/* Character Body */}
                <ellipse cx="100" cy="120" rx="45" ry="50" fill="white"/>
                <ellipse cx="100" cy="125" rx="35" ry="40" fill="#f8fafc"/>
                {/* Blue Cape */}
                <path d="M60 100 C 60 70, 140 70, 140 100 C 150 140, 50 140, 60 100 Z" fill="#2563eb"/>
                {/* Face Details */}
                <circle cx="85" cy="105" r="4" fill="#1e293b"/>
                <circle cx="115" cy="105" r="4" fill="#1e293b"/>
                <ellipse cx="78" cy="112" rx="4" ry="2" fill="#f43f5e"/>
                <ellipse cx="122" cy="112" rx="4" ry="2" fill="#f43f5e"/>
                <path d="M96 112 Q100 117 104 112" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                
                {/* Multi Arms Holding Freelance Tools */}
                {/* Left Arm 1: Keyboard */}
                <rect x="25" y="85" width="28" height="18" rx="4" fill="#38bdf8"/>
                <circle cx="32" cy="94" r="2" fill="white"/>
                <circle cx="39" cy="94" r="2" fill="white"/>
                <circle cx="46" cy="94" r="2" fill="white"/>
                
                {/* Left Arm 2: Scissors */}
                <path d="M35 125 L52 112" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="32" cy="128" r="5" stroke="#f43f5e" strokeWidth="3"/>

                {/* Right Arm 1: Paint Brush */}
                <path d="M150 85 L165 72" stroke="#eab308" strokeWidth="4" strokeLinecap="round"/>
                <path d="M165 72 Q170 65 162 68 Z" fill="#ef4444"/>

                {/* Right Arm 2: Wrench */}
                <path d="M148 122 L162 135" stroke="#64748b" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="165" cy="138" r="4" stroke="#64748b" strokeWidth="2"/>

                {/* Feet */}
                <ellipse cx="85" cy="172" rx="8" ry="4" fill="#f59e0b"/>
                <ellipse cx="115" cy="172" rx="8" ry="4" fill="#f59e0b"/>
                <ellipse cx="100" cy="182" rx="25" ry="5" fill="rgba(0,0,0,0.15)"/>
              </svg>

              <div className="mt-3">
                <h5 className="fw-bold mb-1 text-white">SkillHub Marketplace</h5>
                <p className="small text-white-50 mb-0">Ribuan Klien Siap Memesan Jasa Digital Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerAuthModal;
