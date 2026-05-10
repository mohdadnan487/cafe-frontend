import React, { useState } from 'react';
import './App.css';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  const [view, setView] = useState(tableFromUrl ? 'customer' : 'vendor-login');

  if (view === 'customer') return <CustomerApp tableNumber={tableFromUrl || '1'} />;
  if (view === 'vendor') return <VendorApp onLogout={() => setView('vendor-login')} />;

  return (
    <div className="customer-app">
      <div className="customer-header">
        <div style={{width: 44}} />
        <h1>🍽️ The Food Quarter</h1>
        <div style={{width: 44}} />
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
        <div style={{width: '100%', maxWidth: 360, textAlign: 'center'}}>
          <div style={{fontSize: 72, marginBottom: 16}}>🍽️</div>
          <h2 style={{fontSize: 28, fontWeight: 700, marginBottom: 8, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Vendor Portal</h2>
          <p style={{color: 'var(--text-light)', marginBottom: 32}}>Sign in to manage your store</p>
          <button className="submit-btn" onClick={() => setView('vendor')}>Vendor Login</button>
        </div>
      </div>
    </div>
  );
}