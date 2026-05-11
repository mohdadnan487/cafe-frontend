import React, { useState } from 'react';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';
import KitchenApp from './KitchenApp';
import WaiterStaffApp from './WaiterStaffApp';

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  const roleFromUrl = new URLSearchParams(window.location.search).get('role');
  const [role, setRole] = useState(roleFromUrl || null);

  if (tableFromUrl) return <CustomerApp tableNumber={tableFromUrl} />;
  if (role === 'kitchen') return <KitchenApp onBack={() => setRole(null)} />;
  if (role === 'waiter') return <WaiterStaffApp onBack={() => setRole(null)} />;
  if (role === 'vendor') return <VendorApp onLogout={() => setRole(null)} />;

  return (
    <div style={{minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');`}</style>
      <div style={{background: '#1A1A1A', padding: '48px 24px 40px', textAlign: 'center'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}>The Food Quarter</div>
        <div style={{color: '#fff', fontWeight: 700, fontSize: 28, fontFamily: "'DM Serif Display', serif", letterSpacing: -0.5}}>Staff Portal</div>
        <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>Choose your role to continue</div>
      </div>
      <div style={{flex: 1, padding: '0 20px 40px'}}>
        <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 24, border: '1px solid #F0EFED', borderTop: 'none', marginBottom: 12}}>
          {[
            { key: 'vendor', icon: '⚙️', title: 'Vendor Manager', desc: 'Full dashboard — orders, menu, analytics', color: '#1A1A1A' },
            { key: 'kitchen', icon: '👨‍🍳', title: 'Kitchen Staff', desc: 'Incoming orders and preparation board', color: '#C2410C' },
            { key: 'waiter', icon: '🛎', title: 'Waiter', desc: 'Table requests and order delivery', color: '#1D4ED8' },
          ].map((r, i) => (
            <button key={r.key} onClick={() => setRole(r.key)}
              style={{width: '100%', padding: '18px 20px', background: '#FAFAF9', border: '1.5px solid #E8E6E3', borderRadius: 14, marginBottom: i < 2 ? 10 : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
              <div style={{width: 48, height: 48, borderRadius: 14, background: '#fff', border: '1.5px solid #E8E6E3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0}}>
                {r.icon}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 15, color: '#1A1A1A', marginBottom: 3}}>{r.title}</div>
                <div style={{fontSize: 12, color: '#9B9590'}}>{r.desc}</div>
              </div>
              <div style={{color: '#C4BFB8', fontSize: 18}}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}