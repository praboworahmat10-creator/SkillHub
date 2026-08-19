import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiDollarSign, FiBriefcase, FiStar, FiGrid, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const DashboardPreview = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section className="py-5 py-lg-6">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column Text */}
          <div className="col-lg-5">
            <span className="fl-badge mb-2">Preview Dashboard</span>
            <h2 className="fw-extrabold fs-2 mb-3" style={{ color: 'var(--text-main)' }}>
              {t('preview.title')}
            </h2>
            <p className="text-muted fs-6 mb-4">
              {t('preview.subtitle')}
            </p>

            <ul className="list-unstyled d-flex flex-column gap-2.5 mb-4 text-sm text-muted">
              <li className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={18} />
                <span>Pantau saldo pendapatan secara transparan & real-time</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={18} />
                <span>Kelola deadline dan revisi pesanan client dengan mudah</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={18} />
                <span>Statistik performa layanan dan ulasan rating client</span>
              </li>
            </ul>

            <Link
              to="/freelancer/register"
              className="btn btn-primary rounded-3 px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              {t('preview.cta')}
              <FiArrowRight size={18} />
            </Link>
          </div>

          {/* Right Column Dashboard Mockup Container */}
          <div className="col-lg-7">
            <div className="fl-hero-card p-4 p-md-5 bg-white dark:bg-dark border rounded-4 shadow-md">
              <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
                <div>
                  <h6 className="fw-bold mb-0 text-muted text-xs text-uppercase tracking-wider">Freelancer Dashboard</h6>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Ringkasan Operasional</h5>
                </div>
                <span className="badge bg-primary-light text-primary rounded-pill px-3 py-1 text-xs fw-semibold">
                  Preview State
                </span>
              </div>

              {/* 4 Stat Cards Grid */}
              <div className="row g-3">
                <div className="col-6 col-sm-3">
                  <div className="p-3 rounded-3 bg-light dark:bg-dark-subtle border text-center">
                    <div className="fl-icon-box bg-primary-light text-primary mx-auto mb-2" style={{ width: '42px', height: '42px' }}>
                      <FiDollarSign size={20} />
                    </div>
                    <span className="text-muted text-xs d-block mb-1">{t('preview.earnings')}</span>
                    <span className="fw-bold text-sm text-primary">{t('preview.earningsVal')}</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 rounded-3 bg-light dark:bg-dark-subtle border text-center">
                    <div className="fl-icon-box bg-success bg-opacity-10 text-success mx-auto mb-2" style={{ width: '42px', height: '42px' }}>
                      <FiBriefcase size={20} />
                    </div>
                    <span className="text-muted text-xs d-block mb-1">{t('preview.activeOrders')}</span>
                    <span className="fw-bold text-sm text-success">{t('preview.activeOrdersVal')}</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 rounded-3 bg-light dark:bg-dark-subtle border text-center">
                    <div className="fl-icon-box bg-warning bg-opacity-10 text-warning mx-auto mb-2" style={{ width: '42px', height: '42px' }}>
                      <FiStar size={20} fill="#F59E0B" />
                    </div>
                    <span className="text-muted text-xs d-block mb-1">{t('preview.rating')}</span>
                    <span className="fw-bold text-sm text-warning">{t('preview.ratingVal')}</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 rounded-3 bg-light dark:bg-dark-subtle border text-center">
                    <div className="fl-icon-box bg-info bg-opacity-10 text-info mx-auto mb-2" style={{ width: '42px', height: '42px' }}>
                      <FiGrid size={20} />
                    </div>
                    <span className="text-muted text-xs d-block mb-1">{t('preview.myServices')}</span>
                    <span className="fw-bold text-sm text-info">{t('preview.myServicesVal')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
