import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubNavbar from '../components/SubNavbar';
import ServiceHero from '../components/ServiceHero';
import ServiceStats from '../components/ServiceStats';
import ServiceCapabilities from '../components/ServiceCapabilities';
import ServiceCTA from '../components/ServiceCTA';
import ServiceCareers from '../components/ServiceCareers';

import FAQSection from '../components/FAQSection';
import ServiceCapabilityList from '../components/ServiceCapabilityList';
import RecognitionBanner from '../components/RecognitionBanner';
import { fetchAPI } from '../utils/api';

const dataModulesEn = import.meta.glob('../data/*.js');
const dataModulesAr = import.meta.glob('../data/*.ar.js');

const ServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n, t: translate } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    const loadData = async () => {
      try {
        let importFunc;
        if (i18n.language === 'ar') {
          importFunc = dataModulesAr[`../data/${id}.ar.js`];
          if (!importFunc) {
             console.warn(`Arabic module for ${id} not found, falling back to English`);
             importFunc = dataModulesEn[`../data/${id}.js`];
          }
        } else {
          importFunc = dataModulesEn[`../data/${id}.js`];
        }

        if (!importFunc) {
           throw new Error(`Module ../data/${id}.js not found in import.meta.glob`);
        }

        const module = await importFunc();
        let pageData = { ...module.default };

        // Custom CMS integration for services can be added here if needed
        // For now, we rely on static data files
        
        setData(pageData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load service data:", err);
        setError(translate('service_not_found') || "Service not found");
        setLoading(false);
      }
    };

    loadData();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{translate('common.loading') || "Loading..."}</h2>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{error || translate('common.service_not_found') || "Service not found"}</h2>
        <button
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px', background: 'none', border: '1px solid #00aeef', color: '#fff', cursor: 'pointer' }}
        >
          {translate('common.return_home') || "Return Home"}
        </button>
      </div>
    );
  }

  // 1. Stats Mapping
  const mappedStats = data.stats?.cards?.map(stat => ({
    value: stat.percentage,
    description: stat.text
  })) || [];

  // 2. Capabilities Mapping (Mosaic)
  const mappedCapabilities = data.mosaic?.cards?.map(card => ({
    // If it has an image but no title, it's pure 'image'. If it has both, 'mixed'. Else 'text'.
    type: (!card.title && card.image) ? 'image' : (card.image ? 'mixed' : 'text'),
    category: card.eyebrow,
    title: card.title,
    description: card.body,
    image: card.image ? `/${card.image}` : null,
    linkUrl: card.cta_href,
    linkText: card.cta_text
  })) || [];

  // 3. Testimonials Mapping
  const mappedTestimonials = data.testimonials?.map((t, idx) => ({
    id: idx + 1,
    color: idx % 3 === 0 ? 'blue' : (idx % 3 === 1 ? 'red' : 'cyan'),
    shortTitle: t.author,
    description: `"${t.quote}" — ${t.role}`,
    linkText: ''
  })) || [];

  const anchorIds = data.subnavigation?.anchors
    ?.map(a => a.href?.startsWith('#') ? a.href.substring(1) : null)
    .filter(Boolean) || [];

  const getAnchorId = (index) => anchorIds[index] || `section-${index}`;

  return (
    <>
      <SubNavbar title={data.subnavigation?.title || "Service"} anchors={data.subnavigation?.anchors} />
      <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingBottom: '80px' }}>

        {data.hero && (
          <div id={getAnchorId(0)}>
            <ServiceHero
              title={data.hero.title}
              description={data.hero.subtitle}
              imageSrc={data.hero.image_src ? `/${data.hero.image_src}` : null}
            />
          </div>
        )}

        {data.stats && (
          <div id={getAnchorId(1)}>
            <ServiceStats
              title={data.stats.title}
              stats={mappedStats}
            />
          </div>
        )}

        {data.capabilities_list && (
          <div id={getAnchorId(2)}>
            <ServiceCapabilityList 
              headline={data.capabilities_list.title} 
              items={data.capabilities_list.items} 
            />
          </div>
        )}

        {data.mosaic && (
          <div id={getAnchorId(2)}>
            <ServiceCapabilities
              headline={data.mosaic.title}
              capabilities={mappedCapabilities}
            />
          </div>
        )}

        {data.testimonials && (
          <div id={getAnchorId(3)}>
            <RecognitionBanner 
              title={translate('common.testimonials') || "Customer Testimonials"} 
              awards={mappedTestimonials} 
            />
          </div>
        )}

        {data.banner_new_kind && (
          <div id={getAnchorId(3)}>
            <ServiceCTA
              headline={data.banner_new_kind.title}
              subheadline={data.banner_new_kind.description}
              buttonText={data.banner_new_kind.cta?.text}
              buttonLink={data.banner_new_kind.cta?.href}
            />
          </div>
        )}

        {data.faqs && (
          <div id={getAnchorId(4)}>
            <FAQSection faqs={data.faqs} />
          </div>
        )}

        {data.sales_careers && (
          <div id={getAnchorId(5) || "sales-careers-section"}>
            <ServiceCareers 
              title={data.sales_careers.title}
              description={data.sales_careers.description}
              buttonText={data.sales_careers.cta?.text}
              buttonLink={data.sales_careers.cta?.href}
            />
          </div>
        )}

      </div>
    </>
  );
};


export default ServicePage;
