import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLayers, FiBriefcase, FiUserCheck, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const RegisterRoleSelectPage = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'client' or 'freelancer'
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (userRole === 'freelancer') navigate('/dashboard/freelancer', { replace: true });
      else if (userRole === 'customer') navigate('/dashboard/client', { replace: true });
      else if (userRole === 'admin') navigate('/admin/dashboard', { replace: true });
    }
  }, [user, userRole, navigate]);

  const handleContinue = () => {
    if (selectedRole === 'client') {
      navigate('/register/client');
    } else if (selectedRole === 'freelancer') {
      navigate('/register/freelancer');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Brand Header */}
        <div className="text-center mb-5">
          <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-4">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
              <FiLayers size={24} />
            </div>
            <span className="text-primary">Skill</span>
            <span className="text-dark dark:text-light">Hub</span>
          </Link>
          <h2 className="fw-bold mb-2 text-dark dark:text-light" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>
            Selamat datang di SkillHub
          </h2>
          <p className="text-muted fs-5 mb-0">
            Bagaimana Anda ingin menggunakan platform ini?
          </p>
        </div>

        {/* 2 Choice Cards Grid (Upwork Style) */}
        <div className="row g-4 justify-content-center mb-5">
          
          {/* Card 1: Client */}
          <div className="col-12 col-md-6">
            <div
              onClick={() => setSelectedRole('client')}
              className={`card border-2 rounded-4 p-4 p-lg-5 h-100 text-center cursor-pointer transition-all ${
                selectedRole === 'client'
                  ? 'border-success shadow-lg'
                  : 'border-light-subtle shadow-sm hover-lift'
              }`}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRole === 'client' ? '#eefdf3' : 'var(--card-bg, #ffffff)',
                borderColor: selectedRole === 'client' ? '#10b981' : '#e2e8f0',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Radio check top right */}
              <div className="d-flex justify-content-end mb-2">
                <div
                  className={`rounded-circle border d-flex align-items-center justify-content-center`}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderColor: selectedRole === 'client' ? '#10b981' : '#cbd5e1',
                    backgroundColor: selectedRole === 'client' ? '#10b981' : 'transparent',
                  }}
                >
                  {selectedRole === 'client' && <span className="text-white fw-bold text-xs">✓</span>}
                </div>
              </div>

              {/* Icon Container */}
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-4" style={{ width: '90px', height: '90px', backgroundColor: selectedRole === 'client' ? '#d1fae5' : '#f1f5f9', color: selectedRole === 'client' ? '#047857' : '#334155' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <rect x="14" y="13" width="7" height="6" rx="1" />
                </svg>
              </div>

              <h4 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.4rem' }}>
                Saya ingin merekrut talenta <span className="text-muted fs-5">&rarr;</span>
              </h4>
              <p className="text-muted small mb-0 px-2" style={{ lineHeight: '1.5' }}>
                Posting pekerjaan & rekrut freelancer profesional untuk proyek bisnis Anda.
              </p>
            </div>
          </div>

          {/* Card 2: Freelancer */}
          <div className="col-12 col-md-6">
            <div
              onClick={() => setSelectedRole('freelancer')}
              className={`card border-2 rounded-4 p-4 p-lg-5 h-100 text-center cursor-pointer transition-all ${
                selectedRole === 'freelancer'
                  ? 'border-success shadow-lg'
                  : 'border-light-subtle shadow-sm hover-lift'
              }`}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRole === 'freelancer' ? '#eefdf3' : 'var(--card-bg, #ffffff)',
                borderColor: selectedRole === 'freelancer' ? '#10b981' : '#e2e8f0',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Radio check top right */}
              <div className="d-flex justify-content-end mb-2">
                <div
                  className={`rounded-circle border d-flex align-items-center justify-content-center`}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderColor: selectedRole === 'freelancer' ? '#10b981' : '#cbd5e1',
                    backgroundColor: selectedRole === 'freelancer' ? '#10b981' : 'transparent',
                  }}
                >
                  {selectedRole === 'freelancer' && <span className="text-white fw-bold text-xs">✓</span>}
                </div>
              </div>

              {/* Icon Container */}
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-4" style={{ width: '90px', height: '90px', backgroundColor: selectedRole === 'freelancer' ? '#d1fae5' : '#f1f5f9', color: selectedRole === 'freelancer' ? '#047857' : '#334155' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <rect x="14" y="14" width="7" height="5" rx="1" />
                </svg>
              </div>

              <h4 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.4rem' }}>
                Saya seorang freelancer <span className="text-muted fs-5">&rarr;</span>
              </h4>
              <p className="text-muted small mb-0 px-2" style={{ lineHeight: '1.5' }}>
                Bekerja pada proyek digital & dapatkan penghasilan sebagai profesional.
              </p>
            </div>
          </div>

        </div>

        {/* Submit Action Button */}
        <div className="text-center mb-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`btn rounded-pill px-5 py-3 fw-bold text-white shadow-sm transition-all ${
              selectedRole ? 'btn-success' : 'btn-secondary opacity-50'
            }`}
            style={{ fontSize: '1.05rem', minWidth: '260px' }}
          >
            {selectedRole === 'client' && 'Daftar sebagai Client'}
            {selectedRole === 'freelancer' && 'Daftar sebagai Freelancer'}
            {!selectedRole && 'Pilih Jenis Akun'}
          </button>
        </div>

        {/* Already have account link */}
        <div className="text-center text-muted small">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-success fw-bold text-decoration-underline ms-1">
            Masuk Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterRoleSelectPage;
