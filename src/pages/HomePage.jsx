import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import QuoteSection from '../components/QuoteSection';
import CarouselSection from '../components/CarouselSection';
import RecognitionBanner from '../components/RecognitionBanner';
import NewsSection from '../components/NewsSection';
import CareersSection from '../components/CareersSection';
import { fetchAPI } from '../utils/api';
import { useVisualEditor } from '../context/VisualEditorContext';

import { homeContent } from '../data/content/homepage.js';
import { homeContentAr } from '../data/content/homepage.ar.js';
import './HomePage.css';

export const SectionControl = ({ index, total, onMove }) => (
  <div className="section-cms-controls">
    <button onClick={() => onMove(index, -1)} disabled={index === 0} title="Move Up">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
    </button>
    <button onClick={() => onMove(index, 1)} disabled={index === total - 1} title="Move Down">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <span className="section-label">Section</span>
  </div>
);

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { isCMS, draftData, initDraft, reorderSections, setDataContext } = useVisualEditor();
  
  // Initialize with local fallback data instantly
  const initialData = i18n.language === 'ar' ? homeContentAr : homeContent;
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Also update instantly when language changes
    const currentLocal = i18n.language === 'ar' ? homeContentAr : homeContent;
    setData(currentLocal);
    setDataContext(currentLocal);

    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'homepage.ar' : 'homepage';
        const cmsData = await fetchAPI(`/content/${collection}`);
        const fallbackData = i18n.language === 'ar' ? homeContentAr : homeContent;

        if (isCMS) {
          // Initialize draft with CMS data or local fallback
          initDraft(cmsData || fallbackData, collection);
        }

        if (cmsData) {
          if (!isCMS) {
            setData(cmsData);
            setDataContext(cmsData);
          }
        }
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      }
    };
    
    loadData();
  }, [i18n.language, isCMS]);

  const activeData = (isCMS && draftData) ? draftData : data;

  if (!activeData && !isCMS) return null;

  const renderSection = (section, index, array) => {
    if (!section.visible) return null;
    
    let content = null;
    switch (section.id) {
      case 'hero': 
        content = <Hero key="hero" data={activeData.hero_custom} slides={activeData.hero_slides} />;
        break;
      case 'services': 
        content = <CardSection key="services" id="services" cards={activeData.tilegrid} pathPrefix="tilegrid" />;
        break;
      case 'quote': 
        content = <QuoteSection key="quote" data={activeData.carousel || activeData.quote} />;
        break;
      case 'clients': 
        content = <CarouselSection key="clients" items={activeData.client_carousel} />;
        break;
      case 'recognition': 
        content = <RecognitionBanner key="recognition" title={activeData.recognition?.title} awards={activeData.recognition?.awards} />;
        break;
      case 'careers': 
        content = <CareersSection key="careers" data={activeData.careers} />;
        break;
      case 'news': 
        content = <NewsSection key="news" data={activeData.news} />;
        break;
      default: 
        content = null;
    }

    if (isCMS && content) {
      return (
        <div key={section.id || index} className="cms-reorderable-section" style={{ position: 'relative' }}>
          <SectionControl 
            index={index} 
            total={array.length} 
            onMove={(idx, dir) => reorderSections(idx, dir, 'section_layout', defaultLayout)} 
          />
          {content}
        </div>
      );
    }

    return content;
  };

  const defaultLayout = [
    { id: 'hero', visible: true },
    { id: 'services', visible: true },
    { id: 'quote', visible: true },
    { id: 'clients', visible: true },
    { id: 'recognition', visible: true },
    { id: 'careers', visible: true },
    { id: 'news', visible: true }
  ];

  const layout = activeData.section_layout || defaultLayout;

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <SEO seoData={activeData.seo} />
      {layout.map(renderSection)}
    </div>
  );
};

export default HomePage;
