import React from 'react';
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { formatRupiah, formatRating } from '../../utils/formatters';

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="sh-card p-4 h-100 d-flex flex-column align-items-center text-center">
      <div className="position-relative mb-3">
        <img
          src={freelancer.avatar}
          alt={freelancer.name}
          className="rounded-circle shadow-sm border border-2 border-white"
          style={{ width: '84px', height: '84px', objectFit: 'cover' }}
        />
        <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle p-1" title="Terverifikasi SkillHub">
          <FiCheckCircle size={14} className="text-white" />
        </span>
      </div>

      <h5 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{freelancer.name}</h5>
      <span className="badge badge-pill-primary mb-2">{freelancer.title}</span>

      <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-3">
        <FiMapPin size={14} className="text-primary" />
        <span>{freelancer.location}</span>
        <span className="mx-1">&bull;</span>
        <FiStar size={14} className="text-warning" style={{ fill: '#F59E0B' }} />
        <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{formatRating(freelancer.rating)}</span>
        <span>({freelancer.reviews_count})</span>
      </div>

      {/* Skills Badges */}
      <div className="d-flex flex-wrap justify-content-center gap-1 mb-4 flex-grow-1">
        {freelancer.skills?.map((skill, idx) => (
          <span key={idx} className="rounded-pill px-2 py-1 text-xs fw-medium border" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }}>
            {skill}
          </span>
        ))}
      </div>

      <div className="w-100 pt-3 border-top d-flex align-items-center justify-content-between">
        <div className="text-start">
          <span className="text-muted text-xs d-block">Tarif Per Jam</span>
          <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{formatRupiah(freelancer.hourly_rate)}</span>
        </div>
        <button className="btn btn-outline-sh btn-sm px-3">Lihat Profil</button>
      </div>
    </div>
  );
};

export default FreelancerCard;
