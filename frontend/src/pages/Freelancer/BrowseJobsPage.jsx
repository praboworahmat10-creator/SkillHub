import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobsApi } from '../../services/freelancerJobService';
import { FiSearch, FiBriefcase, FiDollarSign, FiClock, FiMapPin, FiStar, FiCheckCircle, FiChevronRight, FiFilter } from 'react-icons/fi';

const BrowseJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [jobType, setJobType] = useState('');
  const [expLevel, setExpLevel] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobsApi({
        search,
        sort,
        job_type: jobType,
        experience_level: expLevel,
        min_budget: minBudget,
        max_budget: maxBudget,
        page,
      });
      setJobs(res.data.data || []);
      setPagination(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, sort, jobType, expLevel, minBudget, maxBudget, page]);

  return (
    <div className="container-fluid pb-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>🔎 Pasar Pekerjaan Client</h2>
        <p className="text-muted mb-0">Temukan proyek pekerjaan yang sesuai dengan keahlian dan minat Anda.</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Cari pekerjaan (contoh: React Developer, UI Designer)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-3">
            <select className="form-select bg-light" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Sort: Terbaru</option>
              <option value="budget_high">Budget: Tertinggi</option>
              <option value="budget_low">Budget: Terendah</option>
              <option value="deadline">Deadline: Terdekat</option>
            </select>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <button
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#filterCollapse"
            >
              <FiFilter /> Filter
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        <div className="collapse mt-3 pt-3 border-top" id="filterCollapse">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-muted">Tipe Pekerjaan</label>
              <select className="form-select form-select-sm" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="">Semua Tipe</option>
                <option value="fixed_price">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-muted">Tingkat Pengalaman</label>
              <select className="form-select form-select-sm" value={expLevel} onChange={(e) => setExpLevel(e.target.value)}>
                <option value="">Semua Tingkat</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-muted">Budget Min (Rp)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="500000"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-muted">Budget Max (Rp)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="5000000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="d-flex flex-column gap-3 mb-4">
          {jobs.map((job) => (
            <div key={job.id} className="card border-0 shadow-sm rounded-4 p-4 hover-lift transition" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-semibold" style={{ fontSize: '0.8rem' }}>
                      {job.job_type === 'fixed_price' ? 'Fixed Price' : 'Hourly Rate'}
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill fw-semibold" style={{ fontSize: '0.8rem' }}>
                      {job.match_score}% Skill Match
                    </span>
                    <span className="text-muted small ms-auto d-md-none">
                      {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <Link to={`/dashboard/freelancer/jobs/${job.id}`} className="text-decoration-none">
                    <h4 className="fw-bold mb-2 text-dark dark:text-light hover-primary" style={{ color: 'var(--text-main)' }}>
                      {job.title}
                    </h4>
                  </Link>

                  <p className="text-muted small mb-3 line-clamp-2" style={{ lineHeight: '1.6' }}>
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="d-flex flex-wrap gap-1.5 mb-3">
                    {job.required_skills?.map((sk, idx) => (
                      <span key={idx} className="badge bg-light text-secondary rounded-2 px-2.5 py-1 text-xs border">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Client Public info */}
                  <div className="d-flex align-items-center gap-2 pt-2 border-top small text-muted">
                    <div className="d-flex align-items-center gap-1.5 fw-semibold" style={{ color: 'var(--text-main)' }}>
                      <FiBriefcase size={14} className="text-primary" /> {job.client?.name}
                    </div>
                    {job.client?.is_verified && (
                      <span className="text-success d-flex align-items-center gap-1">
                        <FiCheckCircle size={14} /> Terverifikasi
                      </span>
                    )}
                    <span>&bull; ⭐ {job.client?.rating} ({job.client?.completed_projects} proyek)</span>
                    <span className="ms-auto d-none d-md-inline text-muted">
                      Diposting {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-md-end justify-content-between h-100 gap-3 border-start-md ps-md-4 min-w-180">
                  <div className="text-md-end">
                    <p className="text-muted small mb-1">Estimasi Budget</p>
                    <h4 className="fw-extrabold text-primary mb-0">
                      Rp {(job.budget_min || 0).toLocaleString('id-ID')}
                    </h4>
                    <p className="text-muted text-xs mb-0">Deadline: {job.deadline_days} Hari</p>
                  </div>

                  <Link
                    to={`/dashboard/freelancer/jobs/${job.id}`}
                    className="btn btn-primary rounded-3 px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-1 shadow-xs w-100"
                  >
                    Lihat Detail <FiChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted" style={{ backgroundColor: 'var(--card-bg)' }}>
          <FiBriefcase size={48} className="mb-3 opacity-50 mx-auto" />
          <h5 className="fw-bold mb-1">Belum ada pekerjaan yang sesuai dengan pencarian Anda.</h5>
          <p className="small mb-3">Coba ubah kata kunci pencarian atau sesuaikan filter budget dan tipe pekerjaan.</p>
          <button onClick={() => { setSearch(''); setJobType(''); setExpLevel(''); setMinBudget(''); setMaxBudget(''); }} className="btn btn-outline-primary rounded-3 px-4 mx-auto">
            Ubah Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
