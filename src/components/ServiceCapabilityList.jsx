import React from 'react';
import './ServiceCapabilityList.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ServiceCapabilityList = ({ headline, items = [], pathPrefix }) => {
  const { isCMS, updateField, draftData } = useVisualEditor();

  const addItem = () => {
    const currentItems = draftData?.[pathPrefix]?.items || items || [];
    const newItems = [...currentItems, "New Capability Item"];
    updateField(`${pathPrefix}.items`, newItems);
  };

  const removeItem = (index) => {
    const currentItems = draftData?.[pathPrefix]?.items || items || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    updateField(`${pathPrefix}.items`, newItems);
  };

  if (!isCMS && (!items || items.length === 0)) return null;

  return (
    <section className="service-capability-list">
      <div className="capability-list-container">
        <div className="capability-list-header">
          <span className="capability-eyebrow">CAPABILITIES</span>
          {headline && (
            <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="capability-list-headline" placeholder="Enter Headline...">
              {headline}
            </EditableText>
          )}
        </div>
        
        <div className="capability-items-grid">
          {(items || []).map((item, index) => (
            <div key={index} className="capability-item" style={{ position: 'relative' }}>
              {isCMS && (
                <button 
                  onClick={() => removeItem(index)}
                  title="Remove"
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '-20px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
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
              <div className="capability-dot"></div>
              <EditableText 
                path={pathPrefix ? `${pathPrefix}.items.${index}` : `items.${index}`} 
                component="span" 
                className="capability-name"
                placeholder="Capability name..."
              >
                {item}
              </EditableText>
            </div>
          ))}

          {isCMS && (
            <div 
              onClick={addItem}
              className="capability-item add-capability-item"
              style={{
                border: '1px dashed rgba(255,255,255,0.3)',
                padding: '5px 15px',
                cursor: 'pointer',
                opacity: 0.6,
                fontSize: '0.9rem'
              }}
            >
              + Add Item
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceCapabilityList;
