import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

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
            <a href="#careers">{footer.links.careers}</a>
            <a href="#about">{footer.links.about}</a>
            <a href="#contact">{footer.links.contact}</a>
            <a href="#locations">{footer.links.locations}</a>
            <a href="#sitemap">{footer.links.sitemap}</a>
          </div>
          <div className="footer-column">
            <a href="#privacy">{footer.links.privacy}</a>
            <a href="#terms">{footer.links.terms}</a>
            <a href="#cookie">{footer.links.cookie}</a>
            <a href="#accessibility">{footer.links.accessibility}</a>
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
