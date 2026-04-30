import React, { useState } from 'react';
import './CarouselSection.css';
import { useTranslation } from 'react-i18next';

const CarouselSection = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Original IDs and colors to maintain continuity
  const carouselConfig = [
    { id: 1, imageColor: '#1a365d' },
    { id: 2, imageColor: '#276749' },
    { id: 3, imageColor: '#744210' },
    { id: 4, imageColor: '#4c1d95' },
    { id: 5, imageColor: '#9b2c2c' }
  ];

  const carouselData = carouselConfig.map((item, index) => ({
    ...item,
    title: t(`carousel.items.${index}.title`),
    description: t(`carousel.items.${index}.description`)
  }));

  // Create extended array for infinite looping
  const extendedData = [
    { ...carouselData[carouselData.length - 1], uniqueId: 'clone-last' },
    ...carouselData.map(item => ({ ...item, uniqueId: item.id.toString() })),
    { ...carouselData[0], uniqueId: 'clone-first' }
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(carouselData.length);
    } else if (currentIndex === extendedData.length - 1) {
      setCurrentIndex(1);
    }
  };

  // Calculate the display number (1-5) for the counter
  let displayIndex = currentIndex;
  if (currentIndex === 0) displayIndex = carouselData.length;
  else if (currentIndex === extendedData.length - 1) displayIndex = 1;

  // RTL handling for transform
  const isRTL = i18n.language === 'ar';
  const multiplier = isRTL ? 1 : -1;
  const trackStyle = {
    transform: `translateX(${multiplier * currentIndex * 85}vw)`,
    transition: isTransitioning ? 'transform 1.2s ease-in-out' : 'none'
  };

  return (
    <section className="carousel-section">
      <div className="carousel-track-wrapper">
        <div 
          className="carousel-track"
          style={trackStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedData.map((item) => (
            <div className="carousel-slide" key={item.uniqueId}>
              <div className="slide-media">
                <div 
                  className="slide-image-placeholder" 
                  style={{ backgroundColor: item.imageColor }}
                >
                  <span className="placeholder-text">Image Area</span>
                </div>
                <button className="play-button" aria-label="Play video">
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8L0.500001 15.7942L0.500001 0.205771L14 8Z" fill="white"/>
                  </svg>
                </button>
              </div>
              <div className="slide-content">
                <h2 className="slide-title">{item.title}</h2>
                <p className="slide-description">{item.description}</p>
                <a href="#read-more" className="slide-cta">
                  {t('carousel.readMore')}
                  <span className="cta-arrow-box">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 2L9 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-bottom-bar">
        <div className="carousel-controls">
          <button className="control-btn prev-btn" onClick={handlePrev} aria-label="Previous slide">
            <svg style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="square"/>
            </svg>
          </button>
          <span className="slide-counter">{displayIndex}/{carouselData.length}</span>
          <button className="control-btn next-btn" onClick={handleNext} aria-label="Next slide">
            <svg style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="square"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
