import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroVideo from '../videos/hero.mp4';
import { heroSlides as slides } from '../data/heroSlides';
import './Hero.css';

const Hero = ({ data }) => {
  const { t, i18n } = useTranslation();
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const nextSlide = () => {
    setHasInteracted(true);
    setIsInitialLoad(false);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };


  // Auto-advance slides every 5 seconds if no interaction
  useEffect(() => {
    if (hasInteracted) return;

    const timer = setInterval(() => {
      setIsInitialLoad(false);
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasInteracted]);

  useEffect(() => {
    let requestRunning = false;
    
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      if (!requestRunning) {
        requestRunning = true;
        requestAnimationFrame(() => {
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
      
      <div className="hero-container">
        <div className="hero-left animate-on-scroll-left">
          <h1 className="hero-title">
            <span className="title-line-1">{data?.headline_prefix || t('hero.title_line_1')}</span>
            <span className="title-line-2">{data?.headline_suffix_start || t('hero.title_line_2')}</span>
            <span className="title-line-3">{data?.headline_suffix_end || t('hero.title_line_3')}</span>
            <span className="title-line-4">
              {i18n.language === 'ar' ? (
                data?.sub_headline || t('hero.title_line_4')
              ) : (
                <>
                  {(data?.sub_headline || t('hero.title_line_4')).replace('GROWTH', '')} 
                  <span className="accent-g">G</span>ROWTH
                </>
              )}
            </span>
          </h1>
        </div>
        
        <div className="hero-right animate-on-scroll-right">
          <div className={`right-content-wrapper ${!isInitialLoad ? 'fast-animate' : ''}`} key={activeSlide}>
            <div className="accent-divider animate-right-1"></div>
            <div className="hero-main-content-row">
              <div className="hero-text-block">
                <h2 className="hero-subtitle animate-right-2">{t(`hero.slide_${activeSlide}.subtitle`)}</h2>
                <div className="animate-right-3">
                  <p className="hero-description">
                    {t(`hero.slide_${activeSlide}.description`)}
                  </p>
                </div>
              </div>
              
              <button className="hero-nav-btn simple-chevron" onClick={nextSlide} aria-label="Next Slide">
                <svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </button>
            </div>

            <div className="animate-right-4 hero-cta-container">
              {slides[activeSlide].ctaLink.startsWith('http') ? (
                <a href={slides[activeSlide].ctaLink} className="hero-cta" target="_blank" rel="noopener noreferrer">
                  {t(`hero.slide_${activeSlide}.cta`)}
                  <span className="cta-arrow-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                    </svg>
                  </span>
                </a>
              ) : (
                <Link to={slides[activeSlide].ctaLink} className="hero-cta">
                  {t(`hero.slide_${activeSlide}.cta`)}
                  <span className="cta-arrow-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;

