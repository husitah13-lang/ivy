import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SubNavbar from '../components/SubNavbar';
import ArticleHero from '../components/ArticleHero';
import ArticleInBrief from '../components/ArticleInBrief';
import ArticleTextSection from '../components/ArticleTextSection';
import ArticleFAQSection from '../components/ArticleFAQSection';
import ArticleNumberedListSection from '../components/ArticleNumberedListSection';
import insightsDataEn from '../data/insights';
import articleContentEn from '../data/articleContent';
import { fetchAPI } from '../utils/api';

const ArticlePage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadContent = async () => {
      setLoading(true);
      try {
        let contentData = articleContentEn;
        let insightsData = insightsDataEn;

        // Try CMS first
        try {
          const contentCollection = i18n.language === 'ar' ? 'articleContent.ar' : 'articleContent';
          const insightsCollection = i18n.language === 'ar' ? 'insights.ar' : 'insights';
          
          const cmsContent = await fetchAPI(`/api/${contentCollection}`);
          const cmsInsights = await fetchAPI(`/api/${insightsCollection}`);
          
          if (cmsContent) contentData = cmsContent;
          if (cmsInsights) insightsData = cmsInsights;
        } catch (cmsErr) {
          console.warn("CMS fetch for article failed, using local fallback", cmsErr);
          if (i18n.language === 'ar') {
            const arContent = await import('../data/articleContent.ar.js');
            const arInsights = await import('../data/insights.ar.js');
            contentData = arContent.default;
            insightsData = arInsights.default;
          }
        }

        const content = contentData[id];
        
        if (content) {
          setArticle(content);
        } else {
          // Fallback for other articles (find in basic insights data)
          const foundArticle = insightsData.insights.find(item => item.cta_link && item.cta_link.includes(id));
          if (foundArticle) {
            setArticle({
              eyebrow: foundArticle.type,
              title: foundArticle.title,
              subtitle: foundArticle.body,
              readTime: i18n.language === 'ar' ? "قراءة في 5 دقائق" : "5-minute read",
              date: new Date(foundArticle.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              authors: [
                {
                  name: i18n.language === 'ar' ? "خبير آيفي" : "Ivy Expert",
                  title: i18n.language === 'ar' ? "قائد أول" : "Senior Leader",
                  linkedin: "#"
                }
              ]
            });
          }
        }
      } catch (error) {
        console.error("Failed to load article content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{t('common.loading_article')}</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h2>{t('common.article_not_found')}</h2>
      </div>
    );
  }

  const subNavbarTitle = i18n.language === 'ar' ? "منظور" : "Perspective";

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <SubNavbar title={article.eyebrow || subNavbarTitle} anchors={article.anchors || []} />
      
      <div id="overview">
        <ArticleHero 
          eyebrow={article.eyebrow}
          title={article.title}
          subtitle={article.subtitle}
          readTime={article.readTime}
          date={article.date}
          authors={article.authors}
        />
      </div>
      
      {article.inBrief && (
        <div id="in-brief">
          <ArticleInBrief points={article.inBrief} />
        </div>
      )}
      
      {article.introSection && (
        <ArticleTextSection 
          title={article.introSection.title} 
          paragraphs={article.introSection.paragraphs} 
        />
      )}
      
      {article.readinessSection && (
        <ArticleTextSection 
          title={article.readinessSection.title} 
          paragraphs={article.readinessSection.paragraphs} 
        />
      )}
      
      {article.realitiesSection && (
        <div id="realities">
          <ArticleFAQSection 
            title={article.realitiesSection.title}
            faqs={article.realitiesSection.faqs}
          />
        </div>
      )}
      
      {article.phasesSection && (
        <div id="phases">
          <ArticleNumberedListSection 
            title={article.phasesSection.title}
            intro={article.phasesSection.intro}
            items={article.phasesSection.items}
          />
        </div>
      )}

      {article.conclusionSection && (
        <div id="conclusion">
          <ArticleTextSection 
            title={article.conclusionSection.title} 
            paragraphs={article.conclusionSection.paragraphs} 
          />
        </div>
      )}
      
    </div>
  );
};

export default ArticlePage;
