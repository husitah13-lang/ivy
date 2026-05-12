import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroVideo from '../videos/hero.mp4';
import './Hero.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const Hero = ({ data, slides = [] }) => {
  const { t, i18n } = useTranslation();
  const { isCMS } = useVisualEditor();
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (isPaused || isCMS) return; // Don't auto-advance in CMS or if paused
    const timer = setInterval(() => {
      setIsInitialLoad(false);
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, isCMS]);

  // Handle manual slide change in CMS mode
  const goToSlide = (idx) => {
    setIsInitialLoad(false);
    setActiveSlide(idx);
    setIsPaused(true); // Stay on this slide while editing
  };

  useEffect(() => {
    let requestRunning = false;
    
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      if (!requestRunning) {
        requestRunning = true;
        requestAnimationFrame(() => {
          if (!heroRef.current) return;
          const scrollTop = window.scrollY;
          const heroHeight = heroRef.current.offsetHeight || 800;
          
          // Calculate progress (0 to 1) based on scroll position within the hero height
          const progress = Math.min(scrollTop / heroHeight, 1);
          
          // Update CSS variables for children to use
          heroRef.current.style.setProperty('--scroll-progress', progress.toFixed(3));
          requestRunning = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <video ref={videoRef} className="hero-video" autoPlay loop muted playsInline>
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="hero-bg-overlay"></div>
      
      <div className={`hero-container ${i18n.language === 'ar' ? 'is-rtl' : ''}`}>
        <div className="hero-left animate-on-scroll-left">
          <EditableText 
            path="hero_custom.headline" 
            component="h1" 
            className="hero-title"
            placeholder="ENGINEERING DIGITAL SYSTEMS..."
            richText={true}
          >
            {data?.headline}
          </EditableText>
        </div>
        
        <div className="hero-right animate-on-scroll-right">
          <div className={`right-content-wrapper ${!isInitialLoad ? 'fast-animate' : ''}`} key={activeSlide}>
            <div className="accent-divider animate-right-1"></div>
            <div className="hero-main-content-row">
              <div className="hero-text-block">
                <EditableText 
                  path={`hero_slides.${activeSlide}.subtitle`} 
                  component="h2" 
                  className="hero-subtitle animate-right-2"
                  placeholder="Slide Title..."
                >
                  {slides[activeSlide]?.subtitle}
                </EditableText>
                <div className="animate-right-3">
                  <EditableText 
                    path={`hero_slides.${activeSlide}.description`} 
                    component="p" 
                    className="hero-description"
                    placeholder="Slide Description..."
                  >
                    {slides[activeSlide]?.description}
                  </EditableText>
                </div>
              </div>
              

            </div>

            <div className="animate-right-4 hero-cta-container">
              {slides[activeSlide]?.ctaLink?.startsWith('http') ? (
                <a href={slides[activeSlide]?.ctaLink} className="hero-cta" target="_blank" rel="noopener noreferrer">
                  {slides[activeSlide]?.ctaText}
                  <span className="cta-arrow-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                    </svg>
                  </span>
                </a>
              ) : (
                <Link to={slides[activeSlide]?.ctaLink || '#'} className="hero-cta">
                  {slides[activeSlide]?.ctaText}
                  <span className="cta-arrow-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                    </svg>
                  </span>
                </Link>
              )}
            </div>

            {/* Slide Navigation for CMS */}
            {slides.length > 1 && (
              <div className="hero-slide-nav" style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: activeSlide === idx ? '#00aeef' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
                {isCMS && (
                  <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '10px' }}>
                    Edit Slide {activeSlide + 1}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;

