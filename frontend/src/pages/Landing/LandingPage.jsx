import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiCode, FiSmartphone, FiLayout, FiPenTool, FiVideo,
  FiCamera, FiTrendingUp, FiMic, FiGlobe, FiFileText, FiCpu,
  FiCheckCircle, FiShield, FiClock, FiStar, FiArrowRight, FiUsers, FiAward
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import ServiceCard from '../../components/common/ServiceCard';
import FreelancerCard from '../../components/common/FreelancerCard';
import UpworkTalentCategoryShowcase from '../../components/common/UpworkTalentCategoryShowcase';
import SEO from '../../components/common/SEO';
import { getCategoriesApi, getPopularServicesApi, getTopFreelancersApi } from '../../services/landingService';

const LandingPage = () => {

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategoriesApi();
        const servRes = await getPopularServicesApi();
        const freeRes = await getTopFreelancersApi();

        if (catRes.data) setCategories(catRes.data);
        if (servRes.data) setServices(servRes.data);
        if (freeRes.data) setFreelancers(freeRes.data);
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categoryIconMap = {
    'Website Development': <FiCode size={26} />,
    'Mobile Development': <FiSmartphone size={26} />,
    'UI UX Design': <FiLayout size={26} />,
    'Graphic Design': <FiPenTool size={26} />,
    'Video Editing': <FiVideo size={26} />,
    'Photography': <FiCamera size={26} />,
    'Digital Marketing': <FiTrendingUp size={26} />,
    'Voice Over': <FiMic size={26} />,
    'Translation': <FiGlobe size={26} />,
    'Writing & Copywriting': <FiFileText size={26} />,
    'AI Services': <FiCpu size={26} />,
  };

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="landing-page">
        <SEO
          title="SkillHub – Marketplace Jasa Digital & Freelancer Terpercaya"
          description="Temukan freelancer profesional Indonesia untuk web, desain, video, mobile app, AI services, dll. Garansi escrow aman."
          keywords="freelancer indonesia, jasa digital, web development, desain UI/UX, video editing, AI services, marketplace"
        />
      {/* 1. HERO SECTION */}
      <section className="position-relative py-5 overflow-hidden">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="d-inline-flex align-items-center gap-2 badge-pill-primary mb-3">
                  <FiShield size={16} /> Marketplace Jasa Digital #1 Indonesia
                </div>
                <h1 className="fw-extrabold display-4 mb-4 lh-tight">
                  Temukan <span className="hero-gradient-text">Freelancer Terbaik</span> di Indonesia
                </h1>
                <p className="lead text-muted mb-4 pe-lg-4 fs-5">
                  Cari programmer, designer, editor, photographer, translator, digital marketer, dan freelancer profesional terverifikasi untuk proyek bisnis Anda.
                </p>

                {/* Big Search Bar */}
                <form onSubmit={handleHeroSearch} className="hero-search-box d-flex align-items-center mb-4">
                  <FiSearch size={22} className="text-primary me-2 flex-shrink-0" />
                  <input
                    type="text"
                    className="hero-search-input"
                    placeholder="Coba ketik: 'Web Laravel', 'Desain Figma', 'Edit Video'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary-sh text-nowrap px-4 py-3">
                    Cari Jasa
                  </button>
                </form>

                {/* Popular Search Tags */}
                <div className="d-flex align-items-center gap-2 flex-wrap text-muted small">
                  <span className="fw-semibold">Populer:</span>
                  {['React & Laravel', 'Figma UI/UX', 'Flutter Mobile', 'Tiktok Video Edit', 'SEO Content', 'AI Integration'].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(`/explore?search=${encodeURIComponent(tag)}`)}
                      className="btn btn-sm btn-outline-sh py-1 px-3 text-xs rounded-pill"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hero Visual Card / Showcase */}
            <div className="col-lg-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="position-relative"
              >
                <div className="sh-card p-4 bg-white dark:bg-dark shadow-lg border-0 position-relative z-1">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FiCheckCircle size={22} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Garansi Escrow SkillHub</h6>
                        <span className="text-muted text-xs">Dana aman sampai proyek disetujui</span>
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                    alt="Freelancer Collaboration"
                    className="img-fluid rounded-4 mb-3"
                    style={{ height: '220px', width: '100%', objectFit: 'cover' }}
                  />
                  <div className="d-flex align-items-center justify-content-between bg-light dark:bg-dark p-3 rounded-3">
                    <div className="d-flex align-items-center gap-3">
                      <FiUsers className="text-primary" size={24} />
                      <div>
                        <div className="fw-bold text-dark mb-0">15,000+</div>
                        <div className="text-muted text-xs">Freelancer Aktif</div>
                      </div>
                    </div>
                    <div className="vr"></div>
                    <div className="d-flex align-items-center gap-3">
                      <FiAward className="text-success" size={24} />
                      <div>
                        <div className="fw-bold text-dark mb-0">99.4%</div>
                        <div className="text-muted text-xs">Kepuasan Klien</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPWORK STYLE BROWSE TALENT BY CATEGORY SECTION */}
      <UpworkTalentCategoryShowcase />


      {/* 3. POPULAR SERVICES SECTION */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="badge badge-pill-primary mb-2">Service Terlaris</span>
            <h2 className="fw-bold">Layanan Digital Paling Dicari</h2>
            <p className="text-muted">Hasil karya terbaik dari freelancer profesional yang siap membantu bisnis Anda.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            {['All', 'Website Development', 'UI UX Design', 'Mobile Development', 'Video Editing', 'Graphic Design', 'AI Services'].map((catName) => (
              <button
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold transition ${
                  activeCategory === catName
                    ? 'btn-primary-sh'
                    : 'btn-outline-sh'
                }`}
              >
                {catName === 'All' ? 'Semua Layanan' : catName}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="row g-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="col-lg-4 col-md-6">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP FREELANCERS SECTION */}
      <section className="py-5 bg-white dark:bg-dark border-top">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="badge badge-pill-secondary mb-2">Talenta Terbaik</span>
              <h2 className="fw-bold mb-0">Freelancer Rekomendasi Minggu Ini</h2>
            </div>
            <Link to="/explore?type=freelancers" className="btn btn-outline-sh mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
              Lihat Semua Talenta <FiArrowRight />
            </Link>
          </div>

          <div className="row g-4">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className="col-lg-3 col-md-6">
                <FreelancerCard freelancer={freelancer} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CARA KERJA SECTION */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-pill-primary mb-2">Mudah & Aman</span>
            <h2 className="fw-bold">Cara Kerja di SkillHub</h2>
            <p className="text-muted">Proses transaksi jasa digital yang transparan dan terlindungi 100%.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="sh-card p-4 text-center h-100 position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4 shadow" style={{ width: '56px', height: '56px' }}>
                  1
                </div>
                <h5 className="fw-bold mb-2">Cari & Pilih Jasa</h5>
                <p className="text-muted small mb-0">
                  Temukan jasa digital yang Anda butuhkan, bandingkan portofolio, ulasan klien, dan harga secara transparan.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="sh-card p-4 text-center h-100 position-relative">
                <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4 shadow" style={{ width: '56px', height: '56px' }}>
                  2
                </div>
                <h5 className="fw-bold mb-2">Pembayaran Escrow Midtrans</h5>
                <p className="text-muted small mb-0">
                  Lakukan pembayaran melalui Midtrans. Dana ditahan dengan aman oleh sistem SkillHub sampai pekerjaan selesai.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="sh-card p-4 text-center h-100 position-relative">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-4 shadow" style={{ width: '56px', height: '56px' }}>
                  3
                </div>
                <h5 className="fw-bold mb-2">Terima Hasil & Approve</h5>
                <p className="text-muted small mb-0">
                  Freelancer mengirimkan hasil kerja. Setelah Anda merasa puas & menyetujui hasil, dana diteruskan ke saldo freelancer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-5 bg-white dark:bg-dark border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-pill-primary mb-2">Testimoni Klien</span>
            <h2 className="fw-bold">Apa Kata Pemilik Bisnis & UMKM?</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="sh-card p-4 h-100 d-flex flex-column">
                <div className="d-flex text-warning gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <FiStar key={i} style={{ fill: '#F59E0B' }} />)}
                </div>
                <p className="text-muted small flex-grow-1 mb-4 italic">
                  "SkillHub sangat membantu bisnis kuliner saya mendapatkan logo dan desain kemasan baru hanya dalam waktu 3 hari. Prosesnya aman dan komunikasinya sangat lancar lewat chat!"
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Client"
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Dewi Kusuma</h6>
                    <span className="text-muted text-xs">Founder Kopi Kenangan Manis</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sh-card p-4 h-100 d-flex flex-column">
                <div className="d-flex text-warning gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <FiStar key={i} style={{ fill: '#F59E0B' }} />)}
                </div>
                <p className="text-muted small flex-grow-1 mb-4 italic">
                  "Mencari fullstack developer React & Laravel lokal yang handal biasanya susah. Di SkillHub langsung ketemu Budi dan aplikasi CRM kami selesai tepat waktu!"
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
                    alt="Client"
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Hendra Tanuwijaya</h6>
                    <span className="text-muted text-xs">CEO Digital Agency Jakarta</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="sh-card p-4 h-100 d-flex flex-column">
                <div className="d-flex text-warning gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <FiStar key={i} style={{ fill: '#F59E0B' }} />)}
                </div>
                <p className="text-muted small flex-grow-1 mb-4 italic">
                  "Sebagai freelancer UI UX di Bandung, SkillHub memberikan aliran proyek yang konsisten dengan sistem penarikan saldo otomatis yang cepat ke rekening bank lokal."
                </p>
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Freelancer"
                    className="rounded-circle"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Siti Rahma</h6>
                    <span className="text-muted text-xs">Freelance UI/UX Designer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="sh-card p-5 text-white bg-primary position-relative overflow-hidden shadow-lg border-0">
            <div className="row align-items-center position-relative z-1">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h2 className="display-6 fw-bold mb-3">Siap Mengembangkan Proyek Digital Anda?</h2>
                <p className="lead mb-0 text-white-50">
                  Daftar sekarang secara gratis dan temukan ribuan talenta digital berpengalaman di Indonesia.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-lg-end">
                  <Link to="/register-customer" className="btn btn-light btn-lg fw-bold rounded-pill px-4 text-primary shadow">
                    Mulai Sebagai Klien
                  </Link>
                  <Link to="/register-freelancer" className="btn btn-outline-light btn-lg fw-bold rounded-pill px-4">
                    Jadi Freelancer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
