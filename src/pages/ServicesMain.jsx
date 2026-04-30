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

const ServicesMain = () => {
  const { t } = useTranslation();
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAPI('/api/services_main');
        if (data) setCmsData(data);
      } catch (err) {
        console.warn("CMS services_main fetch failed", err);
      }
    };
    loadData();
  }, []);

  const capabilitiesData = cmsData?.capabilities || [0, 1, 2, 3, 4, 5, 6].map(i => ({
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

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      <SubNavbar title={t('services_main.nav.title')} anchors={servicesAnchors} />
      <div id="overview">
        <ServicesHero 
          image={cmsData?.hero?.image || "/business_reinvention_hero.png"}
          title={cmsData?.hero?.title || t('services_main.hero.title')}
          subtitle={cmsData?.hero?.subtitle || t('services_main.hero.subtitle')}
        />
      </div>
      <div id="capabilities">
        <CapabilitiesShowcase capabilities={capabilitiesData} />
      </div>
      <div id="partners">
        <PartnersSection />
      </div>
      <div id="industries">
        <IndustryShowcase industries={industriesData} />
      </div>
      <div id="recognition">
        <RecognitionBanner 
          title={t('services_main.recognition.title')} 
          awards={ivyAwardsData}
        />
      </div>
    </div>
  );
};

export default ServicesMain;
