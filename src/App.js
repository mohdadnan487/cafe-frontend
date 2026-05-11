import React, { useState } from 'react';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';
import KitchenApp from './KitchenApp';
import WaiterStaffApp from './WaiterStaffApp';
import AdminApp from './AdminApp';

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;background:#FAFAF9;}`;

const Icons = {
  food: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  vendor: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  kitchen: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg>,
  waiter: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  admin: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
};

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  const [role, setRole] = useState(null);

  if (tableFromUrl || role === 'customer') return <CustomerApp tableNumber={tableFromUrl || '1'} onBack={() => setRole(null)} />;
  if (role === 'kitchen') return <KitchenApp onBack={() => setRole(null)} />;
  if (role === 'waiter') return <WaiterStaffApp onBack={() => setRole(null)} />;
  if (role === 'vendor') return <VendorApp onLogout={() => setRole(null)} />;
  if (role === 'admin') return <AdminApp onBack={() => setRole(null)} />;

  return (
    <div style={{minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column'}}>
      <style>{css}</style>

      <div style={{background: '#1A1A1A', padding: '56px 24px 36px', textAlign: 'center'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12}}>Welcome to</div>
        <div style={{color: '#fff', fontWeight: 700, fontSize: 34, fontFamily: "'DM Serif Display', serif", letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 8}}>The Food Quarter</div>
        <div style={{color: 'rgba(255,255,255,0.35)', fontSize: 13}}>London's smartest food court</div>
      </div>

      <div style={{flex: 1, padding: '0 20px 40px'}}>

        {/* CUSTOMER */}
        <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: '20px', border: '1px solid #F0EFED', borderTop: 'none', marginBottom: 28}}>
          <div style={{fontSize: 10, fontWeight: 700, color: '#9B9590', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12}}>For Customers</div>
          <button onClick={() => setRole('customer')}
            style={{width: '100%', padding: '18px 20px', background: '#1A1A1A', border: 'none', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
            <div style={{width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0}}>
              <Icons.food />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3}}>Order Food</div>
              <div style={{fontSize: 12, color: 'rgba(255,255,255,0.4)'}}>Browse vendors, order & pay</div>
            </div>
            <div style={{color: 'rgba(255,255,255,0.25)'}}><Icons.arrow /></div>
          </button>
        </div>

        {/* STAFF */}
        <div style={{marginBottom: 28}}>
          <div style={{fontSize: 10, fontWeight: 700, color: '#9B9590', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12}}>For Staff</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            {[
              { key: 'vendor', Icon: Icons.vendor, title: 'Vendor Manager', desc: 'Orders, menu & analytics' },
              { key: 'kitchen', Icon: Icons.kitchen, title: 'Kitchen Display', desc: 'Incoming orders & preparation' },
              { key: 'waiter', Icon: Icons.waiter, title: 'Waiter', desc: 'Table requests & delivery' },
            ].map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                style={{width: '100%', padding: '16px 20px', background: '#fff', border: '1.5px solid #E8E6E3', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
                <div style={{width: 48, height: 48, borderRadius: 14, background: '#F5F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', flexShrink: 0}}>
                  <r.Icon />
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 15, color: '#1A1A1A', marginBottom: 3}}>{r.title}</div>
                  <div style={{fontSize: 12, color: '#9B9590'}}>{r.desc}</div>
                </div>
                <div style={{color: '#C4BFB8'}}><Icons.arrow /></div>
              </button>
            ))}
          </div>
        </div>

        {/* ADMIN */}
        <div>
          <div style={{fontSize: 10, fontWeight: 700, color: '#9B9590', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12}}>Management</div>
          <button onClick={() => setRole('admin')}
            style={{width: '100%', padding: '16px 20px', background: '#fff', border: '1.5px solid #E8E6E3', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left'}}>
            <div style={{width: 48, height: 48, borderRadius: 14, background: '#F5F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', flexShrink: 0}}>
              <Icons.admin />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 15, color: '#1A1A1A', marginBottom: 3}}>Food Court Manager</div>
              <div style={{fontSize: 12, color: '#9B9590'}}>All vendors, revenue & oversight</div>
            </div>
            <div style={{color: '#C4BFB8'}}><Icons.arrow /></div>
          </button>
        </div>
      </div>
    </div>
  );
}