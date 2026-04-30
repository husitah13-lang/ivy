import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './WhatWeThink.css';
import insightsDataEn from '../data/insights';
import CardSection from '../components/CardSection';
import { fetchAPI } from '../utils/api';

const WhatWeThink = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(insightsDataEn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const collection = i18n.language === 'ar' ? 'insights.ar' : 'insights';
        const cmsData = await fetchAPI(`/content/${collection}`);
        if (cmsData) {
          setData(cmsData);
        } else {
          // Fallback to static
          if (i18n.language === 'ar') {
            const arData = await import('../data/insights.ar.js');
            setData(arData.default);
          } else {
            setData(insightsDataEn);
          }
        }
      } catch (error) {
        console.warn("CMS fetch failed, using fallback:", error);
        // Static fallbacks
        if (i18n.language === 'ar') {
          const arData = await import('../data/insights.ar.js');
          setData(arData.default);
        } else {
          setData(insightsDataEn);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [i18n.language]);

  const { hero, filterCategories, sortOptions, insights } = data;

  // States for filters and sort
  const [activeFilters, setActiveFilters] = useState({
    Topic: "All",
    Industry: "All",
    "Content Type": "All"
  });

  // Effect to reset filters when language changes (categories keys/values change)
  useEffect(() => {
    if (!filterCategories) return;
    const keys = Object.keys(filterCategories);
    const initialFilters = {};
    keys.forEach(key => {
      initialFilters[key] = filterCategories[key][0]; // Usually "All" or "الكل"
    });
    setActiveFilters(initialFilters);
  }, [filterCategories]);

  const [activeSort, setActiveSort] = useState(sortOptions?.[0] || "Editor's picks");
  
  useEffect(() => {
    if (sortOptions?.length) {
      setActiveSort(sortOptions[0]);
    }
  }, [sortOptions]);

  const [openDropdown, setOpenDropdown] = useState(null);

  // Deriving the filtered and sorted list
  const filteredInsights = useMemo(() => {
    if (!insights) return [];
    let result = [...insights];

    // Filter Logic
    Object.entries(activeFilters).forEach(([category, activeValue]) => {
      const allText = filterCategories[category]?.[0];
      if (activeValue !== allText) {
        // Map the category to the data field
        const fieldMap = {
          "Topic": "topic",
          "الموضوع": "topic",
          "Industry": "industry",
          "الصناعة": "industry",
          "Content Type": "type",
          "نوع المحتوى": "type"
        };
        const field = fieldMap[category];
        if (field) {
          result = result.filter(item => item[field] === activeValue);
        }
      }
    });

    // Sort Logic
    const newestText = i18n.language === 'ar' ? "الأحدث" : "Newest";
    const oldestText = i18n.language === 'ar' ? "الأقدم" : "Oldest";

    if (activeSort === newestText) {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (activeSort === oldestText) {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [insights, activeFilters, activeSort, filterCategories, i18n.language]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleFilterSelect = (category, value) => {
    setActiveFilters(prev => ({ ...prev, [category]: value }));
    setOpenDropdown(null);
  };

  const handleSortSelect = (value) => {
    setActiveSort(value);
    setOpenDropdown(null);
  };

  if (loading) {
    return (
      <div className="insights-page" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#fff' }}>{t('common.loading')}</h2>
      </div>
    );
  }

  return (
    <div className="insights-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="insights-hero">
        <div className="insights-container">
          <h1 className="insights-title">{hero.title}</h1>
          <p className="insights-subtitle">{hero.description}</p>
        </div>
      </header>

      <section className="insights-filters">
        <div className="insights-container">
          <div className="filter-bar">
            {filterCategories && Object.entries(filterCategories).map(([category, options]) => (
              <div key={category} className="filter-item-wrapper">
                <div 
                  className={`filter-item ${openDropdown === category ? 'active' : ''}`}
                  onClick={() => toggleDropdown(category)}
                >
                  <span className="filter-plus">{openDropdown === category ? '−' : '+'}</span>
                  <span className="filter-label">{category}</span>
                  {activeFilters[category] !== options[0] && (
                    <span className="active-filter-tag">{activeFilters[category]}</span>
                  )}
                </div>
                
                {openDropdown === category && (
                  <div className="filter-dropdown">
                    {options.map(option => (
                      <div 
                        key={option} 
                        className={`dropdown-option ${activeFilters[category] === option ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect(category, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="sort-bar">
            <div className="sort-wrapper">
              <button 
                className={`sort-button ${openDropdown === 'sort' ? 'active' : ''}`}
                onClick={() => toggleDropdown('sort')}
              >
                {t('insights.sort_by')} {activeSort} <span className="sort-arrow">▾</span>
              </button>
              
              {openDropdown === 'sort' && sortOptions && (
                <div className="filter-dropdown sort-dropdown-list">
                  {sortOptions.map(option => (
                    <div 
                      key={option} 
                      className={`dropdown-option ${activeSort === option ? 'selected' : ''}`}
                      onClick={() => handleSortSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="insights-grid-section">
        {filteredInsights.length > 0 ? (
          <CardSection cards={filteredInsights} />
        ) : (
          <div className="no-results">
            <h3>{t('insights.no_results')}</h3>
            <button onClick={() => {
              const initialFilters = {};
              Object.keys(filterCategories).forEach(key => {
                initialFilters[key] = filterCategories[key][0];
              });
              setActiveFilters(initialFilters);
            }}>
              {t('insights.clear_filters')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default WhatWeThink;
