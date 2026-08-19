import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FreelancerHero = ({ onOpenAuthModal }) => {
  const { t } = useTranslation('freelancer');

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="position-relative py-6 py-lg-7 text-center overflow-hidden">
      {/* Background Banner with Soft Gradient & Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.88) 100%), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      <div className="container position-relative text-white py-4" style={{ zIndex: 1 }}>
        <motion.div
          className="mx-auto" style={{ maxWidth: '760px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h1
            className="display-4 fw-extrabold mb-3 text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('hero.headline')}
          </motion.h1>

          <motion.p
            className="lead text-white-50 fs-5 mb-4 leading-relaxed mx-auto" style={{ maxWidth: '640px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('hero.subheadline')}
          </motion.p>

          <motion.div
            className="d-flex flex-column flex-sm-row justify-content-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <button
              type="button"
              onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : null}
              className="btn btn-primary btn-lg rounded-3 px-5 py-3 fw-bold d-inline-flex align-items-center justify-content-center gap-2 shadow-lg transition border-0"
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              {t('hero.primaryCta')}
              <FiArrowRight size={18} />
            </button>

            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="btn btn-outline-light btn-lg rounded-3 px-4 py-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2 transition"
            >
              {t('hero.secondaryCta')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreelancerHero;

