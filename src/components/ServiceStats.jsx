import React from 'react';
import './ServiceStats.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ServiceStats = ({ title, stats, pathPrefix }) => {
  const { isCMS, updateField, draftData } = useVisualEditor();

  const addItem = () => {
    const currentCards = draftData?.[pathPrefix]?.cards || [];
    const newCards = [...currentCards, { percentage: "100%", text: "New Achievement" }];
    updateField(`${pathPrefix}.cards`, newCards);
  };

  const removeItem = (index) => {
    const currentCards = draftData?.[pathPrefix]?.cards || [];
    const newCards = currentCards.filter((_, i) => i !== index);
    updateField(`${pathPrefix}.cards`, newCards);
  };

  if (!isCMS && (!stats || stats.length === 0)) return null;

  return (
    <section className="service-stats">
      <div className="service-stats-container">
        {title && (
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="service-stats-title">
            {title}
          </EditableText>
        )}
        <div className="service-stats-grid">
          {(stats || []).map((stat, index) => (
            <div key={index} className="stat-item" style={{ position: 'relative' }}>
              {isCMS && (
                <button 
                  onClick={() => removeItem(index)}
                  title="Remove Stat"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '10px',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              )}
              <div className="stat-divider"></div>
              <EditableText 
                path={pathPrefix ? `${pathPrefix}.cards.${index}.percentage` : `cards.${index}.percentage`} 
                component="div" 
                className="stat-value"
              >
                {stat.value}
              </EditableText>
              <EditableText 
                path={pathPrefix ? `${pathPrefix}.cards.${index}.text` : `cards.${index}.text`} 
                component="div" 
                className="stat-description"
              >
                {stat.description}
              </EditableText>
            </div>
          ))}
          
          {isCMS && (
            <div 
              onClick={addItem}
              className="stat-item add-stat-item"
              style={{
                border: '1px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                minHeight: '100px'
              }}
            >
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>+ Add Stat</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceStats;
