import React, { useState } from 'react';
import { FiBriefcase, FiAlignLeft, FiDollarSign, FiCalendar, FiTarget, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PostJobPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    duration: '',
    skills: ''
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStep1Valid = formData.title && formData.category;
  const isStep2Valid = formData.description && formData.skills;
  const isStep3Valid = formData.budget && formData.duration;

  return (
    <div className="container-fluid pb-5">
      {/* ── Page Header ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-2 px-4 py-3 rounded-4 shadow-sm gap-3"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <FiBriefcase size={24} style={{ color: '#3b82f6' }} />
            Posting Pekerjaan Baru
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Temukan freelancer terbaik dengan memberikan detail pekerjaan yang jelas
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          
          {/* ── Stepper ── */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex justify-content-between position-relative">
              <div className="position-absolute" style={{ top: '24px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
              <div className="position-absolute" style={{ top: '24px', left: '10%', width: step === 1 ? '0%' : step === 2 ? '40%' : '80%', height: '2px', backgroundColor: 'var(--primary-color)', zIndex: 0, transition: 'width 0.3s ease' }}></div>
              
              {[
                { num: 1, title: 'Info Dasar', icon: <FiTarget size={18} /> },
                { num: 2, title: 'Detail Proyek', icon: <FiAlignLeft size={18} /> },
                { num: 3, title: 'Budget & Waktu', icon: <FiDollarSign size={18} /> }
              ].map((s) => (
                <div key={s.num} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 1 }}>
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                    style={{ 
                      width: '48px', height: '48px', 
                      backgroundColor: step >= s.num ? 'var(--primary-color)' : 'var(--bg-color)',
                      color: step >= s.num ? 'white' : 'var(--text-muted)',
                      border: `2px solid ${step >= s.num ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {step > s.num ? <FiCheckCircle size={20} /> : s.icon}
                  </div>
                  <span className="fw-semibold" style={{ color: step >= s.num ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form Content ── */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" style={{ backgroundColor: 'var(--card-bg)' }}>
            {step === 1 && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Informasi Dasar</h4>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Judul Pekerjaan</label>
                  <input 
                    type="text" 
                    className="form-control px-3 py-2 shadow-none" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Contoh: Pembuatan Website E-Commerce Toko Baju" 
                    style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                  />
                  <div className="form-text mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gunakan judul yang singkat namun jelas agar freelancer mengerti apa yang Anda butuhkan.</div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Kategori Pekerjaan</label>
                  <select 
                    className="form-select px-3 py-2 shadow-none" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Web Development">Web & App Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Desain Grafis</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Content Writing">Penulisan & Terjemahan</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Detail Proyek</h4>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Deskripsi Pekerjaan</label>
                  <textarea 
                    className="form-control px-3 py-3 shadow-none" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Jelaskan secara detail tentang proyek Anda, fitur yang dibutuhkan, dan ekspektasi hasil kerja..." 
                    style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', resize: 'none' }}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Skill yang Dibutuhkan</label>
                  <input 
                    type="text" 
                    className="form-control px-3 py-2 shadow-none" 
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Contoh: React, Node.js, Figma (pisahkan dengan koma)" 
                    style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Budget & Waktu</h4>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Budget Proyek (Rp)</label>
                    <div className="position-relative">
                      <span className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '500' }}>Rp</span>
                      <input 
                        type="number" 
                        className="form-control py-2 shadow-none" 
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="0" 
                        style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', paddingLeft: '45px' }}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Estimasi Waktu Pengerjaan</label>
                    <div className="position-relative">
                      <FiCalendar className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <select 
                        className="form-select py-2 shadow-none" 
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', paddingLeft: '45px' }}
                      >
                        <option value="">Pilih Estimasi</option>
                        <option value="Kurang dari 1 minggu">Kurang dari 1 minggu</option>
                        <option value="1 - 4 minggu">1 - 4 minggu</option>
                        <option value="1 - 3 bulan">1 - 3 bulan</option>
                        <option value="Lebih dari 3 bulan">Lebih dari 3 bulan</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-4" style={{ backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--primary-color)' }}>Ringkasan Pekerjaan</h6>
                  <p className="mb-1" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}><strong>Judul:</strong> {formData.title || '-'}</p>
                  <p className="mb-1" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}><strong>Kategori:</strong> {formData.category || '-'}</p>
                  <p className="mb-0" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}><strong>Skill:</strong> {formData.skills || '-'}</p>
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="d-flex justify-content-between mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              {step > 1 ? (
                <button 
                  className="btn px-4 shadow-none fw-semibold"
                  onClick={handlePrev}
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', border: 'none', borderRadius: '10px' }}
                >
                  Kembali
                </button>
              ) : <div></div>}

              {step < 3 ? (
                <button 
                  className="btn btn-primary px-4 shadow-sm fw-semibold"
                  onClick={handleNext}
                  disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                  style={{ borderRadius: '10px' }}
                >
                  Selanjutnya
                </button>
              ) : (
                <Link
                  to="/dashboard/client/jobs"
                  className={`btn btn-primary px-4 shadow-sm fw-semibold ${!isStep3Valid ? 'disabled' : ''}`}
                  style={{ borderRadius: '10px', textDecoration: 'none' }}
                >
                  Posting Sekarang
                </Link>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
