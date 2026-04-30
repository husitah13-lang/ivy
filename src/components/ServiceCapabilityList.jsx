import React from 'react';
import './ServiceCapabilityList.css';

const ServiceCapabilityList = ({ headline, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="service-capability-list">
      <div className="capability-list-container">
        <div className="capability-list-header">
          <span className="capability-eyebrow">CAPABILITIES</span>
          {headline && <h2 className="capability-list-headline">{headline}</h2>}
        </div>
        
        <div className="capability-items-grid">
          {items.map((item, index) => (
            <div key={index} className="capability-item">
              <div className="capability-dot"></div>
              <span className="capability-name">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCapabilityList;
