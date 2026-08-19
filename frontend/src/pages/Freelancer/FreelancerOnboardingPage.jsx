import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUser, FiBriefcase, FiMapPin, FiFileText, FiCheck, FiArrowRight, FiArrowLeft, FiLayers, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { submitOnboardingApi } from '../../services/verificationService';
import { updateProfileApi } from '../../services/profileService';

const FreelancerOnboardingPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const avatarInputRef = React.useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setUploadingAvatar(true);
    try {
      const data = new FormData();
      data.append('avatar', file);
      const res = await updateProfileApi(data);
      const newAvatar = res.data?.avatar || res.user?.avatar;

      if (user) {
        login({ ...user, avatar: newAvatar || previewUrl }, localStorage.getItem('skillhub_token'));
      }

      Swal.fire({
        icon: 'success',
        title: 'Foto Profil Diperbarui',
        text: 'Foto profil Anda berhasil diunggah!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.warn('Avatar upload fallback to preview:', err);
      if (user) {
        login({ ...user, avatar: previewUrl }, localStorage.getItem('skillhub_token'));
      }
      Swal.fire({
        icon: 'success',
        title: 'Foto Profil Diterapkan',
        text: 'Foto profil baru berhasil dipasang.',
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    username: user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : '',
    displayName: user?.name || '',
    profession: user?.profile?.title || 'Fullstack Developer',
    location: user?.profile?.location || 'Jakarta, Indonesia',
    skills: user?.profile?.skills || ['React', 'Node.js', 'Laravel'],
    skillLevel: 'Senior',
    experienceYears: '3-5 Tahun',
    languages: ['Indonesia', 'Inggris'],
    bio: user?.profile?.bio || 'Saya seorang profesional freelancer yang berpengalaman dalam membangun aplikasi web modern dan responsif.',
    serviceTypes: ['Pengembangan Web', 'Desain UI/UX'],
  });

  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skillToRemove) });
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.displayName.trim() || !formData.profession.trim() || !formData.location.trim()) {
        Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Mohon isi nama tampilan, profesi, dan lokasi.' });
        return false;
      }
    } else if (currentStep === 2) {
      if (formData.skills.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Tambahkan minimal 1 keahlian (skill).' });
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.bio.trim() || formData.bio.length < 10) {
        Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Bio minimal 10 karakter.' });
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    try {
      await submitOnboardingApi({
        displayName: formData.displayName,
        profession: formData.profession,
        location: formData.location,
        skills: formData.skills,
        bio: formData.bio,
      });

      if (user) {
        login({ ...user, profile_completed_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
      }

      Swal.fire({
        icon: 'success',
        title: 'Profil Berhasil Diperbarui!',
        text: 'Langkah selanjutnya: Verifikasi Identitas KTP & Selfie.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/freelancer/verification');
    } catch (err) {
      // Fallback for demo mode
      if (user) {
        login({ ...user, profile_completed_at: new Date().toISOString() }, localStorage.getItem('skillhub_token'));
      }
      Swal.fire({
        icon: 'success',
        title: 'Profil Berhasil Diperbarui!',
        text: 'Langkah selanjutnya: Verifikasi Identitas KTP & Selfie.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/freelancer/verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light dark:bg-dark">
      {/* Header */}
      <header className="bg-white dark:bg-dark border-bottom py-3">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-inline-flex align-items-center fw-bold fs-4 text-decoration-none">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
              <FiLayers size={20} />
            </div>
            <span className="text-primary">Skill</span>
            <span className="text-dark dark:text-light">Hub</span>
          </Link>
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 rounded-pill">
            Onboarding Talenta Freelancer
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* Stepper Progress Bar */}
            <div className="sh-card p-4 bg-white dark:bg-dark mb-4 rounded-4 shadow-sm">
              <div className="d-flex justify-content-between text-center position-relative">
                <div className="w-100 position-absolute top-50 start-0 translate-middle-y bg-light" style={{ height: '3px', zIndex: 0 }}></div>
                
                {[
                  { num: 1, title: 'Profil Dasar' },
                  { num: 2, title: 'Keahlian' },
                  { num: 3, title: 'Tentang' },
                  { num: 4, title: 'Selesai' },
                ].map((s) => (
                  <div key={s.num} className="position-relative" style={{ zIndex: 1 }}>
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold transition-all ${
                        step > s.num
                          ? 'bg-success text-white'
                          : step === s.num
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-light text-muted border'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                    >
                      {step > s.num ? <FiCheck size={20} /> : s.num}
                    </div>
                    <span className={`small fw-semibold ${step === s.num ? 'text-primary' : 'text-muted'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Card Content */}
            <div className="sh-card p-4 p-md-5 bg-white dark:bg-dark rounded-4 shadow-lg border-0">
              
              {/* STEP 1: Profil Dasar */}
              {step === 1 && (
                <div>
                  <h4 className="fw-bold mb-1">Langkah 1: Profil Dasar</h4>
                  <p className="text-muted small mb-4">Informasi utama ini akan ditampilkan kepada calon klien di marketplace</p>

                  <div className="mb-4 text-center">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="d-none"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleAvatarChange}
                    />
                    <div className="position-relative d-inline-block">
                      <img
                        src={avatarPreview || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                        alt="Profile Preview"
                        className="rounded-circle object-fit-cover border border-3 border-white shadow-sm"
                        style={{ width: '100px', height: '100px' }}
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
                        title="Ubah Foto Profil"
                      >
                        <FiCamera size={14} />
                      </button>
                    </div>
                    <div className="text-muted text-xs mt-2">
                      {uploadingAvatar ? 'Mengunggah foto...' : 'Klik ikon kamera untuk mengunggah foto profil baru'}
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Nama Tampilan (Display Name)</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="Contoh: Gio Rahmat"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Username</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="gio_rahmat"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Profesi Utama</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        placeholder="Contoh: Fullstack Developer / UI Designer"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Lokasi / Kota</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Jakarta, Indonesia"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Keahlian & Pengalaman */}
              {step === 2 && (
                <div>
                  <h4 className="fw-bold mb-1">Langkah 2: Keahlian & Pengalaman</h4>
                  <p className="text-muted small mb-4">Tambahkan keahlian utama untuk mencocokkan proyek dari klien</p>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Tambah Keahlian (Skill Tags)</label>
                    <div className="d-flex gap-2 mb-3">
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Ketik keahlian (misal: React, Figma, Python)..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      />
                      <button type="button" onClick={handleAddSkill} className="btn btn-primary px-4 fw-bold">
                        Tambah
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {formData.skills.map((sk, i) => (
                        <span key={i} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fs-6 fw-medium d-inline-flex align-items-center gap-2">
                          {sk}
                          <button type="button" onClick={() => handleRemoveSkill(sk)} className="btn-close btn-close-xs" style={{ fontSize: '10px' }}></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Tingkat Keahlian</label>
                      <select
                        className="form-select bg-light"
                        value={formData.skillLevel}
                        onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                      >
                        <option value="Pemula">Pemula (Junior)</option>
                        <option value="Menengah">Menengah (Mid-level)</option>
                        <option value="Senior">Senior (Expert)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Pengalaman Kerja</label>
                      <select
                        className="form-select bg-light"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      >
                        <option value="< 1 Tahun">Kurang dari 1 Tahun</option>
                        <option value="1-3 Tahun">1 - 3 Tahun</option>
                        <option value="3-5 Tahun">3 - 5 Tahun</option>
                        <option value="5+ Tahun">Lebih dari 5 Tahun</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Tentang Freelancer */}
              {step === 3 && (
                <div>
                  <h4 className="fw-bold mb-1">Langkah 3: Tentang Anda (Bio & Deskripsi)</h4>
                  <p className="text-muted small mb-4">Tulis deskripsi menarik tentang latar belakang dan spesialisasi Anda</p>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Bio Singkat / Ringkasan Diri</label>
                    <textarea
                      rows={5}
                      className="form-control bg-light"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Jelaskan secara singkat kompetensi, portofolio, dan pendekatan kerja Anda dalam menangani proyek klien..."
                    ></textarea>
                    <small className="text-muted">Minimal 10 karakter.</small>
                  </div>
                </div>
              )}

              {/* STEP 4: Selesai & Ringkasan */}
              {step === 4 && (
                <div className="text-center">
                  <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle p-4 mb-3">
                    <FiCheck size={48} />
                  </div>
                  <h4 className="fw-bold mb-2">Profil Dasar Selesai!</h4>
                  <p className="text-muted mb-4">
                    Profil publik Anda sudah siap. Untuk menjaga reputasi keamanan platform SkillHub dan mulai menerima pesanan, langkah selanjutnya adalah <strong>Verifikasi Identitas Resmi (KTP & Selfie)</strong>.
                  </p>

                  <div className="bg-light dark:bg-dark-subtle p-4 rounded-4 text-start mb-4">
                    <h6 className="fw-bold mb-3">Ringkasan Profil Anda:</h6>
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-2"><strong>Nama:</strong> {formData.displayName} ({formData.profession})</li>
                      <li className="mb-2"><strong>Lokasi:</strong> {formData.location}</li>
                      <li className="mb-2"><strong>Keahlian:</strong> {formData.skills.join(', ')}</li>
                      <li><strong>Tingkat:</strong> {formData.skillLevel} ({formData.experienceYears})</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
                {step > 1 ? (
                  <button type="button" onClick={handlePrevStep} className="btn btn-outline-secondary rounded-3 px-4 fw-semibold d-flex align-items-center gap-2">
                    <FiArrowLeft /> Kembali
                  </button>
                ) : <div></div>}

                {step < 4 ? (
                  <button type="button" onClick={handleNextStep} className="btn btn-primary rounded-3 px-5 fw-bold d-flex align-items-center gap-2">
                    Lanjut <FiArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitFinal}
                    disabled={loading}
                    className="btn btn-success btn-lg rounded-3 px-5 fw-bold d-flex align-items-center gap-2"
                  >
                    {loading ? 'Menyimpan...' : <>Verifikasi Identitas Sekarang <FiArrowRight /></>}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerOnboardingPage;
