import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import freelancerId from '../locales/id/freelancer.json';
import freelancerEn from '../locales/en/freelancer.json';

const resources = {
  id: {
    freelancer: freelancerId,
  },
  en: {
    freelancer: freelancerEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'id',
  fallbackLng: 'id',
  defaultNS: 'freelancer',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
