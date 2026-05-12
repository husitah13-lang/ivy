import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '../utils/api';

const VisualEditorContext = createContext();

export const VisualEditorProvider = ({ children }) => {
  const [isCMS, setIsCMS] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dataContext, setDataContext] = useState(null);

  const initDraft = (data, collection) => {
    if (!data) return;
    // Deep clone to avoid mutating original
    setDraftData(JSON.parse(JSON.stringify(data)));
    setDataContext(data);
    setActiveCollection(collection);
    setIsDirty(false);
  };

  const updateField = (path, value) => {
    setDraftData(prev => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = newData;
      
      try {
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setIsDirty(true);
        return newData;
      } catch (err) {
        console.error("Error updating draft field:", path, err);
        return prev;
      }
    });
  };

  const [isTranslating, setIsTranslating] = useState(false);

  const publish = async (syncToArabic = false) => {
    if (!activeCollection || !draftData) return;
    
    setIsSaving(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrms';
      const token = localStorage.getItem('adminToken');
      
      const saveTo = async (collection, data) => {
        return await fetch(`${baseUrl}/api/content/${collection}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });
      };

      // 1. Save main collection
      const res = await saveTo(activeCollection, draftData);

      if (res.ok) {
        // 2. Optional Sync to Arabic
        if (syncToArabic && !activeCollection.endsWith('.ar')) {
          setIsTranslating(true);
          const arCollection = `${activeCollection}.ar`;
          try {
            // Fetch existing Arabic data to merge changes
            const existingArRes = await fetch(`${baseUrl}/api/content/${arCollection}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            let existingArData = null;
            if (existingArRes.ok) {
              existingArData = await existingArRes.json();
            }

            const { translateDiff } = await import('../utils/translate');
            // Compare current draft with previous baseline (dataContext) and merge into existing Arabic
            const translatedData = await translateDiff(draftData, dataContext, existingArData, 'ar');
            await saveTo(arCollection, translatedData);
          } catch (tErr) {
            console.error("Sync to Arabic failed:", tErr);
          } finally {
            setIsTranslating(false);
          }
        }

        setIsDirty(false);
        setDataContext(JSON.parse(JSON.stringify(draftData))); // Update the baseline data
        sessionStorage.clear();
        alert(syncToArabic ? 'Changes published and synced to Arabic!' : 'Changes published successfully!');
        // window.location.reload(); // Removed reload to allow continuous editing
      } else {
        alert('Failed to publish changes.');
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert('Error connecting to CMS backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const reorderSections = (index, direction, layoutPath = 'section_layout', initialLayout = null) => {
    setDraftData(prev => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      
      const parts = layoutPath.split('.');
      let current = newData;
      try {
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        const key = parts[parts.length - 1];
        
        // If the layout doesn't exist yet, use initialLayout if provided
        if (!current[key]) {
          if (initialLayout) {
            current[key] = [...initialLayout];
          } else {
            return prev;
          }
        }
        
        const newLayout = [...current[key]];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newLayout.length) return prev;
        
        // Swap items
        const temp = newLayout[index];
        newLayout[index] = newLayout[targetIndex];
        newLayout[targetIndex] = temp;
        
        current[key] = newLayout;
        setIsDirty(true);
        return newData;
      } catch (err) {
        console.error("Error reordering:", err);
        return prev;
      }
    });
  };

  const updateStyle = (path, styleObj) => {
    setDraftData(prev => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = newData;
      
      try {
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        const fieldName = parts[parts.length - 1];
        // Ensure we have a style container for this field
        // We'll store styles in a parallel object or as part of the field if it's an object
        // Let's store them in a 'metadata' or 'styles' key at the same level if possible
        if (!current._styles) current._styles = {};
        current._styles[fieldName] = { ...current._styles[fieldName], ...styleObj };
        
        setIsDirty(true);
        return newData;
      } catch (err) {
        console.error("Error updating style:", path, err);
        return prev;
      }
    });
  };

  const getStyle = (path) => {
    const source = draftData || dataContext;
    if (!source) return {};
    const parts = path.split('.');
    let current = source;
    
    try {
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
        if (!current) return {};
      }
      const fieldName = parts[parts.length - 1];
      return (current._styles && current._styles[fieldName]) || {};
    } catch (err) {
      return {};
    }
  };

  const discardChanges = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      window.location.reload();
    }
  };

  return (
    <VisualEditorContext.Provider value={{ 
      isCMS, 
      setIsCMS, 
      draftData, 
      setDraftData,
      dataContext,
      setDataContext,
      updateField, 
      initDraft, 
      publish, 
      isDirty, 
      setIsDirty,
      isSaving,
      isTranslating,
      discardChanges,
      reorderSections,
      updateStyle,
      getStyle
    }}>
      {children}
    </VisualEditorContext.Provider>
  );
};

export const useVisualEditor = () => useContext(VisualEditorContext);
