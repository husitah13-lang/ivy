import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';

const Footer = ({ data }) => {
  const { t } = useTranslation();
  
  const footer = data?.footer || {
    brand: t('footer.brand'),
    copyright: t('footer.copyright'),
    links: {
      preference: t('footer.links.preference'),
      careers: t('footer.links.careers'),
      about: t('footer.links.about'),
      contact: t('footer.links.contact'),
      locations: t('footer.links.locations'),
      sitemap: t('footer.links.sitemap'),
      privacy: t('footer.links.privacy'),
      terms: t('footer.links.terms'),
      cookie: t('footer.links.cookie'),
      accessibility: t('footer.links.accessibility'),
      donotsell: t('footer.links.donotsell')
    }
  };

  return (
    <footer className="footer-section">
      {/* Left side links */}
      <div className="footer-left">
        <h2 className="footer-brand">{footer.brand}</h2>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <a href="#pref">{footer.links.preference}</a>
            <Link to="/careers">{footer.links.careers}</Link>
            <a href="#about">{footer.links.about}</a>
            <Link to="/contact">{footer.links.contact}</Link>
            <Link to="/locations">{footer.links.locations}</Link>
            <a href="#sitemap">{footer.links.sitemap}</a>
          </div>
          <div className="footer-column">
            <Link to="/privacy">{footer.links.privacy}</Link>
            <Link to="/terms">{footer.links.terms}</Link>
            <a href="#cookie">{footer.links.cookie}</a>
            <Link to="/accessibility">{footer.links.accessibility}</Link>
            <a href="#donotsell">{footer.links.donotsell}</a>
          </div>
        </div>

        <div className="footer-copyright">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
