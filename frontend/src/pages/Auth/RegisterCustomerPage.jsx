import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiLock, FiPhone, FiLayers, FiArrowRight } from 'react-icons/fi';
import { registerCustomerApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterCustomerPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerCustomerApi(data);
      const isSuccess = res.success || res.status === 'success';
      const userData = res.data?.user || res.user;
      const userToken = res.data?.token || res.token;

      if (isSuccess && userToken) {
        login(userData, userToken);
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil!',
          text: 'Selamat datang di SkillHub Indonesia',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/customer/dashboard');
      } else {
        throw new Error(res.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Demo fallback
      const mockCustomer = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      login(mockCustomer, 'demo_token_customer');

      Swal.fire({
        icon: 'success',
        title: 'Akun Customer Dibuat (Demo)',
        text: `Selamat datang, ${data.name}!`,
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/customer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark shadow-lg border-0">
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-3">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
                    <FiLayers size={24} />
                  </div>
                  <span className="text-primary">Skill</span>
                  <span className="text-dark dark:text-light">Hub</span>
                </Link>
                <h4 className="fw-bold mb-1">Daftar Akun Customer</h4>
                <p className="text-muted small">Cari dan pesan jasa digital terbaik di Indonesia</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Nama Lengkap</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiUser size={18} /></span>
                    <input
                      type="text"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Contoh: Ahmad Rizky"
                      {...register('name', { required: 'Nama lengkap wajib diisi' })}
                    />
                  </div>
                  {errors.name && <div className="text-danger text-xs mt-1">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiMail size={18} /></span>
                    <input
                      type="email"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="nama@email.com"
                      {...register('email', { required: 'Email wajib diisi' })}
                    />
                  </div>
                  {errors.email && <div className="text-danger text-xs mt-1">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Nomor WhatsApp</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiPhone size={18} /></span>
                    <input
                      type="text"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="081234567890"
                      {...register('phone', { required: 'Nomor telepon wajib diisi' })}
                    />
                  </div>
                  {errors.phone && <div className="text-danger text-xs mt-1">{errors.phone.message}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark small">Kata Sandi</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><FiLock size={18} /></span>
                    <input
                      type="password"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Minimal 6 karakter"
                      {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Password minimal 6 karakter' } })}
                    />
                  </div>
                  {errors.password && <div className="text-danger text-xs mt-1">{errors.password.message}</div>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-sh w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? 'Memproses...' : <>Daftar Sekarang <FiArrowRight /></>}
                </button>
              </form>

              <hr className="my-4 border-color" />

              <div className="text-center text-muted small">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
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

export default RegisterCustomerPage;
