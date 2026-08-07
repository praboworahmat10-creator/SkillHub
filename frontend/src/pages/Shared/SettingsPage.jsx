import React, { useState } from 'react';
import { 
  FiUser, FiLock, FiBell, FiShield, 
  FiSave, FiSmartphone, FiMail
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const menuItems = [
    { id: 'profile', label: 'Profil Saya', icon: <FiUser /> },
    { id: 'security', label: 'Kata Sandi & Keamanan', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifikasi', icon: <FiBell /> },
    { id: 'privacy', label: 'Privasi', icon: <FiShield /> },
  ];

  return (
    <div className="container-fluid pb-5">
      <div className="mb-4 mt-2 px-4 py-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)', border: '1px solid var(--border-color)' }}>
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Pengaturan Akun</h2>
        <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kelola preferensi dan pengaturan keamanan akun Anda</p>
      </div>

      <div className="row g-4">
        {/* ── Left Sidebar (Tabs) ── */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 rounded-4 shadow-sm p-3" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex flex-column gap-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`btn text-start d-flex align-items-center gap-3 px-3 py-3 fw-semibold border-0 shadow-none`}
                  style={{
                    borderRadius: '10px',
                    backgroundColor: activeTab === item.id ? 'var(--primary-color)' : 'transparent',
                    color: activeTab === item.id ? 'white' : 'var(--text-main)',
                    transition: 'all 0.2s'
                  }}
                >
                  {React.cloneElement(item.icon, { size: 18 })}
                  {item.label}
                </button>
              ))}
            </div>
            
            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
            
            <div className="px-3">
              <div className="fw-bold mb-3" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Tampilan Tema</div>
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                <span className="fw-semibold" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Dark Mode</span>
                <div className="form-check form-switch m-0">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Content ── */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="card border-0 rounded-4 shadow-sm p-4 p-lg-5" style={{ backgroundColor: 'var(--card-bg)', minHeight: '500px' }}>
            
            {activeTab === 'profile' && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Informasi Pribadi</h4>
                
                <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-secondary" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {formData.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <button className="btn btn-outline-primary btn-sm fw-semibold shadow-sm mb-2" style={{ borderRadius: '8px' }}>Ubah Foto</button>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Format JPG, GIF atau PNG. Maksimal 2MB.</div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Nama Lengkap</label>
                    <input type="text" className="form-control px-3 py-2 shadow-none" name="name" value={formData.name} onChange={handleChange} style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px' }} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Alamat Email</label>
                    <div className="position-relative">
                      <FiMail className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="email" className="form-control py-2 shadow-none" name="email" value={formData.email} onChange={handleChange} style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', paddingLeft: '45px' }} />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Nomor Telepon</label>
                    <div className="position-relative">
                      <FiSmartphone className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" className="form-control py-2 shadow-none" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62 8xx xxxx xxxx" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', paddingLeft: '45px' }} />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-main)' }}>Bio Singkat</label>
                    <textarea className="form-control px-3 py-3 shadow-none" name="bio" value={formData.bio} onChange={handleChange} rows="4" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', resize: 'none' }} placeholder="Ceritakan sedikit tentang diri Anda..."></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                  <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-semibold" style={{ borderRadius: '10px' }}>
                    <FiSave /> Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animation-fade-in text-center py-5">
                <FiLock size={48} className="mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Keamanan & Kata Sandi</h5>
                <p style={{ color: 'var(--text-muted)' }}>Fitur ganti kata sandi sedang dalam tahap integrasi dengan backend.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animation-fade-in text-center py-5">
                <FiBell size={48} className="mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Pengaturan Notifikasi</h5>
                <p style={{ color: 'var(--text-muted)' }}>Pengaturan preferensi email akan segera hadir.</p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animation-fade-in text-center py-5">
                <FiShield size={48} className="mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Pengaturan Privasi</h5>
                <p style={{ color: 'var(--text-muted)' }}>Kontrol privasi profil akan tersedia pada update berikutnya.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
