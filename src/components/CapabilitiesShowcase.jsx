import React, { useState } from 'react';
import './CapabilitiesShowcase.css';
import { useTranslation } from 'react-i18next';

const CapabilitiesShowcase = ({ capabilities }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!capabilities || capabilities.length === 0) return null;

  return (
    <section className="capabilities-showcase">
      <div className="capabilities-container">
        <p className="capabilities-eyebrow">{t('services_main.capabilities_intro.eyebrow')}</p>
        <h2 className="capabilities-headline">{t('services_main.capabilities_intro.title')}</h2>
        
        <div className="capabilities-layout">
          <div className="capabilities-list">
            {capabilities.map((cap, idx) => (
              <div 
                key={idx} 
                className={`capability-item ${activeIndex === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="capability-indicator"></span>
                {cap.title}
              </div>
            ))}
          </div>
          
          <div className="capability-detail-panel">
            <div key={activeIndex} className="animate-fade-in">
              <h3 className="capability-detail-title">{capabilities[activeIndex].detailTitle}</h3>
              <p className="capability-detail-description">
                {capabilities[activeIndex].description}
              </p>
              <div className="capability-graphic">
                <img src={capabilities[activeIndex].image} alt={capabilities[activeIndex].title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesShowcase;
