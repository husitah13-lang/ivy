import React from 'react';
import './ServiceCareers.css';
import { EditableText } from './Admin/Editable';

const ServiceCareers = ({ title, description, buttonText, buttonLink, pathPrefix }) => {
  return (
    <section className="service-careers-section">
      <div className="service-careers-container">
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.title` : 'title'} 
          component="h2" 
          className="service-careers-title"
          placeholder="Careers Title..."
        >
          {title || ""}
        </EditableText>
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.description` : 'description'} 
          component="p" 
          className="service-careers-description"
          placeholder="Careers Description..."
        >
          {description || ""}
        </EditableText>
        <EditableText 
          path={pathPrefix ? `${pathPrefix}.cta.text` : 'cta.text'} 
          component="a" 
          href={buttonLink} 
          className="service-careers-cta"
          placeholder="Button Text..."
        >
          {buttonText || ""}
        </EditableText>
      </div>
    </section>
  );
};

export default ServiceCareers;
