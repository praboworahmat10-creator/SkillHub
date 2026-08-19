import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiShield, FiFolder, FiZap, FiMessageSquare, FiClock, FiTrendingUp, FiStar } from 'react-icons/fi';

const FreelancerBenefits = () => {
  const { t } = useTranslation('freelancer');

  const benefits = [
    { text: t('benefits.b1'), icon: <FiShield className="text-primary" /> },
    { text: t('benefits.b2'), icon: <FiFolder className="text-primary" /> },
    { text: t('benefits.b3'), icon: <FiZap className="text-primary" /> },
    { text: t('benefits.b4'), icon: <FiMessageSquare className="text-primary" /> },
    { text: t('benefits.b5'), icon: <FiClock className="text-primary" /> },
    { text: t('benefits.b6'), icon: <FiTrendingUp className="text-primary" /> },
    { text: t('benefits.b7'), icon: <FiStar className="text-primary" /> },
  ];

  return (
    <section id="benefits" className="py-5 py-lg-6 bg-light dark:bg-dark-subtle border-y">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <span className="fl-badge mb-2">Benefit Eksklusif</span>
            <h2 className="fw-extrabold fs-2 mb-3" style={{ color: 'var(--text-main)' }}>
              {t('benefits.title')}
            </h2>
            <p className="text-muted fs-6 mb-4">
              {t('benefits.subtitle')}
            </p>
            <div className="p-4 rounded-4 bg-primary text-white shadow-sm">
              <h5 className="fw-bold mb-2">Siap Melangkah Lebih Jauh?</h5>
              <p className="text-white-50 text-sm mb-3">
                Bergabunglah dengan ribuan freelancer sukses yang mengelola karier mandiri di SkillHub.
              </p>
              <a href="/freelancer/register" className="btn btn-light fw-bold rounded-3 text-primary px-4 py-2">
                Daftar Gratis Now
              </a>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="row g-3">
              {benefits.map((item, idx) => (
                <div key={idx} className="col-12 col-sm-6">
                  <div className="p-3.5 rounded-3 bg-white dark:bg-dark border shadow-xs d-flex align-items-center gap-3 transition-all hover-lift">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary-light flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      {item.icon}
                    </div>
                    <span className="fw-semibold text-sm" style={{ color: 'var(--text-main)' }}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerBenefits;
