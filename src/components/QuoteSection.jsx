import React from 'react';
import './QuoteSection.css';
import { useTranslation } from 'react-i18next';

const QuoteSection = () => {
  const { t } = useTranslation();
  return (
    <section className="quote-section">
      <div className="quote-container">
        <div className="quote-image-container">
          <img 
            src="/julie_sweet.png" 
            alt={t('home.quote.author')} 
            className="quote-image"
          />
        </div>
        <div className="quote-content">
          <blockquote className="quote-text">
            {t('home.quote.text')}
          </blockquote>
          <p className="quote-author">{t('home.quote.author')}</p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
