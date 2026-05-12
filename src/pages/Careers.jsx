import React, { useState, useEffect } from 'react';
import './Careers.css';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api';
import { useVisualEditor } from '../context/VisualEditorContext';

const Careers = () => {
  const { i18n } = useTranslation();
  const { isCMS, draftData, initDraft, updateField } = useVisualEditor();
  const [isLoading, setIsLoading] = useState(true);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'careers_page.ar' : 'careers_page';
        const data = await fetchAPI(`/content/${collection}`);
        if (data) {
          setCmsData(data);
          if (isCMS) initDraft(data, collection);
        }
      } catch (err) {
        console.warn("CMS careers fetch failed", err);
      }
    };
    loadData();
  }, [isCMS, i18n.language]);

  const activeData = isCMS ? draftData : cmsData;
  const iframeUrl = activeData?.iframe_url || "https://beta.ivy-staging.com/talentAccusation/JobListing?key=d66b8e17";

  return (
    <div className="careers-page">
      {isCMS && (
        <div style={{ padding: '20px', backgroundColor: '#111', color: '#fff', textAlign: 'center' }}>
          <label style={{ marginRight: '10px' }}>Job Board URL:</label>
          <input 
            type="text" 
            value={iframeUrl} 
            onChange={(e) => updateField('iframe_url', e.target.value)}
            style={{ width: '60%', padding: '8px', background: '#222', color: '#fff', border: '1px solid #444' }}
          />
        </div>
      )}
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