import React from 'react';
import './ServiceCapabilities.css';

const ServiceCapabilities = ({ headline, capabilities }) => {
  if (!capabilities || capabilities.length === 0) return null;

  return (
    <section className="service-capabilities">
      <div className="service-capabilities-container">
        {headline && <h2 className="service-capabilities-headline">{headline}</h2>}
        
        <div className="capabilities-masonry">
          {capabilities.map((cap, index) => (
            <div key={index} className="capability-card">
              {/* If it's a pure image card */}
              {cap.type === 'image' ? (
                <div className="capability-image-only">
                  <img src={cap.image} alt={cap.category || 'Service visual'} />
                </div>
              ) : (
                /* Text or Mixed Card */
                <div className="capability-content">
                  <div className="capability-text-wrap">
                    <div className="capability-divider"></div>
                    <div className="capability-category">{cap.category}</div>
                    
                    <div className="capability-title-desc-container">
                      <h3 className="capability-title">{cap.title}</h3>
                      {cap.description && (
                        <p className="capability-description">{cap.description}</p>
                      )}
                    </div>

                    <a href={cap.linkUrl || '#'} className="capability-link">
                      {cap.linkText || 'Learn more'}
                      <span className="link-arrow-box">
                        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 1L6 5L2 9" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                        </svg>
                      </span>
                    </a>
                  </div>
                  {/* If it's a mixed card with an image at the bottom */}
                  {cap.type === 'mixed' && cap.image && (
                    <div className="capability-image-bottom">
                      <img src={cap.image} alt={cap.title} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCapabilities;
