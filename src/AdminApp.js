import React, { useState, useEffect } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAF9; }
  ::-webkit-scrollbar { display: none; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

const VENDORS = [
  { id: 1, name: 'Burger Bros', cuisine: 'American', status: 'active', revenue: 2847.50, orders: 312, rating: 4.8, tables_active: 3 },
  { id: 2, name: 'Sushi Sato', cuisine: 'Japanese', status: 'active', revenue: 3124.00, orders: 287, rating: 4.9, tables_active: 2 },
  { id: 3, name: 'Pizza Palace', cuisine: 'Italian', status: 'active', revenue: 1986.50, orders: 198, rating: 4.6, tables_active: 4 },
  { id: 4, name: 'Green Bowl', cuisine: 'Healthy', status: 'inactive', revenue: 742.00, orders: 89, rating: 4.7, tables_active: 0 },
];

const TABLE_STATUS = [
  { id: 1, status: 'occupied', vendor: 'Burger Bros', spend: 34.98, since: '14:23' },
  { id: 2, status: 'empty' },
  { id: 3, status: 'occupied', vendor: 'Sushi Sato', spend: 67.50, since: '14:15' },
  { id: 4, status: 'waiter', vendor: 'Pizza Palace', spend: 18.99, since: '14:38' },
  { id: 5, status: 'occupied', vendor: 'Burger Bros', spend: 24.97, since: '14:31' },
  { id: 6, status: 'empty' },
  { id: 7, status: 'occupied', vendor: 'Sushi Sato', spend: 45.98, since: '14:29' },
  { id: 8, status: 'empty' },
  { id: 9, status: 'waiter', vendor: 'Green Bowl', spend: 29.98, since: '14:41' },
  { id: 10, status: 'occupied', vendor: 'Pizza Palace', spend: 89.96, since: '14:20' },
  { id: 11, status: 'empty' },
  { id: 12, status: 'occupied', vendor: 'Burger Bros', spend: 12.98, since: '14:35' },
];

const Icons = {
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  vendors: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  tables: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  revenue: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  analytics: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  up: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
};

export default function AdminApp({ onBack }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('overview');
  const [vendors, setVendors] = useState(VENDORS);
  const [tables, setTables] = useState(TABLE_STATUS);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const totalRevenue = vendors.reduce((s, v) => s + v.revenue, 0);
  const totalOrders = vendors.reduce((s, v) => s + v.orders, 0);
  const avgRating = (vendors.reduce((s, v) => s + v.rating, 0) / vendors.length).toFixed(1);
  const occupiedTables = tables.filter(t => t.status !== 'empty').length;

  const T = {
    page: { minHeight: '100vh', background: '#FAFAF9', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #F0EFED' },
    primaryBtn: { width: '100%', padding: '15px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    input: { width: '100%', padding: '13px 14px', border: '1.5px solid #E8E6E3', borderRadius: 10, fontSize: 14, background: '#FAFAF9', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase' },
  };

  if (!loggedIn) {
    return (
      <div style={{...T.page, display: 'flex', flexDirection: 'column'}}>
        <div style={{background:'#1A1A1A',padding:'20px 20px 40px',textAlign:'center'}}><div style={{display:'flex',marginBottom:24}}><button onClick={onBack} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:10,padding:'8px 10px',cursor:'pointer',display:'flex',alignItems:'center',color:'#fff'}}><Icons.back /></button></div>
          <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}>The Food Quarter</div>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 28, fontFamily: "'DM Serif Display', serif"}}>Manager Portal</div>
          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>Food court oversight & analytics</div>
        </div>
        <div style={{flex: 1, padding: '0 20px 40px'}}>
          <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 28, border: '1px solid #F0EFED', borderTop: 'none'}}>

            <div style={{fontWeight: 700, fontSize: 20, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>Admin Login</div>
            <div style={{color: '#9B9590', fontSize: 13, marginBottom: 24}}>Enter master password to continue</div>
            <div style={{...T.label, marginBottom: 6}}>Password</div>
            <input type="password" style={{...T.input, marginBottom: 8}} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && (password === 'admin123' ? setLoggedIn(true) : setError('Wrong password'))} />
            {error && <div style={{color: '#C2410C', fontSize: 13, marginBottom: 12}}>{error}</div>}
            <button onClick={() => password === 'admin123' ? setLoggedIn(true) : setError('Wrong password')} style={{...T.primaryBtn, marginTop: 8}}>Sign In</button>
            <div style={{background: '#F5F4F2', borderRadius: 10, padding: '10px 14px', marginTop: 16, fontSize: 12, color: '#6B6560'}}>
              <strong>Demo:</strong> admin123
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={T.page}>
      {/* HEADER */}
      <div style={{background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EFED', position: 'sticky', top: 0, zIndex: 100}}>
        <button onClick={onBack} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><Icons.back /></button>
        <div style={{textAlign: 'center'}}>
          <div style={{fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif"}}>Food Court Manager</div>
          <div style={{fontSize: 11, color: '#9B9590', letterSpacing: 0.2}}>THE FOOD QUARTER</div>
        </div>
        <button onClick={() => setLoggedIn(false)} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#9B9590', fontSize: 12, fontWeight: 500}}>Logout</button>
      </div>

      {/* TOP STATS */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#F0EFED'}}>
        {[
          { label: 'Revenue', value: `£${(totalRevenue/1000).toFixed(1)}k` },
          { label: 'Orders', value: totalOrders },
          { label: 'Rating', value: avgRating },
          { label: 'Tables', value: `${occupiedTables}/12` },
        ].map(s => (
          <div key={s.label} style={{background: '#fff', padding: '14px 8px', textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: 18, color: '#1A1A1A', fontFamily: "'DM Serif Display', serif"}}>{s.value}</div>
            <div style={{fontSize: 10, color: '#9B9590', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{display: 'flex', background: '#fff', borderBottom: '1px solid #F0EFED'}}>
        {[
          { key: 'overview', icon: <Icons.analytics />, label: 'Overview' },
          { key: 'vendors', icon: <Icons.vendors />, label: 'Vendors' },
          { key: 'tables', icon: <Icons.tables />, label: 'Tables' },
          { key: 'revenue', icon: <Icons.revenue />, label: 'Revenue' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{flex: 1, padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${view === tab.key ? '#1A1A1A' : 'transparent'}`, fontWeight: view === tab.key ? 600 : 400, fontSize: 11, color: view === tab.key ? '#1A1A1A' : '#9B9590', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div style={{padding: 16}}>

        {/* OVERVIEW */}
        {view === 'overview' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Today's Overview</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Food court performance at a glance</div>

            {/* ALERTS */}
            {tables.filter(t => t.status === 'waiter').length > 0 && (
              <div style={{...T.card, padding: 14, marginBottom: 12, borderLeft: '3px solid #C2410C', display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 8, height: 8, borderRadius: 4, background: '#C2410C', animation: 'pulse 1s infinite', flexShrink: 0}} />
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 13}}>{tables.filter(t => t.status === 'waiter').length} tables need attention</div>
                  <div style={{fontSize: 12, color: '#9B9590', marginTop: 1}}>Tables {tables.filter(t => t.status === 'waiter').map(t => t.id).join(', ')} have waiter requests</div>
                </div>
                <button onClick={() => setView('tables')} style={{padding: '6px 12px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer'}}>View</button>
              </div>
            )}

            {/* VENDOR PERFORMANCE */}
            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{...T.label, marginBottom: 14}}>Vendor Performance</div>
              {vendors.map((v, i) => (
                <div key={v.id} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < vendors.length - 1 ? '1px solid #F5F4F2' : 'none'}}>
                  <div style={{width: 36, height: 36, borderRadius: 10, background: '#F5F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#1A1A1A', fontFamily: "'DM Serif Display', serif", flexShrink: 0}}>{v.name[0]}</div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontWeight: 600, fontSize: 13, marginBottom: 3}}>{v.name}</div>
                    <div style={{height: 3, background: '#F0EFED', borderRadius: 2}}>
                      <div style={{height: '100%', width: `${(v.revenue / totalRevenue) * 100}%`, background: '#1A1A1A', borderRadius: 2}} />
                    </div>
                  </div>
                  <div style={{textAlign: 'right', flexShrink: 0}}>
                    <div style={{fontWeight: 700, fontSize: 13}}>£{v.revenue.toFixed(0)}</div>
                    <div style={{fontSize: 11, color: '#9B9590'}}>{v.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>

            {/* PEAK HOURS */}
            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{...T.label, marginBottom: 14}}>Peak Hours Today</div>
              {[
                {time:'11:00', orders:24, pct:48},
                {time:'12:00', orders:45, pct:90},
                {time:'13:00', orders:50, pct:100},
                {time:'14:00', orders:38, pct:76},
                {time:'15:00', orders:18, pct:36},
                {time:'18:00', orders:42, pct:84},
                {time:'19:00', orders:48, pct:96},
                {time:'20:00', orders:31, pct:62},
              ].map(h => (
                <div key={h.time} style={{marginBottom: 8}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 3}}>
                    <span style={{fontSize: 12, color: '#6B6560'}}>{h.time}</span>
                    <span style={{fontSize: 12, fontWeight: 600}}>{h.orders} orders</span>
                  </div>
                  <div style={{height: 5, background: '#F0EFED', borderRadius: 3}}>
                    <div style={{height: '100%', width: `${h.pct}%`, background: h.pct > 80 ? '#C2410C' : '#1A1A1A', borderRadius: 3}} />
                  </div>
                </div>
              ))}
            </div>

            {/* CROSS VENDOR */}
            <div style={{...T.card, padding: 16}}>
              <div style={{...T.label, marginBottom: 4}}>Cross-Vendor Insights</div>
              <div style={{fontSize: 12, color: '#9B9590', marginBottom: 14}}>Most common vendor combinations</div>
              {[
                {combo:'Burger Bros + Green Bowl', pct:67, count:89},
                {combo:'Sushi Sato + Green Bowl', pct:54, count:72},
                {combo:'Pizza Palace + Burger Bros', pct:41, count:55},
              ].map((item, i) => (
                <div key={item.combo} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i < 2 ? '1px solid #F5F4F2':'none'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600, fontSize:13, marginBottom:2}}>{item.combo}</div>
                    <div style={{fontSize:11, color:'#9B9590'}}>{item.count} customers ordered both</div>
                  </div>
                  <div style={{fontWeight:700, fontSize:15, fontFamily:"'DM Serif Display', serif"}}>{item.pct}%</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VENDORS */}
        {view === 'vendors' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>All Vendors</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Manage and monitor all stores</div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16}}>
              {[
                {label:'Active', value: vendors.filter(v=>v.status==='active').length, color:'#15803D'},
                {label:'Inactive', value: vendors.filter(v=>v.status==='inactive').length, color:'#9B9590'},
              ].map(s => (
                <div key={s.label} style={{...T.card, padding:'14px', textAlign:'center'}}>
                  <div style={{fontWeight:800, fontSize:24, color:s.color, fontFamily:"'DM Serif Display', serif"}}>{s.value}</div>
                  <div style={{fontSize:11, color:'#9B9590', fontWeight:600, marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {vendors.map(v => (
              <div key={v.id} style={{...T.card, padding:16, marginBottom:10}}>
                <div style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:12}}>
                  <div style={{width:44, height:44, borderRadius:12, background:'#F5F4F2', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, color:'#1A1A1A', fontFamily:"'DM Serif Display', serif", flexShrink:0}}>{v.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700, fontSize:15, marginBottom:2}}>{v.name}</div>
                    <div style={{fontSize:12, color:'#9B9590'}}>{v.cuisine}</div>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4}}>
                    <div style={{background: v.status==='active' ? '#F0FDF4':'#F5F4F2', color:v.status==='active'?'#15803D':'#9B9590', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600}}>
                      {v.status}
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:3, color:'#D97706', fontSize:12, fontWeight:600}}>
                      <Icons.star /> {v.rating}
                    </div>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12}}>
                  {[
                    {label:'Revenue', value:`£${v.revenue.toFixed(0)}`},
                    {label:'Orders', value:v.orders},
                    {label:'Tables', value:`${v.tables_active} active`},
                  ].map(s => (
                    <div key={s.label} style={{background:'#F5F4F2', borderRadius:10, padding:'10px 8px', textAlign:'center'}}>
                      <div style={{fontWeight:700, fontSize:14, fontFamily:"'DM Serif Display', serif"}}>{s.value}</div>
                      <div style={{fontSize:10, color:'#9B9590', fontWeight:600, marginTop:1}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={() => setVendors(prev => prev.map(vv => vv.id===v.id ? {...vv, status: vv.status==='active'?'inactive':'active'} : vv))}
                    style={{flex:1, padding:'9px', background: v.status==='active'?'#FEF2F2':'#F0FDF4', color:v.status==='active'?'#DC2626':'#15803D', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:12}}>
                    {v.status==='active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button style={{flex:1, padding:'9px', background:'#F5F4F2', color:'#1A1A1A', border:'none', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:12}}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* TABLES */}
        {view === 'tables' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Table Management</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Real-time floor view across all vendors</div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16}}>
              {[
                {label:'Occupied', value:tables.filter(t=>t.status==='occupied').length, color:'#1D4ED8'},
                {label:'Needs Help', value:tables.filter(t=>t.status==='waiter').length, color:'#C2410C'},
                {label:'Empty', value:tables.filter(t=>t.status==='empty').length, color:'#9B9590'},
              ].map(s => (
                <div key={s.label} style={{...T.card, padding:'12px 8px', textAlign:'center'}}>
                  <div style={{fontWeight:800, fontSize:22, color:s.color, fontFamily:"'DM Serif Display', serif"}}>{s.value}</div>
                  <div style={{fontSize:10, color:'#9B9590', fontWeight:600, marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* HEATMAP */}
            <div style={{...T.card, padding:16, marginBottom:16}}>
              <div style={{...T.label, marginBottom:4}}>Revenue Heatmap</div>
              <div style={{fontSize:12, color:'#9B9590', marginBottom:12}}>Spend per table today</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6}}>
                {tables.map(table => {
                  const maxSpend = Math.max(...tables.map(t => t.spend || 0));
                  const heat = table.spend ? (table.spend / maxSpend) : 0;
                  return (
                    <div key={table.id} style={{background:`rgba(194,65,12,${0.08 + heat*0.85})`, borderRadius:10, padding:'12px 8px', textAlign:'center', position:'relative'}}>
                      {table.status==='waiter' && <div style={{position:'absolute', top:5, right:5, width:7, height:7, borderRadius:4, background:'#C2410C', animation:'pulse 1s infinite'}} />}
                      <div style={{fontWeight:700, fontSize:15, color: heat>0.4?'#fff':'#1A1A1A', fontFamily:"'DM Serif Display', serif"}}>{table.id}</div>
                      <div style={{fontSize:9, color: heat>0.4?'rgba(255,255,255,0.8)':'#9B9590', marginTop:2}}>
                        {table.spend ? `£${table.spend.toFixed(0)}` : 'Empty'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TABLE LIST */}
            {tables.filter(t => t.status !== 'empty').map(table => (
              <div key={table.id} style={{...T.card, padding:14, marginBottom:8, display:'flex', alignItems:'center', gap:12, borderLeft: table.status==='waiter'?'3px solid #C2410C':'1px solid #F0EFED'}}>
                <div style={{width:40, height:40, borderRadius:10, background:table.status==='waiter'?'#FFF7ED':'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:table.status==='waiter'?'#C2410C':'#1D4ED8', fontFamily:"'DM Serif Display', serif", flexShrink:0}}>{table.id}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:13, marginBottom:2}}>Table {table.id} · {table.vendor}</div>
                  <div style={{fontSize:11, color:'#9B9590', display:'flex', alignItems:'center', gap:8}}>
                    <span style={{display:'flex', alignItems:'center', gap:3}}><Icons.clock /> Since {table.since}</span>
                    <span>·</span>
                    <span>£{table.spend?.toFixed(2)}</span>
                  </div>
                </div>
                {table.status === 'waiter' && (
                  <button onClick={() => setTables(prev => prev.map(t => t.id===table.id ? {...t, status:'occupied'} : t))}
                    style={{padding:'7px 12px', background:'#1A1A1A', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:4}}>
                    <Icons.check /> Done
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {/* REVENUE */}
        {view === 'revenue' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Revenue Analytics</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Food court financial overview</div>

            <div style={{...T.card, padding:16, marginBottom:12}}>
              <div style={{...T.label, marginBottom:14}}>This Week</div>
              {[
                {day:'Mon', revenue:1240, pct:62},
                {day:'Tue', revenue:980, pct:49},
                {day:'Wed', revenue:1560, pct:78},
                {day:'Thu', revenue:1890, pct:95},
                {day:'Fri', revenue:2000, pct:100},
                {day:'Sat', revenue:1750, pct:88},
                {day:'Sun', revenue:1450, pct:73},
              ].map(d => (
                <div key={d.day} style={{display:'flex', alignItems:'center', gap:12, marginBottom:10}}>
                  <div style={{fontSize:12, color:'#6B6560', width:28}}>{d.day}</div>
                  <div style={{flex:1, height:6, background:'#F0EFED', borderRadius:3}}>
                    <div style={{height:'100%', width:`${d.pct}%`, background:'#1A1A1A', borderRadius:3}} />
                  </div>
                  <div style={{fontSize:12, fontWeight:600, width:48, textAlign:'right'}}>£{d.revenue}</div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding:16, marginBottom:12}}>
              <div style={{...T.label, marginBottom:14}}>Revenue by Vendor</div>
              {vendors.map((v, i) => (
                <div key={v.id} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<vendors.length-1?'1px solid #F5F4F2':'none'}}>
                  <div style={{width:32, height:32, borderRadius:8, background:'#F5F4F2', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'#1A1A1A', fontFamily:"'DM Serif Display', serif", flexShrink:0}}>{v.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600, fontSize:13, marginBottom:4}}>{v.name}</div>
                    <div style={{height:4, background:'#F0EFED', borderRadius:2}}>
                      <div style={{height:'100%', width:`${(v.revenue/totalRevenue)*100}%`, background:'#1A1A1A', borderRadius:2}} />
                    </div>
                  </div>
                  <div style={{textAlign:'right', flexShrink:0}}>
                    <div style={{fontWeight:700, fontSize:14}}>£{v.revenue.toFixed(0)}</div>
                    <div style={{fontSize:11, color:'#9B9590'}}>{((v.revenue/totalRevenue)*100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding:16}}>
              <div style={{...T.label, marginBottom:14}}>Key Metrics</div>
              {[
                {label:'Total Revenue (Today)', value:`£${totalRevenue.toFixed(2)}`, trend:'+12%'},
                {label:'Total Orders', value:totalOrders, trend:'+8%'},
                {label:'Avg Order Value', value:`£${(totalRevenue/totalOrders).toFixed(2)}`, trend:'+3%'},
                {label:'Active Tables', value:`${occupiedTables}/12`, trend:''},
                {label:'Avg Vendor Rating', value:`${avgRating} ★`, trend:''},
                {label:'Commission (8%)', value:`£${(totalRevenue*0.08).toFixed(2)}`, trend:''},
              ].map((item, i) => (
                <div key={item.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom: i<5?'1px solid #F5F4F2':'none'}}>
                  <div style={{fontSize:13, color:'#6B6560'}}>{item.label}</div>
                  <div style={{display:'flex', alignItems:'center', gap:6}}>
                    {item.trend && <div style={{fontSize:11, color:'#15803D', fontWeight:600, display:'flex', alignItems:'center', gap:2}}><Icons.up />{item.trend}</div>}
                    <div style={{fontWeight:700, fontSize:14, fontFamily:"'DM Serif Display', serif"}}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}