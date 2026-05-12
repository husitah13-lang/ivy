import React, { useEffect } from 'react';
import './RecognitionBanner.css';
import { useTranslation } from 'react-i18next';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const RecognitionBanner = ({ title, awards = [], pathPrefix }) => {
  const { t } = useTranslation();
  const { isCMS, updateField } = useVisualEditor();

  const getBaseValue = () => {
    if (!pathPrefix) return 'recognition.awards';
    // If it's a service page testimonial, the array is directly at pathPrefix
    return pathPrefix;
  };

  const addItem = () => {
    const base = getBaseValue();
    const newAwards = [...awards, { shortTitle: "New Recognition", description: "Details here...", linkText: "Learn more >" }];
    updateField(base, newAwards);
  };

  const removeItem = (index) => {
    const base = getBaseValue();
    const newAwards = awards.filter((_, i) => i !== index);
    updateField(base, newAwards);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    const cards = document.querySelectorAll('.award-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [awards.length]);

  if (!isCMS && awards.length === 0) return null;

  const colors = ['blue-card', 'red-card', 'cyan-card'];

  return (
    <section className="recognition-banner-wrapper">
      <div className="recognition-sticky-bg">
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.title` : 'recognition.title'} 
          component="h2" 
          className="recognition-title"
          placeholder="Section Title..."
        >
          {title}
        </EditableText>
      </div>
      
      <div className="recognition-scrolling-cards">
        <div className="scroll-spacer-top"></div>

        {awards.map((award, index) => (
          <div 
            key={index} 
            className={`award-card ${colors[index % colors.length]}`}
            style={{ position: 'relative' }}
          >
            {isCMS && (
              <button 
                onClick={() => removeItem(index)}
                title="Remove Card"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                ×
              </button>
            )}
            <div className="award-card-front">
               <EditableText 
                path={`${getBaseValue()}.${index}.shortTitle`} 
                component="h4"
                placeholder="Card Title..."
               >
                 {award.shortTitle}
               </EditableText>
            </div>
            <div className="award-card-back">
               <EditableText 
                path={`${getBaseValue()}.${index}.description`} 
                component="p"
                placeholder="Card details..."
               >
                 {award.description}
               </EditableText>
               <EditableText 
                path={`${getBaseValue()}.${index}.linkText`} 
                component="a" 
                style={{ color: 'inherit', textDecoration: 'underline' }}
                placeholder="Link text..."
               >
                 {award.linkText}
               </EditableText>
            </div>
          </div>
        ))}
        
        {isCMS && (
          <div 
            onClick={addItem}
            className="award-card add-award-card"
            style={{
              border: '2px dashed rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: '400px',
              background: 'rgba(255,255,255,0.05)'
            }}
          >
            <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>+ Add Recognition Card</span>
          </div>
        )}

        <div className="scroll-spacer-bottom"></div>
      </div>
    </section>
  );
};

export default RecognitionBanner;
