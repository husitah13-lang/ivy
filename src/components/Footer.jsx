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
            <Link to="/careers">{footer.links.careers}</Link>
            <Link to="/contact">{footer.links.contact}</Link>
            <Link to="/locations">{footer.links.locations}</Link>
            <Link to="/cookie-policy">{footer.links.cookie}</Link>
          </div>
          <div className="footer-column">
            <Link to="/privacy">{footer.links.privacy}</Link>
            <Link to="/terms">{footer.links.terms}</Link>
            <Link to="/accessibility">{footer.links.accessibility}</Link>
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
