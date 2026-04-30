import React from 'react';
import './Contact.css';
import worldMap from '../assets/contact_world_map_dots.png';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api';
import { useEffect, useState } from 'react';

const Contact = () => {
  const { t } = useTranslation();
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAPI('/api/contact');
        if (data) setCmsData(data);
      } catch (err) {
        console.warn("CMS contact fetch failed", err);
      }
    };
    loadData();
  }, []);

  const locations = cmsData?.locations || [
    { country: t('contact.locations.0.country'), address: "Imperial Place\nMaxwell Road\nBorehamwood, WD6 1JN", phone: "+44 (0) 208 1237 737" },
    { country: t('contact.locations.1.country'), address: "Mussafah Industrial\nM-3 Firdous Complex\nP.O. Box 46096", phone: "+971 (2) 5551 610" },
    { country: t('contact.locations.2.country'), address: "379/380, Main Potohar\nRoad, I-9/3, Islamabad", phone: "+92 (0) 51 8899 778" },
    { country: t('contact.locations.3.country'), address: "69B Tait street\nKelvin Grove\n4059, QLD", phone: "+61 (0) 40 4057 468" }
  ];

  const heroTitle = cmsData?.hero?.title || t('contact.hero.title');
  const heroSubtitle = cmsData?.hero?.subtitle || t('contact.hero.subtitle');

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <h1 className="contact-title">{heroTitle}</h1>
          <p className="contact-subtitle">
            {heroSubtitle}
          </p>
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
              <h3>{loc.country}</h3>
              <p>
                {loc.address.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}<br />
                  </React.Fragment>
                ))}
              </p>
              <p className="contact-phone">{loc.phone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
