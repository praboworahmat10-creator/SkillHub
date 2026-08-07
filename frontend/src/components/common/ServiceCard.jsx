import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiClock } from 'react-icons/fi';
import { formatRupiah, formatRating } from '../../utils/formatters';

const ServiceCard = ({ service }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="sh-card h-100 overflow-hidden d-flex flex-column position-relative">
      {/* Bookmark Heart */}
      <button
        onClick={toggleFavorite}
        className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center z-2 border"
        style={{ width: '36px', height: '36px', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        title="Simpan ke Favorit"
      >
        <FiHeart
          size={18}
          className={isFavorite ? 'text-danger fill-danger' : 'text-muted'}
          style={{ fill: isFavorite ? '#EF4444' : 'none' }}
        />
      </button>

      {/* Service Cover Image */}
      <Link to={`/dashboard/service/${service.slug}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden" style={{ height: '190px' }}>
          <img
            src={service.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
            alt={service.title}
            className="w-100 h-100 object-fit-cover transition hover-zoom"
            style={{ transition: 'transform 0.5s ease' }}
          />
          <span className="badge badge-pill-primary position-absolute bottom-0 start-0 m-3 shadow-sm">
            {service.category}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        {/* Freelancer Header */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <img
            src={service.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={service.freelancer?.name}
            className="rounded-circle border"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          <div className="lh-1">
            <span className="fw-semibold small d-block" style={{ color: 'var(--text-main)' }}>{service.freelancer?.name}</span>
            <span className="text-muted text-xs">{service.freelancer?.location || 'Indonesia'}</span>
          </div>
        </div>

        {/* Service Title */}
        <Link to={`/dashboard/service/${service.slug}`} className="text-decoration-none mb-3 flex-grow-1">
          <h6 className="fw-bold fs-6 line-clamp-2 hover-primary mb-0" style={{ minHeight: '44px', lineHeight: '1.4', color: 'var(--text-main)' }}>
            {service.title}
          </h6>
        </Link>

        {/* Rating & Delivery Time */}
        <div className="d-flex align-items-center justify-content-between text-muted small mb-3 border-top pt-2">
          <div className="d-flex align-items-center gap-1">
            <FiStar className="text-warning fill-warning" size={16} style={{ fill: '#F59E0B' }} />
            <span className="fw-bold" style={{ color: 'var(--text-main)' }}>{formatRating(service.rating_avg)}</span>
            <span>({service.reviews_count || 0})</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <FiClock size={14} />
            <span>{service.delivery_time_days} Hari</span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <span className="text-muted text-xs uppercase fw-medium">Mulai Dari</span>
          <span className="fw-bold fs-5 text-primary">
            {formatRupiah(service.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
