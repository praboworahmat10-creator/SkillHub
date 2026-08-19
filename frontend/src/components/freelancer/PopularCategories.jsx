import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { popularCategories } from '../../data/freelancerMock';
import { motion } from 'framer-motion';

const PopularCategories = () => {
  const { t } = useTranslation('freelancer');

  return (
    <section id="categories" className="py-5 py-lg-6 bg-white dark:bg-dark">
      <div className="container">
        <motion.div 
          className="text-center mx-auto mb-5" style={{ maxWidth: '680px' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="fw-extrabold fs-2 mb-2" style={{ color: 'var(--text-main)' }}>
            {t('categories.title')}
          </h2>
          <p className="text-muted fs-6 mb-0">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        <div className="row g-3 g-md-4">
          {popularCategories.map((cat, idx) => (
            <motion.div 
              key={cat.id} 
              className="col-12 col-sm-6 col-md-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="d-block position-relative rounded-4 overflow-hidden text-decoration-none shadow-xs transition-all hover-lift"
                style={{ height: '140px' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-100 h-100 object-fit-cover transition-transform"
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-3"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.85) 100%)' }}
                >
                  <h5 className="fw-bold text-white mb-0 text-truncate">{cat.name}</h5>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
