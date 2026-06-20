import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, theme = 'primary' }) => {
  return (
    <div className={`dashboard-card card theme-${theme}`}>
      <div className="card-content">
        <span className="card-title">{title}</span>
        <h3 className="card-value">{value}</h3>
      </div>
      {icon && (
        <div className="card-icon-container">
          {icon}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
