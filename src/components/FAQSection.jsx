import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section">
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-header" 
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="faq-question">{faq.question}</h3>
              <div className="faq-icon">
                <span className="icon-plus"></span>
              </div>
            </div>
            <div className="faq-content">
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
