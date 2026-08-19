import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiMoon, FiSun, FiMenu, FiX, FiLayers } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const FreelancerNavbar = ({ onOpenAuthModal }) => {
  const { t, i18n } = useTranslation('freelancer');
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'benefits', 'how-it-works', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky-top bg-white dark:bg-dark border-bottom shadow-xs py-2 transition-all">
      <div className="container">
        <nav className="navbar navbar-expand-lg p-0 align-items-center justify-content-between">
          {/* Brand Logo */}
          <Link to="/freelancer" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center text-white rounded-3"
              style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-color)' }}
            >
              <FiLayers size={20} />
            </div>
            <span style={{ color: 'var(--text-main)' }}>
              Skill<span style={{ color: 'var(--primary-color)' }}>Hub</span>
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 p-2 text-dark dark:text-white"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>

          {/* Menu & Controls */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show mt-3 pb-3 border-top pt-3' : ''}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
              <li className="nav-item">
                <a
                  href="#hero"
                  className={`fl-nav-link ${activeSection === 'hero' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'hero')}
                >
                  {t('nav.home')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#benefits"
                  className={`fl-nav-link ${activeSection === 'benefits' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'benefits')}
                >
                  {t('nav.benefits')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#how-it-works"
                  className={`fl-nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                >
                  {t('nav.howItWorks')}
                </a>
              </li>

              <li className="nav-item">
                <a
                  href="#faq"
                  className={`fl-nav-link ${activeSection === 'faq' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, 'faq')}
                >
                  {t('nav.faq')}
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Language Switcher */}
              <button
                className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center gap-1 rounded-3 px-2 py-1.5"
                onClick={toggleLanguage}
                title="Switch Language"
                style={{ color: 'var(--text-main)' }}
              >
                <FiGlobe size={16} />
                <span className="fw-semibold text-uppercase">{i18n.language || 'id'}</span>
              </button>

              {/* Theme Switcher */}
              <button
                className="btn btn-sm btn-outline-secondary border-0 p-2 rounded-3"
                onClick={toggleTheme}
                title="Toggle Theme"
                style={{ color: 'var(--text-main)' }}
              >
                {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} className="text-warning" />}
              </button>

              {/* Login Link */}
              <button
                type="button"
                onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : null}
                className="btn btn-link text-decoration-none fw-semibold px-3 py-2 border-0"
                style={{ color: 'var(--text-main)' }}
              >
                {t('nav.login')}
              </button>

              {/* Primary Register CTA */}
              <button
                type="button"
                onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
                className="btn btn-primary rounded-3 px-4 py-2 fw-semibold shadow-sm border-0"
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >
                {t('nav.register')}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default FreelancerNavbar;
