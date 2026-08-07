import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiMail, FiLock, FiLayers, FiArrowRight, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { loginApi } from '../../services/authService';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
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
          showConfirmButton: false
        });

        const role = userData.role?.name || userData.role;
        if (role === 'customer') navigate('/dashboard/client');
        else if (role === 'freelancer') navigate('/dashboard/freelancer');
        else if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      } else {
        throw new Error(res.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Demo fallback – deteksi role berdasarkan email
      const email = data.email.toLowerCase();
      const demoRole = email.includes('freelancer') ? 'freelancer'
        : email.includes('admin') ? 'admin'
        : 'customer';
      const demoName = demoRole === 'freelancer' ? 'Budi Santoso (Freelancer)'
        : demoRole === 'admin' ? 'Admin SkillHub'
        : 'Pelanggan SkillHub';

      const mockUser = {
        id: 1,
        name: demoName,
        email: data.email,
        role: demoRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      login(mockUser, 'demo_sanctum_token_123456');

      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil (Demo Mode)',
        text: `Masuk sebagai ${mockUser.name}`,
        timer: 1500,
        showConfirmButton: false
      });

      if (demoRole === 'customer') navigate('/dashboard/client');
      else if (demoRole === 'freelancer') navigate('/dashboard/freelancer');
      else if (demoRole === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark shadow-lg border-0">
              {/* Header Logo */}
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-3">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
                    <FiLayers size={24} />
                  </div>
                  <span className="text-primary">Skill</span>
                  <span className="text-dark dark:text-light">Hub</span>
                </Link>
                <h4 className="fw-bold mb-1">Masuk ke Akun Anda</h4>
                <p className="text-muted small">Kelola pesanan dan jasa digital Anda dengan mudah</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">Alamat Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <FiMail size={18} />
                    </span>
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
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold text-dark small mb-0">Kata Sandi</label>
                    <Link to="/forgot-password" className="text-primary text-xs text-decoration-none">
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <FiLock size={18} />
                    </span>
                    <input
                      type="password"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      {...register('password', { required: 'Password wajib diisi' })}
                    />
                  </div>
                  {errors.password && <div className="text-danger text-xs mt-1">{errors.password.message}</div>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-sh w-100 py-3 mt-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? 'Memproses...' : <>Masuk Sekarang <FiArrowRight /></>}
                </button>
              </form>

              {/* Demo Account Tips */}
              <div className="mt-4 p-3 bg-light dark:bg-dark rounded-3 text-xs text-muted">
                <span className="fw-semibold d-block text-dark mb-1">💡 Tips Akun Demo:</span>
                <div>- Customer: <code>customer@skillhub.id</code></div>
                <div>- Freelancer: <code>freelancer@skillhub.id</code></div>
                <div>- Admin: <code>admin@skillhub.id</code></div>
              </div>

              <hr className="my-4 border-color" />

              <div className="text-center text-muted small">
                Belum punya akun?{' '}
                <Link to="/register-customer" className="text-primary fw-semibold text-decoration-none">
                  Daftar Customer
                </Link>{' '}
                atau{' '}
                <Link to="/register-freelancer" className="text-secondary fw-semibold text-decoration-none">
                  Daftar Freelancer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
