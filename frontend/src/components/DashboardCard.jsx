import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, count, amount, rating }) => {
  return (
    <div className="sh-card p-5 bg-white dark:bg-dark flex flex-col justify-center items-center text-center">
      <h3 className="fw-bold mb-2 text-primary">{title}</h3>
      {count !== undefined && <p className="display-4 fw-bold mb-0">{count}</p>}
      {amount !== undefined && <p className="fs-4 fw-medium mb-0">{amount}</p>}
      {rating !== undefined && (
        <p className="fs-4 fw-medium mb-0">
          {rating} <span className="text-warning">★</span>
        </p>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default DashboardCard;
