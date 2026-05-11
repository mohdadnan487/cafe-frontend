import React, { useState } from 'react';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';
import KitchenApp from './KitchenApp';
import WaiterStaffApp from './WaiterStaffApp';

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');`;

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  const [role, setRole] = useState(null);

  if (tableFromUrl || role === 'customer') return <CustomerApp tableNumber={tableFromUrl || '1'} onBack={() => setRole(null)} />;
  if (role === 'kitchen') return <KitchenApp onBack={() => setRole(null)} />;
  if (role === 'waiter') return <WaiterStaffApp onBack={() => setRole(null)} />;
  if (role === 'vendor') return <VendorApp onLogout={() => setRole(null)} />;

  return (
    <div style={{minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column'}}>
      <style>{css}</style>

      <div style={{background: '#1A1A1A', padding: '48px 24px 32px', textAlign: 'center'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10}}>Welcome to</div>
        <div style={{color: '#fff', fontWeight: 700, fontSize: 32, fontFamily: "'DM Serif Display', serif", letterSpacing: -0.5}}>The Food Quarter</div>
        <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>London's smartest food court</div>
      </div>

      <div style={{flex: 1, padding: '0 20px 40px'}}>
        {/* CUSTOMER */}
        <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 20, border: '1px solid #F0EFED', borderTop: 'none', marginBottom: 24}}>
          <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12}}>For Customers</div>
          <button onClick={() => setRole('customer')}
            style={{width: '100%', padding: '18px 20px', background: '#1A1A1A', border: 'none', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
            <div style={{width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0}}>🍽️</div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3}}>Order Food</div>
              <div style={{fontSize: 12, color: 'rgba(255,255,255,0.5)'}}>Browse vendors, order & pay</div>
            </div>
            <div style={{color: 'rgba(255,255,255,0.3)', fontSize: 18}}>→</div>
          </button>
        </div>

        {/* STAFF */}
        <div>
          <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12}}>For Staff</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {[
              { key: 'vendor', icon: '⚙️', title: 'Vendor Manager', desc: 'Orders, menu, analytics', bg: '#fff' },
              { key: 'kitchen', icon: '👨‍🍳', title: 'Kitchen Display', desc: 'Incoming orders & preparation', bg: '#fff' },
              { key: 'waiter', icon: '🛎️', title: 'Waiter', desc: 'Table requests & delivery', bg: '#fff' },
            ].map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                style={{width: '100%', padding: '18px 20px', background: r.bg, border: '1.5px solid #E8E6E3', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
                <div style={{width: 48, height: 48, borderRadius: 14, background: '#F5F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0}}>{r.icon}</div>
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
    </div>
  );
}