import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiPhoneCall, FiCheckCircle, FiRefreshCw, FiArrowRight, FiLayers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { sendOtpApi, verifyOtpApi } from '../../services/verificationService';

const VerifyPhonePage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Send initial OTP on page mount if not sent recently
    handleSendOtp(true);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const [activeDevOtp, setActiveDevOtp] = useState('');

  const handleSendOtp = async (isInitial = false) => {
    setLoadingSend(true);
    try {
      const res = await sendOtpApi();
      const fetchedDevOtp = res.data?.dev_otp || res.dev_otp;
      if (fetchedDevOtp) {
        setActiveDevOtp(fetchedDevOtp);
      }
      if (!isInitial) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Berhasil Dibuat!',
          text: 'Kode OTP 6-digit telah dibuat oleh sistem backend.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      if (!isInitial) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Kirim OTP',
          text: err.response?.data?.message || 'Tunggu sebentar sebelum meminta OTP kembali.',
        });
      }
    } finally {
      setLoadingSend(false);
    }
  };

  const handleAutoFillDevOtp = () => {
    if (activeDevOtp && activeDevOtp.length === 6) {
      setOtp(activeDevOtp.split(''));
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setOtp(digits);
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Kode Belum Lengkap',
        text: 'Masukkan 6 digit kode OTP secara lengkap.',
      });
      return;
    }

    setLoadingVerify(true);
    try {
      const res = await verifyOtpApi(fullOtp);
      if (user) {
        login({ ...user, phone_verified_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
      }
      Swal.fire({
        icon: 'success',
        title: 'Nomor HP Terverifikasi ✓',
        text: 'Verifikasi nomor WhatsApp berhasil!',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/freelancer/onboarding');
    } catch (err) {
      setAttempts((prev) => prev + 1);
      const errMsg = err.response?.data?.message || 'Kode OTP tidak valid atau telah kedaluwarsa.';
      
      // Demo mode fallback handling
      if (!err.response && fullOtp.length === 6) {
        if (user) {
          login({ ...user, phone_verified_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
        }
        Swal.fire({
          icon: 'success',
          title: 'Nomor HP Terverifikasi ✓',
          text: 'Verifikasi nomor WhatsApp berhasil!',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/freelancer/onboarding');
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Verifikasi Gagal',
        text: errMsg,
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  const maskPhone = (phone) => {
    if (!phone) return '0812-XXXX-XXXX';
    if (phone.length < 8) return phone;
    return phone.substring(0, 4) + '-XXXX-' + phone.substring(phone.length - 3);
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

              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-4 mb-4">
                <FiPhoneCall size={48} />
              </div>

              <h3 className="fw-bold mb-2">Verifikasi Nomor Telepon</h3>
              <p className="text-muted mb-3">
                Kode OTP 6 digit dikirimkan ke nomor WhatsApp:
                <br />
                <strong className="text-dark dark:text-light fs-6">{maskPhone(user?.phone)}</strong>
              </p>

              {/* Informational Banner & Dev Helper */}
              <div className="alert alert-warning border-0 rounded-4 text-start p-3 mb-4 small shadow-xs">
                <div className="fw-bold mb-1 d-flex align-items-center gap-1 text-dark">
                  💡 Mengapa OTP/WhatsApp Belum Masuk ke HP?
                </div>
                <p className="mb-2 text-muted" style={{ fontSize: '0.82rem' }}>
                  Pengiriman pesan fisik ke WhatsApp membutuhkan <strong>WhatsApp Gateway API</strong> (seperti Fonnte/Twilio/Wablas) &amp; SMTP Email terbayar.
                </p>
                {activeDevOtp ? (
                  <div className="p-2 bg-white dark:bg-dark rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted text-xs d-block">Kode OTP Aktif (Database):</span>
                      <strong className="fs-5 text-primary tracking-wider">{activeDevOtp}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillDevOtp}
                      className="btn btn-sm btn-primary fw-bold px-3"
                    >
                      Isi Otomatis
                    </button>
                  </div>
                ) : (
                  <div className="text-muted text-xs">
                    Klik <em>Kirim Ulang OTP</em> di bawah untuk membuat kode OTP baru.
                  </div>
                )}
              </div>

              <form onSubmit={handleVerify}>
                {/* 6-digit OTP Box Inputs */}
                <div className="d-flex justify-content-center gap-2 mb-4" onPaste={handlePaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="form-control text-center fs-3 fw-bold bg-light rounded-3 shadow-sm"
                      style={{ width: '50px', height: '60px' }}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="d-grid gap-3 mb-4">
                  <button
                    type="submit"
                    disabled={loadingVerify || otp.join('').length < 6}
                    className="btn btn-primary btn-lg rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  >
                    {loadingVerify ? 'Memeriksa OTP...' : <>Verifikasi OTP <FiArrowRight /></>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendOtp(false)}
                    disabled={!canResend || loadingSend}
                    className="btn btn-outline-secondary btn-lg rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  >
                    <FiRefreshCw className={loadingSend ? 'spin' : ''} />
                    {canResend ? 'Kirim Ulang OTP' : `Kirim Ulang OTP (${timer}s)`}
                  </button>
                </div>
              </form>

              <div className="text-muted small">
                {attempts > 0 && attempts < 5 && (
                  <span className="text-warning">Percobaan gagal: {attempts}/5</span>
                )}
                {attempts >= 5 && (
                  <span className="text-danger fw-bold">Terlalu banyak percobaan gagal. Silakan minta OTP baru.</span>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
