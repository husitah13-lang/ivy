import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubNavbar from '../components/SubNavbar';
import SEO from '../components/SEO';
import ArticleHero from '../components/ArticleHero';
import ArticleInBrief from '../components/ArticleInBrief';
import ArticleTextSection from '../components/ArticleTextSection';
import ArticleFAQSection from '../components/ArticleFAQSection';
import ArticleNumberedListSection from '../components/ArticleNumberedListSection';
import insightsDataEn from '../data/insights.json';
import articleContentEn from '../data/articleContent.json';
import { fetchAPI } from '../utils/api';
import { useVisualEditor } from '../context/VisualEditorContext';

const ArticlePage = () => {
  const { id: rawId } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectionData, setCollectionData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  
  const idMap = {
    "1": "ai-superhighway",
    "2": "ai-upstream-energy",
    "3": "cloud-foundation",
    "4": "talent-reinventors",
    "5": "supply-chain",
    "6": "digital-identity",
    "7": "tech-vision",
    "8": "sustainable-tech"
  };
  const id = idMap[rawId] || rawId;

  const { isCMS, draftData, initDraft, setDataContext, updateField } = useVisualEditor();

  const getSkeleton = () => ({
    id: id,
    title: "New Article Title",
    subtitle: "Enter a subtitle here...",
    eyebrow: i18n.language === 'ar' ? "منظور" : "Perspective",
    writtenByLabel: i18n.language === 'ar' ? "بقلم" : "Written by",
    readTime: "5-minute read",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    authors: [{ name: "Author Name", title: "Job Title", linkedin: "#" }],
    inBrief: ["Add a key point...", "Add another point..."],
    introSection: { title: "Introduction", paragraphs: ["Start writing here..."] },
    readinessSection: { title: "Strategic Readiness", paragraphs: ["Add readiness details..."] },
    realitiesSection: { title: "Strategic Realities", faqs: [{ question: "Add Reality", answer: "Details..." }] },
    phasesSection: { title: "Implementation Phases", phases: [{ title: "Phase 1", description: "Details..." }] },
    conclusionSection: { title: "Conclusion", paragraphs: ["Final thoughts..."] }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadContent = async () => {
      setLoading(true);
      try {
        const contentCollection = i18n.language === 'ar' ? 'articleContent.ar' : 'articleContent';
        const insightsCollection = i18n.language === 'ar' ? 'insights.ar' : 'insights';
        
        // Fetch data
        const cmsContent = await fetchAPI(`/content/${contentCollection}`);
        const cmsInsights = await fetchAPI(`/content/${insightsCollection}`);
        
        // Smart Merge: Prioritize CMS, fallback to local
        let contentData = articleContentEn;
        if (cmsContent) {
          if (Array.isArray(cmsContent) && Array.isArray(articleContentEn)) {
            // Merge arrays: CMS items override local items with same ID
            contentData = [...cmsContent, ...articleContentEn.filter(local => !cmsContent.find(cms => cms.id === local.id))];
          } else {
            // Merge objects
            contentData = { ...articleContentEn, ...cmsContent };
          }
        }

        let resolvedInsights = insightsDataEn;
        if (cmsInsights && cmsInsights.insights) {
          const cmsList = cmsInsights.insights;
          const localList = insightsDataEn.insights || [];
          const mergedList = [...cmsList, ...localList.filter(local => !cmsList.find(cms => cms.id === local.id))];
          resolvedInsights = { ...insightsDataEn, insights: mergedList };
        }

        // Arabic Fallback for missing CMS data
        if (!cmsContent && i18n.language === 'ar') {
          try {
            const arContent = await import('../data/articleContent.ar.json');
            contentData = arContent.default;
            const arInsights = await import('../data/insights.ar.json');
            resolvedInsights = arInsights.default;
          } catch (e) {}
        }

        setCollectionData(contentData);
        setInsightsData(resolvedInsights);

        if (isCMS) {
          initDraft(contentData, contentCollection);
        } else {
          setDataContext(contentData);
        }

        // Find the specific article
        let found = Array.isArray(contentData) 
          ? contentData.find(item => item.id?.toString() === id.toString())
          : contentData[id];

        if (!found) {
           // Try finding by slug in insights mapping
           const insightsList = resolvedInsights?.insights || [];
           const info = insightsList.find(i => i.id?.toString() === id.toString() || i.cta_link?.endsWith(`/${id}`));
           if (info) {
             const slug = info.id || info.cta_link?.split('/').pop();
             found = Array.isArray(contentData) ? contentData.find(item => item.id === slug) : contentData[slug];
           }
        }

        setArticle(found);
      } catch (error) {
        console.error("Load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, i18n.language, isCMS]);

  // Effect to handle new article initialization in CMS
  useEffect(() => {
    if (isCMS && draftData && id && !loading) {
      const exists = Array.isArray(draftData) 
        ? draftData.find(item => item.id?.toString() === id.toString())
        : draftData[id];
      
      if (!exists && !Array.isArray(draftData)) {
        // Initialize the new article in draftData
        updateField(id, getSkeleton());
      }
    }
  }, [isCMS, draftData, id, loading]);

  // Use draft data if in CMS mode, otherwise use local state
  const activeCollection = (isCMS && draftData) ? draftData : collectionData;
  let activeArticle = article;
  
  if (activeCollection && id) {
    const matched = Array.isArray(activeCollection) 
      ? activeCollection.find(item => item.id?.toString() === id.toString())
      : activeCollection[id];
    if (matched) activeArticle = matched;
  }

  if (loading && !activeArticle) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{t('common.loading_article')}</h2>
      </div>
    );
  }

  if (!activeArticle) {
    if (isCMS) {
      // Create a skeleton for new articles
      activeArticle = {
        id: id,
        title: "New Article Title",
        subtitle: "Enter a subtitle here...",
        eyebrow: i18n.language === 'ar' ? "منظور" : "Perspective",
        readTime: "5-minute read",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        authors: [{ name: "Author Name", title: "Job Title", linkedin: "#" }],
        inBrief: ["Add a key point...", "Add another point..."],
        introSection: { title: "Introduction", paragraphs: ["Start writing here..."] },
        readinessSection: { title: "Strategic Readiness", paragraphs: ["Add readiness details..."] },
        realitiesSection: { title: "Strategic Realities", faqs: [{ question: "Add Reality", answer: "Details..." }] },
        phasesSection: { title: "Implementation Phases", phases: [{ title: "Phase 1", description: "Details..." }] },
        conclusionSection: { title: "Conclusion", paragraphs: ["Final thoughts..."] }
      };
    } else {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
          <h2>Article Not Found</h2>
        </div>
      );
    }
  }

  const subNavbarTitle = i18n.language === 'ar' ? "Ù…Ù†Ø¸ÙˆØ±" : "Perspective";

  return (
    <div className="article-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <SEO title={`${activeArticle.title} | IVY Insights`} description={activeArticle.subtitle} />
      <SubNavbar title={subNavbarTitle} backLink="/what-we-think" backText={t('common.back_to_insights')} />
      
      <ArticleHero {...activeArticle} pathPrefix={id} />
      
      <div id="brief">
        <ArticleInBrief points={activeArticle.inBrief || activeArticle.points || (isCMS ? ["Point 1", "Point 2"] : [])} pathPrefix={`${id}.inBrief`} />
      </div>

      <div id="intro">
        <ArticleTextSection 
          title={activeArticle.introSection?.title || (isCMS ? "Introduction" : "")} 
          paragraphs={activeArticle.introSection?.paragraphs || activeArticle.paragraphs || (isCMS ? ["Start writing here..."] : [])} 
          pathPrefix={`${id}.introSection`}
        />
      </div>

      <div id="readiness">
        <ArticleTextSection 
          title={activeArticle.readinessSection?.title || (isCMS ? "Strategic Readiness" : "")} 
          paragraphs={activeArticle.readinessSection?.paragraphs || (isCMS ? ["Add readiness details..."] : [])} 
          pathPrefix={`${id}.readinessSection`}
          variant="readiness"
        />
      </div>

      <div id="realities">
        <ArticleFAQSection 
          title={activeArticle.realitiesSection?.title || (isCMS ? "Strategic Realities" : "")} 
          faqs={activeArticle.realitiesSection?.faqs || (isCMS ? [{ question: "Add Reality", answer: "Details..." }] : [])} 
          pathPrefix={`${id}.realitiesSection`}
        />
      </div>

      <div id="phases">
        <ArticleNumberedListSection 
          title={activeArticle.phasesSection?.title || (isCMS ? "Implementation Phases" : "")} 
          phases={activeArticle.phasesSection?.phases || (isCMS ? [{ title: "Phase 1", description: "Details..." }] : [])} 
          pathPrefix={`${id}.phasesSection`}
        />
      </div>

      <div id="conclusion">
        <ArticleTextSection 
          title={activeArticle.conclusionSection?.title || (isCMS ? "Conclusion" : "")} 
          paragraphs={activeArticle.conclusionSection?.paragraphs || (isCMS ? ["Final thoughts..."] : [])} 
          pathPrefix={`${id}.conclusionSection`}
          variant="conclusion"
        />
      </div>
    </div>
  );
};

export default ArticlePage;
