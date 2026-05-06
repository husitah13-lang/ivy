import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

const ContentEditor = ({ collectionName: propCollection }) => {
  const { theme, isDarkMode } = useOutletContext();
  const { collection: paramsCollection } = useParams();
  const collection = propCollection || paramsCollection;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrm';
    fetch(`${baseUrl}/api/content/${collection}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [collection, navigate]);

  const handleUpdateField = (path, value) => {
    setData(prev => {
      const newData = { ...prev };
      const parts = path.split('.');
      let current = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrm';
      const res = await fetch(`${baseUrl}/api/content/${collection}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setMessage('Changes saved successfully!');
      } else {
        setMessage('Error saving data');
      }
    } catch (e) {
      setMessage('Network error');
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: theme.textMuted, padding: '2rem' }}>Loading editor...</div>;
  if (!data) return <div style={{ color: '#ff4d4d', padding: '2rem' }}>Error loading data for {collection}</div>;

  const handleImageUpload = async (path, file) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrm';
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (result.url) {
        handleUpdateField(path, result.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const fieldMap = {
    'homepage': 'Homepage Content',
    'homepage.ar': 'Homepage Content (Arabic)',
    'services_main': 'Services Overview Page',
    'settings': 'Global Site Settings',
    'careers': 'Careers & Job Board',
    'contact': 'Contact & Offices',
    'insights': 'Blog & Perspectives',
    'insights.ar': 'Blog & Perspectives (Arabic)',
    'branding-and-design': 'Branding & Design Page',
    'branding-and-design.ar': 'Branding & Design Page (Arabic)',
    'layout': 'Global Layout (Nav & Footer)',
    'layout.ar': 'Global Layout (Arabic)',
    'targets': 'Targets Live Page',
    'targets.ar': 'Targets Live Page (Arabic)',
    'ai-solutions': 'AI Solutions Page',
    'ai-solutions.ar': 'AI Solutions Page (Arabic)',
    'app-development': 'App Development Page',
    'app-development.ar': 'App Development Page (Arabic)',
    'business-intelligence': 'Business Intelligence Page',
    'business-intelligence.ar': 'Business Intelligence Page (Arabic)',
    'ecommerce': 'Ecommerce Page',
    'ecommerce.ar': 'Ecommerce Page (Arabic)',
    'marketing-services': 'Marketing Services Page',
    'marketing-services.ar': 'Marketing Services Page (Arabic)',
    'saas-platforms': 'SaaS Platforms Page',
    'saas-platforms.ar': 'SaaS Platforms Page (Arabic)',
    'talent-training': 'Talent & Training Page',
    'talent-training.ar': 'Talent & Training Page (Arabic)',
    'web-development': 'Web Development Page',
    'web-development.ar': 'Web Development Page (Arabic)',
    'section_layout': 'Page Structure / Sections Order',
    'visible': 'Is Section Visible?',
    'name': 'Section Display Name',
    'title_lines': 'Main Headline Lines (Supports HTML)',
    'hero_slides': 'Hero Content Slides',
    'subtitle': 'Slide Subtitle / Heading',
    'description': 'Slide Description Paragraph',
    'cta_link': 'Button Link (URL)',
    'cta_text': 'Button Text',
    'body_text': 'Main Hero Description (Left Side)',
    'eyebrow': 'Small Header (Eyebrow)',
    'sub_headline': 'Subtitle',
    'iframe_url': 'Job Board Web Address (URL)',
    'value360': 'Methodology Section',
    'client_carousel': 'Success Stories',
    'awards': 'Testimonials & Awards',
    'articleContent': 'Detailed Articles (EN)',
    'articleContent.ar': 'Detailed Articles (AR)',
    'inBrief': 'Article Highlights (In Brief)',
    'introSection': 'Introduction Section',
    'readinessSection': 'Readiness/Strategy Section',
    'realitiesSection': 'Market Realities (FAQ Style)',
    'phasesSection': 'Implementation Phases',
    'conclusionSection': 'Conclusion & Final Thoughts',
    'faqs': 'Questions & Answers',
    'points': 'Bullet Points',
    'paragraphs': 'Content Paragraphs',
    'items': 'List Items / Entries',
    'readTime': 'Estimated Reading Time',
    'authors': 'Article Authors',
    'eyebrow': 'Small Category Header',
    'anchors': 'Sticky Navigation Links'
  };

  const getLabel = (key) => {
    if (fieldMap[key]) return fieldMap[key];
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Recursive renderer for nested objects
  const renderFields = (obj, prefix = '') => {
    const keys = Object.keys(obj);
    
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {keys.map(key => {
          const value = obj[key];
          const path = prefix ? `${prefix}.${key}` : key;
          const label = getLabel(key);
          const isFullWidth = Array.isArray(value) || (typeof value === 'string' && value.length > 100) || (typeof value === 'object' && value !== null);

          if (Array.isArray(value)) {
            return (
              <div key={path} style={{ gridColumn: '1 / -1', marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.03)', border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '1.2rem', color: theme.accent, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>☰</span> {label}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                  {value.map((item, index) => (
                    <div key={`${path}.${index}`} style={{ padding: '1.2rem', background: theme.card, borderRadius: '8px', border: `1px solid ${theme.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h5 style={{ color: theme.textMuted, fontSize: '0.75rem', fontWeight: 'bold' }}>{label} #{index + 1}</h5>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              const newArr = [...value];
                              const item = newArr.splice(index, 1)[0];
                              newArr.splice(Math.max(0, index - 1), 0, item);
                              handleUpdateField(path, newArr);
                            }}
                            style={{ background: '#f0f0f0', border: '1px solid #ddd', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => {
                              const newArr = [...value];
                              const item = newArr.splice(index, 1)[0];
                              newArr.splice(index + 1, 0, item);
                              handleUpdateField(path, newArr);
                            }}
                            style={{ background: '#f0f0f0', border: '1px solid #ddd', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Remove this item?")) {
                                const newArr = [...value];
                                newArr.splice(index, 1);
                                handleUpdateField(path, newArr);
                              }
                            }}
                            style={{ background: '#fff0f0', color: '#ff4d4d', border: '1px solid #ffdada', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      {typeof item === 'object' ? renderFields(item, `${path}.${index}`) : (
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newArr = [...value];
                            newArr[index] = e.target.value;
                            handleUpdateField(path, newArr);
                          }}
                          style={{ width: '100%', padding: '0.6rem', border: `1px solid ${theme.border}`, borderRadius: '4px' }}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newArr = [...value];
                      const template = value.length > 0 ? (typeof value[0] === 'object' ? { ...JSON.parse(JSON.stringify(value[0])) } : '') : '';
                      if (typeof template === 'object') {
                        Object.keys(template).forEach(k => template[k] = '');
                      }
                      newArr.push(template);
                      handleUpdateField(path, newArr);
                    }}
                    style={{ padding: '1rem', background: '#fff', border: `2px dashed ${theme.border}`, color: theme.accent, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    + Add {label.replace(/s$/, '')}
                  </button>
                </div>
              </div>
            );
          }

          if (typeof value === 'object' && value !== null) {
            return (
              <div key={path} style={{ gridColumn: '1 / -1', marginBottom: '1rem', padding: '1.2rem', border: `1px solid ${theme.border}`, borderRadius: '8px', background: '#fff' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: theme.accent, fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</h4>
                {renderFields(value, path)}
              </div>
            );
          }

          const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('src') || key.toLowerCase().includes('url');

          return (
            <div key={path} style={{ gridColumn: isFullWidth ? '1 / -1' : 'auto', marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#666', marginBottom: '0.4rem' }}>{label}</label>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ flex: 1 }}>
                  {value.length > 100 ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleUpdateField(path, e.target.value)}
                      style={{ width: '100%', height: '100px', padding: '0.75rem', border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '0.9rem', lineHeight: '1.5' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleUpdateField(path, e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                  )}
                </div>
                {isImage && (
                  <div style={{ width: '80px' }}>
                    <div style={{ width: '80px', height: '50px', background: '#f5f5f5', border: `1px solid ${theme.border}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0.3rem' }}>
                      {value ? <img src={value.startsWith('http') ? value : `${import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrm'}${value}`} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.5rem', color: '#999' }}>No Image</span>}
                    </div>
                    <input
                      type="file"
                      id={`file-${path}`}
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(path, e.target.files[0])}
                    />
                    <label
                      htmlFor={`file-${path}`}
                      style={{ display: 'block', textAlign: 'center', fontSize: '0.65rem', padding: '0.2rem', background: '#eee', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Upload
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: '-2rem',
        zIndex: 100,
        background: theme.bg,
        padding: '1.5rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: `1px solid ${theme.border}`,
        width: '100%'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: theme.text, letterSpacing: '-0.5px' }}>{collection.replace(/-/g, ' ').toUpperCase()}</h1>
          <p style={{ fontSize: '0.9rem', color: theme.textMuted, marginTop: '0.3rem' }}>Configure the content for this page</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a
            href={collection === 'homepage' ? window.location.origin : (collection === 'services_main' ? `${window.location.origin}/services` : `${window.location.origin}/services/${collection}`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.textMuted,
              fontSize: '0.9rem',
              textDecoration: 'none',
              borderBottom: `1px solid ${theme.border}`,
              paddingBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Preview Page <span style={{ fontSize: '1rem' }}>↗</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.9rem 2rem',
              background: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 15px ${theme.accent}44`
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accent}66`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 15px ${theme.accent}44`;
            }}
          >
            {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div style={{ background: theme.card, padding: '2.5rem', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)' }}>
        {renderFields(data)}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ContentEditor;
