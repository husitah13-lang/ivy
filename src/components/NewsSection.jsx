import React, { useEffect, useRef, useState } from 'react';
import './NewsSection.css';
import { useTranslation } from 'react-i18next';

const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Get news items from translations
  // Note: we need to handle the array mapping from i18next
  const newsItems = [0, 1, 2, 3, 4, 5].map(i => ({
    category: t(`home.news.items.${i}.category`),
    date: t(`home.news.items.${i}.date`),
    headline: t(`home.news.items.${i}.headline`)
  }));

  const extendedData = [...newsItems, ...newsItems];
  
  // Animation state refs to avoid re-renders
  const xPos = useRef(0);
  const currentSpeed = useRef(1);
  const targetSpeed = useRef(1);
  const isHovered = useRef(false);

  useEffect(() => {
    let animationId;
    const isRTL = i18n.language === 'ar';
    const multiplier = isRTL ? 1 : -1;
    
    const animate = () => {
      if (!trackRef.current) return;

      // Determine target speed
      let baseTarget = isPlaying ? 1 : 0;
      if (isPlaying && isHovered.current) baseTarget = 0.15; // Slow down significantly on hover
      
      // Lerp for smooth speed transition
      targetSpeed.current = baseTarget;
      currentSpeed.current += (targetSpeed.current - currentSpeed.current) * 0.08;
      
      // Update position
      // Using a base speed multiplier (1.2px per frame at 60fps)
      xPos.current += multiplier * currentSpeed.current * 1.2;
      
      // Infinite loop reset
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (Math.abs(xPos.current) >= halfWidth) {
        xPos.current = 0;
      }
      
      trackRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="news-section">
      <div className="news-section-inner scroll-reveal" ref={containerRef}>
        <div 
          className="news-marquee-container"
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseLeave={() => { isHovered.current = false; }}
        >
          <div className="news-track" ref={trackRef}>
            {extendedData.map((item, index) => (
              <div className="news-card" key={`${index}`}>
                <div className="news-card-header">
                  <span className="news-category">{item.category}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h2 className="news-headline">{item.headline}</h2>
                <div className="news-card-footer">
                  <span className="news-read-more">
                    {t('home.news.readMore')}
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="square"
                      style={{ transform: i18n.language === 'ar' ? 'rotate(180deg)' : 'none' }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="news-footer">
          <div className="news-footer-label">
            <span>{t('home.news.title')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
