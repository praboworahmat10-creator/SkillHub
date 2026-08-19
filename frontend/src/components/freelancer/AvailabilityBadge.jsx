import React, { useState } from 'react';
import { updateAvailabilityApi } from '../../services/availabilityService';
import Swal from 'sweetalert2';

const AvailabilityBadge = ({ currentStatus = 'AVAILABLE', onStatusChanged }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (newStatus) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      await updateAvailabilityApi(newStatus);
      setStatus(newStatus);
      if (onStatusChanged) onStatusChanged(newStatus);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Status ketersediaan diperbarui',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error('Failed to update availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeConfig = () => {
    switch (status) {
      case 'BUSY':
        return {
          dot: '🟡',
          label: 'Busy',
          bgClass: 'bg-warning bg-opacity-10 text-dark border-warning',
        };
      case 'NOT_AVAILABLE':
        return {
          dot: '⚪',
          label: 'Not Available',
          bgClass: 'bg-secondary bg-opacity-10 text-secondary border-secondary',
        };
      case 'AVAILABLE':
      default:
        return {
          dot: '🟢',
          label: 'Available for Work',
          bgClass: 'bg-success bg-opacity-10 text-success border-success',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="dropdown d-inline-block">
      <button
        className={`btn btn-sm dropdown-toggle rounded-pill px-3 py-1 fw-semibold border d-flex align-items-center gap-1.5 ${config.bgClass}`}
        type="button"
        id="availabilityDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={loading}
        style={{ fontSize: '0.8rem' }}
      >
        <span>{config.dot}</span>
        <span>{config.label}</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end shadow-sm rounded-3 border-0 py-2" aria-labelledby="availabilityDropdown" style={{ fontSize: '0.85rem' }}>
        <li>
          <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleSelect('AVAILABLE')}>
            <span>🟢</span> <span className="fw-semibold text-success">Available for Work</span>
          </button>
        </li>
        <li>
          <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleSelect('BUSY')}>
            <span>🟡</span> <span className="fw-semibold text-warning">Busy</span>
          </button>
        </li>
        <li>
          <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleSelect('NOT_AVAILABLE')}>
            <span>⚪</span> <span className="fw-semibold text-secondary">Not Available</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AvailabilityBadge;
