import React from 'react';
import { FiExternalLink, FiUser, FiFolder } from 'react-icons/fi';

const PortfolioCard = ({ portfolio, onSelect }) => {
  const freelancerName = portfolio.freelancer?.name || portfolio.freelancer_name || 'Freelancer';
  const freelancerAvatar = portfolio.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const freelancerTitle = portfolio.freelancer?.profile?.title || 'Professional Freelancer';

  return (
    <div className="sh-card h-100 d-flex flex-column overflow-hidden transition-all hover-lift">
      <div className="position-relative overflow-hidden bg-light" style={{ height: '180px' }}>
        <img
          src={portfolio.image_path || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
          alt={portfolio.title}
          className="w-100 h-100 object-fit-cover transition"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-dark bg-opacity-75 backdrop-blur text-white text-xs d-flex align-items-center gap-1">
            <FiFolder size={12} /> Portofolio
          </span>
        </div>
      </div>

      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold mb-2 text-truncate-2 hover-primary" style={{ color: 'var(--text-main)' }}>
          {portfolio.title}
        </h5>
        <p className="text-muted text-sm flex-grow-1 line-clamp-2 mb-3">
          {portfolio.description}
        </p>

        {/* Freelancer details */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
          <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
            <img
              src={freelancerAvatar}
              alt={freelancerName}
              className="rounded-circle flex-shrink-0"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <span className="fw-semibold text-xs d-block text-truncate" style={{ color: 'var(--text-main)' }}>{freelancerName}</span>
              <span className="text-muted text-xs d-block text-truncate">{freelancerTitle}</span>
            </div>
          </div>

          {portfolio.project_url && (
            <a
              href={portfolio.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-sh p-2 rounded-circle flex-shrink-0"
              title="Kunjungi Proyek"
            >
              <FiExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
