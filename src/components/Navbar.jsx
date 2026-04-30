import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import logoB from '../assets/b.png';
import logo2 from '../assets/2.png';

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMenuOpen) return; // Don't hide navbar if mobile menu is open
      
      if (window.scrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = window.scrollY;
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
    <nav className={`navbar ${isHidden ? 'navbar-hidden' : ''} ${isMenuOpen ? 'navbar-open' : ''}`}>
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
              {t('nav.services')}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 1 }}>
            <Link to="/what-we-think" className="nav-link" onClick={closeMenu}>
              {t('nav.news')}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 2 }}>
            <Link to="/careers" className="nav-link" onClick={closeMenu}>
              {t('nav.careers')}
            </Link>
          </li>
          <li className="nav-item" style={{ '--item-index': 3 }}>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              {t('nav.contact')}
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
              <span>{i18n.language === 'ar' ? 'العربية' : 'USA'}</span>
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
