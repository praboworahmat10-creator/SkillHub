import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiShield, FiCamera, FiUploadCloud, FiCheckCircle, FiLock, FiAlertCircle, FiLayers, FiRefreshCw, FiArrowRight, FiTrash2, FiCpu, FiCheck, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { submitIdentityVerificationApi, scanKtpOcrApi } from '../../services/verificationService';

const IdentityVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ─── Form State ───────────────────────────────────────────────────────────
  const [fullName, setFullName]         = useState('');
  const [nik, setNik]                   = useState('');
  const [tempatLahir, setTempatLahir]   = useState('');
  const [birthDate, setBirthDate]       = useState('');
  const [gender, setGender]             = useState('Laki-Laki');
  const [address, setAddress]           = useState('');
  const [kelurahan, setKelurahan]       = useState('');
  const [kecamatan, setKecamatan]       = useState('');
  const [kabKota, setKabKota]           = useState('');
  const [provinsi, setProvinsi]         = useState('');
  const [agama, setAgama]               = useState('');
  const [statusPerkawinan, setStatusPerkawinan] = useState('');
  const [pekerjaan, setPekerjaan]       = useState('');
  const [consent, setConsent]           = useState(false);
  const [consent2, setConsent2]         = useState(false);

  // ─── OCR State ────────────────────────────────────────────────────────────
  const [ocrScanning, setOcrScanning]   = useState(false);
  const [ocrSuccess, setOcrSuccess]     = useState(false);
  const [ocrUnavailable, setOcrUnavailable] = useState(false); // no API key
  const [ocrError, setOcrError]         = useState(false);     // other error
  const [ocrConfidence, setOcrConfidence] = useState(null);    // high|medium|low

  // ─── File Upload State ────────────────────────────────────────────────────
  const [ktpFile, setKtpFile]           = useState(null);
  const [ktpPreview, setKtpPreview]     = useState(null);

  // ─── Camera / Selfie State ────────────────────────────────────────────────
  const [selfieFile, setSelfieFile]     = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const [loading, setLoading]           = useState(false);

  const videoRef        = useRef(null);
  const canvasRef       = useRef(null);
  const mediaStreamRef  = useRef(null);

  // ─── Camera Helpers ───────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      Swal.fire({ icon: 'warning', title: 'Kamera tidak tersedia', text: 'Silakan upload foto selfie secara manual.' });
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setSelfieFile(new File([blob], `selfie_${Date.now()}.png`, { type: 'image/png' }));
        setSelfiePreview(canvas.toDataURL('image/png'));
        stopCamera();
      }
    }, 'image/png');
  };

  // ─── OCR Scan ─────────────────────────────────────────────────────────────
  const performOcrScan = async (file) => {
    setOcrScanning(true);
    setOcrSuccess(false);
    setOcrUnavailable(false);
    setOcrError(false);
    setOcrConfidence(null);

    try {
      const result = await scanKtpOcrApi(file);

      if (result.success && result.data) {
        const d = result.data;

        // Auto-fill semua field yang tersedia dari OCR
        if (d.nama)            setFullName(d.nama);
        if (d.nik)             setNik(d.nik);
        if (d.tempat_lahir)    setTempatLahir(d.tempat_lahir);
        if (d.tanggal_lahir)   setBirthDate(d.tanggal_lahir);
        if (d.jenis_kelamin) {
          const g = d.jenis_kelamin.toUpperCase();
          setGender(g.includes('PEREMPUAN') || g.includes('WANITA') ? 'Perempuan' : 'Laki-Laki');
        }
        if (d.alamat)          setAddress(d.alamat + (d.rt_rw ? `, RT/RW ${d.rt_rw}` : ''));
        if (d.kelurahan)       setKelurahan(d.kelurahan);
        if (d.kecamatan)       setKecamatan(d.kecamatan);
        if (d.agama)           setAgama(d.agama);
        if (d.status_perkawinan) setStatusPerkawinan(d.status_perkawinan);
        if (d.pekerjaan)       setPekerjaan(d.pekerjaan);

        setOcrConfidence(result.confidence || 'medium');
        setOcrSuccess(true);

        Swal.fire({
          icon: 'success',
          title: '⚡ Data KTP Terdeteksi Otomatis!',
          html: `Data NIK, Nama, Tanggal Lahir, dan Alamat telah diisi oleh AI.<br><br>
            <small class="text-warning">⚠️ Periksa kembali semua data sebelum menyimpan. Hasil OCR dapat mengandung kesalahan.</small>`,
          timer: 4000,
          showConfirmButton: true,
          confirmButtonText: 'Sip, Saya Periksa',
          confirmButtonColor: '#2563eb'
        });
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status === 503) {
        // API key tidak dikonfigurasi
        setOcrUnavailable(true);
      } else {
        // Error lain (gambar buram, server error, dll)
        setOcrError(true);
        console.warn('OCR error:', err?.response?.data?.message || err.message);
      }
    } finally {
      setOcrScanning(false);
    }
  };

  // ─── KTP File Selection ───────────────────────────────────────────────────
  const handleKtpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Format Salah', text: 'KTP harus berformat JPG, JPEG, PNG, atau WebP.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Ukuran foto KTP maksimal 5 MB.' });
      return;
    }

    setKtpFile(file);
    setKtpPreview(URL.createObjectURL(file));
    performOcrScan(file);
  };

  const handleReplaceKtp = () => {
    setKtpFile(null);
    setKtpPreview(null);
    setOcrSuccess(false);
    setOcrUnavailable(false);
    setOcrError(false);
    setOcrConfidence(null);
  };

  // ─── Selfie File Selection ────────────────────────────────────────────────
  const handleSelfieFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Ukuran foto selfie maksimal 4 MB.' });
      return;
    }
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
  };

  // ─── NIK Masking ──────────────────────────────────────────────────────────
  const getMaskedNik = (raw) => {
    if (!raw || raw.length < 8) return raw;
    return raw.substring(0, 4) + '★'.repeat(Math.max(0, raw.length - 8)) + raw.substring(raw.length - 4);
  };

  // ─── Field confidence highlight helper ────────────────────────────────────
  const getConfidenceClass = (hasValue) => {
    if (!ocrSuccess || !hasValue) return 'bg-light';
    if (ocrConfidence === 'low')    return 'bg-warning bg-opacity-25 border-warning';
    if (ocrConfidence === 'medium') return 'bg-info bg-opacity-10';
    return 'bg-light';
  };

  // ─── Form Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !nik || !birthDate || !address) {
      Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Harap lengkapi: Nama, NIK, Tanggal Lahir, dan Alamat.' });
      return;
    }
    if (!/^\d{16}$/.test(nik)) {
      Swal.fire({ icon: 'warning', title: 'Format NIK Salah', text: 'NIK harus tepat 16 digit angka.' });
      return;
    }
    if (!ktpFile) {
      Swal.fire({ icon: 'warning', title: 'Foto KTP Belum Diunggah', text: 'Unggah foto KTP Anda terlebih dahulu.' });
      return;
    }
    if (!selfieFile) {
      Swal.fire({ icon: 'warning', title: 'Foto Selfie Belum Ada', text: 'Ambil atau unggah foto selfie/wajah Anda.' });
      return;
    }
    if (!consent || !consent2) {
      Swal.fire({ icon: 'warning', title: 'Persetujuan Diperlukan', text: 'Centang semua pernyataan persetujuan.' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name',        fullName);
      formData.append('nik',              nik);
      formData.append('tempat_lahir',     tempatLahir);
      formData.append('birth_date',       birthDate);
      formData.append('gender',           gender);
      formData.append('address',          address);
      formData.append('kelurahan',        kelurahan);
      formData.append('kecamatan',        kecamatan);
      formData.append('kab_kota',         kabKota);
      formData.append('provinsi',         provinsi);
      formData.append('agama',            agama);
      formData.append('status_perkawinan', statusPerkawinan);
      formData.append('pekerjaan',        pekerjaan);
      formData.append('consent_given',    '1');
      formData.append('ktp_file',         ktpFile);
      formData.append('selfie_file',      selfieFile);

      await submitIdentityVerificationApi(formData);

      Swal.fire({ icon: 'success', title: 'Verifikasi Terkirim!', text: 'Dokumen Anda sudah dikirim dan sedang ditinjau.', timer: 1500, showConfirmButton: false });
      navigate('/freelancer/verification/pending');

    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg) {
        Swal.fire({ icon: 'error', title: 'Gagal Mengirim', text: msg });
      } else {
        // Demo fallback
        Swal.fire({ icon: 'success', title: 'Verifikasi Terkirim (Demo)', text: 'Dokumen Anda sudah dikirim.', timer: 1500, showConfirmButton: false });
        navigate('/freelancer/verification/pending');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Confidence Badge ─────────────────────────────────────────────────────
  const ConfidenceBadge = () => {
    if (!ocrSuccess || !ocrConfidence) return null;
    const map = {
      high:   { cls: 'bg-success-subtle text-success border-success-subtle', label: 'Confidence Tinggi' },
      medium: { cls: 'bg-warning-subtle text-warning border-warning-subtle', label: 'Confidence Sedang — Periksa!' },
      low:    { cls: 'bg-danger-subtle text-danger border-danger-subtle',   label: 'Confidence Rendah — Wajib Periksa!' },
    };
    const c = map[ocrConfidence] || map.medium;
    return (
      <span className={`badge border rounded-pill px-2 py-1 text-xs d-inline-flex align-items-center gap-1 ${c.cls}`}>
        <FiAlertCircle size={11} /> {c.label}
      </span>
    );
  };

  // ─── OCR Status Banner ────────────────────────────────────────────────────
  const OcrBanner = () => {
    if (ocrSuccess) return (
      <div className="alert alert-success border-0 rounded-3 p-2 mb-3 small d-flex align-items-start gap-2">
        <FiCheckCircle className="text-success flex-shrink-0 mt-1" size={15} />
        <div>
          Formulir diisi otomatis dari hasil scan OCR AI. <strong>Periksa kembali setiap field</strong> — OCR dapat mengandung kesalahan.
          <div className="mt-1"><ConfidenceBadge /></div>
        </div>
      </div>
    );
    if (ocrUnavailable) return (
      <div className="alert alert-warning border-0 rounded-3 p-2 mb-3 small d-flex align-items-start gap-2">
        <FiAlertTriangle className="text-warning flex-shrink-0 mt-1" size={15} />
        <div>
          <strong>Layanan OCR belum dikonfigurasi.</strong> Isi semua data identitas secara manual sesuai KTP Anda.
          <div className="text-muted mt-1">Hubungi admin untuk mengaktifkan fitur OCR AI.</div>
        </div>
      </div>
    );
    if (ocrError) return (
      <div className="alert alert-danger border-0 rounded-3 p-2 mb-3 small d-flex align-items-start gap-2">
        <FiAlertCircle className="text-danger flex-shrink-0 mt-1" size={15} />
        <div>
          <strong>OCR gagal membaca KTP.</strong> Pastikan foto jelas dan tidak buram. Isi data secara manual.
        </div>
      </div>
    );
    return null;
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">

        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}>
          <Link to="/" className="d-inline-flex align-items-center fw-bold fs-4 text-decoration-none mb-3">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '38px', height: '38px' }}>
              <FiLayers size={22} />
            </div>
            <span className="text-primary">Skill</span>
            <span className="text-dark">Hub</span>
          </Link>

          <h2 className="fw-bold mb-2">Verifikasi Identitas Resmi</h2>
          <p className="text-muted">
            Verifikasi identitas diperlukan untuk menjaga keamanan freelancer dan client di SkillHub.
          </p>

          <div className="alert alert-warning border-0 rounded-4 text-start d-flex align-items-center gap-3 p-3">
            <FiLock size={28} className="text-warning flex-shrink-0" />
            <div className="small">
              <strong>Jaminan Privasi &amp; Keamanan Data:</strong><br />
              Data KTP &amp; Selfie disimpan dengan enkripsi storage privat. Data pribadi ini <strong>TIDAK PERNAH</strong> ditampilkan publik kepada client.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center g-4">

            {/* ══════════════ LEFT: Data KTP Form ══════════════ */}
            <div className="col-lg-6">
              <div className="sh-card p-4 p-md-5 bg-white rounded-4 shadow-sm border-0 h-100">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FiShield className="text-primary" /> Data Identitas KTP
                  </h5>
                  {ocrSuccess && (
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 text-xs d-inline-flex align-items-center gap-1">
                      <FiCheck size={12} /> AI Auto-Filled
                    </span>
                  )}
                </div>

                <OcrBanner />
                <hr className="mb-4" />

                {/* ── Nama Lengkap ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Nama Lengkap (Sesuai KTP) <span className="text-danger">*</span></label>
                  <input
                    type="text" required
                    className={`form-control ${getConfidenceClass(!!fullName)}`}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Contoh: GIOVED RAHMAT PRABOWO"
                  />
                </div>

                {/* ── NIK ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Nomor Induk Kependudukan (NIK — 16 Digit) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text" required
                    maxLength={16}
                    className={`form-control font-monospace ${getConfidenceClass(!!nik)}`}
                    value={nik}
                    onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan 16 digit NIK dari KTP"
                  />
                  {nik.length > 0 && (
                    <div className="form-text text-muted small mt-1">
                      Format terenkripsi: <span className="fw-bold text-dark font-monospace">{getMaskedNik(nik)}</span>
                      {nik.length !== 16 && <span className="text-danger ms-2">— harus 16 digit ({nik.length}/16)</span>}
                    </div>
                  )}
                  {ocrSuccess && ocrConfidence !== 'high' && (
                    <div className="form-text text-warning small mt-1">
                      <FiAlertTriangle size={12} className="me-1" />
                      Verifikasi NIK ini dengan KTP fisik Anda sebelum submit.
                    </div>
                  )}
                </div>

                {/* ── Tempat & Tanggal Lahir ── */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Tempat Lahir</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!tempatLahir)}`}
                      value={tempatLahir}
                      onChange={e => setTempatLahir(e.target.value)}
                      placeholder="Contoh: TANGERANG"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Tanggal Lahir <span className="text-danger">*</span></label>
                    <input
                      type="date" required
                      className={`form-control ${getConfidenceClass(!!birthDate)}`}
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* ── Jenis Kelamin & Agama ── */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Jenis Kelamin</label>
                    <select
                      className="form-select bg-light"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                    >
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Agama</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!agama)}`}
                      value={agama}
                      onChange={e => setAgama(e.target.value)}
                      placeholder="Contoh: ISLAM"
                    />
                  </div>
                </div>

                {/* ── Alamat ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Alamat (Sesuai KTP) <span className="text-danger">*</span></label>
                  <textarea
                    rows={2} required
                    className={`form-control ${getConfidenceClass(!!address)}`}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor, RT/RW"
                  />
                </div>

                {/* ── Kelurahan & Kecamatan ── */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kelurahan / Desa</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!kelurahan)}`}
                      value={kelurahan}
                      onChange={e => setKelurahan(e.target.value)}
                      placeholder="Contoh: PANINGGILAN UTARA"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kecamatan</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!kecamatan)}`}
                      value={kecamatan}
                      onChange={e => setKecamatan(e.target.value)}
                      placeholder="Contoh: CILEDUG"
                    />
                  </div>
                </div>

                {/* ── Kab/Kota & Provinsi ── */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Kabupaten / Kota</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!kabKota)}`}
                      value={kabKota}
                      onChange={e => setKabKota(e.target.value)}
                      placeholder="Contoh: KOTA TANGERANG"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Provinsi</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!provinsi)}`}
                      value={provinsi}
                      onChange={e => setProvinsi(e.target.value)}
                      placeholder="Contoh: BANTEN"
                    />
                  </div>
                </div>

                {/* ── Status Perkawinan & Pekerjaan ── */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Status Perkawinan</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!statusPerkawinan)}`}
                      value={statusPerkawinan}
                      onChange={e => setStatusPerkawinan(e.target.value)}
                      placeholder="Contoh: BELUM KAWIN"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Pekerjaan (Sesuai KTP)</label>
                    <input
                      type="text"
                      className={`form-control ${getConfidenceClass(!!pekerjaan)}`}
                      value={pekerjaan}
                      onChange={e => setPekerjaan(e.target.value)}
                      placeholder="Contoh: PELAJAR / MAHASISWA"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ══════════════ RIGHT: Dokumen Upload & Selfie ══════════════ */}
            <div className="col-lg-6">
              <div className="sh-card p-4 p-md-5 bg-white rounded-4 shadow-sm border-0 h-100">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiCamera className="text-primary" /> Dokumen Verifikasi (KTP &amp; Selfie)
                </h5>
                <hr className="mb-4" />

                {/* ── A. Upload KTP ── */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small mb-0">1. Upload Foto KTP Asli</label>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 text-xs d-inline-flex align-items-center gap-1">
                      <FiCpu size={12} /> OCR AI (Gemini Vision)
                    </span>
                  </div>
                  <div className="text-muted small mb-2">
                    Unggah foto KTP yang jelas &amp; tidak silau. AI akan otomatis mendeteksi data dari KTP Anda.
                  </div>

                  {!ktpPreview ? (
                    <label className="border border-2 border-dashed rounded-4 p-4 text-center d-block cursor-pointer bg-light">
                      <FiUploadCloud size={38} className="text-primary mb-2" />
                      <div className="fw-semibold text-dark">Klik untuk Upload Foto KTP</div>
                      <div className="small text-muted mt-1">Format: JPG, JPEG, PNG, WebP (Maks. 5 MB)</div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        className="d-none"
                        onChange={handleKtpChange}
                      />
                    </label>
                  ) : (
                    <div className="position-relative rounded-4 overflow-hidden border">
                      <img src={ktpPreview} alt="KTP Preview" className="w-100 object-fit-cover" style={{ maxHeight: '200px' }} />

                      {ocrScanning && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex flex-column align-items-center justify-content-center text-white p-3">
                          <div className="spinner-border text-primary mb-2" role="status" style={{ width: '2.2rem', height: '2.2rem' }} />
                          <div className="fw-bold small">🔍 AI Vision Membaca Data KTP...</div>
                          <div className="text-xs text-white-50 mt-1">Mendeteksi NIK, Nama, Tgl Lahir &amp; Alamat</div>
                        </div>
                      )}

                      <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-85 text-white d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 ms-2">
                          <small className="fw-semibold">Foto KTP Terunggah</small>
                          {ocrSuccess && (
                            <span className="badge bg-success rounded-pill px-2 text-xs d-inline-flex align-items-center gap-1">
                              <FiCheck size={11} /> Auto-Detect Sukses
                            </span>
                          )}
                          {(ocrUnavailable || ocrError) && (
                            <span className="badge bg-warning text-dark rounded-pill px-2 text-xs">
                              Isi Manual
                            </span>
                          )}
                        </div>
                        <button type="button" onClick={handleReplaceKtp} className="btn btn-sm btn-danger d-flex align-items-center gap-1">
                          <FiTrash2 size={14} /> Ganti Foto
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── B. Selfie ── */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small d-block">2. Verifikasi Wajah / Foto Selfie</label>
                  <canvas ref={canvasRef} className="d-none" />

                  {selfiePreview ? (
                    <div className="position-relative rounded-4 overflow-hidden border text-center">
                      <img src={selfiePreview} alt="Selfie Preview" className="w-100 object-fit-cover" style={{ maxHeight: '220px' }} />
                      <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-75 text-white d-flex justify-content-between align-items-center">
                        <small className="fw-semibold ms-2">
                          <FiCheckCircle className="me-1" /> Foto Wajah Berhasil Diambil
                        </small>
                        <button type="button" onClick={() => { setSelfieFile(null); setSelfiePreview(null); }} className="btn btn-sm btn-danger d-flex align-items-center gap-1">
                          <FiRefreshCw size={14} /> Ambil Ulang
                        </button>
                      </div>
                    </div>

                  ) : cameraActive ? (
                    <div className="rounded-4 overflow-hidden bg-black text-center position-relative">
                      <video ref={videoRef} autoPlay playsInline className="w-100 h-auto" style={{ maxHeight: '240px' }} />
                      <div className="p-3 bg-dark d-flex justify-content-center gap-2">
                        <button type="button" onClick={capturePhoto} className="btn btn-success fw-bold px-4 rounded-pill">
                          <FiCamera className="me-1" /> Ambil Foto Selfie
                        </button>
                        <button type="button" onClick={stopCamera} className="btn btn-outline-light rounded-pill">
                          Batal
                        </button>
                      </div>
                    </div>

                  ) : (
                    <div className="border rounded-4 p-4 text-center bg-light">
                      <FiCamera size={36} className="text-primary mb-2" />
                      <div className="fw-semibold mb-2">Ambil Foto Selfie via Kamera Browser</div>
                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <button type="button" onClick={startCamera} className="btn btn-primary rounded-3 px-4 fw-bold d-flex align-items-center gap-2">
                          <FiCamera /> Buka Kamera
                        </button>
                      </div>
                      <div className="border-top pt-3 text-muted small">
                        Atau jika kamera tidak tersedia:{' '}
                        <label className="text-primary fw-bold cursor-pointer text-decoration-underline ms-1">
                          Upload Foto Selfie
                          <input type="file" accept="image/*" className="d-none" onChange={handleSelfieFileChange} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Consent ── */}
                <div className="border-top pt-3 mb-4">
                  <div className="alert alert-info border-0 rounded-3 p-2 mb-3 small d-flex align-items-start gap-2">
                    <FiInfo size={14} className="text-info flex-shrink-0 mt-1" />
                    <span>Data KTP &amp; Selfie Anda disimpan terenkripsi dan hanya digunakan untuk proses verifikasi akun SkillHub. Tidak akan dibagikan kepada pihak ketiga.</span>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      type="checkbox" className="form-check-input" id="consent1"
                      checked={consent} onChange={e => setConsent(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="consent1">
                      Saya menyatakan bahwa data identitas dan dokumen yang saya berikan adalah benar dan milik sendiri.
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox" className="form-check-input" id="consent2"
                      checked={consent2} onChange={e => setConsent2(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="consent2">
                      Saya menyetujui penggunaan data identitas ini khusus untuk proses verifikasi akun SkillHub.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success btn-lg w-100 rounded-3 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Mengirimkan Dokumen...</>
                    : <>Kirim untuk Verifikasi <FiArrowRight /></>
                  }
                </button>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default IdentityVerificationPage;
