import React from 'react';
import './ArticleInBrief.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const ArticleInBrief = ({ points = [], pathPrefix }) => {
  const { isCMS, updateField } = useVisualEditor();

  const addItem = () => {
    const newItems = [...points, "New summary point..."];
    updateField(pathPrefix ? `${pathPrefix}` : 'points', newItems);
  };

  const removeItem = (index) => {
    const newItems = points.filter((_, i) => i !== index);
    updateField(pathPrefix ? `${pathPrefix}` : 'points', newItems);
  };

  if (!isCMS && (!points || points.length === 0)) return null;

  return (
    <section className="article-in-brief">
      <div className="article-in-brief-container">
        <h2 className="article-in-brief-title">In brief</h2>
        <ul className="article-in-brief-list">
          {(Array.isArray(points) ? points : (points ? [points] : [])).map((point, index) => (
            <li key={index} style={{ position: 'relative' }}>
              {isCMS && (
                <button 
                  onClick={() => removeItem(index)}
                  className="cms-remove-item-btn"
                  title="Remove Point"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '-30px',
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
              <EditableText path={pathPrefix ? `${pathPrefix}.${index}` : `${index}`} component="span">
                {point}
              </EditableText>
            </li>
          ))}
        </ul>

        {isCMS && (
          <button 
            onClick={addItem}
            className="cms-add-item-btn"
            style={{
              marginTop: '15px',
              padding: '6px 15px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px dashed rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            + Add Point
          </button>
        )}
      </div>
    </section>
  );
};

export default ArticleInBrief;
