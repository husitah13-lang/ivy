import React, { useState, useEffect } from 'react';
import './Careers.css';
import { fetchAPI } from '../utils/api';

const Careers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAPI('/api/careers');
        if (data) setCmsData(data);
      } catch (err) {
        console.warn("CMS careers fetch failed", err);
      }
    };
    loadData();
  }, []);

  const iframeUrl = cmsData?.iframe_url || "https://beta.ivy-staging.com/talentAccusation/JobListing?key=d66b8e17";

  return (
    <div className="careers-page">
      <section className="careers-cta-section">
        <div className="careers-container">
          <div className="careers-iframe-container">
            {isLoading && (
              <div className="iframe-loader">
                <div className="spinner"></div>
              </div>
            )}
            <iframe 
              src={iframeUrl} 
              title="Job Listings"
              className={`careers-iframe ${isLoading ? 'loading' : ''}`}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;