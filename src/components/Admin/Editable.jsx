import React, { useRef, useState, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import './Editable.css';

const StylingToolbar = ({ path, type, active, onToggleSource, isSourceMode }) => {
  const { getStyle, updateStyle } = useVisualEditor();
  const styles = getStyle(path);

  const handleColorSelection = (color) => {
    document.execCommand('foreColor', false, color);
  };

  if (!active) return null;

  const fontFamilies = [
    { name: 'Default', value: 'inherit' },
    { name: 'Inter', value: '"Inter", sans-serif' },
    { name: 'Roboto', value: '"Roboto", sans-serif' },
    { name: 'Outfit', value: '"Outfit", sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'monospace' }
  ];

  return (
    <div 
      className="cms-styling-toolbar" 
      onClick={(e) => e.stopPropagation()}
      style={{ display: 'flex', flexWrap: 'nowrap', minWidth: 'max-content', alignItems: 'center' }}
    >
      {type === 'text' && (
        <div className="toolbar-group">
          <button 
            type="button"
            className={isSourceMode ? 'active' : ''}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onToggleSource}
            title="Toggle HTML Source"
            style={{ marginRight: '8px', borderRight: '1px solid #444', paddingRight: '8px', width: 'auto', display: 'flex', gap: '4px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span style={{ fontSize: '0.65rem' }}>HTML</span>
          </button>

          <div className="tool-input">
            <span style={{ color: '#aaa', marginRight: '4px' }}>Size</span>
            <input 
              type="number" 
              value={parseInt(styles.fontSize) || ''} 
              placeholder="16"
              onChange={(e) => updateStyle(path, { fontSize: e.target.value ? e.target.value + 'px' : 'inherit' })}
              className="cms-number-input"
            />
          </div>
          
          <select 
            className="cms-select"
            value={styles.fontFamily || 'inherit'} 
            onChange={(e) => updateStyle(path, { fontFamily: e.target.value })}
          >
            {fontFamilies.map(f => (
              <option key={f.value} value={f.value}>{f.name}</option>
            ))}
          </select>

          <button 
            type="button"
            className={styles.fontWeight === 'bold' ? 'active' : ''}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => updateStyle(path, { fontWeight: styles.fontWeight === 'bold' ? 'normal' : 'bold' })}
            title="Bold"
          >B</button>

          <button 
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleColorSelection('#00aeef')}
            title="Color Selection (Blue)"
            style={{ color: '#00aeef' }}
          >A</button>

          <button 
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => document.execCommand('removeFormat')}
            title="Clear Formatting"
            style={{ color: '#aaa' }}
          ><u>A</u></button>

          <select 
            className="cms-select"
            value={styles.textTransform || 'none'} 
            onChange={(e) => updateStyle(path, { textTransform: e.target.value })}
          >
            <option value="none">Normal</option>
            <option value="uppercase">ABC</option>
            <option value="lowercase">abc</option>
            <option value="capitalize">Abc</option>
          </select>

          <div className="tool-input">
            <span style={{ color: '#aaa', marginRight: '4px' }}>Global</span>
            <input 
              type="color" 
              value={styles.color || '#ffffff'} 
              onChange={(e) => updateStyle(path, { color: e.target.value })}
              className="cms-color-input"
            />
          </div>
        </div>
      )}
      {type === 'image' && (
        <div className="toolbar-group">
          <div className="tool-input">
            <span>W</span>
            <input 
              type="text" 
              placeholder="Auto"
              value={styles.width || ''} 
              onChange={(e) => updateStyle(path, { width: e.target.value })}
            />
          </div>
          <div className="tool-input">
            <span>H</span>
            <input 
              type="text" 
              placeholder="Auto"
              value={styles.height || ''} 
              onChange={(e) => updateStyle(path, { height: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const EditableText = ({ path, children, className = "", style = {}, component: Component = "div", placeholder = "Enter text...", richText = false }) => {
  const { isCMS, updateField, getStyle, setIsDirty } = useVisualEditor();
  const [isFocused, setIsFocused] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const editorRef = useRef(null);
  const cmsStyles = getStyle(path);
  
  const isEmpty = !children || (typeof children === 'string' && children.trim() === '');

  if (!isCMS) {
    if (richText || (typeof children === 'string' && children.includes('<'))) {
      return <Component className={className} style={{...style, ...cmsStyles}} dangerouslySetInnerHTML={{ __html: children }} />;
    }
    return <Component className={className} style={{...style, ...cmsStyles}}>{children}</Component>;
  }

  const handleFocus = () => {
    setIsFocused(true);
    document.body.classList.add('cms-editing-active');
  };

  const handleInput = () => {
    // Just trigger dirty state immediately so Publish button enables while typing
    setIsDirty(true);
  };

  const handleBlur = (e) => {
    if (e.relatedTarget && e.currentTarget.parentNode && e.currentTarget.parentNode.contains(e.relatedTarget)) {
      return;
    }

    const content = isSourceMode ? e.target.value : (richText ? e.target.innerHTML : e.target.innerText);
    updateField(path, content);
    setIsFocused(false);
    document.body.classList.remove('cms-editing-active');
  };

  const toggleSourceMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSourceMode) {
      // If we're coming out of source mode, sync the value
      const content = editorRef.current.value;
      updateField(path, content);
    }
    
    setIsSourceMode(!isSourceMode);
  };

  return (
    <div 
      className={`cms-editable-wrapper ${isFocused ? 'is-focused' : ''} ${isEmpty ? 'is-empty' : ''} ${isSourceMode ? 'is-source-mode' : ''}`} 
      style={{ position: 'relative', display: 'inline-block', width: '100%' }}
    >
      <StylingToolbar 
        path={path} 
        type="text" 
        active={isFocused} 
        onToggleSource={toggleSourceMode}
        isSourceMode={isSourceMode}
      />
      
      {isSourceMode ? (
        <textarea
          ref={editorRef}
          className={`${className} cms-html-editor`}
          defaultValue={children}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleInput}
          style={{
            ...style,
            ...cmsStyles,
            width: '100%',
            minHeight: '100px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#111',
            color: '#00aeef',
            border: '1px solid #00aeef',
            padding: '10px',
            borderRadius: '4px',
            outline: 'none',
            resize: 'vertical'
          }}
        />
      ) : (
        <Component
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleInput}
          className={`${className} cms-editable-text ${isFocused ? 'cms-focused' : ''} ${isEmpty ? 'show-placeholder' : ''}`}
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={(richText || (typeof children === 'string' && children.includes('<'))) ? { __html: children } : undefined}
          style={{
            ...style,
            ...cmsStyles,
            outline: isFocused ? '2px solid #fff' : '1px dashed rgba(255, 255, 255, 0.2)',
            outlineOffset: '2px',
            cursor: 'text',
            minHeight: isEmpty ? '1.5em' : 'auto',
            minWidth: isEmpty ? '50px' : 'auto'
          }}
        >
          {(richText || (typeof children === 'string' && children.includes('<'))) ? null : children}
        </Component>
      )}
    </div>
  );
};

export const EditableImage = ({ path, src, alt, className = "", style = {} }) => {
  const { isCMS, updateField, getStyle, setIsDirty } = useVisualEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef();
  const cmsStyles = getStyle(path);

  if (!isCMS) return <img src={src} alt={alt} className={className} style={{...style, ...cmsStyles}} />;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setIsDirty(true); // Enable publish button as soon as upload starts
    const formData = new FormData();
    formData.append('file', file);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrms';
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        updateField(path, data.url);
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="cms-editable-image-wrapper" 
      style={{ position: 'relative', display: 'inline-block', ...style, ...cmsStyles }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StylingToolbar path={path} type="image" active={isHovered} />
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%',
          objectFit: 'cover'
        }} 
      />
      <div 
        className="cms-image-overlay"
        onClick={() => fileInputRef.current.click()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isUploading ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: (isHovered || isUploading) ? 1 : 0,
          transition: 'opacity 0.3s',
          cursor: isUploading ? 'wait' : 'pointer',
          color: 'white',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          zIndex: 10
        }}
      >
        {isUploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="cms-spinner"></div>
            Uploading...
          </div>
        ) : 'Replace'}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        style={{ display: 'none' }} 
        accept="image/*"
      />
    </div>
  );
};
