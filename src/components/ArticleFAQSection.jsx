import React, { useState } from 'react';
import './ArticleFAQSection.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ArticleFAQSection = ({ title, faqs = [], pathPrefix }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { isCMS, updateField } = useVisualEditor();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const addItem = () => {
    const newItems = [...faqs, { question: "New Question", answer: "New Answer" }];
    updateField(pathPrefix ? `${pathPrefix}.faqs` : 'faqs', newItems);
  };

  const removeItem = (e, index) => {
    e.stopPropagation();
    const newItems = faqs.filter((_, i) => i !== index);
    updateField(pathPrefix ? `${pathPrefix}.faqs` : 'faqs', newItems);
  };

  if (!isCMS && (!faqs || faqs.length === 0)) return null;

  return (
    <section className="article-faq-section">
      <div className="article-faq-container">
        {title && (
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="article-faq-title">
            {title}
          </EditableText>
        )}
        
        <div className="article-faq-list">
          {(faqs || []).map((faq, index) => (
            <div 
              key={index} 
              className={`article-faq-item ${activeIndex === index ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {isCMS && (
                <button 
                  onClick={(e) => removeItem(e, index)}
                  className="cms-remove-item-btn"
                  title="Remove FAQ"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '-30px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              )}
              <div 
                className="article-faq-header" 
                onClick={() => toggleAccordion(index)}
              >
                <div className="article-faq-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <EditableText 
                  path={pathPrefix ? `${pathPrefix}.faqs.${index}.question` : `faqs.${index}.question`} 
                  component="h3" 
                  className="article-faq-question"
                >
                  {faq.question}
                </EditableText>
                <div className="article-faq-icon">
                  <span className="icon-plus"></span>
                </div>
              </div>
              <div className="article-faq-content">
                <div className="article-faq-answer">
                  <EditableText 
                    path={pathPrefix ? `${pathPrefix}.faqs.${index}.answer` : `faqs.${index}.answer`} 
                    component="p"
                  >
                    {faq.answer}
                  </EditableText>
                </div>
              </div>
            </div>
          ))}

          {isCMS && (
            <button 
              onClick={addItem}
              className="cms-add-item-btn"
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px dashed rgba(255,255,255,0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              + Add FAQ Item
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleFAQSection;
