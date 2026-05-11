import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { display: none; }
  input, button, textarea, select { font-family: 'DM Sans', sans-serif; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideIn { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes ring { 0%{transform:rotate(0)} 10%{transform:rotate(15deg)} 20%{transform:rotate(-15deg)} 30%{transform:rotate(10deg)} 40%{transform:rotate(-10deg)} 50%{transform:rotate(0)} 100%{transform:rotate(0)} }
  @keyframes notif { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
`;

const Icons = {
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  orders: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  menu: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  analytics: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  kitchen: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  waiter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  logout: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
};

const DUMMY_ORDERS = [
  { id: 1047, table_number: 3, status: 'new', total: 24.97, created_at: new Date(Date.now() - 120000).toISOString(), items_summary: '2× Classic Burger, 1× Cheese Fries' },
  { id: 1046, table_number: 7, status: 'preparing', total: 19.98, created_at: new Date(Date.now() - 300000).toISOString(), items_summary: '1× Double Smash, 1× Chocolate Shake' },
  { id: 1045, table_number: 12, status: 'ready', total: 12.98, created_at: new Date(Date.now() - 600000).toISOString(), items_summary: '2× Cheese Fries, 1× Lemonade' },
  { id: 1044, table_number: 1, status: 'delivered', total: 35.96, created_at: new Date(Date.now() - 1800000).toISOString(), items_summary: '3× Classic Burger, 1× Double Smash' },
];

const DUMMY_MENU = [
  { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, aged cheddar', price: 9.99, category: 'Burgers', is_available: 1, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: 2, name: 'Double Smash', description: 'Double smash patty, special sauce, pickles', price: 12.99, category: 'Burgers', is_available: 1, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200' },
  { id: 3, name: 'Cheese Fries', description: 'Hand-cut fries, aged cheddar sauce', price: 4.99, category: 'Sides', is_available: 1, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
  { id: 4, name: 'Chocolate Shake', description: 'Thick Belgian chocolate milkshake', price: 5.99, category: 'Drinks', is_available: 1, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200' },
];

const DUMMY_WAITER = [
  { id: 1, table_number: 4, created_at: new Date(Date.now() - 90000).toISOString() },
  { id: 2, table_number: 9, created_at: new Date(Date.now() - 240000).toISOString() },
];

const TABLE_STATUS = [
  { id: 1, status: 'occupied', since: '14:23', orders: 2, spend: 34.98 },
  { id: 2, status: 'empty', since: null, orders: 0, spend: 0 },
  { id: 3, status: 'occupied', since: '14:31', orders: 1, spend: 24.97 },
  { id: 4, status: 'waiter', since: '14:38', orders: 1, spend: 18.99 },
  { id: 5, status: 'occupied', since: '14:15', orders: 3, spend: 67.50 },
  { id: 6, status: 'empty', since: null, orders: 0, spend: 0 },
  { id: 7, status: 'occupied', since: '14:29', orders: 2, spend: 45.98 },
  { id: 8, status: 'empty', since: null, orders: 0, spend: 0 },
  { id: 9, status: 'waiter', since: '14:41', orders: 2, spend: 29.98 },
  { id: 10, status: 'occupied', since: '14:20', orders: 4, spend: 89.96 },
  { id: 11, status: 'empty', since: null, orders: 0, spend: 0 },
  { id: 12, status: 'occupied', since: '14:35', orders: 1, spend: 12.98 },
];

const Badge = ({ count }) => count > 0 ? (
  <div style={{position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: '#C2410C', border: '1.5px solid #FAFAF9'}} />
) : null;

export default function VendorApp({ onLogout }) {
  const [token, setToken] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [view, setView] = useState('orders');
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [menuItems, setMenuItems] = useState(DUMMY_MENU);
  const [waiterRequests, setWaiterRequests] = useState(DUMMY_WAITER);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', cuisine: '', description: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: null, imagePreview: null });
  const [filterStatus, setFilterStatus] = useState('all');
  const [queueWait, setQueueWait] = useState(18);
  const [happyHour, setHappyHour] = useState(false);
  const [happyDiscount, setHappyDiscount] = useState(20);
  const [kitchenView, setKitchenView] = useState('board');
  const [tables, setTables] = useState(TABLE_STATUS);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Simulate live notifications
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      const newNotif = { id: Date.now(), type: 'order', message: 'New order from Table 5', time: new Date(), read: false };
      setNotifications(prev => [newNotif, ...prev]);
      setOrders(prev => [...prev, { id: 1048, table_number: 5, status: 'new', total: 18.98, created_at: new Date().toISOString(), items_summary: '1× Chicken Burger, 1× Onion Rings' }]);
    }, 8000);
    const timer2 = setTimeout(() => {
      const newNotif = { id: Date.now() + 1, type: 'waiter', message: 'Table 11 needs assistance', time: new Date(), read: false };
      setNotifications(prev => [newNotif, ...prev]);
      setWaiterRequests(prev => [...prev, { id: 99, table_number: 11, created_at: new Date().toISOString() }]);
    }, 20000);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, [token]);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const kitchenPending = orders.filter(o => ['new', 'preparing'].includes(o.status)).length;
  const tableAlerts = tables.filter(t => t.status === 'waiter').length;

  const stats = {
    new_orders: newOrders,
    preparing: orders.filter(o => o.status === 'preparing').length,
    today_revenue: orders.reduce((s, o) => s + o.total, 0),
    today_orders: orders.length,
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vendor/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.token) { setToken(data.token); setVendor(data.vendor); }
      else { setToken('demo'); setVendor({ name: loginForm.email.split('@')[0] || 'My Store', cuisine: 'Street Food', email: loginForm.email }); }
    } catch { setToken('demo'); setVendor({ name: 'Demo Store', cuisine: 'Street Food', email: loginForm.email }); }
  };

  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vendor/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.token) { setToken(data.token); setVendor(data.vendor); }
      else showMsg(data.error || 'Registration failed');
    } catch { showMsg('Connection error'); }
  };

  const logout = () => { setToken(null); setVendor(null); onLogout(); };

  const updateOrderStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
    const notif = { id: Date.now(), type: 'order', message: `Order #${id} marked ${status}`, time: new Date(), read: false };
    setNotifications(prev => [notif, ...prev]);
  };

  const dismissWaiter = (id) => {
    setWaiterRequests(prev => prev.filter(r => r.id !== id));
    setTables(prev => prev.map(t => t.id === waiterRequests.find(w => w.id === id)?.table_number ? {...t, status: 'occupied'} : t));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewItem(prev => ({...prev, image: file, imagePreview: ev.target.result}));
    reader.readAsDataURL(file);
  };

  const addMenuItem = async () => {
    if (!newItem.name || !newItem.price) return;
    let image_url = newItem.imagePreview;
    if (newItem.image && token !== 'demo') {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('price', newItem.price);
      formData.append('category', newItem.category);
      formData.append('image', newItem.image);
      try {
        const res = await fetch(`${API_URL}/api/vendor/menu`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        const data = await res.json();
        if (data.id) { setMenuItems(prev => [...prev, data]); setNewItem({ name: '', description: '', price: '', category: '', image: null, imagePreview: null }); showMsg('Item added!'); return; }
      } catch {}
    }
    setMenuItems(prev => [...prev, { id: Date.now(), name: newItem.name, description: newItem.description, price: parseFloat(newItem.price), category: newItem.category, is_available: 1, image_url }]);
    setNewItem({ name: '', description: '', price: '', category: '', image: null, imagePreview: null });
    showMsg('Item added to menu');
  };

  const deleteMenuItem = (id) => setMenuItems(prev => prev.filter(i => i.id !== id));
  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const T = {
    page: { minHeight: '100vh', background: '#FAFAF9', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    header: { background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EFED', position: 'sticky', top: 0, zIndex: 100 },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #F0EFED' },
    primaryBtn: { width: '100%', padding: '15px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    ghostBtn: { width: '100%', padding: '14px', background: '#fff', color: '#1A1A1A', border: '1.5px solid #E8E6E3', borderRadius: 12, fontWeight: 500, fontSize: 14, cursor: 'pointer' },
    input: { width: '100%', padding: '13px 14px', border: '1.5px solid #E8E6E3', borderRadius: 10, fontSize: 14, background: '#FAFAF9', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 600, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6, display: 'block' },
    statusBadge: (s) => {
      const map = { new: ['#FFF7ED','#C2410C'], preparing: ['#EFF6FF','#1D4ED8'], ready: ['#F0FDF4','#15803D'], delivered: ['#F5F4F2','#6B6560'] };
      const [bg, color] = map[s] || ['#F5F4F2','#6B6560'];
      return { background: bg, color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' };
    },
  };

  // LOGIN
  if (!token) {
    return (
      <div style={{minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column'}}>
        <div style={{background:'#1A1A1A',padding:'20px 20px 40px',textAlign:'center'}}><div style={{display:'flex',marginBottom:24}}><button onClick={onLogout} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:10,padding:'8px 10px',cursor:'pointer',display:'flex',alignItems:'center',color:'#fff'}}><Icons.back /></button></div>
          <div style={{fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12}}>The Food Quarter</div>
          <div style={{color: '#fff', fontWeight: 700, fontSize: 28, fontFamily: "'DM Serif Display', serif", letterSpacing: -0.5}}>Vendor Portal</div>
          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6}}>Manage your store</div>
        </div>
        <div style={{flex: 1, padding: '0 20px 40px'}}>
          <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: 28, border: '1px solid #F0EFED', borderTop: 'none', marginBottom: 20}}>
            {message && <div style={{background: '#FFF7ED', color: '#C2410C', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13}}>{message}</div>}
            {!showRegister ? (
              <>
                <div style={{fontWeight: 700, fontSize: 20, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>Welcome back</div>
                <div style={{color: '#9B9590', fontSize: 13, marginBottom: 24}}>Sign in to your vendor account</div>
                <label style={T.label}>Email</label>
                <input type="email" style={{...T.input, marginBottom: 12}} placeholder="you@store.com" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                <label style={T.label}>Password</label>
                <input type="password" style={{...T.input, marginBottom: 20}} placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} onKeyPress={e => e.key === 'Enter' && login()} />
                <button onClick={login} style={T.primaryBtn}>Sign In</button>
                <div style={{textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9B9590'}}>
                  New vendor? <span style={{color: '#1A1A1A', fontWeight: 600, cursor: 'pointer'}} onClick={() => setShowRegister(true)}>Register →</span>
                </div>
                <div style={{background: '#F5F4F2', borderRadius: 10, padding: '10px 14px', marginTop: 16, fontSize: 12, color: '#6B6560'}}>
                  <strong>Demo:</strong> burger@test.com / password123
                </div>
              </>
            ) : (
              <>
                <div style={{fontWeight: 700, fontSize: 20, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>Join The Food Quarter</div>
                <div style={{color: '#9B9590', fontSize: 13, marginBottom: 24}}>Create your vendor account</div>
                {[{key:'name',label:'Store Name',placeholder:'e.g. Burger Bros',type:'text'},{key:'email',label:'Email',placeholder:'you@store.com',type:'email'},{key:'password',label:'Password',placeholder:'••••••••',type:'password'},{key:'cuisine',label:'Cuisine Type',placeholder:'e.g. American',type:'text'},{key:'description',label:'Short Description',placeholder:'What makes you special?',type:'text'}].map(f => (
                  <div key={f.key} style={{marginBottom: 12}}>
                    <label style={T.label}>{f.label}</label>
                    <input type={f.type} style={T.input} placeholder={f.placeholder} value={registerForm[f.key]} onChange={e => setRegisterForm({...registerForm, [f.key]: e.target.value})} />
                  </div>
                ))}
                <button onClick={register} style={{...T.primaryBtn, marginTop: 8}}>Create Account</button>
                <div style={{textAlign: 'center', marginTop: 16, fontSize: 13, color: '#9B9590'}}>
                  Already registered? <span style={{color: '#1A1A1A', fontWeight: 600, cursor: 'pointer'}} onClick={() => setShowRegister(false)}>Sign in →</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={T.page}>

      {/* LIVE NOTIFICATIONS */}
      {notifications.filter(n => !n.read).slice(0,1).map(notif => (
        <div key={notif.id} style={{position: 'fixed', top: 16, right: 16, left: 16, maxWidth: 448, margin: '0 auto', background: '#1A1A1A', color: '#fff', borderRadius: 14, padding: '14px 16px', zIndex: 999, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: 'notif 0.3s ease'}}>
          <div style={{width: 36, height: 36, borderRadius: 18, background: notif.type === 'order' ? '#C2410C' : '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'ring 1s ease'}}>
            <Icons.bell />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 600, fontSize: 13}}>{notif.message}</div>
            <div style={{fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2}}>Just now</div>
          </div>
          <button onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n))} style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500}}>
            Dismiss
          </button>
        </div>
      ))}

      {/* HEADER */}
      <div style={T.header}>
        <div>
          <div style={{fontWeight: 600, fontSize: 15, color: '#1A1A1A', letterSpacing: -0.2}}>{vendor?.name}</div>
          <div style={{fontSize: 11, color: '#9B9590', marginTop: 1, letterSpacing: 0.2}}>{vendor?.cuisine?.toUpperCase()}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <button onClick={() => { setShowNotifPanel(!showNotifPanel); setNotifications(prev => prev.map(n => ({...n, read: true}))); }}
            style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icons.bell />
            <Badge count={unreadNotifs} />
          </button>
          <button onClick={logout} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#6B6560', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
            <Icons.logout /> Logout
          </button>
        </div>
      </div>

      {/* NOTIFICATION PANEL */}
      {showNotifPanel && (
        <div style={{background: '#fff', border: '1px solid #F0EFED', borderRadius: 16, margin: '8px 16px', padding: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
          <div style={{fontWeight: 600, fontSize: 14, marginBottom: 12}}>Notifications</div>
          {notifications.length === 0 ? (
            <div style={{fontSize: 13, color: '#9B9590', textAlign: 'center', padding: '12px 0'}}>No notifications</div>
          ) : notifications.slice(0, 5).map(n => (
            <div key={n.id} style={{display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F4F2'}}>
              <div style={{width: 8, height: 8, borderRadius: 4, background: n.read ? '#E8E6E3' : '#C2410C', flexShrink: 0}} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 13, fontWeight: n.read ? 400 : 600}}>{n.message}</div>
                <div style={{fontSize: 11, color: '#9B9590', marginTop: 1}}>{n.time.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATS */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#F0EFED'}}>
        {[
          { label: 'New', value: stats.new_orders, alert: stats.new_orders > 0 },
          { label: 'Preparing', value: stats.preparing },
          { label: 'Orders', value: stats.today_orders },
          { label: 'Revenue', value: `£${stats.today_revenue.toFixed(0)}` },
        ].map(stat => (
          <div key={stat.label} style={{background: '#fff', padding: '14px 8px', textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: 20, color: stat.alert ? '#C2410C' : '#1A1A1A', fontFamily: "'DM Serif Display', serif"}}>{stat.value}</div>
            <div style={{fontSize: 10, color: '#9B9590', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TABS WITH BADGES */}
      <div style={{display: 'flex', background: '#fff', borderBottom: '1px solid #F0EFED', overflowX: 'auto'}}>
        {[
          { key: 'orders', icon: <Icons.orders />, label: 'Orders', badge: newOrders },
          { key: 'kitchen', icon: <Icons.kitchen />, label: 'Kitchen', badge: kitchenPending },
          { key: 'tables', icon: <Icons.users />, label: 'Tables', badge: tableAlerts },
          { key: 'waiter', icon: <Icons.waiter />, label: 'Waiter', badge: waiterRequests.length },
          { key: 'menu', icon: <Icons.menu />, label: 'Menu', badge: 0 },
          { key: 'analytics', icon: <Icons.analytics />, label: 'Analytics', badge: 0 },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{flex: 1, padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${view === tab.key ? '#1A1A1A' : 'transparent'}`, fontWeight: view === tab.key ? 600 : 400, fontSize: 11, color: view === tab.key ? '#1A1A1A' : '#9B9590', cursor: 'pointer', letterSpacing: 0.3, whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative'}}>
            <div style={{position: 'relative', display: 'inline-flex'}}>
              {tab.icon}
              <Badge count={tab.badge} />
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {message && <div style={{background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '10px 20px', fontSize: 13, color: '#166534', fontWeight: 500, textAlign: 'center'}}>{message}</div>}

      <div style={{padding: 16}}>

        {/* ORDERS */}
        {view === 'orders' && (
          <>
            <div style={{display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 2}}>
              {['all', 'new', 'preparing', 'ready', 'delivered'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filterStatus === s ? '#1A1A1A' : '#E8E6E3'}`, background: filterStatus === s ? '#1A1A1A' : '#fff', color: filterStatus === s ? '#fff' : '#6B6560', fontWeight: 500, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap'}}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div style={{...T.card, padding: 16, marginBottom: 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 14}}>Queue Wait Time</div>
                  <div style={{fontSize: 12, color: '#9B9590', marginTop: 2}}>Shown to customers before ordering</div>
                </div>
                <div style={{background: '#F5F4F2', padding: '6px 14px', borderRadius: 10, fontWeight: 700, fontSize: 20, fontFamily: "'DM Serif Display', serif"}}>{queueWait}m</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
                <button onClick={() => setQueueWait(Math.max(5, queueWait - 5))} style={{width: 32, height: 32, borderRadius: 16, border: '1.5px solid #E8E6E3', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16}}>−</button>
                <div style={{flex: 1, height: 4, background: '#F0EFED', borderRadius: 2}}>
                  <div style={{height: '100%', width: `${(queueWait / 60) * 100}%`, background: queueWait > 30 ? '#C2410C' : queueWait > 15 ? '#D97706' : '#15803D', borderRadius: 2, transition: 'all 0.3s'}} />
                </div>
                <button onClick={() => setQueueWait(Math.min(60, queueWait + 5))} style={{width: 32, height: 32, borderRadius: 16, border: '1.5px solid #E8E6E3', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16}}>+</button>
              </div>
              <div style={{paddingTop: 14, borderTop: '1px solid #F0EFED', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 13}}>Happy Hour</div>
                  <div style={{fontSize: 12, color: '#9B9590'}}>{happyDiscount}% off all items</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  {happyHour && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                      <button onClick={() => setHappyDiscount(Math.max(5, happyDiscount - 5))} style={{width: 24, height: 24, borderRadius: 12, border: '1px solid #E8E6E3', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700}}>−</button>
                      <span style={{fontWeight: 700, fontSize: 14, minWidth: 30, textAlign: 'center'}}>{happyDiscount}%</span>
                      <button onClick={() => setHappyDiscount(Math.min(50, happyDiscount + 5))} style={{width: 24, height: 24, borderRadius: 12, border: '1px solid #E8E6E3', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700}}>+</button>
                    </div>
                  )}
                  <button onClick={() => setHappyHour(!happyHour)} style={{width: 44, height: 24, borderRadius: 12, background: happyHour ? '#1A1A1A' : '#E8E6E3', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s'}}>
                    <div style={{width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 3, left: happyHour ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'}} />
                  </button>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px 20px', color: '#9B9590'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>—</div>
                <div style={{fontWeight: 600, fontSize: 15}}>No orders</div>
              </div>
            ) : filteredOrders.map(order => (
              <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, animation: 'slideIn 0.3s ease', borderLeft: order.status === 'new' ? '3px solid #C2410C' : '1px solid #F0EFED'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif"}}>Table {order.table_number}</div>
                    <div style={{fontSize: 11, color: '#9B9590', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4}}><Icons.clock /> {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                  <div style={T.statusBadge(order.status)}>{order.status}</div>
                </div>
                <div style={{fontSize: 13, color: '#6B6560', marginBottom: 10, lineHeight: 1.5}}>{order.items_summary}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontWeight: 700, fontSize: 16}}>£{Number(order.total).toFixed(2)}</div>
                  <div>
                    {order.status === 'new' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} style={{padding: '8px 16px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 12}}>Start Preparing</button>}
                    {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'ready')} style={{padding: '8px 16px', background: '#15803D', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 12}}>Mark Ready</button>}
                    {order.status === 'ready' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{padding: '8px 16px', background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 12}}>Delivered</button>}
                    {order.status === 'delivered' && <div style={{fontSize: 12, color: '#9B9590', display: 'flex', alignItems: 'center', gap: 4}}><Icons.check /> Complete</div>}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* KITCHEN */}
        {view === 'kitchen' && (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <div>
                <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif"}}>Kitchen Display</div>
                <div style={{fontSize: 12, color: '#9B9590', marginTop: 2}}>Live order board</div>
              </div>
              <div style={{display: 'flex', background: '#F5F4F2', borderRadius: 10, padding: 3, gap: 2}}>
                {['board', 'list'].map(v => (
                  <button key={v} onClick={() => setKitchenView(v)} style={{padding: '6px 12px', borderRadius: 8, border: 'none', background: kitchenView === v ? '#1A1A1A' : 'transparent', color: kitchenView === v ? '#fff' : '#6B6560', fontWeight: 500, fontSize: 12, cursor: 'pointer'}}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {kitchenView === 'board' ? (
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                {['new', 'preparing'].map(status => (
                  <div key={status}>
                    <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6}}>
                      <div style={{width: 8, height: 8, borderRadius: 4, background: status === 'new' ? '#C2410C' : '#1D4ED8', animation: status === 'new' ? 'pulse 1.5s infinite' : 'none'}} />
                      {status === 'new' ? 'Incoming' : 'In Progress'}
                    </div>
                    {orders.filter(o => o.status === status).map(order => (
                      <div key={order.id} style={{...T.card, padding: 14, marginBottom: 8, borderLeft: `3px solid ${status === 'new' ? '#C2410C' : '#1D4ED8'}`}}>
                        <div style={{fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>T{order.table_number}</div>
                        <div style={{fontSize: 11, color: '#6B6560', lineHeight: 1.5, marginBottom: 8}}>{order.items_summary}</div>
                        <button onClick={() => updateOrderStatus(order.id, status === 'new' ? 'preparing' : 'ready')} style={{width: '100%', padding: '8px', background: status === 'new' ? '#1A1A1A' : '#15803D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 11}}>
                          {status === 'new' ? 'Accept' : 'Ready'}
                        </button>
                      </div>
                    ))}
                    {orders.filter(o => o.status === status).length === 0 && (
                      <div style={{...T.card, padding: 20, textAlign: 'center', color: '#C4BFB8', fontSize: 13}}>Empty</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              orders.filter(o => ['new','preparing'].includes(o.status)).map(order => (
                <div key={order.id} style={{...T.card, padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14}}>
                  <div style={{width: 40, height: 40, borderRadius: 10, background: order.status === 'new' ? '#FFF7ED' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: order.status === 'new' ? '#C2410C' : '#1D4ED8', fontFamily: "'DM Serif Display', serif", flexShrink: 0}}>{order.table_number}</div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 12, color: '#6B6560', lineHeight: 1.4, marginBottom: 2}}>{order.items_summary}</div>
                    <div style={{fontSize: 11, color: '#9B9590', display: 'flex', alignItems: 'center', gap: 3}}><Icons.clock /> {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                  <button onClick={() => updateOrderStatus(order.id, order.status === 'new' ? 'preparing' : 'ready')} style={{padding: '8px 12px', background: order.status === 'new' ? '#1A1A1A' : '#15803D', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap'}}>
                    {order.status === 'new' ? 'Accept' : 'Ready'}
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* TABLES */}
        {view === 'tables' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Table Status</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Live view — updates when customers scan QR</div>
            <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
              {[{status:'occupied',label:'Occupied',color:'#1D4ED8'},{status:'waiter',label:'Needs Help',color:'#C2410C'},{status:'empty',label:'Empty',color:'#9B9590'}].map(s => (
                <div key={s.status} style={{...T.card, padding: '10px 14px', flex: 1, textAlign: 'center'}}>
                  <div style={{fontWeight: 700, fontSize: 18, color: s.color, fontFamily: "'DM Serif Display', serif"}}>{tables.filter(t => t.status === s.status).length}</div>
                  <div style={{fontSize: 10, color: '#9B9590', fontWeight: 600, letterSpacing: 0.3, marginTop: 2}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16}}>
              {tables.map(table => {
                const colors = {occupied:'#EFF6FF', waiter:'#FFF7ED', empty:'#F5F4F2'};
                const textColors = {occupied:'#1D4ED8', waiter:'#C2410C', empty:'#C4BFB8'};
                return (
                  <div key={table.id} style={{background: colors[table.status], borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: table.status === 'waiter' ? '1.5px solid #FED7AA' : '1px solid transparent', position: 'relative'}}>
                    {table.status === 'waiter' && <div style={{position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, background: '#C2410C', animation: 'pulse 1s infinite'}} />}
                    <div style={{fontWeight: 700, fontSize: 16, color: textColors[table.status], fontFamily: "'DM Serif Display', serif"}}>{table.id}</div>
                    <div style={{fontSize: 9, color: textColors[table.status], fontWeight: 600, letterSpacing: 0.3, marginTop: 2, textTransform: 'uppercase'}}>{table.status === 'empty' ? 'Free' : table.status === 'waiter' ? 'Help!' : table.since}</div>
                    {table.spend > 0 && <div style={{fontSize: 10, color: '#6B6560', marginTop: 2}}>£{table.spend.toFixed(0)}</div>}
                  </div>
                );
              })}
            </div>
            {tables.filter(t => t.status === 'waiter').map(table => (
              <div key={table.id} style={{...T.card, padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid #C2410C'}}>
                <div style={{width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#C2410C', fontFamily: "'DM Serif Display', serif", flexShrink: 0}}>{table.id}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 14}}>Table {table.id} needs assistance</div>
                  <div style={{fontSize: 12, color: '#9B9590', marginTop: 2}}>Since {table.since} · £{table.spend.toFixed(2)} spent</div>
                </div>
                <button onClick={() => setTables(prev => prev.map(t => t.id === table.id ? {...t, status: 'occupied'} : t))} style={{padding: '8px 14px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 12}}>Done</button>
              </div>
            ))}
          </>
        )}

        {/* WAITER */}
        {view === 'waiter' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Waiter Requests</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Customers requesting assistance</div>
            {waiterRequests.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px 20px', color: '#9B9590'}}>
                <div style={{fontSize: 32, marginBottom: 8}}>—</div>
                <div style={{fontWeight: 600}}>All clear</div>
              </div>
            ) : waiterRequests.map(req => (
              <div key={req.id} style={{...T.card, padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, borderLeft: '3px solid #C2410C'}}>
                <div style={{width: 44, height: 44, borderRadius: 12, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Icons.waiter /></div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 15}}>Table {req.table_number}</div>
                  <div style={{fontSize: 12, color: '#9B9590', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4}}><Icons.clock /> {new Date(req.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <button onClick={() => dismissWaiter(req.id)} style={{padding: '9px 16px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6}}><Icons.check /> Done</button>
              </div>
            ))}
          </>
        )}

        {/* MENU */}
        {view === 'menu' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Menu Management</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Add, edit or remove items</div>

            <div style={{...T.card, padding: 16, marginBottom: 16}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14}}>Add New Item</div>

              {/* IMAGE UPLOAD */}
              <label style={{display: 'block', marginBottom: 12, cursor: 'pointer'}}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
                <div style={{border: '2px dashed #E8E6E3', borderRadius: 12, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#FAFAF9', overflow: 'hidden', position: 'relative'}}>
                  {newItem.imagePreview ? (
                    <img src={newItem.imagePreview} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <>
                      <div style={{color: '#C4BFB8'}}><Icons.upload /></div>
                      <div style={{fontSize: 13, color: '#9B9590', fontWeight: 500}}>Tap to upload photo</div>
                      <div style={{fontSize: 11, color: '#C4BFB8'}}>JPG, PNG up to 5MB</div>
                    </>
                  )}
                </div>
              </label>

              <div style={{marginBottom: 10}}>
                <label style={T.label}>Item Name *</label>
                <input style={T.input} placeholder="e.g. Classic Burger" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div style={{marginBottom: 10}}>
                <label style={T.label}>Description</label>
                <input style={T.input} placeholder="Brief description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: 10, marginBottom: 14}}>
                <div style={{flex: 1}}>
                  <label style={T.label}>Price (£) *</label>
                  <input style={T.input} type="number" placeholder="9.99" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                </div>
                <div style={{flex: 1}}>
                  <label style={T.label}>Category</label>
                  <input style={T.input} placeholder="e.g. Burgers" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
                </div>
              </div>
              <button onClick={addMenuItem} style={{...T.primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <Icons.plus /> Add to Menu
              </button>
            </div>

            {menuItems.map(item => (
              <div key={item.id} style={{...T.card, padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#F5F4F2', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4BFB8'}}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Icons.image />}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontWeight: 600, fontSize: 14, marginBottom: 2}}>{item.name}</div>
                  <div style={{fontSize: 11, color: '#9B9590', marginBottom: 4}}>{item.category}</div>
                  <div style={{fontWeight: 700, fontSize: 14}}>£{Number(item.price).toFixed(2)}</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end'}}>
                  <div style={{background: item.is_available ? '#F0FDF4' : '#FEF2F2', color: item.is_available ? '#15803D' : '#DC2626', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600}}>
                    {item.is_available ? 'Available' : 'Off'}
                  </div>
                  <button onClick={() => deleteMenuItem(item.id)} style={{background: '#FEF2F2', border: 'none', borderRadius: 6, padding: '5px 8px', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center'}}><Icons.trash /></button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ANALYTICS */}
        {view === 'analytics' && (
          <>
            <div style={{fontWeight: 700, fontSize: 16, fontFamily: "'DM Serif Display', serif", marginBottom: 4}}>Analytics</div>
            <div style={{fontSize: 12, color: '#9B9590', marginBottom: 16}}>Business intelligence</div>

            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14}}>Today</div>
              {[{label:'Total Orders',value:stats.today_orders,sub:'+12% vs yesterday'},{label:'Revenue',value:`£${stats.today_revenue.toFixed(2)}`,sub:'+8% vs yesterday'},{label:'Avg Order',value:`£${stats.today_orders>0?(stats.today_revenue/stats.today_orders).toFixed(2):'0.00'}`,sub:'Per customer'},{label:'Table Turnover',value:'4.2x',sub:'Tables served'}].map((item,i) => (
                <div key={item.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<3?'1px solid #F5F4F2':'none'}}>
                  <div><div style={{fontSize:13,color:'#6B6560'}}>{item.label}</div><div style={{fontSize:11,color:'#15803D',marginTop:2}}>{item.sub}</div></div>
                  <div style={{fontWeight:700,fontSize:18,fontFamily:"'DM Serif Display', serif"}}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14}}>Peak Hours</div>
              {[{time:'12:00',orders:18,pct:90},{time:'13:00',orders:20,pct:100},{time:'18:00',orders:16,pct:80},{time:'19:00',orders:19,pct:95},{time:'20:00',orders:12,pct:60}].map(hour => (
                <div key={hour.time} style={{marginBottom: 10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:12,color:'#6B6560'}}>{hour.time}</span><span style={{fontSize:12,fontWeight:600}}>{hour.orders} orders</span></div>
                  <div style={{height:6,background:'#F0EFED',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${hour.pct}%`,background:hour.pct>80?'#C2410C':'#1A1A1A',borderRadius:3}} /></div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14}}>Top Items</div>
              {[{name:'Cheese Fries',orders:312,revenue:'£1,556',pct:100},{name:'Classic Burger',orders:245,revenue:'£2,447',pct:79},{name:'Double Smash',orders:189,revenue:'£2,455',pct:61},{name:'Chocolate Shake',orders:201,revenue:'£1,203',pct:64}].map((item,idx) => (
                <div key={item.name} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:idx<3?'1px solid #F5F4F2':'none'}}>
                  <div style={{width:24,height:24,borderRadius:12,background:idx===0?'#1A1A1A':'#F5F4F2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:idx===0?'#fff':'#9B9590',flexShrink:0}}>{idx+1}</div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{item.name}</div><div style={{height:3,background:'#F0EFED',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${item.pct}%`,background:'#1A1A1A',borderRadius:2}} /></div></div>
                  <div style={{textAlign:'right',flexShrink:0}}><div style={{fontWeight:700,fontSize:13}}>{item.revenue}</div><div style={{fontSize:11,color:'#9B9590'}}>{item.orders} sold</div></div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4}}>Cross-Vendor Insights</div>
              <div style={{fontSize: 12, color: '#9B9590', marginBottom: 14}}>Customers who order from you also visit</div>
              {[{vendor:'Green Bowl',pct:67,insight:'Health-conscious pairing'},{vendor:'Sushi Sato',pct:43,insight:'Protein seekers'},{vendor:'Pizza Palace',pct:31,insight:'Indulgent occasions'}].map((item,idx) => (
                <div key={item.vendor} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:idx<2?'1px solid #F5F4F2':'none'}}>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{item.vendor}</div><div style={{fontSize:11,color:'#9B9590'}}>{item.insight}</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontWeight:700,fontSize:16,fontFamily:"'DM Serif Display', serif"}}>{item.pct}%</div><div style={{fontSize:10,color:'#9B9590'}}>overlap</div></div>
                </div>
              ))}
            </div>

            <div style={{...T.card, padding: 16}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4}}>Table Heatmap</div>
              <div style={{fontSize: 12, color: '#9B9590', marginBottom: 14}}>Revenue by table position</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6}}>
                {[{id:1,heat:85},{id:2,heat:42},{id:3,heat:91},{id:4,heat:23},{id:5,heat:67},{id:6,heat:15},{id:7,heat:78},{id:8,heat:34},{id:9,heat:56},{id:10,heat:95},{id:11,heat:12},{id:12,heat:48}].map(table => (
                  <div key={table.id} style={{background:`rgba(194,65,12,${0.1+(table.heat/100)*0.9})`,borderRadius:10,padding:'14px 8px',textAlign:'center'}}>
                    <div style={{fontWeight:700,fontSize:14,color:table.heat>50?'#fff':'#1A1A1A',fontFamily:"'DM Serif Display', serif"}}>{table.id}</div>
                    <div style={{fontSize:10,color:table.heat>50?'rgba(255,255,255,0.8)':'#6B6560',marginTop:2}}>{table.heat}%</div>
                  </div>
                ))}
              </div>
              <div style={{height:4,borderRadius:2,background:'linear-gradient(to right,rgba(194,65,12,0.1),rgba(194,65,12,1))',marginTop:12}} />
              <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:11,color:'#9B9590'}}><span>Low</span><span>High</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}