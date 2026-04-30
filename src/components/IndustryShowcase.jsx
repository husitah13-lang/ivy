import React, { useState } from 'react';
import './IndustryShowcase.css';

const IndustryShowcase = ({ industries }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!industries || industries.length === 0) return null;

  return (
    <section className="industry-showcase">
      <div className="industry-container">
        <p className="industry-eyebrow">INDUSTRIES</p>
        <h2 className="industry-headline">Unmatched industry expertise</h2>
        
        <div className="industry-layout">
          <div className="industry-list">
            {industries.map((industry, idx) => (
              <div 
                key={idx} 
                className={`industry-item ${activeIndex === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="industry-indicator"></span>
                {industry.title}
              </div>
            ))}
          </div>
          
          <div className="industry-detail-panel">
            <div key={activeIndex} className="animate-fade-in">
              <h3 className="industry-detail-title">{industries[activeIndex].detailTitle}</h3>
              <p className="industry-detail-description">
                {industries[activeIndex].description}
              </p>
              <div className="industry-graphic">
                <img src={industries[activeIndex].image} alt={industries[activeIndex].title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;
