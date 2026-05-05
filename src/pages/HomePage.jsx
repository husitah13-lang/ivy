import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import CardSection from '../components/CardSection';
import QuoteSection from '../components/QuoteSection';
import CarouselSection from '../components/CarouselSection';
import RecognitionBanner from '../components/RecognitionBanner';
import NewsSection from '../components/NewsSection';
import CareersSection from '../components/CareersSection';
import { fetchAPI } from '../utils/api';

import { homeContent } from '../data/content/homepage.js';
import { homeContentAr } from '../data/content/homepage.ar.js';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  
  // Initialize with local fallback data instantly
  const initialData = i18n.language === 'ar' ? homeContentAr : homeContent;
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Also update instantly when language changes
    setData(i18n.language === 'ar' ? homeContentAr : homeContent);

    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'homepage.ar' : 'homepage';
        // Fetch CMS data in background
        const cmsData = await fetchAPI(`/content/${collection}`);
        if (cmsData) {
          setData(cmsData);
        }
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      }
    };
    
    // Slight delay to ensure UI renders instantly before network request
    const timer = setTimeout(loadData, 50);
    return () => clearTimeout(timer);
  }, [i18n.language]);

  if (!data) return null;

  const renderSection = (section) => {
    if (!section.visible) return null;
    
    switch (section.id) {
      case 'hero': 
        return <Hero key="hero" data={data.hero_custom} slides={data.hero_slides} />;
      case 'services': 
        return <CardSection key="services" id="services" cards={data.tilegrid} />;
      case 'quote': 
        return <QuoteSection key="quote" data={data.carousel || data.quote} />;
      case 'clients': 
        return <CarouselSection key="clients" items={data.client_carousel} />;
      case 'recognition': 
        return <RecognitionBanner key="recognition" title={data.recognition?.title} awards={data.recognition?.awards} />;
      case 'careers': 
        return <CareersSection key="careers" data={data.careers} />;
      case 'news': 
        return <NewsSection key="news" data={data.news} />;
      default: 
        return null;
    }
  };

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {data.section_layout ? (
        data.section_layout.map(renderSection)
      ) : (
        <>
          <Hero data={data.hero_custom} slides={data.hero_slides} />
          <CardSection id="services" cards={data.tilegrid} />
          <QuoteSection data={data.carousel || data.quote} />
          <CarouselSection items={data.client_carousel} />
          <RecognitionBanner title={data.recognition?.title} awards={data.recognition?.awards} />
          <CareersSection data={data.careers} />
          <NewsSection data={data.news} />
        </>
      )}
    </div>
  );
};

export default HomePage;
