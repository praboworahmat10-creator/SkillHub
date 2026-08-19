import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { faqList } from '../../data/freelancerMock';

const FAQSection = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section id="faq" className="py-5 py-lg-6">
      <div className="container">
        <motion.div
          className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="fl-badge mb-2">FAQ & Bantuan</span>
          <h2 className="fw-extrabold fs-2 mb-3" style={{ color: 'var(--text-main)' }}>
            {t('faq.title')}
          </h2>
          <p className="text-muted fs-6">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="mx-auto" style={{ maxWidth: '780px' }}>
          {faqList.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <details className="fl-faq-item" open={idx === 0}>
                <summary className="fl-faq-summary">
                  <span>{t(`faq.${item.qKey}`)}</span>
                  <FiChevronDown size={18} className="text-muted transition-transform" />
                </summary>
                <div className="fl-faq-content">
                  {t(`faq.${item.aKey}`)}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
