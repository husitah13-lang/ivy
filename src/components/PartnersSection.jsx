import React from 'react';
import './PartnersSection.css';

const partners = [
  { name: 'Shopify', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Shopify_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { name: 'AWS', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Cloudflare', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.svg' },
  { name: 'Firebase', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg' },
  { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' }
];

const PartnersSection = () => {
  return (
    <section className="partners-section">
      <div className="partners-container">
        <h2 className="partners-title">partnerships to help accelerate change</h2>
        
        <div className="partners-grid">
          {partners.map((partner, idx) => (
            <div key={idx} className="partner-logo-item" title={partner.name}>
              <img src={partner.logo} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
