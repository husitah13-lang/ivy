import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { EditableText } from '../components/Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';
import { fetchAPI } from '../utils/api';
import './LocationsPage.css';

import { locationsContent } from '../data/content/locations';
import { locationsContentAr } from '../data/content/locations.ar';

const LocationsPage = () => {
  const { i18n } = useTranslation();
  const { isCMS, draftData, initDraft, setDraftData, setIsDirty } = useVisualEditor();
  const [data, setData] = useState(i18n.language === 'ar' ? locationsContentAr : locationsContent);
  const [openRegion, setOpenRegion] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'locations.ar' : 'locations';
        const fallback = i18n.language === 'ar' ? locationsContentAr : locationsContent;
        const fetched = await fetchAPI(`/content/${collection}`);
        const active = fetched || fallback;
        setData(active);
        if (isCMS) initDraft(active, collection);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    loadData();
  }, [i18n.language, isCMS]);

  const activeData = (isCMS && draftData) ? draftData : data;

  const toggleRegion = (id) => {
    setOpenRegion(openRegion === id ? null : id);
  };

  const handleAddRegion = () => {
    if (!draftData) return;
    const newRegions = [...(draftData.regions || [])];
    newRegions.push({ name: "New Region", id: `region-${Date.now()}`, content: "Details for the new region..." });
    setDraftData({ ...draftData, regions: newRegions });
    setIsDirty(true);
  };

  const handleDeleteRegion = (index, e) => {
    e.stopPropagation();
    if (!draftData) return;
    if (window.confirm("Are you sure you want to delete this region?")) {
      const newRegions = [...draftData.regions];
      newRegions.splice(index, 1);
      setDraftData({ ...draftData, regions: newRegions });
      setIsDirty(true);
    }
  };

  if (!activeData) return null;

  return (
    <div className="locations-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <SEO seoData={activeData.seo} />
      
      <div className="locations-header">
        <EditableText path="hero.title" component="h1" className="locations-title">
          {activeData.hero?.title}
        </EditableText>
        <EditableText path="hero.subtitle" component="p" className="locations-subtitle">
          {activeData.hero?.subtitle}
        </EditableText>
        <div className="gradient-divider"></div>
      </div>

      <div className="locations-list">
        {activeData.regions?.map((region, idx) => (
          <div key={region.id || idx} className={`location-item ${openRegion === region.id ? 'open' : ''}`}>
            <div className="location-header" onClick={() => toggleRegion(region.id)}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isCMS && (
                  <button className="admin-delete-region-btn" onClick={(e) => handleDeleteRegion(idx, e)} title="Delete Region">
                    🗑️
                  </button>
                )}
                <EditableText path={`regions.${idx}.name`} component="h2" className="location-region">
                  {region.name}
                </EditableText>
              </div>
              <div className="location-icon">{openRegion === region.id ? '−' : '+'}</div>
            </div>
            <div className="location-content">
              <EditableText path={`regions.${idx}.content`} component="div" richText={true}>
                {region.content}
              </EditableText>
            </div>
          </div>
        ))}
        {isCMS && (
          <button className="admin-add-region-btn" onClick={handleAddRegion}>
            + Add New Region
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationsPage;
