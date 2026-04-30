import React from 'react';
import './ServiceCTA.css';

const ServiceCTA = ({ headline, subheadline, buttonText, buttonLink, alignment = 'center', bgColor = '#000000' }) => {
  return (
    <section className={`service-cta ${alignment}`} style={{ backgroundColor: bgColor }}>
      <div className="service-cta-container">
        {headline && <h2 className="service-cta-headline">{headline}</h2>}
        {subheadline && <p className="service-cta-subheadline">{subheadline}</p>}
        {buttonText && (
          <a href={buttonLink || '#'} className="service-cta-button">
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

export default ServiceCTA;
