import React from 'react';
import './Contact.css';
import worldMap from '../assets/contact_world_map_dots.png';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api';
import { useEffect, useState } from 'react';
import { useVisualEditor } from '../context/VisualEditorContext';
import { EditableText } from '../components/Admin/Editable';

const Contact = () => {
  const { t } = useTranslation();
  const { isCMS, draftData, initDraft } = useVisualEditor();
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'contact.ar' : 'contact';
        const data = await fetchAPI(`/content/${collection}`);
        if (data) {
          setCmsData(data);
          if (isCMS) initDraft(data, collection);
        }
      } catch (err) {
        console.warn("CMS contact fetch failed", err);
      }
    };
    loadData();
  }, [isCMS, i18n.language]);

  const activeData = isCMS ? draftData : cmsData;

  const locations = activeData?.locations || [
    { country: t('contact.locations.0.country'), address: "Imperial Place\nMaxwell Road\nBorehamwood, WD6 1JN", phone: "+44 (0) 208 1237 737" },
    { country: t('contact.locations.1.country'), address: "Mussafah Industrial\nM-3 Firdous Complex\nP.O. Box 46096", phone: "+971 (2) 5551 610" },
    { country: t('contact.locations.2.country'), address: "379/380, Main Potohar\nRoad, I-9/3, Islamabad", phone: "+92 (0) 51 8899 778" },
    { country: t('contact.locations.3.country'), address: "69B Tait street\nKelvin Grove\n4059, QLD", phone: "+61 (0) 40 4057 468" }
  ];

  const heroTitle = activeData?.hero?.title || t('contact.hero.title');
  const heroSubtitle = activeData?.hero?.subtitle || t('contact.hero.subtitle');

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <EditableText path="hero.title" component="h1" className="contact-title">
            {heroTitle}
          </EditableText>
          <EditableText path="hero.subtitle" component="p" className="contact-subtitle">
            {heroSubtitle}
          </EditableText>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="map-container">
          <img src={worldMap} alt="World Map" className="contact-map-img" />
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-grid">
          {locations.map((loc, index) => (
            <div className="location-col" key={index}>
              <EditableText path={`locations.${index}.country`} component="h3">
                {loc.country}
              </EditableText>
              <EditableText path={`locations.${index}.address`} component="p" style={{ whiteSpace: 'pre-wrap' }}>
                {loc.address}
              </EditableText>
              <EditableText path={`locations.${index}.phone`} component="p" className="contact-phone">
                {loc.phone}
              </EditableText>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
