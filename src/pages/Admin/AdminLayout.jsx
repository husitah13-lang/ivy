import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');
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
  const mainPages = ['homepage', 'index', 'settings', 'careers', 'contact', 'services_main'];
  const hiddenCollections = ['index', 'index.ar', 'articleContent', 'articleContent.ar', 'heroSlides', 'update-links', 'services'];
  
  const arPages = filteredCollections.filter(c => c.endsWith('.ar') && !mainPages.includes(c) && !hiddenCollections.includes(c));
  const otherPages = filteredCollections.filter(c => !c.endsWith('.ar') && !mainPages.includes(c) && !hiddenCollections.includes(c));
  
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('adminTheme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  React.useEffect(() => {
    localStorage.setItem('adminTheme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const theme = {
    bg: isDarkMode ? '#050505' : '#f8f9fa',
    sidebar: isDarkMode ? '#0a0a0a' : '#ffffff',
    border: isDarkMode ? '#222' : '#e9ecef',
    text: isDarkMode ? '#fff' : '#212529',
    textMuted: isDarkMode ? '#888' : '#6c757d',
    card: isDarkMode ? '#111' : '#ffffff',
    input: isDarkMode ? '#111' : '#fff',
    accent: '#00aeef'
  };

  const NavItem = ({ name, path, icon = '📄' }) => (
    <li style={{ marginBottom: '0.2rem' }}>
      <NavLink 
        to={path}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          textDecoration: 'none',
          color: isActive ? theme.accent : theme.textMuted,
          background: isActive ? `${theme.accent}11` : 'transparent',
          borderLeft: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
          fontSize: '0.85rem',
          fontWeight: isActive ? '600' : '400',
          transition: 'all 0.2s ease'
        })}
      >
        <span style={{ fontSize: '1rem', opacity: 0.7 }}>{icon}</span>
        {name.replace(/-/g, ' ').replace('.ar', ' (AR)')}
      </NavLink>
    </li>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: theme.sidebar, borderRight: `1px solid ${theme.border}`, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', background: theme.accent, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>I</div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Ivy Manager</h2>
              <div style={{ fontSize: '0.6rem', color: theme.textMuted, textTransform: 'uppercase' }}>Cloud Manager</div>
            </div>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <input 
            type="text" 
            placeholder="Find a page..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.6rem 1rem 0.6rem 2.2rem', 
              background: theme.input, 
              border: `1px solid ${theme.border}`, 
              borderRadius: '8px', 
              color: theme.text, 
              fontSize: '0.8rem' 
            }}
          />
          <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '0.8rem' }}>🔍</span>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.65rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', padding: '0 0.5rem' }}>Core Website</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {mainPages.filter(p => collections.includes(p)).map(p => (
                <NavItem key={p} name={p} path={`/admin/${p}`} icon={p === 'settings' ? '⚙️' : '🏠'} />
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.65rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', padding: '0 0.5rem' }}>Services & Content</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {otherPages.map(p => (
                <NavItem key={p} name={p} path={`/admin/${p}`} icon="📁" />
              ))}
            </ul>
          </div>

          {arPages.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.65rem', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', padding: '0 0.5rem' }}>Arabic Translation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {arPages.map(p => (
                  <NavItem key={p} name={p} path={`/admin/${p}`} icon="🌐" />
                ))}
              </ul>
            </div>
          )}
        </nav>

        <div style={{ padding: '1rem', background: `${theme.accent}05`, borderRadius: '8px', border: `1px solid ${theme.accent}22`, marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.7rem', color: theme.accent, marginBottom: '0.5rem', textTransform: 'uppercase' }}>User Guide</h4>
          <ul style={{ fontSize: '0.7rem', color: theme.textMuted, paddingLeft: '1rem' }}>
            <li style={{ marginBottom: '0.4rem' }}>Select a page from the list to start editing.</li>
            <li style={{ marginBottom: '0.4rem' }}>Use <b>Save Changes</b> at the top right to publish.</li>
          </ul>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${theme.border}` }}>
          <a 
            href={window.location.origin} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.5rem', 
              padding: '0.8rem', 
              borderRadius: '8px', 
              color: theme.accent, 
              textDecoration: 'none', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              background: `${theme.accent}11`,
              transition: 'all 0.2s ease'
            }}
          >
            <span>👁️</span> View Live Site
          </a>
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.75rem', 
            background: 'transparent', 
            border: 'none', 
            color: theme.textMuted, 
            borderRadius: '6px', 
            cursor: 'pointer',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            textAlign: 'left'
          }}
        >
          Logout Session
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh' }}>
        <Outlet context={{ theme, isDarkMode }} />
      </div>
    </div>
  );
};

export default AdminLayout;
