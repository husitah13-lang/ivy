import React from 'react';
import ServicesHero from '../components/ServicesHero';
import CapabilitiesShowcase from '../components/CapabilitiesShowcase';
import PartnersSection from '../components/PartnersSection';
import IndustryShowcase from '../components/IndustryShowcase';
import RecognitionBanner from '../components/RecognitionBanner';
import SubNavbar from '../components/SubNavbar';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api';
import { useEffect, useState } from 'react';
import { useVisualEditor } from '../context/VisualEditorContext';
import { SectionControl } from './HomePage';

import { servicesMainContent } from '../data/content/services_main';
import { servicesMainContentAr } from '../data/content/services_main_ar';

const ServicesMain = () => {
  const { t, i18n } = useTranslation();
  const { isCMS, draftData, initDraft, reorderSections, setDataContext } = useVisualEditor();
  
  // Initialize with local fallback data instantly
  const initialData = i18n.language === 'ar' ? servicesMainContentAr : servicesMainContent;
  const [cmsData, setCmsData] = useState(initialData);

  useEffect(() => {
    const currentLocal = i18n.language === 'ar' ? servicesMainContentAr : servicesMainContent;
    setCmsData(currentLocal);

    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'services_main.ar' : 'services_main';
        const data = await fetchAPI(`/content/${collection}`);
        if (data) {
          setCmsData(data);
          setDataContext(data);
          if (isCMS) initDraft(data, collection);
        } else {
          setDataContext(currentLocal);
        }
      } catch (err) {
        console.warn("CMS services_main fetch failed", err);
        setDataContext(currentLocal);
      }
    };
    loadData();
  }, [isCMS, i18n.language]);

  const activeData = isCMS ? draftData : cmsData;

  const capabilitiesData = activeData?.capabilities || [0, 1, 2, 3, 4, 5, 6].map(i => ({
    title: t(`services_main.capabilities.${i}.title`),
    detailTitle: t(`services_main.capabilities.${i}.detailTitle`),
    description: t(`services_main.capabilities.${i}.description`),
    image: [
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ][i]
  }));

  const industriesData = [0, 1, 2, 3, 4].map(i => ({
    title: t(`services_main.industries.${i}.title`),
    detailTitle: t(`services_main.industries.${i}.detailTitle`),
    description: t(`services_main.industries.${i}.description`),
    image: [
      "https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ][i]
  }));

  const ivyAwardsData = [0, 1, 2].map(i => ({
    id: i + 1,
    color: ['blue', 'red', 'cyan'][i],
    shortTitle: t(`services_main.recognition.items.${i}.shortTitle`),
    description: t(`services_main.recognition.items.${i}.description`),
    linkText: t(`services_main.recognition.items.${i}.linkText`)
  }));

  const servicesAnchors = [
    { text: t('services_main.nav.anchors.overview'), href: '#overview' },
    { text: t('services_main.nav.anchors.capabilities'), href: '#capabilities' },
    { text: t('services_main.nav.anchors.partners'), href: '#partners' },
    { text: t('services_main.nav.anchors.industries'), href: '#industries' },
    { text: t('services_main.nav.anchors.recognition'), href: '#recognition' }
  ];

  const defaultLayout = [
    { id: 'overview', visible: true },
    { id: 'capabilities', visible: true },
    { id: 'partners', visible: true },
    { id: 'industries', visible: true },
    { id: 'recognition', visible: true }
  ];

  const layout = activeData?.section_layout || defaultLayout;

  const renderSection = (section, index, array) => {
    if (!section.visible) return null;

    let content = null;
    switch (section.id) {
      case 'overview':
        content = (
          <div id="overview">
            <ServicesHero 
              image={activeData?.hero?.image || "/business_reinvention_hero.png"}
              title={activeData?.hero?.title || t('services_main.hero.title')}
              subtitle={activeData?.hero?.subtitle || t('services_main.hero.subtitle')}
              pathPrefix="hero"
            />
          </div>
        );
        break;
      case 'capabilities':
        content = (
          <div id="capabilities">
            <CapabilitiesShowcase capabilities={capabilitiesData} pathPrefix="capabilities" />
          </div>
        );
        break;
      case 'partners':
        content = (
          <div id="partners">
            <PartnersSection pathPrefix="partners" />
          </div>
        );
        break;
      case 'industries':
        content = (
          <div id="industries">
            <IndustryShowcase industries={industriesData} pathPrefix="industries" />
          </div>
        );
        break;
      case 'recognition':
        content = (
          <div id="recognition">
            <RecognitionBanner 
              title={activeData?.recognition?.title || t('services_main.recognition.title')} 
              awards={ivyAwardsData}
              pathPrefix="recognition"
            />
          </div>
        );
        break;
      default:
        content = null;
    }

    if (!content) return null;

    if (isCMS) {
      return (
        <div key={section.id || index} className="cms-reorderable-section" style={{ position: 'relative' }}>
          <SectionControl index={index} total={array.length} onMove={(idx, dir) => reorderSections(idx, dir, 'section_layout', defaultLayout)} />
          {content}
        </div>
      );
    }

    return (
      <div key={section.id || index}>
        {content}
      </div>
    );
  };

  console.log("ServicesMain rendering with activeData:", activeData);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <SubNavbar title={activeData?.hero?.title || t('services_main.nav.title') || "Our Services"} anchors={servicesAnchors} />
      <div className="services-content-wrapper">
        {layout.map(renderSection)}
      </div>
    </div>
  );
};

export default ServicesMain;
