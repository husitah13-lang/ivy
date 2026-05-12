import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://betaapi.ivy-staging.com/apicrm';
    fetch(`${baseUrl}/api/collections`)
      .then(res => res.json())
      .then(data => setCollections(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const filteredCollections = collections.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping logic
  const mainPages = ['homepage', 'settings', 'careers', 'contact', 'services_main'];
  const hiddenCollections = ['index', 'index.ar', 'heroSlides', 'update-links', 'services'];

  const arPages = filteredCollections.filter(c => c.endsWith('.ar') && !mainPages.includes(c) && !hiddenCollections.includes(c));
  const otherPages = filteredCollections.filter(c => !c.endsWith('.ar') && !mainPages.includes(c) && !hiddenCollections.includes(c));

  const theme = {
    bg: '#0a0a0a',
    sidebar: '#111111',
    header: '#111111',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textMuted: '#a0a0a0',
    card: '#1a1a1a',
    input: '#1a1a1a',
    accent: '#00aeef',
    accentHover: '#0090c7'
  };

  const NavItem = ({ name, path, icon = '📄', badge = null }) => (
    <li style={{ marginBottom: '0.4rem' }}>
      <NavLink
        to={path}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          textDecoration: 'none',
          color: isActive ? '#fff' : theme.textMuted,
          background: isActive ? theme.accent : 'transparent',
          fontSize: '0.9rem',
          fontWeight: isActive ? '600' : '400',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isActive ? `0 4px 12px ${theme.accent}44` : 'none'
        })}
      >
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ flex: 1 }}>{name.replace(/-/g, ' ').replace('.ar', ' (Arabic)')}</span>
        {badge && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>{badge}</span>}
      </NavLink>
    </li>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '280px' : '0px', 
        background: theme.sidebar, 
        borderRight: `1px solid ${theme.border}`, 
        padding: isSidebarOpen ? '1.5rem 1rem' : '0', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: `linear-gradient(135deg, ${theme.accent}, #006699)`, 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '900', 
            color: '#fff',
            fontSize: '1.2rem',
            boxShadow: `0 4px 12px ${theme.accent}33`
          }}>I</div>
          <div style={{ opacity: isSidebarOpen ? 1 : 0 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, letterSpacing: '-0.3px' }}>IVY CMS</h2>
            <div style={{ fontSize: '0.65rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Intelligence Engine</div>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: theme.text,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = theme.accent}
            onBlur={(e) => e.target.style.borderColor = theme.border}
          />
          <span style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem', scrollbarWidth: 'thin' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.7rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', paddingLeft: '0.5rem', fontWeight: '700' }}>Pages</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {mainPages.map(p => (
                <NavItem key={p} name={p === 'services_main' ? 'Services Overview' : p} path={`/admin/${p}`} icon={p === 'settings' ? '⚙️' : (p === 'homepage' ? '🏠' : '📄')} />
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.7rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', paddingLeft: '0.5rem', fontWeight: '700' }}>Content Nodes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {otherPages.map(p => (
                <NavItem key={p} name={p} path={`/admin/${p}`} icon="🧩" />
              ))}
            </ul>
          </div>

          {arPages.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.7rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', paddingLeft: '0.5rem', fontWeight: '700' }}>Localization (AR)</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {arPages.map(p => (
                  <NavItem key={p} name={p} path={`/admin/${p}`} icon="🌍" />
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '0.7rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem', paddingLeft: '0.5rem', fontWeight: '700' }}>Database</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {collections.includes('articleContent') && (
                <NavItem name="Article Database (EN)" path="/admin/articleContent" icon="📚" />
              )}
              {collections.includes('articleContent.ar') && (
                <NavItem name="Article Database (AR)" path="/admin/articleContent.ar" icon="📚" />
              )}
            </ul>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: `1px solid ${theme.border}` }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${theme.border}`,
              color: '#ff4d4d',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ 
          height: '70px', 
          background: theme.header, 
          borderBottom: `1px solid ${theme.border}`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2.5rem',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isSidebarOpen ? '◂' : '▸'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: theme.textMuted }}>
              <span style={{ opacity: 0.5 }}>Pages</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span style={{ color: theme.text, fontWeight: '600' }}>{location.pathname.split('/').pop().replace(/-/g, ' ')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a
              href={window.location.origin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.85rem',
                color: theme.accent,
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: `${theme.accent}11`
              }}
            >
              View Live Site ↗
            </a>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', border: `2px solid ${theme.border}` }}>
              AD
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', background: theme.bg }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet context={{ theme, isDarkMode: true }} />
          </div>
        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
