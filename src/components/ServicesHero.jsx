import React from 'react';
import './ServicesHero.css';
import { EditableText, EditableImage } from './Admin/Editable';

const ServicesHero = ({ image, title, subtitle, pathPrefix }) => {
  return (
    <section className="services-hero">
      <div className="services-hero-container">
        <div className="services-hero-image">
          <EditableImage path={pathPrefix ? `${pathPrefix}.image` : 'image'} src={image} alt="Services Hero" />
        </div>
        <div className="services-hero-content">
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h1" className="services-hero-title">
            {title}
          </EditableText>
          <EditableText path={pathPrefix ? `${pathPrefix}.subtitle` : 'subtitle'} component="p" className="services-hero-subtitle">
            {subtitle}
          </EditableText>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
