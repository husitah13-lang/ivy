import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { EditableText } from '../components/Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';
import { fetchAPI } from '../utils/api';
import './LegalPage.css';

import { privacyContent, termsContent, accessibilityContent } from '../data/content/legal';
import { privacyContentAr, termsContentAr, accessibilityContentAr } from '../data/content/legal.ar';

const LegalPage = ({ type }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isCMS, draftData, initDraft } = useVisualEditor();
  
  // Determine page type if not explicitly passed
  const pageType = type || location.pathname.split('/').pop();
  
  // Select fallback data based on type
  const getFallbackData = () => {
    const isAr = i18n.language === 'ar';
    if (pageType === 'privacy') return isAr ? privacyContentAr : privacyContent;
    if (pageType === 'terms') return isAr ? termsContentAr : termsContent;
    if (pageType === 'accessibility') return isAr ? accessibilityContentAr : accessibilityContent;
    return isAr ? privacyContentAr : privacyContent; // default
  };

  const [data, setData] = useState(getFallbackData());

  // Reset data when pageType changes
  useEffect(() => {
    setData(getFallbackData());
  }, [pageType, i18n.language]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collectionName = pageType === 'privacy' ? 'privacy' : pageType === 'terms' ? 'terms' : 'accessibility';
        const collection = i18n.language === 'ar' ? `${collectionName}.ar` : collectionName;
        const fallback = getFallbackData();
        const fetched = await fetchAPI(`/content/${collection}`);
        const active = fetched || fallback;
        setData(active);
        if (isCMS) initDraft(active, collection);
      } catch (err) {
        console.error(`Failed to load ${pageType}:`, err);
      }
    };
    loadData();
  }, [pageType, i18n.language, isCMS]);

  const activeData = (isCMS && draftData) ? draftData : data;

  if (!activeData) return null;

  return (
    <div className="legal-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <SEO seoData={activeData.seo} />
      
      <EditableText path="header" component="div" className="legal-header-label">
        {activeData.header}
      </EditableText>
      
      <EditableText path="title" component="h1" className="legal-title">
        {activeData.title}
      </EditableText>
      
      <div className="legal-gradient-divider"></div>
      
      <div className="legal-body">
        <EditableText path="body" component="div" richText={true}>
          {activeData.body}
        </EditableText>
      </div>
    </div>
  );
};

export default LegalPage;
