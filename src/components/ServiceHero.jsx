import React from 'react';
import './ServiceHero.css';
import { EditableText, EditableImage } from './Admin/Editable';

const ServiceHero = ({ title, description, imageSrc, pathPrefix }) => {
  return (
    <section className="service-hero">
      <div className="service-hero-container">
        <div className="service-hero-image">
          <EditableImage 
            path={pathPrefix ? `${pathPrefix}.image_src` : 'image_src'}
            src={imageSrc || "/service_hero_illustration.png"} 
            alt="Service Visual" 
          />
        </div>
        <div className="service-hero-content">
          <EditableText 
            path={pathPrefix ? `${pathPrefix}.title` : 'title'} 
            component="h1" 
            className="service-hero-title"
            placeholder="Enter Hero Title..."
          >
            {title || ""}
          </EditableText>
          <EditableText 
            path={pathPrefix ? `${pathPrefix}.subtitle` : 'subtitle'} 
            component="p" 
            className="service-hero-text"
            placeholder="Enter Hero Description..."
          >
            {description || ""}
          </EditableText>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
