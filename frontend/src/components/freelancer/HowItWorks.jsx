import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { simpleSteps } from '../../data/freelancerMock';

const HowItWorks = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section id="how-it-works" className="py-5 py-lg-6 bg-light dark:bg-dark-subtle border-y">
      <div className="container">
        <motion.div
          className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fw-extrabold fs-2 mb-2" style={{ color: 'var(--text-main)' }}>
            {t('how.title')}
          </h2>
        </motion.div>

        <div className="mx-auto" style={{ maxWidth: '780px' }}>
          <div className="row g-4">
            {simpleSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="col-12 col-md-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
              >
                <div className="p-4 rounded-4 bg-white dark:bg-dark border shadow-xs h-100 transition-all hover-lift">
                  <h5 className="fw-bold mb-2 text-primary">
                    {t(`how.${step.titleKey}`)}
                  </h5>
                  <p className="text-muted text-sm mb-0 leading-relaxed">
                    {t(`how.${step.descKey}`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
