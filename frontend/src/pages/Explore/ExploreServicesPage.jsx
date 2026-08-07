import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiUserCheck, FiBriefcase, FiRefreshCw } from 'react-icons/fi';
import ServiceCard from '../../components/common/ServiceCard';
import FreelancerCard from '../../components/common/FreelancerCard';
import PortfolioCard from '../../components/common/PortfolioCard';
import { getPopularServicesApi, getCategoriesApi, getTopFreelancersApi, getCategoryDetailApi } from '../../services/landingService';

const ExploreServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('cat') || 'All';
  const initialType = searchParams.get('type') || 'services'; // 'services' | 'freelancers' | 'portfolios'

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [activeTab, setActiveTab] = useState(initialType); // services, freelancers, portfolios

  const [services, setServices] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [servRes, catRes, freeRes] = await Promise.all([
          getPopularServicesApi(),
          getCategoriesApi(),
          getTopFreelancersApi()
        ]);

        if (servRes.data) setServices(servRes.data);
        if (catRes.data) setCategories(catRes.data);
        
        let fetchedFreelancers = freeRes.data || [];
        if (servRes.data) {
          // Extract portfolios from freelancers if available
          const extractedPortfolios = [];
          fetchedFreelancers.forEach(f => {
            if (f.portfolios && Array.isArray(f.portfolios)) {
              f.portfolios.forEach(p => {
                extractedPortfolios.push({
                  ...p,
                  freelancer: f
                });
              });
            }
          });
          setPortfolios(extractedPortfolios);
        }
        setFreelancers(fetchedFreelancers);

        // If a specific category slug is present in URL, try fetching its detailed content
        if (initialCat !== 'All') {
          const catDetail = await getCategoryDetailApi(initialCat);
          if (catDetail.data) {
            if (catDetail.data.services?.length > 0) {
              setServices(catDetail.data.services.map(s => ({
                id: s.id,
                title: s.title,
                slug: s.slug,
                price: parseFloat(s.price),
                delivery_time_days: s.delivery_time_days,
                rating_avg: s.rating_avg || 4.9,
                reviews_count: s.reviews_count || 12,
                image: s.images && s.images[0] ? s.images[0].image_path : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                category: s.category?.name || s.category,
                freelancer: {
                  name: s.freelancer?.name || 'Freelancer',
                  title: s.freelancer?.profile?.title || 'Professional',
                  avatar: s.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  rating: s.freelancer?.profile?.rating_avg || 4.9,
                  location: s.freelancer?.profile?.location || 'Indonesia'
                }
              })));
            }

            if (catDetail.data.freelancers?.length > 0) {
              setFreelancers(catDetail.data.freelancers.map(f => ({
                id: f.id,
                name: f.name,
                title: f.profile?.title || 'Freelancer Professional',
                avatar: f.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                rating: f.profile?.rating_avg || 5.0,
                reviews_count: f.profile?.reviews_count || 12,
                location: f.profile?.location || 'Indonesia',
                hourly_rate: f.profile?.hourly_rate || 150000,
                skills: Array.isArray(f.profile?.skills) ? f.profile.skills : ['Laravel', 'React', 'Design']
              })));
            }

            if (catDetail.data.portfolios?.length > 0) {
              setPortfolios(catDetail.data.portfolios);
            }
          }
        }
      } catch (err) {
        console.error('Error loading explore data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [initialCat]);

  const handleCategoryClick = (catSlug) => {
    setSelectedCat(catSlug);
    setSearchParams({ search: searchQuery, cat: catSlug, type: activeTab });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchParams({ search: searchQuery, cat: selectedCat, type: tab });
  };

  // Category matching helper (slug, name, or id)
  const isCategoryMatch = (itemCategory, categorySlug) => {
    if (categorySlug === 'All') return true;
    if (!itemCategory) return true;
    
    const catObj = categories.find(c => c.slug === categorySlug);
    const catName = catObj ? catObj.name.toLowerCase() : categorySlug.toLowerCase().replace(/-/g, ' ');
    const normItemCat = typeof itemCategory === 'string' ? itemCategory.toLowerCase() : (itemCategory.name || '').toLowerCase();
    
    return normItemCat.includes(catName) || normItemCat.includes(categorySlug.toLowerCase());
  };

  // Filter Services
  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (typeof s.category === 'string' ? s.category : s.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = isCategoryMatch(s.category, selectedCat);
    return matchesSearch && matchesCat;
  });

  // Filter Freelancers
  const filteredFreelancers = freelancers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.skills && f.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCat = isCategoryMatch(f.title, selectedCat) || isCategoryMatch(f.skills?.join(' '), selectedCat);
    return matchesSearch && matchesCat;
  });

  // Filter Portfolios
  const filteredPortfolios = portfolios.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const freelancerTitle = p.freelancer?.profile?.title || p.freelancer?.title || '';
    const matchesCat = isCategoryMatch(freelancerTitle, selectedCat) || isCategoryMatch(p.title, selectedCat);
    return matchesSearch && matchesCat;
  });

  const getActiveCategoryName = () => {
    if (selectedCat === 'All') return 'Semua Kategori';
    const found = categories.find(c => c.slug === selectedCat);
    return found ? found.name : selectedCat.replace(/-/g, ' ');
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header & Search */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 pt-2">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Eksplorasi Jasa & Talent</h3>
            <p className="text-muted mb-0">
              Menampilkan hasil untuk: <span className="fw-bold text-primary">{getActiveCategoryName()}</span>
            </p>
          </div>
          
          <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <FiSearch className="position-absolute text-muted" size={18} style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control border shadow-sm rounded-pill w-100"
              style={{ paddingLeft: '44px', paddingRight: '16px', height: '46px', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              placeholder="Cari jasa, talent, atau portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`btn btn-sm rounded-pill px-4 py-2 text-nowrap fw-semibold ${selectedCat === 'All' ? 'btn-primary-sh' : 'btn-outline-sh'}`}
          >
            Semua Job Kategori
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.slug)}
              className={`btn btn-sm rounded-pill px-4 py-2 text-nowrap fw-semibold ${selectedCat === c.slug ? 'btn-primary-sh' : 'btn-outline-sh'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Content View Tabs (Services vs Freelancers vs Portfolios) */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom flex-wrap gap-3">
          <div className="nav nav-pills gap-2">
            <button
              onClick={() => handleTabClick('services')}
              className={`nav-link rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${activeTab === 'services' ? 'active bg-primary text-white' : 'btn-outline-sh'}`}
            >
              <FiGrid size={16} /> Jasa Digital ({filteredServices.length})
            </button>
            <button
              onClick={() => handleTabClick('freelancers')}
              className={`nav-link rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${activeTab === 'freelancers' ? 'active bg-primary text-white' : 'btn-outline-sh'}`}
            >
              <FiUserCheck size={16} /> Profil Freelancer ({filteredFreelancers.length})
            </button>
            <button
              onClick={() => handleTabClick('portfolios')}
              className={`nav-link rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${activeTab === 'portfolios' ? 'active bg-primary text-white' : 'btn-outline-sh'}`}
            >
              <FiBriefcase size={16} /> Portofolio & Karya ({filteredPortfolios.length})
            </button>
          </div>

          {(searchQuery || selectedCat !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); handleCategoryClick('All'); }}
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            >
              <FiRefreshCw size={14} /> Reset Filter
            </button>
          )}
        </div>

        {/* Tab 1: Services Grid */}
        {activeTab === 'services' && (
          filteredServices.length > 0 ? (
            <div className="row g-4">
              {filteredServices.map(service => (
                <div key={service.id} className="col-lg-4 col-md-6">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Tidak Ada Layanan Jasa" message="Belum ada layanan digital yang sesuai dengan kategori ini." />
          )
        )}

        {/* Tab 2: Freelancers Grid */}
        {activeTab === 'freelancers' && (
          filteredFreelancers.length > 0 ? (
            <div className="row g-4">
              {filteredFreelancers.map(freelancer => (
                <div key={freelancer.id} className="col-lg-3 col-md-6">
                  <FreelancerCard freelancer={freelancer} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Tidak Ada Profil Freelancer" message="Belum ada freelancer yang terdaftar untuk kategori ini." />
          )
        )}

        {/* Tab 3: Portfolios Grid */}
        {activeTab === 'portfolios' && (
          filteredPortfolios.length > 0 ? (
            <div className="row g-4">
              {filteredPortfolios.map(portfolio => (
                <div key={portfolio.id || portfolio.title} className="col-lg-4 col-md-6">
                  <PortfolioCard portfolio={portfolio} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Tidak Ada Hasil Karya Portofolio" message="Belum ada portofolio yang diunggah untuk kategori ini." />
          )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ title, message }) => (
  <div className="sh-card p-5 text-center my-4">
    <h5 className="fw-bold mb-2">{title}</h5>
    <p className="text-muted small mb-0">{message}</p>
  </div>
);

export default ExploreServicesPage;
