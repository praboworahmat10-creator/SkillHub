import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiLayers, FiInstagram, FiPhone, FiVideo, FiLinkedin, FiFacebook } from 'react-icons/fi';

const FreelancerFooter = () => {
  const { t } = useTranslation('freelancer');

  return (
    <footer className="bg-dark text-white pt-5 pb-4 border-top border-secondary-subtle">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info Column */}
          <div className="col-12 col-lg-4">
            <Link to="/freelancer" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-color)' }}
              >
                <FiLayers size={20} />
              </div>
              <span className="fs-4 fw-bold text-white">
                Skill<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-muted text-sm mb-4 leading-relaxed" style={{ maxWidth: '320px', color: '#94A3B8' }}>
              {t('footer.tagline')}
            </p>

            {/* Social Media Icons */}
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 text-white border-secondary"
                style={{ width: '36px', height: '36px' }}
                title="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 text-white border-secondary"
                style={{ width: '36px', height: '36px' }}
                title="WhatsApp"
              >
                <FiPhone size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 text-white border-secondary"
                style={{ width: '36px', height: '36px' }}
                title="TikTok"
              >
                <FiVideo size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 text-white border-secondary"
                style={{ width: '36px', height: '36px' }}
                title="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2 text-white border-secondary"
                style={{ width: '36px', height: '36px' }}
                title="Facebook"
              >
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-6 col-sm-3 col-lg-2">
            <h6 className="fw-bold mb-3 text-white text-sm text-uppercase tracking-wider">
              {t('footer.col1Title')}
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><Link to="/explore" className="text-muted text-decoration-none hover-white">{t('footer.col1L1')}</Link></li>
              <li><Link to="/explore" className="text-muted text-decoration-none hover-white">{t('footer.col1L2')}</Link></li>
              <li><a href="#how-it-works" className="text-muted text-decoration-none hover-white">{t('footer.col1L3')}</a></li>
            </ul>
          </div>

          <div className="col-6 col-sm-3 col-lg-2">
            <h6 className="fw-bold mb-3 text-white text-sm text-uppercase tracking-wider">
              {t('footer.col2Title')}
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><Link to="/freelancer/register" className="text-muted text-decoration-none hover-white">{t('footer.col2L1')}</Link></li>
              <li><Link to="/freelancer/register" className="text-muted text-decoration-none hover-white">{t('footer.col2L2')}</Link></li>
              <li><a href="#faq" className="text-muted text-decoration-none hover-white">{t('footer.col2L3')}</a></li>
            </ul>
          </div>

          <div className="col-6 col-sm-3 col-lg-2">
            <h6 className="fw-bold mb-3 text-white text-sm text-uppercase tracking-wider">
              {t('footer.col3Title')}
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><a href="#faq" className="text-muted text-decoration-none hover-white">{t('footer.col3L1')}</a></li>
              <li><a href="#faq" className="text-muted text-decoration-none hover-white">{t('footer.col3L2')}</a></li>
              <li><a href="#faq" className="text-muted text-decoration-none hover-white">{t('footer.col3L3')}</a></li>
            </ul>
          </div>

          <div className="col-6 col-sm-3 col-lg-2">
            <h6 className="fw-bold mb-3 text-white text-sm text-uppercase tracking-wider">
              {t('footer.col4Title')}
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-sm">
              <li><a href="#legal" className="text-muted text-decoration-none hover-white">{t('footer.col4L1')}</a></li>
              <li><a href="#legal" className="text-muted text-decoration-none hover-white">{t('footer.col4L2')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row justify-content-between align-items-center text-xs text-muted">
          <span>{t('footer.copyright')}</span>
          <span className="mt-2 mt-sm-0">Crafted for SkillHub Indonesia Community</span>
        </div>
      </div>
    </footer>
  );
};

export default FreelancerFooter;
