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

const DUMMY_REQUESTS = [
  { id: 1, table_number: 4, created_at: new Date(Date.now() - 90000).toISOString() },
  { id: 2, table_number: 9, created_at: new Date(Date.now() - 240000).toISOString() },
];

const DUMMY_READY = [
  { id: 1045, table_number: 12, items: ['2× Cheese Fries', '1× Lemonade'], ready_at: new Date(Date.now() - 120000).toISOString() },
];

const TABLE_STATUS = [
  { id: 1, status: 'occupied', since: '14:23' },
  { id: 2, status: 'empty' },
  { id: 3, status: 'occupied', since: '14:31' },
  { id: 4, status: 'waiter', since: '14:38' },
  { id: 5, status: 'occupied', since: '14:15' },
  { id: 6, status: 'empty' },
  { id: 7, status: 'occupied', since: '14:29' },
  { id: 8, status: 'empty' },
  { id: 9, status: 'waiter', since: '14:41' },
  { id: 10, status: 'occupied', since: '14:20' },
  { id: 11, status: 'empty' },
  { id: 12, status: 'occupied', since: '14:35' },
];

const Icons = {
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

export default function WaiterStaffApp({ onBack }) {
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState('requests');
  const [requests, setRequests] = useState(DUMMY_REQUESTS);
  const [readyOrders, setReadyOrders] = useState(DUMMY_READY);
  const [tables, setTables] = useState(TABLE_STATUS);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const timer = setTimeout(() => {
      setRequests(prev => [...prev, { id: 99, table_number: 6, created_at: new Date().toISOString() }]);
      setTables(prev => prev.map(t => t.id === 6 ? {...t, status: 'waiter', since: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} : t));
    }, 12000);
    return () => clearTimeout(timer);
  }, [loggedIn]);

  const elapsed = (dateStr) => {
    const mins = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    return mins < 1 ? 'Just now' : `${mins}m ago`;
  };

  const T = {
    page: { minHeight: '100vh', background: '#FAFAF9', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #F0EFED' },
    primaryBtn: { width: '100%', padding: '15px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    input: { width: '100%', padding: '13px 14px', border: '1.5px solid #E8E6E3', borderRadius: 10, fontSize: 14, background: '#FAFAF9', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' },
  };

  if (!loggedIn) {
    return (
      <div style={{...T.page, display: 'flex', flexDirection: 'column'}}>
        <div style={{background: '#1A1A1A', padding: '48px 24px 40px', textAlign: 'center'}}>
          <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}>The Food Quarter</div>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 28, fontFamily: "'DM Serif Display', serif"}}>Waiter Login</div>
          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>Enter your name to start your shift</div>
        </div>
        <div style={{flex: 1, padding: '0 20px 40px'}}>
          <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 28, border: '1px solid #F0EFED', borderTop: 'none'}}>
            <div style={{fontSize: 11, fontWeight: 600, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6}}>Your Name</div>
            <input style={{...T.input, marginBottom: 16}} placeholder="e.g. Sarah" value={name} onChange={e => setName(e.target.value)} onKeyPress={e => e.key === 'Enter' && name.trim() && setLoggedIn(true)} />
            <button onClick={() => name.trim() && setLoggedIn(true)} style={T.primaryBtn}>Start Shift</button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'requests', label: 'Requests', badge: requests.length },
    { key: 'deliver', label: 'Deliver', badge: readyOrders.length },
    { key: 'tables', label: 'Tables', badge: tables.filter(t => t.status === 'waiter').length },
  ];

  return (
    <div style={T.page}>
      <div style={{background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EFED', position: 'sticky', top: 0, zIndex: 100}}>
        <button onClick={onBack} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><Icons.back /></button>
        <div style={{textAlign: 'center'}}>
          <div style={{fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif"}}>{name}</div>
          <div style={{fontSize: 11, color: '#9B9590', letterSpacing: 0.2}}>WAITER · ON SHIFT</div>
        </div>
        <button onClick={() => setLoggedIn(false)} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#9B9590', fontSize: 12, fontWeight: 500}}>End</button>
      </div>

      {/* TABS */}
      <div style={{display: 'flex', background: '#fff', borderBottom: '1px solid #F0EFED'}}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${view === tab.key ? '#1A1A1A' : 'transparent'}`, fontWeight: view === tab.key ? 700 : 400, fontSize: 13, color: view === tab.key ? '#1A1A1A' : '#9B9590', cursor: 'pointer', position: 'relative'}}>
            {tab.label}
            {tab.badge > 0 && (
              <div style={{display: 'inline-flex', marginLeft: 6, width: 18, height: 18, borderRadius: 9, background: '#C2410C', color: '#fff', fontSize: 10, fontWeight: 800, alignItems: 'center', justifyContent: 'center'}}>
                {tab.badge}
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{padding: 16}}>

        {/* REQUESTS */}
        {view === 'requests' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Waiter Requests</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Tables needing your attention</div>
            {requests.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 20px', color: '#9B9590'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>—</div>
                <div style={{fontWeight: 600}}>All clear</div>
                <div style={{fontSize: 13, marginTop: 4}}>No pending requests</div>
              </div>
            ) : requests.map(req => (
              <div key={req.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #C2410C', animation: 'slideIn 0.3s ease'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                  <div style={{width: 48, height: 48, borderRadius: 14, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#C2410C', fontFamily: "'DM Serif Display', serif", flexShrink: 0}}>
                    {req.table_number}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 700, fontSize: 15}}>Table {req.table_number}</div>
                    <div style={{fontSize: 12, color: '#9B9590', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4}}><Icons.clock /> {elapsed(req.created_at)}</div>
                  </div>
                  <button onClick={() => { setRequests(prev => prev.filter(r => r.id !== req.id)); setTables(prev => prev.map(t => t.id === req.table_number ? {...t, status: 'occupied'} : t)); }}
                    style={{padding: '9px 16px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6}}>
                    <Icons.check /> Done
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* DELIVER */}
        {view === 'deliver' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Ready to Deliver</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Orders ready from kitchen</div>
            {readyOrders.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 20px', color: '#9B9590'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>—</div>
                <div style={{fontWeight: 600}}>Nothing to deliver</div>
                <div style={{fontSize: 13, marginTop: 4}}>Kitchen is still preparing</div>
              </div>
            ) : readyOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, borderLeft: '3px solid #15803D', animation: 'slideIn 0.3s ease'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10}}>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                    <div style={{fontSize: 12, color: '#9B9590', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4}}><Icons.clock /> Ready {elapsed(order.ready_at)}</div>
                  </div>
                  <div style={{background: '#F0FDF4', color: '#15803D', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600}}>Ready</div>
                </div>
                <div style={{marginBottom: 14}}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{fontSize: 13, color: '#6B6560', padding: '4px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F5F4F2' : 'none'}}>{item}</div>
                  ))}
                </div>
                <button onClick={() => setReadyOrders(prev => prev.filter(o => o.id !== order.id))}
                  style={{width: '100%', padding: '12px', background: '#15803D', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                  <Icons.check /> Delivered to Table
                </button>
              </div>
            ))}
          </>
        )}

        {/* TABLES */}
        {view === 'tables' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Floor View</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Current table status</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16}}>
              {tables.map(table => {
                const colors = {occupied:'#EFF6FF', waiter:'#FFF7ED', empty:'#F5F4F2'};
                const textColors = {occupied:'#1D4ED8', waiter:'#C2410C', empty:'#C4BFB8'};
                return (
                  <div key={table.id} style={{background: colors[table.status], borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: table.status === 'waiter' ? '1.5px solid #FED7AA' : '1px solid transparent', position: 'relative'}}>
                    {table.status === 'waiter' && <div style={{position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, background: '#C2410C', animation: 'pulse 1s infinite'}} />}
                    <div style={{fontWeight: 700, fontSize: 16, color: textColors[table.status], fontFamily: "'DM Serif Display', serif"}}>{table.id}</div>
                    <div style={{fontSize: 9, color: textColors[table.status], fontWeight: 600, letterSpacing: 0.3, marginTop: 2, textTransform: 'uppercase'}}>{table.status === 'empty' ? 'Free' : table.status === 'waiter' ? 'Help!' : table.since}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}