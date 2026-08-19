import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { formatRupiah, formatRating } from '../../utils/formatters';

const FreelancerCard = ({ freelancer }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (freelancer?.id) {
      navigate(`/freelancers/${freelancer.id}`);
    }
  };

  return (
    <div
      className="sh-card p-4 h-100 d-flex flex-column align-items-center text-center"
      onClick={handleCardClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
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
        <button
          className="btn btn-outline-sh btn-sm px-3"
          onClick={e => { e.stopPropagation(); handleCardClick(); }}
        >Lihat Profil</button>
      </div>
    </div>
  );
};

export default FreelancerCard;
