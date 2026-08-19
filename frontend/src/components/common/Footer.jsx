import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiMail } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Untuk Klien',
      links: [
        { label: 'Cara Kerja SkillHub', to: '#' },
        { label: 'Cari Freelancer', to: '/explore' },
        { label: 'Posting Pekerjaan', to: '/register/client' },
        { label: 'Panduan Klien', to: '#' },
      ],
    },
    {
      title: 'Untuk Freelancer',
      links: [
        { label: 'Daftar Jadi Freelancer', to: '/register/freelancer' },
        { label: 'Cara Mendapat Klien', to: '#' },
        { label: 'Panduan Freelancer', to: '#' },
        { label: 'Forum Komunitas', to: '#' },
      ],
    },
    {
      title: 'Perusahaan',
      links: [
        { label: 'Tentang Kami', to: '#' },
        { label: 'Bantuan & Dukungan', to: '#' },
        { label: 'Kebijakan Privasi', to: '#' },
        { label: 'Syarat & Ketentuan', to: '#' },
      ],
    },
  ];

  const socials = [
    { icon: <FiInstagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <FiTwitter size={18} />, href: '#', label: 'Twitter / X' },
    { icon: <FiLinkedin size={18} />, href: '#', label: 'LinkedIn' },
    { icon: <FiYoutube size={18} />, href: '#', label: 'YouTube' },
  ];

  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>
      {/* Main Footer */}
      <div className="container py-5">
        <div className="row g-5">
          
          {/* Brand column */}
          <div className="col-12 col-lg-3">
            <Link to="/" className="text-decoration-none d-inline-block mb-3">
              <span className="fw-bold fs-4" style={{ color: '#fff' }}>Skill</span>
              <span className="fw-bold fs-4" style={{ color: '#3b82f6' }}>Hub</span>
            </Link>
            <p className="small mb-4" style={{ color: '#64748b', lineHeight: '1.7' }}>
              Platform freelance lokal Indonesia. Menghubungkan klien dengan talenta digital terbaik secara aman dan profesional.
            </p>
            {/* Social Icons */}
            <div className="d-flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '36px', height: '36px', backgroundColor: '#1e293b', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="col-6 col-md-4 col-lg-2">
              <h6 className="fw-bold mb-3" style={{ color: '#e2e8f0', fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                {col.title}
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-decoration-none small"
                      style={{ color: '#64748b', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="col-12 col-md-4 col-lg-3">
            <h6 className="fw-bold mb-3" style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>Hubungi Kami</h6>
            <a
              href="mailto:support@skillhub.id"
              className="d-flex align-items-center gap-2 text-decoration-none small mb-2"
              style={{ color: '#64748b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <FiMail size={15} />
              support@skillhub.id
            </a>
            <div className="mt-4">
              <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#1e293b', color: '#3b82f6', fontSize: '0.75rem' }}>
                🇮🇩 Proudly Made in Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #1e293b' }}>
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="small" style={{ color: '#475569' }}>
              © {year} SkillHub Indonesia. Hak cipta dilindungi.
            </span>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none small" style={{ color: '#475569' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >Kebijakan Privasi</a>
              <span style={{ color: '#334155' }}>·</span>
              <a href="#" className="text-decoration-none small" style={{ color: '#475569' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >Syarat & Ketentuan</a>
              <span style={{ color: '#334155' }}>·</span>
              <a href="#" className="text-decoration-none small" style={{ color: '#475569' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >Keamanan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
