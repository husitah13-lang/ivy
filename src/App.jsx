import React from 'react'
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
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const isAdmin = location.pathname.startsWith('/admin');

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
    <>
      <ScrollHandler />
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "main-content"}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/:id" element={<ServicePage />} />
            <Route path="/what-we-think" element={<WhatWeThink />} />
            <Route path="/what-we-think/:id" element={<ArticlePage />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<ServicesMain />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ContentEditor collectionName="homepage" />} />
              <Route path=":collection" element={<ContentEditor />} />
            </Route>
          </Routes>
        </PageTransition>
        {!isAdmin && <Footer />}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
