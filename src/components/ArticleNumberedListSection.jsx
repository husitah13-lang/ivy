import React from 'react';
import './ArticleNumberedListSection.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ArticleNumberedListSection = ({ title, intro, items = [], pathPrefix }) => {
  const { isCMS, updateField } = useVisualEditor();

  const addItem = () => {
    const newItems = [...items, { title: "New Step", text: "Step description goes here..." }];
    updateField(pathPrefix ? `${pathPrefix}.items` : 'items', newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateField(pathPrefix ? `${pathPrefix}.items` : 'items', newItems);
  };

  if (!isCMS && (!items || items.length === 0)) return null;

  return (
    <section className="article-numbered-section">
      <div className="article-numbered-container">
        {title && (
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="article-numbered-title">
            {title}
          </EditableText>
        )}
        {intro && (
          <EditableText path={pathPrefix ? `${pathPrefix}.intro` : 'intro'} component="p" className="article-numbered-intro">
            {intro}
          </EditableText>
        )}
        
        <div className="article-numbered-list">
          {(items || []).map((item, index) => (
            <div key={index} className="article-numbered-item" style={{ position: 'relative' }}>
              {isCMS && (
                <button 
                  onClick={() => removeItem(index)}
                  className="cms-remove-item-btn"
                  title="Remove Item"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '-30px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    zIndex: 10
                  }}
                >
                  ×
                </button>
              )}
              <div className="article-numbered-index">{index + 1}.</div>
              <div className="article-numbered-content">
                {item.title && (
                  <EditableText path={pathPrefix ? `${pathPrefix}.items.${index}.title` : `items.${index}.title`} component="strong">
                    {item.title}{' '}
                  </EditableText>
                )}
                <EditableText path={pathPrefix ? `${pathPrefix}.items.${index}.text` : `items.${index}.text`} component="span">
                  {item.text}
                </EditableText>
              </div>
            </div>
          ))}

          {isCMS && (
            <button 
              onClick={addItem}
              className="cms-add-item-btn"
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px dashed rgba(255,255,255,0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              + Add Step Item
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleNumberedListSection;
