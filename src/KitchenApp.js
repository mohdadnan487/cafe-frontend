import React, { useState, useEffect } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAF9; }
  ::-webkit-scrollbar { display: none; }
  @keyframes slideIn { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

const DUMMY_ORDERS = [
  { id: 1047, table_number: 3, status: 'new', created_at: new Date(Date.now() - 120000).toISOString(), items: ['2× Classic Burger', '1× Cheese Fries'] },
  { id: 1046, table_number: 7, status: 'preparing', created_at: new Date(Date.now() - 300000).toISOString(), items: ['1× Double Smash', '1× Chocolate Shake'] },
  { id: 1045, table_number: 12, status: 'new', created_at: new Date(Date.now() - 60000).toISOString(), items: ['2× Cheese Fries', '1× Lemonade'] },
];

const Icons = {
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

const BackHeader = ({ onPress, title, subtitle }) => (
  <div style={{background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F0EFED', position: 'sticky', top: 0, zIndex: 100}}>
    <button onClick={onPress} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0}}>
      <Icons.back />
    </button>
    {title && <div>
      <div style={{fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif"}}>{title}</div>
      {subtitle && <div style={{fontSize: 11, color: '#9B9590', letterSpacing: 0.2}}>{subtitle}</div>}
    </div>}
  </div>
);

export default function KitchenApp({ onBack }) {
  const [pin, setPin] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const timer = setTimeout(() => {
      setOrders(prev => [...prev, { id: 1048, table_number: 5, status: 'new', created_at: new Date().toISOString(), items: ['1× Chicken Burger', '1× Onion Rings'] }]);
    }, 10000);
    return () => clearTimeout(timer);
  }, [loggedIn]);

  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));

  const elapsed = (dateStr) => {
    const mins = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    return mins < 1 ? 'Just now' : `${mins}m ago`;
  };

  const T = {
    page: { minHeight: '100vh', background: '#FAFAF9', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #F0EFED' },
    label: { fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase' },
  };

  if (!loggedIn) {
    return (
      <div style={T.page}>
        <BackHeader onPress={onBack} />
        <div style={{background: '#1A1A1A', padding: '40px 24px 32px', textAlign: 'center'}}>
          <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}>The Food Quarter</div>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 28, fontFamily: "'DM Serif Display', serif"}}>Kitchen Display</div>
          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>Enter PIN to access</div>
        </div>
        <div style={{padding: '0 20px 40px'}}>
          <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 28, border: '1px solid #F0EFED', borderTop: 'none'}}>
            <div style={{background: '#F5F4F2', borderRadius: 14, padding: '16px 24px', marginBottom: 24, textAlign: 'center'}}>
              <div style={{fontSize: 32, fontWeight: 700, color: '#1A1A1A', letterSpacing: 12, fontFamily: "'DM Serif Display', serif", minHeight: 42}}>
                {pin ? '●'.repeat(pin.length) : <span style={{color: '#C4BFB8', fontSize: 24}}>- - - -</span>}
              </div>
            </div>
            {error && <div style={{color: '#C2410C', fontSize: 13, textAlign: 'center', marginBottom: 16, fontWeight: 500}}>{error}</div>}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16}}>
              {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                <button key={i} onClick={() => {
                  if (k === '⌫') { setPin(p => p.slice(0,-1)); setError(''); }
                  else if (k !== '') {
                    const newPin = pin + k;
                    setPin(newPin);
                    if (newPin.length === 4) {
                      if (newPin === '1234') { setLoggedIn(true); setPin(''); }
                      else { setError('Wrong PIN — try again'); setPin(''); }
                    }
                  }
                }} style={{height: 58, borderRadius: 12, background: k === '' ? 'transparent' : '#F5F4F2', border: k === '' ? 'none' : '1.5px solid #E8E6E3', color: '#1A1A1A', fontSize: k === '⌫' ? 18 : 20, fontWeight: 600, cursor: k === '' ? 'default' : 'pointer'}}>
                  {k}
                </button>
              ))}
            </div>
            <div style={{textAlign: 'center', fontSize: 12, color: '#C4BFB8'}}>Demo PIN: 1234</div>
          </div>
        </div>
      </div>
    );
  }

  const newOrders = orders.filter(o => o.status === 'new');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div style={T.page}>
      <BackHeader onPress={onBack} title="Kitchen Display" subtitle="LIVE ORDERS" />

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#F0EFED'}}>
        {[
          { label: 'Incoming', value: newOrders.length, color: '#C2410C' },
          { label: 'Preparing', value: preparingOrders.length, color: '#D97706' },
          { label: 'Ready', value: readyOrders.length, color: '#15803D' },
        ].map(s => (
          <div key={s.label} style={{background: '#fff', padding: '14px 8px', textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: 24, color: s.color, fontFamily: "'DM Serif Display', serif"}}>{s.value}</div>
            <div style={{fontSize: 10, color: '#9B9590', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{padding: 16}}>
        {newOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#C2410C', animation: 'pulse 1s infinite'}} />
              <div style={{...T.label, color: '#C2410C'}}>Incoming</div>
            </div>
            {newOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #C2410C', animation: 'slideIn 0.3s ease'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4, color: '#9B9590', fontSize: 12}}><Icons.clock /> {elapsed(order.created_at)}</div>
                </div>
                <div style={{marginBottom: 14}}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{fontSize: 14, color: '#6B6560', padding: '5px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F5F4F2' : 'none'}}>{item}</div>
                  ))}
                </div>
                <button onClick={() => updateStatus(order.id, 'preparing')} style={{width: '100%', padding: '13px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14}}>
                  Accept & Start Preparing
                </button>
              </div>
            ))}
          </div>
        )}

        {preparingOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#D97706'}} />
              <div style={{...T.label, color: '#D97706'}}>In Progress</div>
            </div>
            {preparingOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #D97706'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4, color: '#9B9590', fontSize: 12}}><Icons.clock /> {elapsed(order.created_at)}</div>
                </div>
                <div style={{marginBottom: 14}}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{fontSize: 14, color: '#6B6560', padding: '5px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F5F4F2' : 'none'}}>{item}</div>
                  ))}
                </div>
                <button onClick={() => updateStatus(order.id, 'ready')} style={{width: '100%', padding: '13px', background: '#15803D', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Icons.check /> Mark as Ready
                </button>
              </div>
            ))}
          </div>
        )}

        {readyOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#15803D'}} />
              <div style={{...T.label, color: '#15803D'}}>Ready for Collection</div>
            </div>
            {readyOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #15803D', opacity: 0.6}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{background: '#F0FDF4', color: '#15803D', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600}}>Ready</div>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} style={{fontSize: 13, color: '#9B9590', padding: '3px 0'}}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {orders.filter(o => ['new','preparing','ready'].includes(o.status)).length === 0 && (
          <div style={{textAlign: 'center', padding: '60px 20px'}}>
            <div style={{fontSize: 40, marginBottom: 12, color: '#E8E6E3'}}>—</div>
            <div style={{color: '#9B9590', fontWeight: 600, fontSize: 16}}>Kitchen clear</div>
          </div>
        )}
      </div>
    </div>
  );
}