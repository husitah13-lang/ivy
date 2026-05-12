import React, { useState } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { useNavigate } from 'react-router-dom';
import './AdminToolbar.css';

const AdminToolbar = () => {
  const { 
    isCMS, 
    isDirty, 
    isSaving, 
    isTranslating, 
    activeCollection, 
    publish, 
    discardChanges 
  } = useVisualEditor();
  const [syncToArabic, setSyncToArabic] = useState(true);
  const navigate = useNavigate();

  if (!isCMS) return null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <div className="admin-toolbar">
      <div className="toolbar-left">
        <span className="cms-badge">CMS EDIT MODE</span>
        {isDirty && <span className="unsaved-dot" title="Unsaved Changes"></span>}
      </div>
      
      <div className="toolbar-actions">
        {!activeCollection?.endsWith('.ar') && (
          <label className="sync-checkbox">
            <input 
              type="checkbox" 
              checked={syncToArabic} 
              onChange={(e) => setSyncToArabic(e.target.checked)} 
            />
            Sync to Arabic
          </label>
        )}

        <button 
          className={`btn-publish ${isDirty ? 'active' : ''}`} 
          onClick={() => publish(syncToArabic)}
          disabled={(!isDirty && !isTranslating) || isSaving || isTranslating}
        >
          {isTranslating ? 'Translating...' : (isSaving ? 'Publishing...' : 'Publish Changes')}
        </button>
        
        <button 
          className="btn-discard" 
          onClick={discardChanges}
          disabled={!isDirty || isSaving || isTranslating}
        >
          Discard
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button className="btn-logout" onClick={handleLogout}>
          Exit CMS
        </button>
      </div>
    </div>
  );
};

export default AdminToolbar;
