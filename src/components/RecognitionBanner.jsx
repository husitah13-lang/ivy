import React, { useEffect, useRef } from 'react';
import './RecognitionBanner.css';
import { useTranslation } from 'react-i18next';

const RecognitionBanner = ({ title, awards }) => {
  const { t } = useTranslation();
  const blueRef = useRef(null);
  const redRef = useRef(null);
  const cyanRef = useRef(null);

  const displayData = awards || [];
  const bannerTitle = title || "";

  if (displayData.length < 3) return null;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    if (blueRef.current) observer.observe(blueRef.current);
    if (redRef.current) observer.observe(redRef.current);
    if (cyanRef.current) observer.observe(cyanRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="recognition-banner-wrapper">
      
      {/* Sticky Background Text */}
      <div className="recognition-sticky-bg">
        <h2 className="recognition-title">
          {bannerTitle}
        </h2>
      </div>
      
      {/* Scrolling Foreground Cards */}
      <div className="recognition-scrolling-cards">
        <div className="scroll-spacer-top"></div>

        {/* Blue Card */}
        <div ref={blueRef} className="award-card blue-card">
          <div className="award-card-front">
             <h4>{displayData[0].shortTitle}</h4>
          </div>
          <div className="award-card-back">
             <p>{displayData[0].description}</p>
             <a href="#awards">{displayData[0].linkText}</a>
          </div>
        </div>

        {/* Red Card */}
        <div ref={redRef} className="award-card red-card">
          <div className="award-card-front">
             <h4>{displayData[1].shortTitle}</h4>
          </div>
          <div className="award-card-back">
             <p>{displayData[1].description}</p>
             <a href="#awards">{displayData[1].linkText}</a>
          </div>
        </div>

        {/* Cyan Card */}
        <div ref={cyanRef} className="award-card cyan-card">
          <div className="award-card-front">
             <h4>{displayData[2].shortTitle}</h4>
          </div>
          <div className="award-card-back">
             <p>{displayData[2].description}</p>
             <a href="#awards">{displayData[2].linkText}</a>
          </div>
        </div>
        
        <div className="scroll-spacer-bottom"></div>
      </div>
    </section>
  );
};

export default RecognitionBanner;
