import React from 'react';
import './ServiceCareers.css';

const ServiceCareers = ({ title, description, buttonText, buttonLink }) => {
  return (
    <section className="service-careers-section">
      <div className="service-careers-container">
        <h2 className="service-careers-title">{title}</h2>
        <p className="service-careers-description">{description}</p>
        {buttonText && buttonLink && (
          <a href={buttonLink} className="service-careers-cta">
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

export default ServiceCareers;
