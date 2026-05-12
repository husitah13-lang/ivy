import React, { useState } from 'react';
import './CapabilitiesShowcase.css';
import { useTranslation } from 'react-i18next';
import { EditableText, EditableImage } from './Admin/Editable';

const CapabilitiesShowcase = ({ capabilities, pathPrefix }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!capabilities || capabilities.length === 0) return null;

  return (
    <section className="capabilities-showcase">
      <div className="capabilities-container">
        <EditableText path="capabilities_intro.eyebrow" component="p" className="capabilities-eyebrow">
          {t('services_main.capabilities_intro.eyebrow')}
        </EditableText>
        <EditableText path="capabilities_intro.title" component="h2" className="capabilities-headline">
          {t('services_main.capabilities_intro.title')}
        </EditableText>
        
        <div className="capabilities-layout">
          <div className="capabilities-list">
            {capabilities.map((cap, idx) => (
              <div 
                key={idx} 
                className={`capability-item ${activeIndex === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="capability-indicator"></span>
                <EditableText path={pathPrefix ? `${pathPrefix}.${idx}.title` : `${idx}.title`} component="span">
                  {cap.title}
                </EditableText>
              </div>
            ))}
          </div>
          
          <div className="capability-detail-panel">
            <div key={activeIndex} className="animate-fade-in">
              <EditableText path={pathPrefix ? `${pathPrefix}.${activeIndex}.detailTitle` : `${activeIndex}.detailTitle`} component="h3" className="capability-detail-title">
                {capabilities[activeIndex].detailTitle}
              </EditableText>
              <EditableText path={pathPrefix ? `${pathPrefix}.${activeIndex}.description` : `${activeIndex}.description`} component="p" className="capability-detail-description">
                {capabilities[activeIndex].description}
              </EditableText>
              <div className="capability-graphic">
                <EditableImage 
                  path={pathPrefix ? `${pathPrefix}.${activeIndex}.image` : `${activeIndex}.image`} 
                  src={capabilities[activeIndex].image} 
                  alt={capabilities[activeIndex].title} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesShowcase;
