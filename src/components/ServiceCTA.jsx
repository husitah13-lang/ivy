import React from 'react';
import './ServiceCTA.css';
import { EditableText } from './Admin/Editable';

const ServiceCTA = ({ headline, subheadline, buttonText, buttonLink, alignment = 'center', bgColor = '#000000', pathPrefix }) => {
  return (
    <section className={`service-cta ${alignment}`} style={{ backgroundColor: bgColor }}>
      <div className="service-cta-container">
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.title` : 'title'} 
          component="h2" 
          className="service-cta-headline"
          placeholder="CTA Headline..."
        >
          {headline || ""}
        </EditableText>
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.description` : 'description'} 
          component="p" 
          className="service-cta-subheadline"
          placeholder="CTA Description..."
        >
          {subheadline || ""}
        </EditableText>
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.cta.text` : 'cta.text'} 
          component="a" 
          href={buttonLink || '#'} 
          className="service-cta-button"
          placeholder="Button Text..."
        >
          {buttonText || ""}
        </EditableText>
      </div>
    </section>
  );
};

export default ServiceCTA;
