import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardSection.css';

// To maintain the visual pattern from the original design
const visualPatterns = [
  { type: 'light', image: '/careers_office.png', anim: 'reveal-up' },
  { type: 'dark', image: '/purple_ai_wave.png', anim: 'reveal-scale' },
  { type: 'light', image: '/service_phone.png', anim: 'reveal-right' },
  { type: 'dark', image: '/talent_reinventors.png', anim: 'reveal-left' },
  { type: 'dark', image: '/service_train.png', anim: 'reveal-blur' },
  { type: 'light', image: '/service_hero_illustration.png', anim: 'reveal-zoom' },
  { type: 'dark', image: '/service_posters.png', anim: 'reveal-up' },
  { type: 'light', image: '/julie_sweet.png', anim: 'reveal-scale' }
];

const CardSection = ({ cards = [], id }) => {
  const navigate = useNavigate();

  return (
    <section id={id} className="card-section">
      <div className="card-grid">
        {cards.map((card, index) => {
          const pattern = visualPatterns[index % visualPatterns.length];
          const routeId = card.cta_link ? card.cta_link.replace('.html', '') : card.id;

          return (
            <div
              key={card.id || index}
              className={`content-card ${pattern.type} anim-${pattern.anim}`}
              onClick={() => {
                if (card.cta_link && card.cta_link.startsWith('/')) {
                  navigate(card.cta_link);
                } else {
                  navigate(`/service/${routeId}`);
                }
              }}
            >

              {/* Image layer that will swipe to the right */}
              <div 
                className="card-image-layer" 
                style={{ backgroundImage: `url(${pattern.image})` }}
              >
                <div className="card-image-overlay">
                  <h3 className="card-image-title">{card.title}</h3>
                </div>
              </div>

              <div className="card-content">
                <span className="card-category">{card.type}</span>
                <h3 className="card-title">{card.title}</h3>

                <div className="card-body">
                  <p className="card-description">{card.body}</p>
                  <div className="card-expand-container">
                    <div className="card-expand">
                      {card.cta_text || 'Expand'}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


export default CardSection;
