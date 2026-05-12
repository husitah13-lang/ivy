import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { fetchAPI } from '../../utils/api';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { isDirty, isCMS } = useVisualEditor();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dynamicPages, setDynamicPages] = useState({
    services: [],
    articles: []
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.remove('sidebar-collapsed');
    } else {
      document.body.classList.add('sidebar-collapsed');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadDynamicPages = async () => {
      try {
        // In a real scenario, we might have an endpoint for all collections
        // For now, let's try to fetch known collections to see what pages exist
        const servicesData = await fetchAPI('/content/services');
        const insightsData = await fetchAPI('/content/insights');

        setDynamicPages({
          services: servicesData?.services || [],
          articles: insightsData?.insights || []
        });
      } catch (err) {
        console.warn("Failed to fetch dynamic pages for sidebar", err);
      }
    };

    if (isCMS) {
      loadDynamicPages();
    }
  }, [isCMS]);

  const handleNavigation = (path, e) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Leave anyway?")) {
        e.preventDefault();
        return;
      }
    }
  };

  const mainPages = [
    { name: 'Home Page', path: '/admin', icon: '🏠' },
    { name: 'Services Overview', path: '/admin/services', icon: '🛠️' },
    { name: 'What We Think', path: '/admin/what-we-think', icon: '💡' },
    { name: 'Careers', path: '/admin/careers', icon: '💼' },
    { name: 'Contact', path: '/admin/contact', icon: '✉️' },
  ];

  // Hardcoded services based on existing files
  const servicesList = [
    { id: 'ai-solutions', title: 'AI Solutions' },
    { id: 'app-development', title: 'App Development' },
    { id: 'branding-and-design', title: 'Branding & Design' },
    { id: 'ecommerce', title: 'E-commerce' },
    { id: 'marketing-services', title: 'Marketing Services' },
    { id: 'targets', title: 'Targets Live' },
    { id: 'web-development', title: 'Web Development' },
  ];

  // Merge dynamic and hardcoded services, ensuring unique IDs
  const allServicesMap = new Map();
  servicesList.forEach(s => allServicesMap.set(s.id, s));
  dynamicPages.services.forEach(s => allServicesMap.set(s.id, s));
  
  const filteredServices = Array.from(allServicesMap.values()).filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = dynamicPages.articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isCMS) return null;

  return (
    <aside className={`admin-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <button 
        className="btn-toggle-sidebar" 
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <span></span>
        {isOpen ? '‹' : '›'}
      </button>

      <div className="sidebar-header">
        <div className="sidebar-logo">I</div>
        <div>
          <h2>IVY CMS</h2>
          <div className="cms-status-badge">
            <span className={`status-dot ${isDirty ? 'dirty' : ''}`}></span>
            {isDirty ? 'Unsaved Changes' : 'All synced'}
          </div>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search pages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-group">
          <div className="sidebar-group-title">Main Pages</div>
          {mainPages.map(page => (
            <NavLink 
              key={page.path} 
              to={page.path} 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={(e) => handleNavigation(page.path, e)}
            >
              <span className="item-icon">{page.icon}</span>
              {page.name}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-group-title">Services</div>
          {filteredServices.map(service => (
            <NavLink 
              key={service.id} 
              to={`/admin/services/${service.id}`} 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={(e) => handleNavigation(`/admin/services/${service.id}`, e)}
            >
              <span className="item-icon">📄</span>
              {service.title}
            </NavLink>
          ))}
        </div>

        {filteredArticles.length > 0 && (
          <div className="sidebar-group">
            <div className="sidebar-group-title">Articles</div>
            {filteredArticles.map((article, idx) => {
              // Use article ID if available, else use index
              const articleId = article.id || (article.cta_link ? article.cta_link.split('/').pop() : idx);
              return (
                <NavLink 
                  key={idx} 
                  to={`/admin/what-we-think/${articleId}`} 
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavigation(`/admin/what-we-think/${articleId}`, e)}
                >
                  <span className="item-icon">📝</span>
                  {article.title}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
         <button className="sidebar-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {
           localStorage.removeItem('adminToken');
           window.location.href = '/';
         }}>
           <span className="item-icon">🚪</span>
           Exit CMS
         </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
