import React, { useState } from 'react';
import './ArticleFAQSection.css';

const ArticleFAQSection = ({ title, faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="article-faq-section">
      <div className="article-faq-container">
        {title && <h2 className="article-faq-title">{title}</h2>}
        
        <div className="article-faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`article-faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="article-faq-header" 
                onClick={() => toggleAccordion(index)}
              >
                <div className="article-faq-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="article-faq-question">{faq.question}</h3>
                <div className="article-faq-icon">
                  <span className="icon-plus"></span>
                </div>
              </div>
              <div className="article-faq-content">
                <div className="article-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleFAQSection;
