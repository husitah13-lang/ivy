import React from 'react';
import './QuoteSection.css';
import { useTranslation } from 'react-i18next';

import { EditableText, EditableImage } from './Admin/Editable';

const QuoteSection = ({ data }) => {
  const { t } = useTranslation();
  
  // Use passed data or fallback to translations
  const quoteData = data || {
    quote: t('home.quote.text'),
    author: t('home.quote.author'),
    image: "/julie_sweet.png"
  };

  return (
    <section className="quote-section">
      <div className="quote-container">
        <div className="quote-image-container">
          <EditableImage 
            path="carousel.image"
            src={quoteData.image || "/julie_sweet.png"} 
            alt={quoteData.author} 
            className="quote-image"
          />
        </div>
        <div className="quote-content">
          <EditableText path="carousel.quote" component="blockquote" className="quote-text">
            {quoteData.quote}
          </EditableText>
          <EditableText path="carousel.author" component="p" className="quote-author">
            {quoteData.author}
          </EditableText>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
