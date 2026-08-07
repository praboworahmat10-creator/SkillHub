import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiDollarSign, FiLayers, FiArrowRight } from 'react-icons/fi';
import { registerFreelancerApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterFreelancerPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerFreelancerApi(data);
      const isSuccess = res.success || res.status === 'success';
      const userData = res.data?.user || res.user;
      const userToken = res.data?.token || res.token;

      if (isSuccess && userToken) {
        login(userData, userToken);
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Freelancer Berhasil!',
          text: 'Selamat bergabung dengan ekosistem SkillHub Indonesia',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/freelancer/dashboard');
      } else {
        throw new Error(res.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error('Freelancer registration error:', err);
      // Demo fallback
      const mockFreelancer = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'freelancer',
        title: data.title || 'Freelance Specialist',
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : ['React', 'Laravel'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      };
      login(mockFreelancer, 'demo_token_freelancer');

      Swal.fire({
        icon: 'success',
        title: 'Akun Freelancer Dibuat (Demo)',
        text: `Selamat datang, ${data.name}! Siap tawarkan jasa digital Anda.`,
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/freelancer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark shadow-lg border-0">
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-3">
                  <div className="bg-secondary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
                    <FiLayers size={24} />
                  </div>
                  <span className="text-secondary">Skill</span>
                  <span className="text-dark dark:text-light">Hub</span>
                </Link>
                <div className="badge badge-pill-secondary mb-2">Pendaftaran Talenta</div>
                <h4 className="fw-bold mb-1">Gabung Sebagai Freelancer Profesional</h4>
                <p className="text-muted small">Tawarkan keahlian digital Anda ke ribuan klien & UMKM Indonesia</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Nama Lengkap</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiUser size={18} /></span>
                      <input
                        type="text"
                        className={`form-control bg-light border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Contoh: Budi Santoso"
                        {...register('name', { required: 'Nama wajib diisi' })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Email Profesional</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiMail size={18} /></span>
                      <input
                        type="email"
                        className={`form-control bg-light border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="budi@dev.com"
                        {...register('email', { required: 'Email wajib diisi' })}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Nomor WhatsApp</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiPhone size={18} /></span>
                      <input
                        type="text"
                        className={`form-control bg-light border-start-0 ps-0 ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="081234567890"
                        {...register('phone', { required: 'Telepon wajib diisi' })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Gelar / Professional Title</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiBriefcase size={18} /></span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="Contoh: Fullstack Dev / UI Designer"
                        {...register('title')}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Keahlian (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="React, Laravel, Figma, Premiere Pro, Flutter..."
                    {...register('skills')}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Tarif Per Jam (IDR)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiDollarSign size={18} /></span>
                      <input
                        type="number"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="150000"
                        {...register('hourly_rate')}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark small">Kata Sandi</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={18} /></span>
                      <input
                        type="password"
                        className={`form-control bg-light border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Minimal 6 karakter"
                        {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Minimal 6 karakter' } })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-secondary-sh w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? 'Memproses...' : <>Daftar Sebagai Freelancer <FiArrowRight /></>}
                </button>
              </form>

              <hr className="my-4 border-color" />

              <div className="text-center text-muted small">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-secondary fw-semibold text-decoration-none">
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFreelancerPage;
