import React, { useState } from 'react';
import './App.css';
import CustomerApp from './CustomerApp';
import WaiterLogin from './WaiterLogin';
import WaiterDashboard from './WaiterDashboard';
import ManagerDashboard from './ManagerDashboard';

export default function App() {
  const [role, setRole] = useState('select');
  const [waiterName, setWaiterName] = useState('');

  if (role === 'customer') return <CustomerApp onBack={() => setRole('select')} />;
  if (role === 'waiter-login') return <WaiterLogin onLogin={(name) => { setWaiterName(name); setRole('waiter'); }} onBack={() => setRole('staff')} />;
  if (role === 'waiter') return <WaiterDashboard waiterName={waiterName} onBack={() => { setRole('select'); setWaiterName(''); }} />;
  if (role === 'manager') return <ManagerDashboard onBack={() => setRole('select')} />;

  if (role === 'manager-login') {
    return (
      <div className="customer-app">
        <div className="customer-header">
          <button className="back-btn" onClick={() => setRole('staff')}>← Back</button>
          <h1>⚙️ Manager Login</h1>
          <div style={{width: 44}} />
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <div style={{width: '100%', maxWidth: 320, background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center'}}>
            <p style={{fontSize: 14, color: 'var(--text-light)', marginBottom: 20}}>Enter password to continue</p>
            <input type="password" placeholder="Password" id="manager-pwd" style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}}
              onKeyPress={(e) => { if (e.key === 'Enter') { if (document.getElementById('manager-pwd').value === 'admin123') setRole('manager'); else alert('Wrong password'); }}}
            />
            <button className="login-btn" onClick={() => { if (document.getElementById('manager-pwd').value === 'admin123') setRole('manager'); else alert('Wrong password'); }}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'staff') {
    return (
      <div className="customer-app">
        <div className="customer-header">
          <button className="back-btn" onClick={() => setRole('select')}>← Back</button>
          <h1>👥 Staff Portal</h1>
          <div style={{width: 44}} />
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <div style={{width: '100%', maxWidth: 400, textAlign: 'center'}}>
            <p style={{fontSize: 16, color: 'var(--text-light)', marginBottom: 32}}>Choose your role</p>
            <div className="role-buttons">
              <button className="role-btn" onClick={() => setRole('waiter-login')}>
                <span className="role-icon">👨‍🍳</span>
                <span className="role-title">Waiter</span>
                <span className="role-desc">Enter your name</span>
              </button>
              <button className="role-btn" onClick={() => setRole('manager-login')}>
                <span className="role-icon">⚙️</span>
                <span className="role-title">Manager</span>
                <span className="role-desc">Enter password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-app">
      <div className="customer-header">
        <div style={{width: 44}} />
        <h1>☕ Cafe Service</h1>
        <div style={{width: 44}} />
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
        <div style={{width: '100%', maxWidth: 400, textAlign: 'center'}}>
          <p style={{fontSize: 16, color: 'var(--text-light)', marginBottom: 32}}>Choose your role</p>
          <div className="role-buttons">
            <button className="role-btn" onClick={() => setRole('customer')}>
              <span className="role-icon">📱</span>
              <span className="role-title">Customer</span>
              <span className="role-desc">Scan table QR</span>
            </button>
            <button className="role-btn" onClick={() => setRole('staff')}>
              <span className="role-icon">👥</span>
              <span className="role-title">Staff</span>
              <span className="role-desc">Login required</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}