import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SubNavbar.css';

const SubNavbar = ({ title, anchors }) => {
  const [isTop, setIsTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (location.pathname.startsWith('/service') || location.pathname.startsWith('/what-we-think/')) {
        if (window.scrollY > 50) {
          setIsTop(true);
        } else {
          setIsTop(false);
        }
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleAnchorClick = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const offset = 60;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className={`sub-navbar ${isTop ? 'sub-navbar-top' : ''}`}>
      <div className="sub-navbar-container">
        <div className="sub-navbar-left">
          <span className="sub-navbar-title">{title || 'Marketing & Experience'}</span>
        </div>
        <div className="sub-navbar-right">
          {anchors ? (
            anchors.map((anchor, idx) => (
              <a 
                key={idx} 
                href={anchor.href}
                onClick={(e) => handleAnchorClick(e, anchor.href)}
              >
                {anchor.text}
              </a>
            ))
          ) : (
            <>
              <a href="#what-to-do" onClick={(e) => handleAnchorClick(e, '#what-to-do')}>What to do</a>
              <a href="#whats-trending" onClick={(e) => handleAnchorClick(e, '#whats-trending')}>What's trending</a>
              <a href="#partners" onClick={(e) => handleAnchorClick(e, '#partners')}>Partners</a>
              <a href="#careers" onClick={(e) => handleAnchorClick(e, '#careers')}>Careers</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
