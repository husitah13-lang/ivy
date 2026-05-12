import React, { useState } from 'react';
import './IndustryShowcase.css';
import { EditableText, EditableImage } from './Admin/Editable';

const IndustryShowcase = ({ industries, pathPrefix }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!industries || industries.length === 0) return null;

  return (
    <section className="industry-showcase">
      <div className="industry-container">
        <EditableText path="industry_intro.eyebrow" component="p" className="industry-eyebrow">
          INDUSTRIES
        </EditableText>
        <EditableText path="industry_intro.title" component="h2" className="industry-headline">
          Unmatched industry expertise
        </EditableText>
        
        <div className="industry-layout">
          <div className="industry-list">
            {industries.map((industry, idx) => (
              <div 
                key={idx} 
                className={`industry-item ${activeIndex === idx ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="industry-indicator"></span>
                <EditableText path={pathPrefix ? `${pathPrefix}.${idx}.title` : `${idx}.title`} component="span">
                  {industry.title}
                </EditableText>
              </div>
            ))}
          </div>
          
          <div className="industry-detail-panel">
            <div key={activeIndex} className="animate-fade-in">
              <EditableText path={pathPrefix ? `${pathPrefix}.${activeIndex}.detailTitle` : `${activeIndex}.detailTitle`} component="h3" className="industry-detail-title">
                {industries[activeIndex].detailTitle}
              </EditableText>
              <EditableText path={pathPrefix ? `${pathPrefix}.${activeIndex}.description` : `${activeIndex}.description`} component="p" className="industry-detail-description">
                {industries[activeIndex].description}
              </EditableText>
              <div className="industry-graphic">
                <EditableImage 
                  path={pathPrefix ? `${pathPrefix}.${activeIndex}.image` : `${activeIndex}.image`} 
                  src={industries[activeIndex].image} 
                  alt={industries[activeIndex].title} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;
