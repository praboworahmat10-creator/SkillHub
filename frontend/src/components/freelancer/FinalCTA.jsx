import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FinalCTA = ({ onOpenAuthModal }) => {
  const { t } = useTranslation('freelancer');

  return (
    <section className="py-5 py-lg-6 bg-primary text-white text-center">
      <div className="container">
        <motion.div
          className="mx-auto" style={{ maxWidth: '640px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-6 fw-extrabold mb-3 text-white">
            {t('final.title')}
          </h2>
          <p className="text-white-50 fs-5 mb-4 leading-relaxed">
            {t('final.description')}
          </p>
          <button
            type="button"
            onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
            className="btn btn-light btn-lg rounded-3 px-5 py-3 fw-bold text-primary shadow-sm d-inline-flex align-items-center gap-2 hover-lift transition border-0"
          >
            {t('final.button')}
            <FiArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;

