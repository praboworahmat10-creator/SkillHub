import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';
import { serviceCards } from '../../data/freelancerMock';

const ServiceShowcase = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section id="pricing" className="py-5 py-lg-6">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}>
          <span className="fl-badge mb-2">Konsep Marketplace Jasa</span>
          <h2 className="fw-extrabold fs-2 mb-3" style={{ color: 'var(--text-main)' }}>
            {t('services.title')}
          </h2>
          <p className="text-muted fs-6">
            {t('services.description')}
          </p>
        </div>

        <div className="row g-4 justify-content-center mb-5">
          {serviceCards.map((card) => (
            <div key={card.id} className="col-12 col-md-6 col-lg-5">
              <div className="card h-100 border rounded-4 bg-white dark:bg-dark shadow-sm overflow-hidden transition-all hover-lift">
                {/* Service Image Header */}
                <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src={card.image}
                    alt={t(`services.${card.titleKey}`)}
                    className="w-100 h-100 object-fit-cover transition-transform"
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-1.5 text-xs fw-semibold backdrop-blur">
                    {card.badge}
                  </span>
                </div>

                {/* Service Body */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={card.avatar}
                      alt={card.freelancerName}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <span className="text-muted text-xs fw-semibold">{card.freelancerName}</span>
                    <span className="text-muted text-xs ms-auto px-2 py-0.5 rounded bg-light dark:bg-dark-subtle fw-medium">
                      {t(`services.${card.catKey}`)}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
                    {t(`services.${card.titleKey}`)}
                  </h5>

                  {/* Rating & Orders */}
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <div>
                      <span className="text-muted text-xs d-block">{t('services.startingFrom')}</span>
                      <span className="fw-extrabold fs-5 text-primary">
                        {t(`services.${card.priceKey}`)}
                      </span>
                    </div>

                    <div className="text-end">
                      <div className="d-flex align-items-center justify-content-end gap-1 text-warning fw-bold text-sm">
                        <FiStar size={15} fill="#F59E0B" />
                        <span>{t(`services.${card.ratingKey}`)}</span>
                      </div>
                      <span className="text-muted text-xs">
                        {t(`services.${card.ordersKey}`)} {t('services.orders')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner inside Service Showcase */}
        <div className="text-center">
          <a
            href="/explore"
            className="btn btn-outline-primary rounded-3 px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
          >
            {t('services.cta')}
            <FiArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
