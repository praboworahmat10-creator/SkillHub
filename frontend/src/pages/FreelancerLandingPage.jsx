import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../i18n';
import SEO from '../components/common/SEO';
import FreelancerNavbar from '../components/freelancer/FreelancerNavbar';
import FreelancerHero from '../components/freelancer/FreelancerHero';
import TrustStats from '../components/freelancer/TrustStats';
import PopularCategories from '../components/freelancer/PopularCategories';
import WhySkillHub from '../components/freelancer/WhySkillHub';
import HowItWorks from '../components/freelancer/HowItWorks';
import EarningsCalculator from '../components/freelancer/EarningsCalculator';
import Testimonials from '../components/freelancer/Testimonials';
import FAQSection from '../components/freelancer/FAQSection';
import FinalCTA from '../components/freelancer/FinalCTA';
import FreelancerFooter from '../components/freelancer/FreelancerFooter';
import FreelancerAuthModal from '../components/freelancer/FreelancerAuthModal';

const FreelancerLandingPage = ({ initialModal }) => {
  const [searchParams] = useSearchParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  useEffect(() => {
    const action = searchParams.get('action');
    if (initialModal || action === 'login' || action === 'register') {
      setAuthModalMode(initialModal || action || 'login');
      setIsAuthModalOpen(true);
    }
  }, [initialModal, searchParams]);

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-body text-body">
      <SEO
        title="Ubah Keahlian Anda Menjadi Penghasilan - Freelancer SkillHub"
        description="Bangun layanan Anda, temukan client yang tepat, dan kembangkan karier freelance bersama SkillHub Indonesia."
        keywords="menjadi freelancer, jual jasa digital, komisi freelance, tempat cari client web developer, marketplace freelancer indonesia"
      />

      <FreelancerNavbar onOpenAuthModal={handleOpenAuthModal} />

      <main className="flex-grow-1">
        <FreelancerHero onOpenAuthModal={handleOpenAuthModal} />
        <TrustStats />
        <PopularCategories />
        <WhySkillHub />
        <HowItWorks />
        <EarningsCalculator />
        <Testimonials />
        <FAQSection />
        <FinalCTA onOpenAuthModal={handleOpenAuthModal} />
      </main>

      <FreelancerFooter />

      {/* Fastwork-style Auth Modal Popup */}
      <FreelancerAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default FreelancerLandingPage;
