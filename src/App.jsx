import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ServicePage from './pages/ServicePage'
import WhatWeThink from './pages/WhatWeThink'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import ArticlePage from './pages/ArticlePage'
import ServicesMain from './pages/ServicesMain'
import AdminLogin from './pages/Admin/Login'
import AdminLayout from './pages/Admin/AdminLayout'
import ContentEditor from './pages/Admin/ContentEditor'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import './App.css'
import { useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VisualEditorProvider, useVisualEditor } from './context/VisualEditorContext'
import AdminToolbar from './components/Admin/AdminToolbar'
import AdminSidebar from './components/Admin/AdminSidebar'
import { fetchAPI, getCachedData } from './utils/api'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isCMS, setIsCMS } = useVisualEditor();
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPath = location.pathname === '/admin/login';
  const [layoutData, setLayoutData] = useState(null);

  useEffect(() => {
    if (isAdminPath && !isLoginPath) {
      setIsCMS(true);
      document.body.classList.add('cms-mode-active');
    } else {
      setIsCMS(false);
      document.body.classList.remove('cms-mode-active');
    }
  }, [location.pathname, isLoginPath, isAdminPath, setIsCMS]);

  useEffect(() => {
    const prefetchData = async () => {
      try {
        const lang = i18n.language === 'ar' ? 'ar' : 'en';
        const suffix = lang === 'ar' ? '.ar' : '';
        
        // Parallel pre-fetching of critical data
        Promise.all([
          fetchAPI(`/content/layout${suffix}`),
          fetchAPI(`/content/homepage${suffix}`),
          fetchAPI(`/content/services${suffix}`)
        ]).then(([layout, home, services]) => {
          if (layout) setLayoutData(layout);
          console.log('Critical content pre-loaded');
        });
      } catch (err) {
        console.warn("Pre-fetch failed", err);
      }
    };
    prefetchData();
  }, [i18n.language]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    if (i18n.language === 'ar') {
      document.body.classList.add('rtl-arabic');
    } else {
      document.body.classList.remove('rtl-arabic');
    }
  }, [i18n.language]);

  return (
    <div className={isCMS ? "cms-layout-wrapper" : ""}>
      <ScrollHandler />
      <AdminSidebar />
      <div className={isCMS ? "cms-main-area" : ""}>
        <AdminToolbar />
        {(!isCMS && !isLoginPath) && <Navbar data={layoutData} />}
        <main className={(isCMS || isLoginPath) ? "" : "main-content"}>
          <PageTransition>
            <Routes>
              {/* Live Website Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services/:id" element={<ServicePage />} />
              <Route path="/what-we-think" element={<WhatWeThink />} />
              <Route path="/what-we-think/:id" element={<ArticlePage />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<ServicesMain />} />

              {/* Arabic Aliases to prevent broken links */}
              <Route path="/الخدمات" element={<ServicesMain />} />
              <Route path="/الخدمات/:id" element={<ServicePage />} />
              <Route path="/ما-نفكر-فيه" element={<WhatWeThink />} />
              <Route path="/ما-نفكر-فيه/:id" element={<ArticlePage />} />
              <Route path="/الوظائف" element={<Careers />} />
              <Route path="/اتصل-بنا" element={<Contact />} />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* CMS Clone Routes (Protected) */}
              <Route path="/admin" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/admin/services/:id" element={<ProtectedRoute><ServicePage /></ProtectedRoute>} />
              <Route path="/admin/what-we-think" element={<ProtectedRoute><WhatWeThink /></ProtectedRoute>} />
              <Route path="/admin/what-we-think/:id" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
              <Route path="/admin/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
              <Route path="/admin/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute><ServicesMain /></ProtectedRoute>} />
            </Routes>
          </PageTransition>
        </main>
        {(!isCMS && !isLoginPath) && <Footer data={layoutData} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <VisualEditorProvider>
      <Router>
        <AppContent />
      </Router>
    </VisualEditorProvider>
  )
}

export default App
