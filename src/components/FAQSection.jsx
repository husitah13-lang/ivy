import React, { useState } from 'react';
import './FAQSection.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const FAQSection = ({ faqs = [], pathPrefix }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { isCMS, updateField } = useVisualEditor();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const addItem = () => {
    const newItems = [...faqs, { question: "New Question", answer: "New Answer" }];
    updateField(pathPrefix, newItems);
  };

  const removeItem = (e, index) => {
    e.stopPropagation();
    const newItems = faqs.filter((_, i) => i !== index);
    updateField(pathPrefix, newItems);
  };

  if (!isCMS && (!faqs || faqs.length === 0)) return null;

  return (
    <section className="faq-section">
      <div className="faq-container">
        {(faqs || []).map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            {isCMS && (
              <button 
                onClick={(e) => removeItem(e, index)}
                title="Remove FAQ"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '10px',
                  zIndex: 10
                }}
              >
                ×
              </button>
            )}
            <div 
              className="faq-header" 
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-number">
                {String(index + 1).padStart(2, '0')}
              </div>
              <EditableText 
                path={pathPrefix ? `${pathPrefix}.${index}.question` : `${index}.question`} 
                component="h3" 
                className="faq-question"
              >
                {faq.question}
              </EditableText>
              <div className="faq-icon">
                <span className="icon-plus"></span>
              </div>
            </div>
            <div className="faq-content">
              <div className="faq-answer">
                <EditableText 
                  path={pathPrefix ? `${pathPrefix}.${index}.answer` : `${index}.answer`} 
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
    </section>
  );
};

export default FAQSection;
