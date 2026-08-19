import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMapPin, FiMail, FiPhone, FiGlobe, 
  FiBriefcase, FiStar, FiEdit3, FiCheckCircle,
  FiCamera, FiPlus, FiTrash2, FiX, FiExternalLink, FiUpload
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { 
  updateProfileApi, 
  fetchPortfoliosApi, 
  createPortfolioApi, 
  updatePortfolioApi, 
  deletePortfolioApi 
} from '../../services/profileService';

const defaultPortfolios = [
  { 
    id: 101, 
    title: 'E-Commerce App Redesign', 
    category: 'UI/UX Design', 
    image_path: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 
    description: 'Redesign of a major e-commerce platform, improving conversion rate by 30%.',
    project_url: 'https://example.com'
  },
  { 
    id: 102, 
    title: 'Finance Dashboard', 
    category: 'Web Development', 
    image_path: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', 
    description: 'Real-time financial monitoring dashboard built with React and D3.js.',
    project_url: 'https://example.com'
  },
  { 
    id: 103, 
    title: 'Brand Identity – Startup Fintech', 
    category: 'Graphic Design', 
    image_path: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80', 
    description: 'Complete brand identity for an Indonesian Fintech startup from logo to guidelines.',
    project_url: 'https://example.com'
  },
];

const dummyReviews = [
  { id: 1, name: 'Budi Santoso', initial: 'BS', color: '#3b82f6', rating: 5, date: '12 Ags 2026', comment: 'Hasil kerja sangat rapi dan selesai tepat waktu. Komunikasi juga sangat lancar!' },
  { id: 2, name: 'Siti Rahayu', initial: 'SR', color: '#10b981', rating: 4, date: '5 Jul 2026', comment: 'Desainnya bagus, hanya perlu sedikit revisi di awal. Overall sangat memuaskan.' },
];

const ProfilePage = () => {
  const { user, login, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolios, setPortfolios] = useState(defaultPortfolios);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);

  // Avatar upload state
  const avatarInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile Edit Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || 'Saya adalah seorang profesional berdedikasi dengan pengalaman di bidang kreatif dan teknologi.',
    city: user?.profile?.location || user?.profile?.city || 'Jakarta, Indonesia',
    phone: user?.phone || '',
    skills: user?.profile?.skills ? (Array.isArray(user?.profile?.skills) ? user?.profile?.skills.join(', ') : user?.profile?.skills) : 'UI/UX Design, React.js, Figma, Node.js',
    website: user?.profile?.website || '',
  });

  // Portfolio Modal State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    project_url: '',
    image: null,
    image_preview: '',
  });
  const portfolioImageInputRef = useRef(null);

  // Fetch portfolios on mount
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoadingPortfolios(true);
    try {
      const res = await fetchPortfoliosApi();
      if (res.data && res.data.length > 0) {
        setPortfolios(res.data);
      }
    } catch (err) {
      console.warn('Portfolios API fallback to default:', err);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await updateProfileApi(formData);
      const newAvatar = res.data?.avatar || res.user?.avatar || previewUrl;

      login({ ...user, avatar: newAvatar }, localStorage.getItem('skillhub_token'));

      Swal.fire({
        icon: 'success',
        title: 'Foto Profil Diperbarui!',
        text: 'Foto profil berhasil diunggah ke server.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.warn('Avatar upload fallback to preview:', err);
      login({ ...user, avatar: previewUrl }, localStorage.getItem('skillhub_token'));
      Swal.fire({
        icon: 'success',
        title: 'Foto Profil Diperbarui',
        text: 'Foto profil baru berhasil dipasang.',
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Profile Form Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('bio', profileForm.bio);
      formData.append('city', profileForm.city);
      formData.append('phone', profileForm.phone);
      formData.append('skills', profileForm.skills);
      if (profileForm.website) formData.append('website', profileForm.website);

      const res = await updateProfileApi(formData);
      const updatedUser = res.data || user;

      login({
        ...user,
        name: profileForm.name,
        phone: profileForm.phone,
        profile: {
          ...(user?.profile || {}),
          bio: profileForm.bio,
          location: profileForm.city,
          city: profileForm.city,
          skills: profileForm.skills.split(',').map(s => s.trim()),
          website: profileForm.website,
        }
      }, localStorage.getItem('skillhub_token'));

      Swal.fire({
        icon: 'success',
        title: 'Profil Berhasil Diperbarui',
        text: 'Informasi profil Anda telah diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
      setShowEditProfileModal(false);
    } catch (err) {
      console.warn('Profile update fallback:', err);
      login({
        ...user,
        name: profileForm.name,
        phone: profileForm.phone,
        profile: {
          ...(user?.profile || {}),
          bio: profileForm.bio,
          location: profileForm.city,
          city: profileForm.city,
          skills: profileForm.skills.split(',').map(s => s.trim()),
          website: profileForm.website,
        }
      }, localStorage.getItem('skillhub_token'));

      Swal.fire({
        icon: 'success',
        title: 'Profil Berhasil Diperbarui',
        text: 'Informasi profil Anda telah diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
      setShowEditProfileModal(false);
    }
  };

  // Open Portfolio Modal for Add
  const handleOpenAddPortfolio = () => {
    setEditingPortfolio(null);
    setPortfolioForm({
      title: '',
      category: 'Web Development',
      description: '',
      project_url: '',
      image: null,
      image_preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    });
    setShowPortfolioModal(true);
  };

  // Open Portfolio Modal for Edit
  const handleOpenEditPortfolio = (item) => {
    setEditingPortfolio(item);
    setPortfolioForm({
      title: item.title,
      category: item.category || 'Web Development',
      description: item.description || '',
      project_url: item.project_url || '',
      image: null,
      image_preview: item.image_path || item.image || '',
    });
    setShowPortfolioModal(true);
  };

  // Portfolio Image Change
  const handlePortfolioImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPortfolioForm({
      ...portfolioForm,
      image: file,
      image_preview: previewUrl,
    });
  };

  // Portfolio Save (Add / Edit)
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    if (!portfolioForm.title.trim()) {
      Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Judul portofolio wajib diisi.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', portfolioForm.title);
      formData.append('description', portfolioForm.description);
      if (portfolioForm.project_url) formData.append('project_url', portfolioForm.project_url);
      if (portfolioForm.image) {
        formData.append('image', portfolioForm.image);
      } else if (portfolioForm.image_preview) {
        formData.append('image_url', portfolioForm.image_preview);
      }

      if (editingPortfolio) {
        await updatePortfolioApi(editingPortfolio.id, formData);
        Swal.fire({ icon: 'success', title: 'Portofolio Diperbarui', timer: 1500, showConfirmButton: false });
      } else {
        await createPortfolioApi(formData);
        Swal.fire({ icon: 'success', title: 'Portofolio Ditambahkan', timer: 1500, showConfirmButton: false });
      }

      loadPortfolios();
      setShowPortfolioModal(false);
    } catch (err) {
      console.warn('Portfolio API fallback:', err);
      if (editingPortfolio) {
        setPortfolios(portfolios.map(p => p.id === editingPortfolio.id ? {
          ...p,
          title: portfolioForm.title,
          description: portfolioForm.description,
          project_url: portfolioForm.project_url,
          image_path: portfolioForm.image_preview,
        } : p));
      } else {
        const newItem = {
          id: Date.now(),
          title: portfolioForm.title,
          category: portfolioForm.category,
          description: portfolioForm.description,
          project_url: portfolioForm.project_url,
          image_path: portfolioForm.image_preview || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        };
        setPortfolios([newItem, ...portfolios]);
      }
      Swal.fire({ icon: 'success', title: 'Portofolio Berhasil Disimpan!', timer: 1500, showConfirmButton: false });
      setShowPortfolioModal(false);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus Portofolio?',
      text: 'Portofolio yang dihapus tidak dapat dikembalikan.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        await deletePortfolioApi(id);
      } catch (err) {
        console.warn('Delete portfolio API fallback:', err);
      }
      setPortfolios(portfolios.filter(p => p.id !== id));
      Swal.fire({ icon: 'success', title: 'Portofolio Dihapus', timer: 1500, showConfirmButton: false });
    }
  };

  const currentSkills = user?.profile?.skills 
    ? (Array.isArray(user?.profile?.skills) ? user?.profile?.skills : user?.profile?.skills.split(',')) 
    : ['UI/UX Design', 'React.js', 'Figma', 'Node.js', 'Tailwind CSS'];

  return (
    <div className="container-fluid pb-5">
      
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={avatarInputRef}
        className="d-none"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleAvatarSelect}
      />

      {/* ── Profile Header Banner ── */}
      <div className="card border-0 rounded-4 shadow-sm overflow-hidden mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        {/* Cover Banner */}
        <div style={{ 
          height: '180px', 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e40af 50%, #7c3aed 100%)',
          position: 'relative'
        }}>
          <button 
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="btn btn-sm fw-semibold position-absolute d-flex align-items-center gap-2"
            style={{ 
              top: '20px', right: '20px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)'
            }}
          >
            <FiCamera size={14} /> Ubah Sampul / Foto
          </button>
        </div>
        
        <div className="px-4 pb-4 position-relative">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-3">
            <div className="d-flex align-items-end" style={{ marginTop: '-64px' }}>
              
              {/* Avatar Picture with Interactive Camera Badge */}
              <div className="position-relative d-inline-block">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="rounded-circle object-fit-cover shadow-md"
                    style={{ 
                      width: '128px', height: '128px', 
                      border: '4px solid var(--card-bg)', zIndex: 1 
                    }}
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{ 
                      width: '128px', height: '128px', fontSize: '3rem', 
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      border: '4px solid var(--card-bg)', zIndex: 1
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow border border-2 border-white d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px', zIndex: 2 }}
                        title="Ubah Foto Profil"
                      >
                        <FiCamera size={16} />
                      </button>
                    </div>

                    <div className="ms-3 mb-2">
                      <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{user?.name || 'Nama Pengguna'}</h3>

                      {/* ── User/Client ID Badge ── */}
                      <div className="mb-2">
                        <span
                          className="badge fw-bold font-monospace px-3 py-1"
                          style={{
                            backgroundColor: userRole === 'customer' ? 'rgba(16,185,129,0.12)' : 'rgba(139,92,246,0.12)',
                            color: userRole === 'customer' ? '#059669' : '#7c3aed',
                            border: `1px solid ${userRole === 'customer' ? '#6ee7b7' : '#c4b5fd'}`,
                            fontSize: '0.82rem',
                            letterSpacing: '0.04em',
                          }}
                          title="ID Akun Anda"
                        >
                          {userRole === 'customer'
                            ? `CLT-${String(user?.id || 0).padStart(5, '0')}`
                            : `FRL-${String(user?.id || 0).padStart(5, '0')}`}
                        </span>
                      </div>

                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <span className="badge text-capitalize" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontWeight: '600' }}>
                          {userRole || 'User'}
                        </span>
                        <span className="d-flex align-items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <FiMapPin size={14} /> {user?.profile?.location || user?.profile?.city || 'Jakarta, Indonesia'}
                        </span>
                        <span className="d-flex align-items-center gap-1" style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: '600' }}>
                          <FiStar size={14} /> 4.9/5.0
                        </span>
                      </div>
                    </div>
            </div>

            <div className="mt-4 mt-md-0 d-flex gap-2">
              <button 
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="btn btn-primary fw-semibold px-4 shadow-sm" style={{ borderRadius: '10px' }}
              >
                <FiEdit3 className="me-2" size={15} /> Edit Profil
              </button>
            </div>
          </div>
          
          <p className="mb-3" style={{ color: 'var(--text-main)', fontSize: '0.95rem', maxWidth: '760px', lineHeight: '1.7' }}>
            {user?.profile?.bio || 'Saya adalah seorang profesional berdedikasi dengan pengalaman di bidang kreatif dan teknologi. Selalu berusaha memberikan hasil terbaik untuk klien dengan komunikasi yang transparan dan pekerjaan tepat waktu.'}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* ── Left Sidebar ── */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm p-4 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h6 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Informasi Kontak</h6>
            <div className="d-flex flex-column gap-3">
              {[
                {
                  icon: <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-muted)' }}>#</span>,
                  label: userRole === 'customer' ? 'ID Client' : 'ID Freelancer',
                  value: userRole === 'customer'
                    ? `CLT-${String(user?.id || 0).padStart(5, '0')}`
                    : `FRL-${String(user?.id || 0).padStart(5, '0')}`,
                  isMonospace: true,
                },
                { icon: <FiMail size={16} />, label: 'Email', value: user?.email || 'email@example.com' },
                { icon: <FiPhone size={16} />, label: 'Telepon', value: user?.phone || '081234567890' },
                { icon: <FiGlobe size={16} />, label: 'Website', value: user?.profile?.website || 'www.portfolio.com', isLink: true },
              ].map((item, i) => (
                <div key={i} className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1px' }}>{item.label}</div>
                    <div
                      className={`fw-semibold${item.isMonospace ? ' font-monospace' : ''}`}
                      style={{ color: item.isLink ? '#3b82f6' : 'var(--text-main)', fontSize: '0.88rem' }}
                    >{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Keahlian Utama</h6>
            <div className="d-flex flex-wrap gap-2">
              {currentSkills.map((skill, i) => (
                <span key={i} className="badge fw-semibold" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '7px 12px', fontSize: '0.78rem' }}>
                  {typeof skill === 'string' ? skill.trim() : skill}
                </span>
              ))}
            </div>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Statistik</h6>
            {[
              { icon: <FiCheckCircle size={15} />, label: 'Pekerjaan Selesai', value: '42' },
              { icon: <FiStar size={15} />, label: 'Rating Rata-rata', value: '4.9 / 5.0', valueColor: '#f59e0b' },
              { icon: <FiBriefcase size={15} />, label: 'Total Pengalaman', value: '5 Tahun' },
            ].map((stat, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {stat.icon} {stat.label}
                </span>
                <span className="fw-bold" style={{ color: stat.valueColor || 'var(--text-main)', fontSize: '0.9rem' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Content (Tabs & Portfolio Management) ── */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 rounded-4 shadow-sm p-4" style={{ backgroundColor: 'var(--card-bg)', minHeight: '480px' }}>
            
            {/* Header Tabs with Add Portfolio Button */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex gap-2">
                {[
                  { key: 'portfolio', label: `Portofolio Karya (${portfolios.length})` },
                  { key: 'reviews', label: `Ulasan (${dummyReviews.length})` },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="btn fw-semibold px-4"
                    style={{
                      borderRadius: '10px',
                      backgroundColor: activeTab === tab.key ? 'var(--primary-color)' : 'transparent',
                      color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                      border: 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'portfolio' && (
                <button
                  type="button"
                  onClick={handleOpenAddPortfolio}
                  className="btn btn-primary fw-bold d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                >
                  <FiPlus size={18} /> Tambah Portofolio
                </button>
              )}
            </div>

            {/* Portfolio Tab Content */}
            {activeTab === 'portfolio' && (
              <div>
                {loadingPortfolios ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : portfolios.length > 0 ? (
                  <div className="row g-4">
                    {portfolios.map(item => (
                      <div key={item.id} className="col-12 col-sm-6 col-lg-6">
                        <div 
                          className="card border-0 rounded-4 overflow-hidden h-100 shadow-sm position-relative group-hover"
                          style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}
                        >
                          <div style={{ height: '180px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--border-color)' }}>
                            <img 
                              src={item.image_path || item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'} 
                              alt={item.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {/* Action Buttons overlay */}
                            <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPortfolio(item)}
                                className="btn btn-sm btn-light rounded-circle shadow p-2"
                                title="Edit Karya"
                              >
                                <FiEdit3 size={14} className="text-primary" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="btn btn-sm btn-light rounded-circle shadow p-2"
                                title="Hapus Karya"
                              >
                                <FiTrash2 size={14} className="text-danger" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <div className="mb-1 text-primary small fw-semibold">{item.category || 'Portofolio Projek'}</div>
                            <h6 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>{item.title}</h6>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                              {item.description}
                            </p>
                            {item.project_url && (
                              <a
                                href={item.project_url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-link p-0 text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1 mt-1"
                              >
                                Lihat Proyek <FiExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <FiBriefcase size={48} className="mb-3 opacity-50" />
                    <p className="fw-bold mb-1">Belum Ada Portofolio</p>
                    <p className="small mb-3">Tunjukkan karya terbaik Anda untuk menarik lebih banyak calon klien di SkillHub.</p>
                    <button onClick={handleOpenAddPortfolio} className="btn btn-primary fw-bold rounded-3 px-4">
                      + Tambah Portofolio Pertama
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab Content */}
            {activeTab === 'reviews' && (
              <div className="d-flex flex-column gap-3">
                {dummyReviews.map(review => (
                  <div key={review.id} className="p-4 rounded-4" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: review.color, fontSize: '0.95rem' }}>
                          {review.initial}
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{review.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{review.date}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-1" style={{ color: '#f59e0b' }}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={16} style={{ fill: i < review.rating ? '#f59e0b' : 'none' }} />
                        ))}
                      </div>
                    </div>
                    <p className="mb-0" style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.65', fontStyle: 'italic' }}>
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── MODAL: EDIT PROFIL ── */}
      {showEditProfileModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Edit Informasi Profil</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditProfileModal(false)}></button>
              </div>
              <form onSubmit={handleSaveProfile}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Lokasi / Kota</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Nomor Telepon / WhatsApp</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Website / Tautan Portofolio</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Keahlian (Pisahkan dengan koma)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.skills}
                        onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                        placeholder="React, Figma, Laravel, UI/UX"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Bio & Deskripsi Singkat</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowEditProfileModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary fw-bold rounded-3 px-4">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: TAMBAH / EDIT PORTOFOLIO ── */}
      {showPortfolioModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingPortfolio ? 'Edit Karya Portofolio' : 'Tambah Karya Portofolio Baru'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowPortfolioModal(false)}></button>
              </div>
              <form onSubmit={handleSavePortfolio}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Judul Proyek / Karya</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Redesain Aplikasi Mobile E-Commerce"
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Kategori Karya</label>
                      <select
                        className="form-select"
                        value={portfolioForm.category}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Mobile App">Mobile App Development</option>
                        <option value="Video & Motion">Video &amp; Motion Graphics</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Link Proyek (Opsional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com"
                        value={portfolioForm.project_url}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, project_url: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Gambar Tangkapan Layar Proyek</label>
                    <input
                      type="file"
                      ref={portfolioImageInputRef}
                      className="d-none"
                      accept="image/*"
                      onChange={handlePortfolioImageChange}
                    />
                    
                    <div className="d-flex align-items-center gap-3">
                      {portfolioForm.image_preview && (
                        <img
                          src={portfolioForm.image_preview}
                          alt="Preview"
                          className="rounded-3 border object-fit-cover"
                          style={{ width: '120px', height: '80px' }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => portfolioImageInputRef.current?.click()}
                        className="btn btn-outline-primary d-flex align-items-center gap-2 rounded-3"
                      >
                        <FiUpload size={16} /> Pilih File Gambar...
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Deskripsi Hasil Kerja</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Jelaskan peran Anda, teknologi yang digunakan, serta dampak positif karya ini..."
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowPortfolioModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary fw-bold rounded-3 px-4">
                    {editingPortfolio ? 'Simpan Perubahan' : 'Tambah Portofolio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
