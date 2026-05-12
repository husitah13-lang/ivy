import React from 'react';
import './ServiceCapabilities.css';
import { EditableText, EditableImage } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ServiceCapabilities = ({ headline, capabilities, pathPrefix }) => {
  const { isCMS, updateField, draftData } = useVisualEditor();

  const addItem = () => {
    const currentCards = draftData?.[pathPrefix]?.cards || [];
    const newCards = [...currentCards, { 
      eyebrow: "NEW CAPABILITY", 
      title: "Title Here", 
      body: "Description goes here.", 
      image: "service_phone.png" 
    }];
    updateField(`${pathPrefix}.cards`, newCards);
  };

  const removeItem = (index) => {
    const currentCards = draftData?.[pathPrefix]?.cards || [];
    const newCards = currentCards.filter((_, i) => i !== index);
    updateField(`${pathPrefix}.cards`, newCards);
  };

  if (!isCMS && (!capabilities || capabilities.length === 0)) return null;

  return (
    <section className="service-capabilities">
      <div className="service-capabilities-container">
        {headline && (
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="service-capabilities-headline">
            {headline}
          </EditableText>
        )}
        
        <div className="capabilities-masonry">
          {(capabilities || []).map((cap, index) => (
            <div key={index} className="capability-card" style={{ position: 'relative' }}>
              {isCMS && (
                <button 
                  onClick={() => removeItem(index)}
                  title="Remove Capability"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
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
                    zIndex: 20
                  }}
                >
                  ×
                </button>
              )}
              {/* If it's a pure image card */}
              {cap.type === 'image' ? (
                <div className="capability-image-only">
                  <EditableImage 
                    path={pathPrefix ? `${pathPrefix}.cards.${index}.image` : `cards.${index}.image`}
                    src={cap.image} 
                    alt={cap.category || 'Service visual'} 
                  />
                </div>
              ) : (
                /* Text or Mixed Card */
                <div className="capability-content">
                  <div className="capability-text-wrap">
                    <div className="capability-divider"></div>
                    <EditableText 
                      path={pathPrefix ? `${pathPrefix}.cards.${index}.eyebrow` : `cards.${index}.eyebrow`} 
                      component="div" 
                      className="capability-category"
                    >
                      {cap.category}
                    </EditableText>
                    
                    <div className="capability-title-desc-container">
                      <EditableText 
                        path={pathPrefix ? `${pathPrefix}.cards.${index}.title` : `cards.${index}.title`} 
                        component="h3" 
                        className="capability-title"
                      >
                        {cap.title}
                      </EditableText>
                      {cap.description && (
                        <EditableText 
                          path={pathPrefix ? `${pathPrefix}.cards.${index}.body` : `cards.${index}.body`} 
                          component="p" 
                          className="capability-description"
                        >
                          {cap.description}
                        </EditableText>
                      )}
                    </div>

                    <a href={cap.linkUrl || '#'} className="capability-link">
                      {cap.linkText || 'Learn more'}
                      <span className="link-arrow-box">
                        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 1L6 5L2 9" stroke="white" strokeWidth="2" strokeLinecap="square"/>
                        </svg>
                      </span>
                    </a>
                  </div>
                  {/* If it's a mixed card with an image at the bottom */}
                  {cap.type === 'mixed' && cap.image && (
                    <div className="capability-image-bottom">
                      <EditableImage 
                        path={pathPrefix ? `${pathPrefix}.cards.${index}.image` : `cards.${index}.image`}
                        src={cap.image} 
                        alt={cap.title} 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isCMS && (
            <div 
              onClick={addItem}
              className="capability-card add-capability-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                minHeight: '200px'
              }}
            >
              <div style={{ fontSize: '2rem', opacity: 0.5 }}>+ Add Capability</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceCapabilities;
