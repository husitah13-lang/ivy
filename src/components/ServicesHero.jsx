import React from 'react';
import './ServicesHero.css';

const ServicesHero = ({ image, title, subtitle }) => {
  return (
    <section className="services-hero">
      <div className="services-hero-container">
        <div className="services-hero-image">
          <img src={image} alt="Services Hero" />
        </div>
        <div className="services-hero-content">
          <h1 className="services-hero-title">{title}</h1>
          <p className="services-hero-subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
