import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewsSection.css';
import { useTranslation } from 'react-i18next';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const NewsSection = ({ data }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const { isCMS } = useVisualEditor();
  const [isPlaying, setIsPlaying] = useState(true);
  
  const newsItems = data?.items || [];
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
              <div 
                className="news-card" 
                key={`${index}`}
                onClick={() => {
                  if (isCMS) return;
                  const articleId = item.id || item.cta_link?.replace('.html', '').replace(/^\//, '') || index;
                  navigate(`/what-we-think/${articleId}`);
                }}
                style={{ cursor: isCMS ? 'default' : 'pointer', position: 'relative' }}
              >
                {isCMS && (
                  <button 
                    className="cms-navigate-btn"
                    title="Navigate to this article to edit it"
                    onClick={(e) => {
                      e.stopPropagation();
                      const articleId = item.id || item.cta_link?.replace('.html', '').replace(/^\//, '') || index;
                      navigate(`/admin/what-we-think/${articleId}`);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 100,
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}
                  >
                    Edit Page
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                )}
                <div className="news-card-header">
                  <EditableText path={`news.items.${index % newsItems.length}.category`} component="span" className="news-category">
                    {item.category}
                  </EditableText>
                  <span className="news-date">{item.date}</span>
                </div>
                <EditableText path={`news.items.${index % newsItems.length}.headline`} component="h2" className="news-headline">
                  {item.headline}
                </EditableText>
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
            <EditableText path="news.headline" component="span">
              {data?.headline || t('home.news.title')}
            </EditableText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
