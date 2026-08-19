import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getPublicJobsApi } from '../../services/freelancerJobService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiFileText, FiPlus, FiCheck } from 'react-icons/fi';

const PublicJobboardPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters matching Fastwork Jobboard (Screenshot)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobType, setJobType] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [jobsRes, catRes] = await Promise.all([
        getPublicJobsApi({
          category_id: selectedCategory,
          job_type: jobType,
        }),
        api.get('/categories').catch(() => ({ data: { data: [] } })),
      ]);

      setJobs(jobsRes?.data?.data || jobsRes?.data || []);
      setCategories(catRes?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch public jobboard jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, jobType]);

  const handlePostJobClick = () => {
    if (!user) {
      Swal.fire({
        icon: 'question',
        title: 'Posting Pekerjaan Baru',
        text: 'Untuk memposting lowongan pekerjaan baru, silakan masuk atau daftar sebagai Akun Client.',
        showCancelButton: true,
        confirmButtonText: 'Daftar Client',
        cancelButtonText: 'Masuk',
        confirmButtonColor: '#2563eb',
      }).then((res) => {
        if (res.isConfirmed) {
          navigate('/register/client');
        } else if (res.dismiss === Swal.DismissReason.cancel) {
          navigate('/login');
        }
      });
      return;
    }

    if (userRole === 'customer' || userRole === 'admin') {
      navigate('/dashboard/client/post-job');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Akun Freelancer',
        text: 'Anda sedang masuk sebagai Akun Freelancer. Untuk memposting pekerjaan, gunakan akun Client.',
      });
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobboard/${jobId}`);
  };

  return (
    <div className="bg-white dark:bg-dark min-vh-100 py-4 py-md-5">
      <div className="container" style={{ maxWidth: '1140px' }}>
        
        {/* Page Heading (Fastwork Exact Style) */}
        <h1 className="fw-extrabold text-dark dark:text-light mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em' }}>
          Jobboard
        </h1>

        {/* Row 1: Active Filter Pill & + Post a job button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <button
              className="btn btn-dark rounded-pill px-4 py-2 fw-bold text-white shadow-2xs d-inline-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#18181b', borderColor: '#18181b', fontSize: '0.9rem' }}
            >
              Semua pekerjaan <FiCheck size={16} />
            </button>
          </div>

          <div>
            <button
              onClick={handlePostJobClick}
              className="btn btn-dark rounded-pill px-4 py-2 fw-bold text-white shadow-sm d-inline-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#18181b', borderColor: '#18181b', fontSize: '0.9rem' }}
            >
              <FiPlus size={16} /> + Post a job
            </button>
          </div>
        </div>

        {/* Row 2: "All jobs" sub-title + Filter Dropdowns */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3">
          <h3 className="fw-bold text-dark dark:text-light mb-0" style={{ fontSize: '1.5rem' }}>
            All jobs
          </h3>

          <div className="d-flex align-items-center gap-2">
            {/* Job category dropdown */}
            <select
              className="form-select rounded-pill bg-light border-0 fw-semibold text-muted px-3 py-1.5"
              style={{ fontSize: '0.85rem', minWidth: '160px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Job category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Employment type dropdown */}
            <select
              className="form-select rounded-pill bg-light border-0 fw-semibold text-muted px-3 py-1.5"
              style={{ fontSize: '0.85rem', minWidth: '160px' }}
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Employment type</option>
              <option value="fixed_price">Freelance</option>
              <option value="contract">Kontrak kerja</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>
        </div>

        {/* Jobboard Table (Exact Fastwork Layout & Clean Styling) */}
        <div className="border rounded-4 overflow-hidden shadow-2xs bg-white dark:bg-dark">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ minWidth: '880px' }}>
                <thead className="bg-light text-muted uppercase text-xs fw-bold border-bottom">
                  <tr>
                    <th scope="col" className="ps-4 py-3" style={{ width: '42%' }}>Jobs</th>
                    <th scope="col" className="py-3">Kategori</th>
                    <th scope="col" className="py-3">Type</th>
                    <th scope="col" className="py-3">Budget</th>
                    <th scope="col" className="py-3">Posted</th>
                    <th scope="col" className="pe-4 py-3">Deliver Within</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => {
                    const dateStr = new Date(job.created_at || Date.now()).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }) + ' ' + new Date(job.created_at || Date.now()).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={job.id}
                        className="transition hover-bg-light"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleJobClick(job.id)}
                      >
                        {/* Jobs (Icon + Title) */}
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-2.5">
                            <span className="text-muted flex-shrink-0">
                              <FiFileText size={18} />
                            </span>
                            <span className="fw-bold text-primary hover-underline text-truncate" style={{ fontSize: '0.92rem', color: '#2563eb' }}>
                              {job.title}
                            </span>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="py-3 text-primary text-sm fw-medium" style={{ color: '#2563eb' }}>
                          {job.category?.name || 'Lainnya'}
                        </td>

                        {/* Type Badge */}
                        <td className="py-3">
                          <span className="badge rounded-pill bg-light text-dark border fw-normal px-3 py-1 text-xs">
                            {job.job_type === 'contract' ? 'Kontrak kerja' : 'Freelance'}
                          </span>
                        </td>

                        {/* Budget */}
                        <td className="py-3 fw-extrabold text-primary" style={{ fontSize: '0.92rem', color: '#2563eb' }}>
                          Rp{(job.budget_min || job.budget_max || 0).toLocaleString('id-ID')}
                        </td>

                        {/* Posted */}
                        <td className="py-3 text-muted text-xs">
                          {dateStr}
                        </td>

                        {/* Deliver Within */}
                        <td className="pe-4 py-3 text-muted text-xs">
                          {job.deadline_days ? `${job.deadline_days} Hari` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">Belum ada lowongan pekerjaan tersedia.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicJobboardPage;
