import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiShield, FiFileText, FiHeadphones } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WhySkillHub = () => {
  const { t } = useTranslation('freelancer');

  const benefits = [
    {
      icon: <FiSearch size={28} className="text-primary" />,
      titleKey: 'item1Title',
      descKey: 'item1Desc',
    },
    {
      icon: <FiShield size={28} className="text-primary" />,
      titleKey: 'item2Title',
      descKey: 'item2Desc',
    },
    {
      icon: <FiFileText size={28} className="text-primary" />,
      titleKey: 'item3Title',
      descKey: 'item3Desc',
    },
    {
      icon: <FiHeadphones size={28} className="text-primary" />,
      titleKey: 'item4Title',
      descKey: 'item4Desc',
    },
  ];

  return (
    <section id="benefits" className="py-5 py-lg-6 bg-white dark:bg-dark">
      <div className="container">
        <motion.div 
          className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fw-extrabold fs-2 mb-2" style={{ color: 'var(--text-main)' }}>
            {t('why.title')}
          </h2>
        </motion.div>

        <div className="row g-4 justify-content-center">
          {benefits.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="col-12 col-md-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="d-flex gap-3.5 p-4 rounded-4 bg-light dark:bg-dark-subtle border border-subtle h-100 transition-all hover-lift">
                <div className="flex-shrink-0 mt-1">
                  {item.icon}
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                    {t(`why.${item.titleKey}`)}
                  </h5>
                  <p className="text-muted text-sm mb-0 leading-relaxed">
                    {t(`why.${item.descKey}`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySkillHub;
