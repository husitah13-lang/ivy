import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer-section">
      {/* Left side links */}
      <div className="footer-left">
        <h2 className="footer-brand">{t('footer.brand')}</h2>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <a href="#pref">{t('footer.links.preference')}</a>
            <a href="#careers">{t('footer.links.careers')}</a>
            <a href="#about">{t('footer.links.about')}</a>
            <a href="#contact">{t('footer.links.contact')}</a>
            <a href="#locations">{t('footer.links.locations')}</a>
            <a href="#sitemap">{t('footer.links.sitemap')}</a>
          </div>
          <div className="footer-column">
            <a href="#privacy">{t('footer.links.privacy')}</a>
            <a href="#terms">{t('footer.links.terms')}</a>
            <a href="#cookie">{t('footer.links.cookie')}</a>
            <a href="#accessibility">{t('footer.links.accessibility')}</a>
            <a href="#donotsell">{t('footer.links.donotsell')}</a>
          </div>
        </div>

        <div className="footer-copyright">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
