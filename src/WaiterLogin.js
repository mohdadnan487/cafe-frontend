import React, { useState } from 'react';

export default function WaiterLogin({ onLogin, onBack }) {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div className="customer-app">
      <div className="customer-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>👨‍🍳 Waiter Login</h1>
        <div style={{width: 44}} />
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
        <div style={{width: '100%', maxWidth: 320, background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <p style={{fontSize: 14, color: 'var(--text-light)', marginBottom: 20}}>Enter your name to start</p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}}
          />
          <button className="login-btn" onClick={handleStart}>Login</button>
        </div>
      </div>
    </div>
  );
}