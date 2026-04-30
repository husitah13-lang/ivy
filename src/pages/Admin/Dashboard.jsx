import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');
    fetch(`${baseUrl}/api/homepage`)
      .then(res => res.json())
      .then(json => {
        setData(JSON.stringify(json, null, 2));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Validate JSON
      const parsedData = JSON.parse(data);
      
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');
      const res = await fetch(`${baseUrl}/api/homepage`, {
        method: 'POST', // Match server.js logic
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(parsedData)
      });
      
      if (res.ok) {
        setMessage('Saved successfully!');
      } else {
        if (res.status === 401 || res.status === 403) {
          navigate('/admin/login');
        } else {
          setMessage('Error saving data');
        }
      }
    } catch (e) {
      setMessage('Invalid JSON format');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading CMS...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '2rem', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Ivy CMS Dashboard</h2>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
        
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Edit Homepage Content (JSON)</h3>
          <p style={{ marginBottom: '1rem', color: '#888' }}>
            Modify the structured content below. This directly updates the live website.
          </p>
          
          <textarea 
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{ 
              width: '100%', 
              height: '500px', 
              background: '#000', 
              color: '#0f0', 
              border: '1px solid #333',
              padding: '1rem',
              fontFamily: 'monospace',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ 
                padding: '0.75rem 2rem', 
                background: saving ? '#555' : '#fff', 
                color: '#000', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: saving ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              {saving ? 'Saving...' : 'Publish Changes'}
            </button>
            {message && <span style={{ color: message.includes('success') ? '#0f0' : 'red' }}>{message}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
