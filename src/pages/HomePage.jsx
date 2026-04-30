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

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const collection = i18n.language === 'ar' ? 'homepage.ar' : 'homepage';
        const cmsData = await fetchAPI(`/content/${collection}`);
        if (cmsData) {
          setData(cmsData);
        }
      } catch (error) {
        console.error("Failed to load homepage data from CMS:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [i18n.language]);

  if (loading || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <h2 style={{ color: '#fff' }}>{t('common.loading')}</h2>
      </div>
    );
  }

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Hero data={data.hero_custom} />
      <CardSection id="services" cards={data.tilegrid} />
      <QuoteSection data={data.carousel} />
      <CarouselSection items={data.client_carousel} />
      <RecognitionBanner title={t('hero.ai_agentic_leap')} />
      <CareersSection data={data.careers} />
      <NewsSection data={data.news} />
    </div>
  );
};

export default HomePage;
