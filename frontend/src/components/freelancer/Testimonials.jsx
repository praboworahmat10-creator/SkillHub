import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { testimonialsList } from '../../data/freelancerMock';

const Testimonials = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section className="py-5 py-lg-6 bg-light dark:bg-dark-subtle border-y">
      <div className="container">
        <motion.div
          className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="fl-badge mb-2">Testimoni Freelancer</span>
          <h2 className="fw-extrabold fs-2 mb-3" style={{ color: 'var(--text-main)' }}>
            {t('testimonials.title')}
          </h2>
          <p className="text-muted fs-6">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="row g-4">
          {testimonialsList.map((item, idx) => (
            <motion.div
              key={item.id}
              className="col-12 col-md-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <div className="card h-100 p-4 border rounded-4 bg-white dark:bg-dark shadow-xs d-flex flex-column transition-all hover-lift">
                {/* Rating Stars */}
                <div className="d-flex text-warning mb-3">
                  {[...Array(item.stars)].map((_, i) => (
                    <FiStar key={i} size={16} fill="#F59E0B" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-muted text-sm flex-grow-1 leading-relaxed mb-4">
                  "{t(`testimonials.${item.textKey}`)}"
                </p>

                {/* Author Info */}
                <div className="d-flex align-items-center gap-3 pt-3 border-top mt-auto">
                  <img
                    src={item.avatar}
                    alt={t(`testimonials.${item.nameKey}`)}
                    className="rounded-circle object-fit-cover"
                    style={{ width: '44px', height: '44px' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>
                      {t(`testimonials.${item.nameKey}`)}
                    </h6>
                    <small className="text-muted text-xs">
                      {t(`testimonials.${item.roleKey}`)}
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

