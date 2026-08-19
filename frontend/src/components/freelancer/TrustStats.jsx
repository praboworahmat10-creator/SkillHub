import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiBriefcase, FiCheckSquare, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TrustStats = () => {
  const { t } = useTranslation('freelancer');

  const stats = [
    {
      value: t('stats.freelancers'),
      label: t('stats.freelancersLabel'),
      icon: <FiUsers size={24} className="text-primary" />,
    },
    {
      value: t('stats.services'),
      label: t('stats.servicesLabel'),
      icon: <FiBriefcase size={24} className="text-success" />,
    },
    {
      value: t('stats.projects'),
      label: t('stats.projectsLabel'),
      icon: <FiCheckSquare size={24} style={{ color: 'var(--accent-emerald)' }} />,
    },
    {
      value: t('stats.rating'),
      label: t('stats.ratingLabel'),
      icon: <FiStar size={24} className="text-warning" fill="#F59E0B" />,
    },
  ];

  return (
    <section className="py-4 border-y bg-white dark:bg-dark">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <p className="text-xs text-uppercase tracking-wider fw-bold text-muted mb-0">
            {t('stats.title')}
          </p>
        </div>
        <div className="row g-4 justify-content-center text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              className="col-6 col-md-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="p-3 rounded-3 transition-all hover-lift">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  {stat.icon}
                </div>
                <div
                  className="display-6 fw-extrabold mb-1"
                  style={{ color: 'var(--text-main)' }}
                >
                  {stat.value}
                </div>
                <div className="text-muted text-sm fw-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TrustStats;
