import React from 'react';
import './ServiceHero.css';

const ServiceHero = ({ title, description, imageSrc }) => {
  return (
    <section className="service-hero">
      <div className="service-hero-container">
        <div className="service-hero-image">
          <img src={imageSrc || "/service_hero_illustration.png"} alt="Service Visual" />
        </div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">
            {title || (
              <>
                Resonate to create<br/>
                relevance in today's<br/>
                world of marketing
              </>
            )}
          </h1>
          <p className="service-hero-text">
            {description || "Data overload, vague promises and uninspired content are drowning out meaningful customer experiences. To cut through the noise, relevance must take center stage—driven by a marketing function fueled by data, creativity and technology to create lasting interactions."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
