import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CareersSection.css';
import { useTranslation } from 'react-i18next';

const CareersSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight;
      const end = 0;
      
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const animProgress = Math.min(1, scrollProgress / 0.7);
  const scale = 3.5 - (animProgress * 2.5);
  const translateX = (1 - animProgress) * 60;
  
  const textOpacity = scrollProgress > 0.5 
    ? Math.min(1, (scrollProgress - 0.5) / 0.4) 
    : 0;
    
  const textTranslateY = scrollProgress > 0.5 
    ? 20 * (1 - (scrollProgress - 0.5) / 0.4) 
    : 20;

  return (
    <section ref={sectionRef} className="cs-section">
      <div className="cs-image-container">
        <div 
          className="cs-image-wrapper"
          style={{ 
            transform: `translateX(${translateX}%) scale(${scale})`,
            zIndex: scrollProgress < 0.7 ? 10 : 1
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
            alt="Professional team collaborating"
            className="cs-image"
          />
        </div>
      </div>

      <div 
        className="cs-content"
        style={{ 
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`
        }}
      >
        <span className="cs-label">{t('home.careers.label')}</span>
        <h2 className="cs-title">
          {t('home.careers.title')}
        </h2>
        <p className="cs-subtitle">
          {t('home.careers.subtitle')}
        </p>
        <div className="cs-cta" onClick={() => navigate('/careers')} style={{ cursor: 'pointer' }}>
          <span className="cs-cta-text">{t('home.careers.cta')}</span>
          <button className="cs-cta-btn" aria-label={t('home.careers.cta')} onClick={(e) => { e.stopPropagation(); navigate('/careers'); }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 2L9 6L4 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;