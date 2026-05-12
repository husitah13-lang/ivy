import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardSection.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

// To maintain the visual pattern from the original design
const visualPatterns = [
  { type: 'light', image: '/careers_office.png', anim: 'reveal-up' },
  { type: 'dark', image: '/purple_ai_wave.png', anim: 'reveal-scale' },
  { type: 'light', image: '/service_phone.png', anim: 'reveal-right' },
  { type: 'dark', image: '/talent_reinventors.png', anim: 'reveal-left' },
  { type: 'dark', image: '/service_train.png', anim: 'reveal-blur' },
  { type: 'light', image: '/service_hero_illustration.png', anim: 'reveal-zoom' },
  { type: 'dark', image: '/service_posters.png', anim: 'reveal-up' },
  { type: 'light', image: '/julie_sweet.png', anim: 'reveal-scale' }
];

const CardSection = ({ cards = [], id, basePath = '/services', pathPrefix = 'tilegrid' }) => {
  const navigate = useNavigate();
  const { isCMS, updateField, draftData } = useVisualEditor();

  const addCard = () => {
    const fullList = draftData[pathPrefix] || cards;
    const newId = `new-insight-${Date.now()}`;
    const newCards = [...fullList, {
      id: newId,
      title: "New Item Title",
      body: "Describe this new item here...",
      type: "Perspective",
      cta_text: "Read more",
      cta_link: basePath === '/services' ? `/services/${newId}` : `/what-we-think/${newId}`,
      date: new Date().toISOString().split('T')[0]
    }];
    updateField(pathPrefix, newCards);
  };

  const removeCard = (e, index) => {
    e.stopPropagation();
    const fullList = draftData[pathPrefix] || cards;
    const realIndex = cards[index].originalIndex !== undefined ? cards[index].originalIndex : index;
    const newCards = fullList.filter((_, i) => i !== realIndex);
    updateField(pathPrefix, newCards);
  };

  return (
    <section id={id} className="card-section">
      <div className="card-grid">
        {cards.map((card, index) => {
          const realIndex = card.originalIndex !== undefined ? card.originalIndex : index;
          const pattern = visualPatterns[index % visualPatterns.length];
          const routeId = card.cta_link ? card.cta_link.replace('.html', '').replace(/^\//, '') : card.id;

          return (
            <div
              key={card.id || index}
              className={`content-card ${pattern.type} anim-${pattern.anim}`}
              onClick={() => {
                if (isCMS) return; // Prevent navigation in CMS mode for cards
                if (card.cta_link && card.cta_link.startsWith('/')) {
                  navigate(card.cta_link);
                } else {
                  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
                  const cleanRouteId = routeId.toString().startsWith('/') ? routeId.toString().slice(1) : routeId;
                  navigate(`${cleanBasePath}/${cleanRouteId}`);
                }
              }}
              style={{ position: 'relative' }}
            >
              {isCMS && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 100, display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => removeCard(e, index)}
                    title="Remove this tile"
                    style={{
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}
                  >
                    ×
                  </button>
                  <button 
                    className="cms-image-swap-btn"
                    title="Change the background image of this tile"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (event) => {
                        const file = event.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrms';
                        const token = localStorage.getItem('adminToken');
                        try {
                          const res = await fetch(`${baseUrl}/api/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const result = await res.json();
                          if (result.url) {
                            updateField(`${pathPrefix}.${realIndex}.image`, result.url);
                          }
                        } catch (err) {
                          console.error("Upload failed", err);
                        }
                      };
                      input.click();
                    }}
                    style={{
                      background: 'rgba(0,174,239,0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}
                  >
                    Change Image
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </button>
                  <button 
                    className="cms-navigate-btn"
                    title="Navigate to this page to edit it"
                    onClick={(e) => {
                      e.stopPropagation();
                      let targetUrl = '';
                      if (card.cta_link && card.cta_link.startsWith('/')) {
                        targetUrl = `/admin${card.cta_link}`;
                      } else {
                        const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
                        const cleanRouteId = routeId.toString().startsWith('/') ? routeId.toString().slice(1) : routeId;
                        targetUrl = `/admin${cleanBasePath}/${cleanRouteId}`;
                      }
                      navigate(targetUrl);
                    }}
                    style={{
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}
                  >
                    Edit Page
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              )}

              {/* Image layer that will swipe to the right */}
              <div 
                className="card-image-layer" 
                style={{ backgroundImage: `url(${card.image || pattern.image})` }}
              >
                <div className="card-image-overlay">
                  <EditableText path={`${pathPrefix}.${realIndex}.title`} component="h3" className="card-image-title">
                    {card.title}
                  </EditableText>
                </div>
              </div>

              <div className="card-content">
                <span className="card-category">{card.type}</span>
                <EditableText path={`${pathPrefix}.${realIndex}.title`} component="h3" className="card-title">
                  {card.title}
                </EditableText>

                <div className="card-body">
                  <EditableText path={`${pathPrefix}.${realIndex}.body`} component="p" className="card-description">
                    {card.body}
                  </EditableText>
                  <div className="card-expand-container">
                    <div className="card-expand">
                      {card.cta_text || 'Expand'}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isCMS && (
          <div 
            className="content-card add-new-card"
            onClick={addCard}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              minHeight: '400px'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }}>+</div>
            <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>Add New Tile</div>
          </div>
        )}
      </div>
    </section>
  );
};


export default CardSection;
