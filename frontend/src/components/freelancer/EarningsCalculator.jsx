import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatRupiah } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiClock } from 'react-icons/fi';

const EarningsCalculator = () => {
  const { t } = useTranslation('freelancer');
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  
  // Rate assumption: Rp 150.000 / hour
  const hourlyRate = 150000;
  // 4 weeks per month assumption
  const estimatedMonthly = hoursPerWeek * hourlyRate * 4;

  return (
    <section className="py-5 py-lg-6 bg-light dark:bg-dark-soft">
      <div className="container">
        <motion.div 
          className="row justify-content-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white dark:bg-dark">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3">
                    <FiTrendingUp size={32} />
                  </div>
                  <h2 className="fw-bold mb-2">{t('calculator.title')}</h2>
                  <p className="text-muted mb-0">{t('calculator.subtitle')}</p>
                </div>

                <div className="row align-items-center mt-5">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="d-flex justify-content-between mb-2">
                      <label htmlFor="hoursRange" className="fw-semibold d-flex align-items-center gap-2">
                        <FiClock className="text-muted" />
                        {t('calculator.hoursLabel')}
                      </label>
                      <span className="fw-bold text-primary fs-5">
                        {t('calculator.hoursValue', { count: hoursPerWeek })}
                      </span>
                    </div>
                    
                    <input 
                      type="range" 
                      className="form-range" 
                      id="hoursRange" 
                      min="5" 
                      max="60" 
                      step="5"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    />
                    
                    <div className="d-flex justify-content-between text-muted small mt-2">
                      <span>5 jam</span>
                      <span>60 jam</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-primary bg-opacity-10 rounded-4 p-4 text-center h-100 d-flex flex-column justify-content-center">
                      <p className="text-muted fw-semibold mb-1">{t('calculator.estimatedMonthly')}</p>
                      <h3 className="display-5 fw-bold text-primary mb-2">
                        {formatRupiah(estimatedMonthly)}
                      </h3>
                      <p className="small text-muted mb-0 fst-italic">
                        {t('calculator.rateNote')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <Link to="/freelancer/register" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold">
                    {t('calculator.cta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EarningsCalculator;
