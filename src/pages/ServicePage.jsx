import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubNavbar from '../components/SubNavbar';
import SEO from '../components/SEO';
import ServiceHero from '../components/ServiceHero';
import ServiceStats from '../components/ServiceStats';
import ServiceCapabilities from '../components/ServiceCapabilities';
import ServiceCTA from '../components/ServiceCTA';
import ServiceCareers from '../components/ServiceCareers';

import FAQSection from '../components/FAQSection';
import ServiceCapabilityList from '../components/ServiceCapabilityList';
import RecognitionBanner from '../components/RecognitionBanner';
import { fetchAPI, getCachedData } from '../utils/api';
import { useVisualEditor } from '../context/VisualEditorContext';
import { EditableText } from '../components/Admin/Editable';
import { SectionControl } from './HomePage'; // Reusing the control component

const dataModulesEn = import.meta.glob('../data/*.js');
const dataModulesAr = import.meta.glob('../data/*.ar.js');

const ServicePage = () => {
  const { id: rawId } = useParams();
  const navigate = useNavigate();
  const { i18n, t: translate } = useTranslation();
  
  // Map Arabic slugs back to English IDs for data fetching
  const idMap = {
    'الأهداف': 'targets',
    'حلول-الذكاء-الاصطناعي': 'ai-solutions',
    'تطوير-التطبيقات': 'app-development',
    'العلامة-التجارية-والتصميم': 'branding-and-design',
    'التجارة-الإلكترونية': 'ecommerce',
    'خدمات-التسويق': 'marketing-services',
    'تطوير-الويب': 'web-development'
  };
  const id = idMap[rawId] || rawId;

  const collection = i18n.language === 'ar' ? `${id}.ar` : id;
  const initialData = getCachedData(`/content/${collection}`);

  const { isCMS, draftData, initDraft, reorderSections, setDataContext } = useVisualEditor();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialData) {
      setLoading(true);
    }
    setError(null);

    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? `${id}.ar` : id;
        let cmsData = await fetchAPI(`/content/${collection}`);
        
        // --- Fallback: If Arabic is missing, use English ---
        if (!cmsData && i18n.language === 'ar') {
          console.log(`Arabic content missing for ${id}, falling back to English`);
          cmsData = await fetchAPI(`/content/${id}`);
        }
        
        // 2. Load static fallback data
        let localData = null;
        let importFunc;
        if (i18n.language === 'ar') {
          importFunc = dataModulesAr[`../data/${id}.ar.js`];
          if (!importFunc) importFunc = dataModulesEn[`../data/${id}.js`];
        } else {
          importFunc = dataModulesEn[`../data/${id}.js`];
        }

        if (importFunc) {
          const module = await importFunc();
          localData = module.default;
        }

        if (isCMS) {
          // Initialize draft with CMS data or local fallback
          initDraft(cmsData || localData, collection);
        }

        if (cmsData) {
          if (!isCMS) {
            setData(cmsData);
            setDataContext(cmsData);
          }
          setLoading(false);
          return;
        }

        if (localData) {
          if (!isCMS) {
            setData({ ...localData });
            setDataContext(localData);
          }
          setLoading(false);
          return;
        }

        // 3. If in CMS mode and still no data found, create a new skeleton draft
        if (isCMS) {
          const skeletonData = {
            id: id,
            seo: { title: `New Service | IVY`, description: "New service description" },
            subnavigation: {
              title: "New Service",
              anchors: [
                { text: "Overview", href: "#hero" },
                { text: "Stats", href: "#stats" },
                { text: "Capabilities", href: "#mosaic" }
              ]
            },
            hero: {
              title: "New Service Title",
              subtitle: "Start describing your new service here.",
              image_src: "service_hero_illustration.png"
            },
            stats: {
              title: "Impact Metrics",
              cards: [
                { percentage: "99%", text: "Customer Satisfaction" },
                { percentage: "24/7", text: "Global Support" }
              ]
            },
            mosaic: {
              title: "Our Capabilities",
              cards: [
                { eyebrow: "TECH", title: "Cutting Edge", body: "We use the latest tech.", image: "service_phone.png" },
                { eyebrow: "DESIGN", title: "User Centric", body: "Beautiful interfaces.", image: "careers_office.png" }
              ]
            },
            section_layout: [
              { id: 'hero', visible: true },
              { id: 'stats', visible: true },
              { id: 'mosaic', visible: true },
              { id: 'banner_new_kind', visible: true },
              { id: 'faqs', visible: true }
            ],
            faqs: [
              { question: "New Question?", answer: "New Answer." }
            ],
            banner_new_kind: {
              title: "Ready to grow?",
              description: "Let's work together.",
              cta: { text: "Contact Us", href: "/contact" }
            }
          };
          initDraft(skeletonData, collection);
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load service data:", err);
        setError(translate('service_not_found') || "Service not found");
        setLoading(false);
      }
    };

    loadData();
  }, [id, i18n.language, isCMS]);

  const activeData = (isCMS && draftData) ? draftData : data;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{translate('common.loading') || "Loading..."}</h2>
      </div>
    );
  }

  if (error || (!activeData && !isCMS)) {
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
  const mappedStats = activeData.stats?.cards?.map(stat => ({
    value: stat.percentage,
    description: stat.text
  })) || [];

  // 2. Capabilities Mapping (Mosaic)
  const mappedCapabilities = activeData.mosaic?.cards?.map(card => ({
    // If it has an image but no title, it's pure 'image'. If it has both, 'mixed'. Else 'text'.
    type: (!card.title && card.image) ? 'image' : (card.image ? 'mixed' : 'text'),
    category: card.eyebrow,
    title: card.title,
    description: card.body,
    image: card.image ? (card.image.startsWith('http') ? card.image : `/${card.image}`) : null,
    linkUrl: card.cta_href,
    linkText: card.cta_text
  })) || [];

  // 3. Testimonials Mapping with safe fallbacks
  const mappedTestimonials = activeData.testimonials?.map((t, idx) => {
    const author = t.author || t.Author || "Client";
    const quote = t.quote || t.Quote || t.text || "";
    const role = t.role || t.Role || "";
    
    return {
      id: idx + 1,
      color: idx % 3 === 0 ? 'blue' : (idx % 3 === 1 ? 'red' : 'cyan'),
      shortTitle: author,
      description: quote ? `"${quote}"${role ? ` — ${role}` : ''}` : "",
      linkText: ''
    };
  }).filter(t => t.description !== "") || [];
  const anchorIds = activeData.subnavigation?.anchors
    ?.map(a => a.href?.startsWith('#') ? a.href.substring(1) : null)
    .filter(Boolean) || [];

  const getAnchorId = (index) => anchorIds[index] || `section-${index}`;

  // Build a default section layout if not provided by CMS
  const defaultLayout = [
    { id: 'hero', visible: !!activeData.hero },
    { id: 'stats', visible: !!activeData.stats },
    { id: 'capabilities_list', visible: !!activeData.capabilities_list },
    { id: 'mosaic', visible: !!activeData.mosaic },
    { id: 'targets_services', visible: !!activeData.targets_services },
    { id: 'testimonials', visible: !!activeData.testimonials },
    { id: 'banner_new_kind', visible: !!activeData.banner_new_kind },
    { id: 'faqs', visible: !!activeData.faqs },
    { id: 'sales_careers', visible: !!activeData.sales_careers }
  ];

  const layout = activeData.section_layout || defaultLayout;

  const renderSection = (section, index, array) => {
    if (!section.visible) return null;

    let content = null;
    let anchorIdx = index;

    switch (section.id) {
      case 'hero':
        content = (
          <ServiceHero
            title={activeData.hero?.title}
            description={activeData.hero?.subtitle}
            imageSrc={activeData.hero?.image_src ? (activeData.hero.image_src.startsWith('http') ? activeData.hero.image_src : `/${activeData.hero.image_src}`) : null}
            pathPrefix="hero"
          />
        );
        break;
      case 'stats':
        content = <ServiceStats title={activeData.stats?.title} stats={mappedStats} pathPrefix="stats" />;
        break;
      case 'capabilities_list':
        content = <ServiceCapabilityList headline={activeData.capabilities_list?.title} items={activeData.capabilities_list?.items} pathPrefix="capabilities_list" />;
        break;
      case 'mosaic':
        content = <ServiceCapabilities headline={activeData.mosaic?.title} capabilities={mappedCapabilities} pathPrefix="mosaic" />;
        break;
      case 'targets_services':
        content = (
          <section className="service-features-grid" style={{ padding: '80px 0', background: '#0a0a0a' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {activeData.targets_services?.map((svc, sIdx) => (
                  <div key={sIdx} className="feature-card" style={{ border: '1px solid #333', padding: '30px', borderRadius: '8px' }}>
                    <EditableText path={`targets_services.${sIdx}.title`} component="h3" style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#00aeef' }}>
                      {svc.title}
                    </EditableText>
                    <EditableText path={`targets_services.${sIdx}.description`} component="p" style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#ccc' }}>
                      {svc.description}
                    </EditableText>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
        break;
      case 'testimonials':
        content = <RecognitionBanner title={translate('common.testimonials') || "Customer Testimonials"} awards={mappedTestimonials} pathPrefix="testimonials" />;
        break;
      case 'banner_new_kind':
        content = (
          <ServiceCTA
            headline={activeData.banner_new_kind?.title}
            subheadline={activeData.banner_new_kind?.description}
            buttonText={activeData.banner_new_kind?.cta?.text}
            buttonLink={activeData.banner_new_kind?.cta?.href}
            pathPrefix="banner_new_kind"
          />
        );
        break;
      case 'faqs':
        content = <FAQSection faqs={activeData.faqs} pathPrefix="faqs" />;
        break;
      case 'sales_careers':
        content = (
          <ServiceCareers 
            title={activeData.sales_careers?.title}
            description={activeData.sales_careers?.description}
            buttonText={activeData.sales_careers?.cta?.text}
            buttonLink={activeData.sales_careers?.cta?.href}
            pathPrefix="sales_careers"
          />
        );
        break;
      default:
        content = null;
    }

    if (!content) return null;

    if (isCMS) {
      return (
        <div key={section.id || index} id={getAnchorId(anchorIdx)} className="cms-reorderable-section" style={{ position: 'relative' }}>
          <SectionControl 
            index={index} 
            total={array.length} 
            onMove={(idx, dir) => reorderSections(idx, dir, 'section_layout', defaultLayout)} 
          />
          {content}
        </div>
      );
    }

    return (
      <div key={section.id || index} id={getAnchorId(anchorIdx)}>
        {content}
      </div>
    );
  };

  return (
    <>
      <SEO seoData={activeData.seo} />
      <SubNavbar title={activeData.subnavigation?.title || "Service"} anchors={activeData.subnavigation?.anchors} />
      <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingBottom: '80px' }}>
        {layout.map(renderSection)}
      </div>
    </>
  );
};

export default ServicePage;

