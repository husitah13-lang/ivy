import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import logoB from '../assets/b.png';
import logo2 from '../assets/2.png';

const Navbar = ({ data }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const nav = data?.nav || {
    services: t('nav.services'),
    news: t('nav.news'),
    careers: t('nav.careers'),
    contact: t('nav.contact'),
    language: i18n.language === 'ar' ? 'English' : 'Arabic'
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMenuOpen) return;
      
      const currentScrollY = window.scrollY;
      
      // Show navbar if scrolling up, hide if scrolling down
      // Only hide after some initial scroll (e.g. 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Add background blur/color if scrolled past top
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isHidden ? 'navbar-hidden' : ''} ${isScrolled ? 'navbar-scrolled' : ''} ${isMenuOpen ? 'navbar-open' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logoB} className="logo-main" alt="Logo" />
          <img src={logo2} className="logo-back" alt="Logo Background" />
        </Link>

        {/* Hamburger Toggle */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item" style={{ '--item-index': 0 }}>
            <Link to="/#services" className="nav-link" onClick={closeMenu}>
              {nav.services}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 1 }}>
            <Link to="/what-we-think" className="nav-link" onClick={closeMenu}>
              {nav.news}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 2 }}>
            <Link to="/careers" className="nav-link" onClick={closeMenu}>
              {nav.careers}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 3 }}>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              {nav.contact}
            </Link>
          </li>
          <li className="nav-item lang-switcher-item" style={{ '--item-index': 4 }}>
            <button 
              className="nav-link lang-btn" 
              onClick={() => { toggleLanguage(); closeMenu(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{nav.language}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
