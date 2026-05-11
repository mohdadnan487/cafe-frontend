import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; }
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

  // Simulate new order coming in
  useEffect(() => {
    if (!loggedIn) return;
    const timer = setTimeout(() => {
      setOrders(prev => [...prev, {
        id: 1048, table_number: 5, status: 'new',
        created_at: new Date().toISOString(),
        items: ['1× Chicken Burger', '1× Onion Rings']
      }]);
    }, 10000);
    return () => clearTimeout(timer);
  }, [loggedIn]);

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
  };

  const elapsed = (dateStr) => {
    const mins = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    return mins < 1 ? 'Just now' : `${mins}m ago`;
  };

  const T = {
    page: { minHeight: '100vh', background: '#111', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    card: { background: '#1C1C1C', borderRadius: 16, border: '1px solid #2A2A2A' },
  };

  if (!loggedIn) {
    return (
      <div style={{...T.page, display: 'flex', flexDirection: 'column'}}>
        <div style={{padding: '20px', display: 'flex', alignItems: 'center'}}>
          <button onClick={onBack} style={{background: '#2A2A2A', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center'}}>
            <Icons.back />
          </button>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24}}>
          <div style={{width: 64, height: 64, borderRadius: 20, background: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20}}>👨‍🍳</div>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 24, fontFamily: "'DM Serif Display', serif", marginBottom: 6}}>Kitchen</div>
          <div style={{color: '#666', fontSize: 13, marginBottom: 32}}>Enter PIN to access kitchen display</div>

          <div style={{background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: 16, padding: '14px 24px', marginBottom: 24, minWidth: 160, textAlign: 'center'}}>
            <div style={{fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 8, fontFamily: "'DM Serif Display', serif"}}>
              {pin ? '●'.repeat(pin.length) : <span style={{color: '#444'}}>----</span>}
            </div>
          </div>

          {error && <div style={{color: '#C2410C', fontSize: 13, marginBottom: 16}}>{error}</div>}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 240}}>
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
              <button key={i} onClick={() => {
                if (k === '⌫') { setPin(p => p.slice(0,-1)); setError(''); }
                else if (k !== '') {
                  const newPin = pin + k;
                  setPin(newPin);
                  if (newPin.length === 4) {
                    if (newPin === '1234') { setLoggedIn(true); setPin(''); }
                    else { setError('Wrong PIN'); setPin(''); }
                  }
                }
              }}
                style={{height: 56, borderRadius: 14, background: k === '' ? 'transparent' : '#2A2A2A', border: 'none', color: '#fff', fontSize: k === '⌫' ? 18 : 20, fontWeight: 600, cursor: k === '' ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif"}}>
                {k}
              </button>
            ))}
          </div>
          <div style={{color: '#444', fontSize: 12, marginTop: 20}}>Demo PIN: 1234</div>
        </div>
      </div>
    );
  }

  const newOrders = orders.filter(o => o.status === 'new');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div style={T.page}>
      {/* HEADER */}
      <div style={{background: '#1C1C1C', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2A2A2A', position: 'sticky', top: 0, zIndex: 100}}>
        <button onClick={onBack} style={{background: '#2A2A2A', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center'}}>
          <Icons.back />
        </button>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif"}}>Kitchen Display</div>
          <div style={{color: '#666', fontSize: 11, marginTop: 1}}>LIVE ORDERS</div>
        </div>
        <div style={{display: 'flex', gap: 6}}>
          {newOrders.length > 0 && (
            <div style={{background: '#C2410C', color: '#fff', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700, animation: 'pulse 1.5s infinite'}}>
              {newOrders.length} new
            </div>
          )}
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#000'}}>
        {[
          { label: 'Incoming', value: newOrders.length, color: '#C2410C' },
          { label: 'Preparing', value: preparingOrders.length, color: '#D97706' },
          { label: 'Ready', value: readyOrders.length, color: '#15803D' },
        ].map(s => (
          <div key={s.label} style={{background: '#1C1C1C', padding: '14px 8px', textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: 24, color: s.color, fontFamily: "'DM Serif Display', serif"}}>{s.value}</div>
            <div style={{fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{padding: 16}}>

        {/* NEW ORDERS */}
        {newOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#C2410C', animation: 'pulse 1s infinite'}} />
              <div style={{fontSize: 11, fontWeight: 700, color: '#C2410C', letterSpacing: 0.8, textTransform: 'uppercase'}}>Incoming Orders</div>
            </div>
            {newOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #C2410C', animation: 'slideIn 0.3s ease'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 12}}><Icons.clock /> {elapsed(order.created_at)}</div>
                </div>
                <div style={{marginBottom: 14}}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{color: '#CCC', fontSize: 14, padding: '4px 0', borderBottom: i < order.items.length - 1 ? '1px solid #2A2A2A' : 'none'}}>{item}</div>
                  ))}
                </div>
                <button onClick={() => updateStatus(order.id, 'preparing')}
                  style={{width: '100%', padding: '12px', background: '#C2410C', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, letterSpacing: 0.2}}>
                  Accept & Start Preparing
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PREPARING */}
        {preparingOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#D97706'}} />
              <div style={{fontSize: 11, fontWeight: 700, color: '#D97706', letterSpacing: 0.8, textTransform: 'uppercase'}}>In Progress</div>
            </div>
            {preparingOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #D97706'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 12}}><Icons.clock /> {elapsed(order.created_at)}</div>
                </div>
                <div style={{marginBottom: 14}}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{color: '#CCC', fontSize: 14, padding: '4px 0', borderBottom: i < order.items.length - 1 ? '1px solid #2A2A2A' : 'none'}}>{item}</div>
                  ))}
                </div>
                <button onClick={() => updateStatus(order.id, 'ready')}
                  style={{width: '100%', padding: '12px', background: '#15803D', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Icons.check /> Mark as Ready
                </button>
              </div>
            ))}
          </div>
        )}

        {/* READY */}
        {readyOrders.length > 0 && (
          <div style={{marginBottom: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: '#15803D'}} />
              <div style={{fontSize: 11, fontWeight: 700, color: '#15803D', letterSpacing: 0.8, textTransform: 'uppercase'}}>Ready for Collection</div>
            </div>
            {readyOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #15803D', opacity: 0.7}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                  <div style={{background: '#15803D', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600}}>Ready</div>
                </div>
                <div>{order.items.map((item, i) => (
                  <div key={i} style={{color: '#666', fontSize: 13, padding: '3px 0'}}>{item}</div>
                ))}</div>
              </div>
            ))}
          </div>
        )}

        {orders.filter(o => ['new','preparing','ready'].includes(o.status)).length === 0 && (
          <div style={{textAlign: 'center', padding: '60px 20px'}}>
            <div style={{fontSize: 40, marginBottom: 12, color: '#2A2A2A'}}>—</div>
            <div style={{color: '#444', fontWeight: 600, fontSize: 16}}>Kitchen clear</div>
            <div style={{color: '#333', fontSize: 13, marginTop: 4}}>No pending orders</div>
          </div>
        )}
      </div>
    </div>
  );
}