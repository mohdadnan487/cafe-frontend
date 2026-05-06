import React from 'react';
import './App.css';

export default function StaffHome({ onSelectRole, onBack }) {
  return (
    <div className="app-select">
      <div className="select-container">
        <div className="app-logo">👥</div>
        <h1>Staff Portal</h1>
        <p>Choose your role</p>
        
        <div className="role-buttons">
          <button 
            className="role-btn waiter-btn"
            onClick={() => onSelectRole('waiter')}
          >
            <span className="role-icon">👨‍🍳</span>
            <span className="role-title">Waiter</span>
            <span className="role-desc">Enter your name</span>
          </button>

          <button 
            className="role-btn manager-btn"
            onClick={() => onSelectRole('manager')}
          >
            <span className="role-icon">⚙️</span>
            <span className="role-title">Manager</span>
            <span className="role-desc">Enter password</span>
          </button>
        </div>

        <button className="back-to-main" onClick={onBack}>
          ← Back to Start
        </button>
      </div>
    </div>
  );
}
