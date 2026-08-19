import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { getJobDetailApi } from '../../services/freelancerJobService';
import { submitProposalApi } from '../../services/proposalService';
import { fetchPortfoliosApi as getPortfoliosApi } from '../../services/profileService';

import { FiArrowLeft, FiSend, FiDollarSign, FiClock, FiCheck, FiBriefcase } from 'react-icons/fi';

const SubmitProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const [jobRes, portRes] = await Promise.all([
          getJobDetailApi(id),
          getPortfoliosApi().catch(() => ({ data: [] })),
        ]);
        setJob(jobRes.data);
        setPortfolios(portRes.data || []);

        // Pre-fill suggested values
        if (jobRes.data) {
          setValue('proposed_price', jobRes.data.budget_min);
          setValue('estimated_days', jobRes.data.deadline_days);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const togglePortfolioSelect = (portId) => {
    if (selectedPortfolios.includes(portId)) {
      setSelectedPortfolios(selectedPortfolios.filter(p => p !== portId));
    } else {
      setSelectedPortfolios([...selectedPortfolios, portId]);
    }
  };

  const onSubmit = (data) => {
    Swal.fire({
      title: 'Kirim Proposal?',
      text: 'Apakah Anda yakin ingin mengirimkan proposal lamaran untuk pekerjaan ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Kirim Proposal',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const payload = {
            cover_letter: data.cover_letter,
            proposed_price: parseFloat(data.proposed_price),
            estimated_days: parseInt(data.estimated_days),
            additional_notes: data.additional_notes || '',
            portfolio_ids: selectedPortfolios,
            relevant_skills: job?.required_skills || [],
          };
          await submitProposalApi(id, payload);

          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Proposal berhasil dikirim.',
            timer: 1500,
            showConfirmButton: false,
          });

          navigate('/dashboard/freelancer/proposals');
        } catch (err) {
          console.error('Submit proposal error:', err);
          const errMsg = err.response?.data?.message || err.message || 'Gagal mengirim proposal.';
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mengirim Proposal',
            text: errMsg,
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      {/* Back Button */}
      <Link to={`/dashboard/freelancer/jobs/${id}`} className="btn btn-link text-decoration-none p-0 mb-4 d-inline-flex align-items-center gap-2 fw-semibold">
        <FiArrowLeft /> Kembali ke Detail Pekerjaan
      </Link>

      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-9">
          {/* Job Summary Banner */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary bg-opacity-10 text-dark">
            <h5 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>{job?.title}</h5>
            <p className="small text-muted mb-0">
              Estimasi Budget: Rp {(job?.budget_min || 0).toLocaleString('id-ID')} &bull; Deadline: {job?.deadline_days} Hari
            </p>
          </div>

          {/* Proposal Form Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h3 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Form Pengajuan Proposal</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Cover Letter */}
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: 'var(--text-main)' }}>
                  Cover Letter (Surat Pengantar) <span className="text-danger">*</span>
                </label>
                <p className="text-muted small mb-2">
                  Jelaskan kualifikasi Anda, bagaimana Anda akan menyelesaikan proyek ini, serta alasan client harus memilih Anda.
                </p>
                <textarea
                  className={`form-control bg-light ${errors.cover_letter ? 'is-invalid' : ''}`}
                  rows={6}
                  placeholder="Halo, saya berpengalaman mengerjakan proyek serupa dengan hasil terbaik. Pendekatan saya untuk proyek ini..."
                  {...register('cover_letter', {
                    required: 'Cover letter wajib diisi',
                    minLength: { value: 20, message: 'Cover letter minimal 20 karakter' },
                  })}
                />
                {errors.cover_letter && <div className="invalid-feedback">{errors.cover_letter.message}</div>}
              </div>

              {/* Price & Delivery Row */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-main)' }}>
                    Harga Penawaran (Rp) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">Rp</span>
                    <input
                      type="number"
                      className={`form-control bg-light border-start-0 ps-0 ${errors.proposed_price ? 'is-invalid' : ''}`}
                      placeholder="3000000"
                      {...register('proposed_price', {
                        required: 'Harga penawaran wajib diisi',
                        min: { value: 10000, message: 'Harga minimal Rp 10.000' },
                      })}
                    />
                  </div>
                  {errors.proposed_price && <div className="text-danger text-xs mt-1">{errors.proposed_price.message}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-main)' }}>
                    Estimasi Waktu Pengerjaan (Hari) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control bg-light ${errors.estimated_days ? 'is-invalid' : ''}`}
                    placeholder="7"
                    {...register('estimated_days', {
                      required: 'Estimasi waktu wajib diisi',
                      min: { value: 1, message: 'Minimal 1 hari' },
                    })}
                  />
                  {errors.estimated_days && <div className="invalid-feedback">{errors.estimated_days.message}</div>}
                </div>
              </div>

              {/* Attach Relevant Portfolio (Optional) */}
              {portfolios.length > 0 && (
                <div className="mb-4 pt-3 border-top">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-main)' }}>
                    Pilih Portofolio Relevan (Opsional)
                  </label>
                  <p className="text-muted small mb-3">Tampilkan hasil karya portofolio Anda untuk meyakinkan client.</p>

                  <div className="row g-3">
                    {portfolios.map((port) => {
                      const isSelected = selectedPortfolios.includes(port.id);
                      return (
                        <div key={port.id} className="col-12 col-md-6">
                          <div
                            onClick={() => togglePortfolioSelect(port.id)}
                            className={`card border-2 p-3 rounded-3 cursor-pointer transition ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <h6 className="fw-bold mb-0 text-truncate">{port.title}</h6>
                              {isSelected && <FiCheck className="text-primary fw-bold" size={20} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="mb-4">
                <label className="form-label fw-bold" style={{ color: 'var(--text-main)' }}>
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  className="form-control bg-light"
                  rows={3}
                  placeholder="Informasi pendukung lain yang ingin Anda sampaikan..."
                  {...register('additional_notes')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg rounded-3 fw-bold w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                {loading ? 'Memproses...' : <><FiSend /> Kirim Proposal</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitProposalPage;
