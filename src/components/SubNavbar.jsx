import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SubNavbar.css';
import { EditableText } from './Admin/Editable';
import { useVisualEditor } from '../context/VisualEditorContext';

const SubNavbar = ({ title, anchors = [] }) => {
  const [isTop, setIsTop] = useState(false);
  const location = useLocation();
  const { isCMS, updateField } = useVisualEditor();

  const addAnchor = () => {
    const newAnchors = [...anchors, { text: "New Section", href: "#new-section" }];
    updateField('subnavigation.anchors', newAnchors);
  };

  const removeAnchor = (e, index) => {
    e.stopPropagation();
    const newAnchors = anchors.filter((_, i) => i !== index);
    updateField('subnavigation.anchors', newAnchors);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname.startsWith('/service') || location.pathname.startsWith('/what-we-think/')) {
        if (window.scrollY > 50) {
          setIsTop(true);
        } else {
          setIsTop(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleAnchorClick = (e, href) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const offset = 60;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className={`sub-navbar ${isTop ? 'sub-navbar-top' : ''}`}>
      <div className="sub-navbar-container">
        <div className="sub-navbar-left">
          <EditableText path="subnavigation.title" component="span" className="sub-navbar-title" placeholder="Page Title...">
            {title || 'Marketing & Experience'}
          </EditableText>
        </div>
        <div className="sub-navbar-right">
          {anchors.map((anchor, idx) => (
            <div key={idx} className="sub-navbar-anchor-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <EditableText 
                path={`subnavigation.anchors.${idx}.text`} 
                component="a" 
                href={anchor.href}
                onClick={(e) => handleAnchorClick(e, anchor.href)}
                placeholder="Link..."
              >
                {anchor.text}
              </EditableText>
              {isCMS && (
                <button 
                  onClick={(e) => removeAnchor(e, idx)}
                  style={{
                    marginLeft: '4px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '8px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {isCMS && (
            <button 
              onClick={addAnchor}
              style={{
                marginLeft: '15px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px dashed #444',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}
            >
              + Add Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
