import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/common/Footer';
import { 
  FiHome, FiBriefcase, FiMessageSquare, FiDollarSign, 
  FiUser, FiSettings, FiLogOut, FiMenu, FiX, FiBell, 
  FiMoon, FiSun, FiSearch, FiChevronDown, FiFileText,
  FiUsers, FiBarChart2, FiClock, FiStar, FiBookmark,
  FiTrendingUp, FiCreditCard, FiActivity, FiPlusCircle
} from 'react-icons/fi';

/* ───────────── Dropdown Item Component ───────────── */
const DropdownItem = ({ to, icon, label, desc, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-decoration-none d-flex align-items-start gap-3 px-4 py-2 dropdown-hover-item"
    style={{ color: 'var(--text-main)' }}
  >
    {icon && (
      <span className="mt-1 flex-shrink-0" style={{ color: 'var(--primary-color)' }}>{icon}</span>
    )}
    <div>
      <div className="fw-semibold" style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{label}</div>
      {desc && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>}
    </div>
  </Link>
);

/* ───────────── Nav Dropdown Component ───────────── */
const NavDropdown = ({ label, sections, isActive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="position-relative d-flex align-items-center h-100" ref={ref}>
      <button
        type="button"
        className={`minimal-nav-link ${isActive ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {label} <FiChevronDown size={13} style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div
          className="position-absolute top-100 start-0 rounded-3 shadow-lg border py-2"
          style={{ minWidth: '240px', backgroundColor: 'var(--card-bg)', zIndex: 1060, border: '1px solid var(--border-color)', marginTop: '0px' }}
        >
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <div className="px-4 pt-2 pb-1" style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  {section.title}
                </div>
              )}
              {section.items.map((item, ii) => (
                <DropdownItem key={ii} {...item} onClick={() => setOpen(false)} />
              ))}
              {si < sections.length - 1 && <hr className="my-2 mx-3" style={{ borderColor: 'var(--border-color)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ───────────── Main Layout ───────────── */
const DashboardLayout = () => {
  const { user, userRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Talent');
  const [isSearchCatOpen, setSearchCatOpen] = useState(false);
  const profileRef = useRef(null);
  const searchCatRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdownOpen(false);
      if (searchCatRef.current && !searchCatRef.current.contains(e.target)) setSearchCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    // Ambil role SEBELUM logout membersihkan state (userRole sudah ternormalisasi)
    const roleBeforeLogout = userRole;

    await logout(); // clear user state & token

    // Gunakan window.location untuk hard redirect agar tidak di-intercept ProtectedRoute
    if (roleBeforeLogout === 'freelancer') {
      window.location.href = '/freelancer'; // Landing page khusus freelancer
    } else {
      window.location.href = '/';           // Landing page utama (client)
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const dest = searchCategory === 'Lowongan'
        ? `/dashboard/client/jobs?search=${encodeURIComponent(searchQuery.trim())}`
        : `/dashboard/talent?search=${encodeURIComponent(searchQuery.trim())}&type=${encodeURIComponent(searchCategory.toLowerCase())}`;
      navigate(dest);
    }
  };

  const searchCategories = [
    { label: 'Talent', icon: <FiUsers size={15} />, desc: 'Temukan freelancer & agensi' },
    { label: 'Jasa', icon: <FiBriefcase size={15} />, desc: 'Lihat layanan dari para pro' },
    { label: 'Lowongan', icon: <FiFileText size={15} />, desc: 'Lowongan yang diposting klien' },
  ];

  const dashboardHome = userRole === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client';

  /* ── CLIENT NAV STRUCTURE ── */
  const clientNav = [
    {
      label: 'Cari Talent',
      sections: [
        {
          title: 'Kelola Lowongan',
          items: [
            { to: '/dashboard/client/jobs', icon: <FiBriefcase size={16} />, label: 'Lowongan & Proposal', desc: 'Lihat semua posting pekerjaan Anda' },
            { to: '/dashboard/client/proposals', icon: <FiFileText size={16} />, label: 'Penawaran Tertunda', desc: 'Tinjau penawaran dari freelancer' },
          ]
        },
        {
          title: 'Temukan Freelancer',
          items: [
            { to: '/dashboard/client/post-job', icon: <FiPlusCircle size={16} />, label: 'Posting Pekerjaan', desc: 'Buat lowongan baru' },
            { to: '/dashboard/talent', icon: <FiSearch size={16} />, label: 'Cari Freelancer', desc: 'Temukan talent terbaik' },
            { to: '/dashboard/client/saved-talents', icon: <FiStar size={16} />, label: 'Talent Tersimpan', desc: 'Daftar favorit Anda' },
          ]
        }
      ]
    },
    {
      label: 'Kelola Pekerjaan',
      sections: [
        {
          title: 'Kontrak Aktif',
          items: [
            { to: '/dashboard/client/contracts', icon: <FiActivity size={16} />, label: 'Kontrak Saya', desc: 'Kelola kontrak berjalan' },
            { to: '/dashboard/client/team', icon: <FiUsers size={16} />, label: 'Tim Saya', desc: 'Freelancer yang bekerja dengan Anda' },
          ]
        },
        {
          title: 'Aktivitas & Waktu',
          items: [
            { to: '/dashboard/client/timesheet', icon: <FiClock size={16} />, label: 'Timesheet', desc: 'Lacak jam kerja freelancer' },
            { to: '/dashboard/client/daily-report', icon: <FiBookmark size={16} />, label: 'Laporan Harian', desc: 'Catatan aktivitas harian' },
          ]
        }
      ]
    },
    {
      label: 'Laporan',
      sections: [
        {
          items: [
            { to: '/dashboard/billing', icon: <FiTrendingUp size={16} />, label: 'Ringkasan Keuangan', desc: 'Total pengeluaran mingguan' },
            { to: '/dashboard/billing', icon: <FiCreditCard size={16} />, label: 'Riwayat Transaksi', desc: 'Semua pembayaran yang dilakukan' },
            { to: '/dashboard/billing', icon: <FiBarChart2 size={16} />, label: 'Pengeluaran per Aktivitas', desc: 'Breakdown biaya per proyek' },
          ]
        }
      ]
    },
  ];

  /* ── FREELANCER NAV STRUCTURE ── */
  const freelancerNav = [
    {
      label: 'Cari Kerja',
      sections: [
        {
          title: 'Marketplace Pekerjaan',
          items: [
            { to: '/dashboard/freelancer/browse-jobs', icon: <FiSearch size={16} />, label: 'Cari Pekerjaan', desc: 'Temukan project yang cocok' },
            { to: '/dashboard/freelancer/proposals', icon: <FiFileText size={16} />, label: 'Proposal Terkirim', desc: 'Lacak status proposal Anda' },
          ]
        }
      ]
    },
    {
      label: 'Pekerjaan Saya',
      sections: [
        {
          title: 'Layanan & Pesanan',
          items: [
            { to: '/dashboard/freelancer/gigs', icon: <FiBriefcase size={16} />, label: 'Layanan Saya (My Gigs)', desc: 'Kelola paket jasa yang Anda tawarkan' },
            { to: '/dashboard/freelancer/orders', icon: <FiActivity size={16} />, label: 'Pesanan Aktif', desc: 'Proyek yang sedang dikerjakan' },
          ]
        },
        {
          title: 'Kontrak',
          items: [
            { to: '/dashboard/freelancer/contracts', icon: <FiFileText size={16} />, label: 'Kontrak Saya', desc: 'Semua kontrak aktif & selesai' },
          ]
        }
      ]
    },
    {
      label: 'Keuangan',
      sections: [
        {
          items: [
            { to: '/dashboard/freelancer/wallet', icon: <FiTrendingUp size={16} />, label: 'Dompet & Pendapatan', desc: 'Saldo dan riwayat penghasilan' },
            { to: '/dashboard/freelancer/wallet', icon: <FiCreditCard size={16} />, label: 'Tarik Dana (Payout)', desc: 'Cairkan penghasilan ke rekening' },
            { to: '/dashboard/freelancer/wallet', icon: <FiBarChart2 size={16} />, label: 'Statistik Performa', desc: 'View, click, dan performa gig' },
          ]
        }
      ]
    },
  ];

  const navStructure = userRole === 'freelancer' ? freelancerNav : clientNav;

  const isNavActive = (nav) => {
    if (!nav?.sections) return false;
    return nav.sections.some(s => s?.items?.some(item => {
      if (item?.to === '/dashboard/client' || item?.to === '/dashboard/freelancer') {
        return false;
      }
      return item?.to && location.pathname.startsWith(item.to);
    }));
  };

  /* Simple links always visible */
  const simpleLinks = [
    { path: '/dashboard/messages', label: 'Pesan', icon: <FiMessageSquare /> },
  ];

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* ── Top Navigation Bar (Minimal Flat Stripe/Linear Style) ── */}
      <header className="sticky-top border-bottom" style={{ backgroundColor: 'var(--card-bg)', zIndex: 1030, height: '72px' }}>
        <div className="container-fluid px-lg-4 h-100">
          <div className="d-flex align-items-center justify-content-between h-100">
            
            {/* Logo & Navigation */}
            <div className="d-flex align-items-center h-100" style={{ gap: '40px' }}>
              <Link to={dashboardHome} className="fs-4 fw-bold hero-gradient-text text-decoration-none flex-shrink-0">
                SkillHub
              </Link>

              {/* Desktop Dropdown Nav */}
              <nav className="d-none d-lg-flex align-items-center h-100" style={{ gap: '36px' }}>
                {/* Dashboard Home link */}
                <Link
                  to={dashboardHome}
                  className={`minimal-nav-link ${location.pathname === dashboardHome ? 'active' : ''}`}
                >
                  <FiHome size={15} /> Beranda
                </Link>

                {navStructure.map((nav, i) => (
                  <NavDropdown key={i} label={nav.label} sections={nav.sections} isActive={isNavActive(nav)} />
                ))}

                {simpleLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`minimal-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Global Search Bar with Category Dropdown */}
            <div className="d-none d-md-block flex-grow-1 mx-4" style={{ maxWidth: '420px' }}>
              <form onSubmit={handleSearch}>
                <div className="input-group" style={{ borderRadius: '10px', overflow: 'visible', position: 'relative' }}>
                  {/* Search Icon */}
                  <span className="input-group-text border-end-0 text-muted" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', borderRadius: '10px 0 0 10px' }}>
                    <FiSearch size={16} />
                  </span>
                  {/* Search Input */}
                  <input 
                    type="text" 
                    className="form-control border-start-0 border-end-0" 
                    placeholder={`Cari ${searchCategory.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', boxShadow: 'none' }}
                  />
                  {/* Category Button */}
                  <div className="position-relative" ref={searchCatRef}>
                    <button
                      type="button"
                      onClick={() => setSearchCatOpen(!isSearchCatOpen)}
                      className="btn fw-semibold d-flex align-items-center gap-2 border-start"
                      style={{ 
                        backgroundColor: 'var(--primary-color)', color: '#fff',
                        borderColor: 'var(--primary-color)', borderRadius: '0 10px 10px 0',
                        fontSize: '0.8rem', height: '100%', whiteSpace: 'nowrap', padding: '0 14px'
                      }}
                    >
                      {searchCategory} <FiChevronDown size={13} style={{ transition: 'transform 0.2s', transform: isSearchCatOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>

                    {/* Category Dropdown */}
                    {isSearchCatOpen && (
                      <div
                        className="position-absolute end-0 top-100 mt-1 rounded-3 shadow-lg border py-2"
                        style={{ minWidth: '220px', backgroundColor: 'var(--card-bg)', zIndex: 1070, border: '1px solid var(--border-color)' }}
                      >
                        {searchCategories.map((cat) => (
                          <button
                            key={cat.label}
                            type="button"
                            onClick={() => { setSearchCategory(cat.label); setSearchCatOpen(false); }}
                            className="d-flex align-items-start gap-3 w-100 border-0 text-start px-4 py-2 dropdown-hover-item"
                            style={{ backgroundColor: searchCategory === cat.label ? 'var(--bg-color)' : 'transparent', cursor: 'pointer' }}
                          >
                            <span className="mt-1 flex-shrink-0" style={{ color: 'var(--primary-color)' }}>{cat.icon}</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: '0.875rem', color: 'var(--text-color)' }}>{cat.label}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{cat.desc}</div>
                            </div>
                            {searchCategory === cat.label && (
                              <span className="ms-auto mt-1" style={{ color: 'var(--primary-color)', fontSize: '0.75rem' }}>✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Right Actions */}
            <div className="d-flex align-items-center gap-2">
              <button onClick={toggleTheme} className="btn btn-link text-muted p-2 rounded-circle d-none d-sm-flex">
                {theme === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
              </button>

              <button className="btn btn-link text-muted position-relative p-2 rounded-circle">
                <FiBell size={19} />
                <span className="position-absolute" style={{ top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid var(--card-bg)' }}></span>
              </button>

              <div className="vr mx-1 d-none d-md-block" style={{ backgroundColor: 'var(--border-color)' }}></div>

              {/* Profile Dropdown */}
              <div className="position-relative" ref={profileRef}>
                <button 
                  className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2"
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', fontSize: '0.9rem' }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <FiChevronDown size={14} className="text-muted d-none d-md-block" />
                </button>

                {isProfileDropdownOpen && (
                  <div 
                    className="position-absolute end-0 mt-2 rounded-3 shadow-lg border py-2"
                    style={{ width: '220px', backgroundColor: 'var(--card-bg)', zIndex: 1050, border: '1px solid var(--border-color)' }}
                  >
                    <div className="px-4 py-2 border-bottom mb-1" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
                      <small className="text-muted text-truncate d-block">{user?.email}</small>
                      <span className="badge mt-1 text-capitalize" style={{ backgroundColor: 'var(--primary-color)20', color: 'var(--primary-color)', fontSize: '0.7rem' }}>{userRole}</span>
                    </div>
                    <DropdownItem to="/profile" icon={<FiUser size={15} />} label="Profil Saya" onClick={() => setProfileDropdownOpen(false)} />
                    <DropdownItem to="/dashboard/billing" icon={<FiCreditCard size={15} />} label="Keuangan & Tagihan" onClick={() => setProfileDropdownOpen(false)} />
                    <DropdownItem to="/settings" icon={<FiSettings size={15} />} label="Pengaturan" onClick={() => setProfileDropdownOpen(false)} />
                    <hr className="my-1 mx-3" style={{ borderColor: 'var(--border-color)' }} />
                    <button
                      onClick={handleLogout}
                      className="btn btn-link w-100 text-decoration-none text-start d-flex align-items-start gap-3 px-4 py-2"
                      style={{ color: '#ef4444' }}
                    >
                      <FiLogOut size={16} className="mt-1 flex-shrink-0" />
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>Keluar</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Toggle */}
              <button 
                className="btn btn-link text-muted d-lg-none p-2"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="d-lg-none border-top px-3 py-3" style={{ backgroundColor: 'var(--card-bg)' }}>
            <form onSubmit={handleSearch} className="mb-3">
              <div className="input-group">
                <span className="input-group-text border-end-0 text-muted" style={{ backgroundColor: 'var(--bg-color)' }}><FiSearch /></span>
                <input 
                  type="text" className="form-control border-start-0" 
                  placeholder="Cari freelancer atau layanan..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-color)' }}
                />
              </div>
            </form>
            <div className="d-flex flex-column gap-1">
              <Link to={dashboardHome} onClick={() => setMobileMenuOpen(false)} className={`text-decoration-none px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 ${location.pathname === dashboardHome ? 'text-primary' : 'text-muted'}`}>
                <FiHome /> Beranda
              </Link>
              {navStructure.map((nav, ni) =>
                nav.sections.map((section, si) =>
                  section.items.map((item, ii) => (
                    <Link key={`${ni}-${si}-${ii}`} to={item.to} onClick={() => setMobileMenuOpen(false)} className="text-decoration-none px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 text-muted">
                      {item.icon} {item.label}
                    </Link>
                  ))
                )
              )}
              {simpleLinks.map(link => (
                <Link key={link.label} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`text-decoration-none px-3 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 ${location.pathname === link.path ? 'text-primary' : 'text-muted'}`}>
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 container-fluid px-lg-5 py-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      <style>{`
        .dropdown-hover-item:hover {
          background-color: var(--bg-color) !important;
          border-radius: 8px;
        }
        .dropdown-hover-item {
          transition: background-color 0.15s ease;
          border-radius: 8px;
          margin: 0 8px;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
