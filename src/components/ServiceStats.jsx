import React from 'react';
import './ServiceStats.css';

const ServiceStats = ({ title, stats }) => {
  // If no stats are provided, don't render the section
  if (!stats || stats.length === 0) return null;

  return (
    <section className="service-stats">
      <div className="service-stats-container">
        {title && <h2 className="service-stats-title">{title}</h2>}
        <div className="service-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-divider"></div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceStats;
