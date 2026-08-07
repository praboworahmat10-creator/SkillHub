import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiSun, FiMoon, FiUser, FiBriefcase, FiLogOut, FiMenu, FiX, FiLayers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-navbar py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
          <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-2" style={{ width: '38px', height: '38px' }}>
            <FiLayers size={22} />
          </div>
          <span className="text-primary">Skill</span>
          <span className="text-dark dark:text-light">Hub</span>
        </Link>

        {/* Mobile Toggle Button */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <button className="btn btn-sm btn-outline-sh border-0 p-2" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} className="text-warning" />}
          </button>
          <button
            className="btn btn-outline-sh p-2 ms-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Navbar Links & Controls */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show mt-3' : ''}`}>
          {/* Search Bar Input */}
          <form className="mx-lg-auto my-2 my-lg-0" style={{ maxWidth: '380px', width: '100%' }} onSubmit={handleSearchSubmit}>
            <div className="position-relative">
              <input
                type="text"
                className="form-control rounded-pill pe-5 ps-4 py-2 bg-light dark:bg-dark text-dark dark:text-light border-0 shadow-sm"
                placeholder="Cari jasa programmer, designer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn text-muted position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-3 align-items-lg-center fw-medium">
            <li className="nav-item">
              <Link className="nav-link px-3 text-secondary-dark" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-secondary-dark" to="/explore">Explore</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 text-secondary-dark" to="/register-freelancer">Jadi Freelancer</Link>
            </li>
          </ul>

          {/* User Controls / Actions */}
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-sh border-0 p-2 d-none d-lg-block me-1" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} className="text-warning" />}
            </button>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-sh dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  <span className="fw-semibold text-truncate ms-1" style={{ maxWidth: '120px' }}>{user.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom mb-1">
                    <div className="fw-bold text-dark">{user.name}</div>
                    <div className="text-muted small">{user.email}</div>
                    <span className="badge badge-pill-primary mt-1 text-capitalize">{userRole}</span>
                  </li>
                  {userRole === 'customer' && (
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/customer/dashboard">
                        <FiUser size={16} /> Dashboard Customer
                      </Link>
                    </li>
                  )}
                  {userRole === 'freelancer' && (
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/freelancer/dashboard">
                        <FiBriefcase size={16} /> Dashboard Freelancer
                      </Link>
                    </li>
                  )}
                  {userRole === 'admin' && (
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/admin/dashboard">
                        <FiUser size={16} /> Dashboard Admin
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger rounded-3 py-2 d-flex align-items-center gap-2" onClick={logout}>
                      <FiLogOut size={16} /> Keluar
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-sh px-4">Masuk</Link>
                <Link to="/register-customer" className="btn btn-primary-sh px-4">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
