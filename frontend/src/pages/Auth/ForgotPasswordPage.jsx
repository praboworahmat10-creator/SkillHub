import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { FiMail, FiLayers, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = (data) => {
    setSent(true);
    Swal.fire({
      icon: 'success',
      title: 'Email Terkirim!',
      text: `Instruksi pemulihan kata sandi telah dikirim ke ${data.email}`,
      confirmButtonColor: '#2563EB'
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light dark:bg-dark">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark shadow-lg border-0">
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center fw-bold fs-3 text-decoration-none mb-3">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '42px', height: '42px' }}>
                    <FiLayers size={24} />
                  </div>
                  <span className="text-primary">Skill</span>
                  <span className="text-dark dark:text-light">Hub</span>
                </Link>
                <h4 className="fw-bold mb-1">Lupa Kata Sandi?</h4>
                <p className="text-muted small">Masukkan email Anda untuk menerima tautan pemulihan kata sandi</p>
              </div>

              {sent ? (
                <div className="text-center py-4">
                  <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                    <FiCheckCircle size={36} />
                  </div>
                  <h5 className="fw-bold mb-2">Periksa Email Anda</h5>
                  <p className="text-muted small mb-4">
                    Kami telah mengirimkan tautan reset password. Silakan periksa kotak masuk atau folder spam email Anda.
                  </p>
                  <Link to="/login" className="btn btn-outline-sh w-100">
                    Kembali ke Halaman Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small">Alamat Email Terdaftar</label>
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

                  <button type="submit" className="btn btn-primary-sh w-100 py-3 mb-3">
                    Kirim Tautan Reset Password
                  </button>

                  <div className="text-center">
                    <Link to="/login" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-primary">
                      <FiArrowLeft /> Kembali ke Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
