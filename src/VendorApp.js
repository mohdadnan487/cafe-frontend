import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const DUMMY_ORDERS = [
  { id: 1001, table_number: 3, status: 'new', total: 24.97, created_at: new Date(Date.now() - 120000).toISOString(), items_summary: '2x Classic Burger, 1x Cheese Fries' },
  { id: 1002, table_number: 7, status: 'preparing', total: 19.98, created_at: new Date(Date.now() - 300000).toISOString(), items_summary: '1x Double Smash, 1x Chocolate Shake' },
  { id: 1003, table_number: 1, status: 'ready', total: 12.98, created_at: new Date(Date.now() - 600000).toISOString(), items_summary: '2x Cheese Fries, 1x Onion Rings' },
  { id: 1004, table_number: 5, status: 'delivered', total: 35.96, created_at: new Date(Date.now() - 900000).toISOString(), items_summary: '3x Classic Burger, 1x Double Smash' },
];

const DUMMY_MENU = [
  { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 9.99, category: 'Burgers', is_available: 1, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: 2, name: 'Double Smash', description: 'Double beef smash patty with special sauce', price: 12.99, category: 'Burgers', is_available: 1, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200' },
  { id: 3, name: 'Cheese Fries', description: 'Crispy fries with melted cheese sauce', price: 4.99, category: 'Sides', is_available: 1, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
  { id: 4, name: 'Chocolate Shake', description: 'Thick creamy chocolate milkshake', price: 5.99, category: 'Drinks', is_available: 1, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200' },
];

const DUMMY_WAITER = [
  { id: 1, table_number: 4, created_at: new Date(Date.now() - 60000).toISOString() },
  { id: 2, table_number: 9, created_at: new Date(Date.now() - 180000).toISOString() },
];

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
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = {
    new_orders: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    today_revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    today_orders: orders.length,
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setVendor(data.vendor);
        fetchLiveData(data.token);
      } else {
        setToken('demo');
        setVendor({ name: loginForm.email.split('@')[0] || 'My Store', cuisine: 'Food', email: loginForm.email });
      }
    } catch (err) {
      setToken('demo');
      setVendor({ name: loginForm.email.split('@')[0] || 'My Store', cuisine: 'Food', email: loginForm.email });
    }
  };

  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vendor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setVendor(data.vendor);
      } else {
        setMessage(data.error || 'Registration failed');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error connecting to server');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fetchLiveData = async (t) => {
    const headers = { Authorization: `Bearer ${t}` };
    try {
      const [ordersRes, menuRes, waiterRes] = await Promise.all([
        fetch(`${API_URL}/api/vendor/orders`, { headers }),
        fetch(`${API_URL}/api/vendor/menu`, { headers }),
        fetch(`${API_URL}/api/vendor/waiter-requests`, { headers }),
      ]);
      const liveOrders = await ordersRes.json();
      const liveMenu = await menuRes.json();
      const liveWaiter = await waiterRes.json();
      if (liveOrders.length) setOrders(liveOrders);
      if (liveMenu.length) setMenuItems(liveMenu);
      if (liveWaiter.length) setWaiterRequests(liveWaiter);
    } catch (err) {}
  };

  const logout = () => { setToken(null); setVendor(null); onLogout(); };

  const updateOrderStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
    if (token !== 'demo') {
      await fetch(`${API_URL}/api/vendor/orders/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    }
  };

  const dismissWaiter = async (id) => {
    setWaiterRequests(prev => prev.filter(r => r.id !== id));
    if (token !== 'demo') {
      await fetch(`${API_URL}/api/vendor/waiter-requests/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item = { id: Date.now(), ...newItem, price: parseFloat(newItem.price), is_available: 1, image_url: null };
    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: '', description: '', price: '', category: '', image: null });
    showMsg('✅ Item added!');
  };

  const deleteMenuItem = (id) => setMenuItems(prev => prev.filter(i => i.id !== id));
  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const statusColor = (s) => ({ new: { bg: '#fff3cd', color: '#856404' }, preparing: { bg: '#cce5ff', color: '#004085' }, ready: { bg: '#d4edda', color: '#155724' }, delivered: { bg: '#e2e3e5', color: '#383d41' } }[s] || { bg: '#eee', color: '#666' });

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  // LOGIN
  if (!token) {
    return (
      <div style={{minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column'}}>
        <div style={{background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', padding: '40px 20px 60px', textAlign: 'center'}}>
          <div style={{fontSize: 48, marginBottom: 8}}>🍽️</div>
          <div style={{color: 'white', fontWeight: 800, fontSize: 24}}>The Food Quarter</div>
          <div style={{color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4}}>Vendor Portal</div>
        </div>
        <div style={{flex: 1, padding: '0 20px 40px', marginTop: -20}}>
          <div style={{background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.1)'}}>
            {message && <div style={{background: '#fff3cd', color: '#856404', padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600}}>{message}</div>}
            {!showRegister ? (
              <>
                <div style={{fontWeight: 800, fontSize: 20, marginBottom: 4, textAlign: 'center'}}>Welcome Back 👋</div>
                <div style={{color: '#999', fontSize: 13, marginBottom: 24, textAlign: 'center'}}>Sign in to manage your store</div>
                <input type="email" placeholder="Email address" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  style={{width: '100%', padding: '14px 16px', border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15, marginBottom: 12, boxSizing: 'border-box'}} />
                <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  onKeyPress={e => e.key === 'Enter' && login()}
                  style={{width: '100%', padding: '14px 16px', border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15, marginBottom: 20, boxSizing: 'border-box'}} />
                <button onClick={login} style={{width: '100%', padding: 16, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer'}}>Sign In</button>
                <div style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#999'}}>
                  New vendor? <span style={{color: '#2563eb', fontWeight: 700, cursor: 'pointer'}} onClick={() => setShowRegister(true)}>Register here →</span>
                </div>
                <div style={{background: '#f0f4ff', borderRadius: 10, padding: '10px 14px', marginTop: 16, fontSize: 12, color: '#2563eb'}}>
                  <strong>Demo:</strong> burger@test.com / password123
                </div>
              </>
            ) : (
              <>
                <div style={{fontWeight: 800, fontSize: 20, marginBottom: 4, textAlign: 'center'}}>Join The Food Quarter 🚀</div>
                <div style={{color: '#999', fontSize: 13, marginBottom: 24, textAlign: 'center'}}>Create your vendor account</div>
                {[
                  { key: 'name', placeholder: 'Store name', type: 'text' },
                  { key: 'email', placeholder: 'Email address', type: 'email' },
                  { key: 'password', placeholder: 'Password', type: 'password' },
                  { key: 'cuisine', placeholder: 'Cuisine type (e.g. Italian, Sushi)', type: 'text' },
                  { key: 'description', placeholder: 'Short description of your store', type: 'text' },
                ].map(field => (
                  <input key={field.key} type={field.type} placeholder={field.placeholder} value={registerForm[field.key]}
                    onChange={e => setRegisterForm({...registerForm, [field.key]: e.target.value})}
                    style={{width: '100%', padding: '14px 16px', border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15, marginBottom: 12, boxSizing: 'border-box'}} />
                ))}
                <button onClick={register} style={{width: '100%', padding: 16, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer'}}>Create Account</button>
                <div style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#999'}}>
                  Already registered? <span style={{color: '#2563eb', fontWeight: 700, cursor: 'pointer'}} onClick={() => setShowRegister(false)}>Sign in →</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 480, margin: '0 auto'}}>

      {/* HEADER */}
      <div style={{background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{color: 'white', fontWeight: 800, fontSize: 18}}>🍽️ {vendor?.name}</div>
          <div style={{color: 'rgba(255,255,255,0.8)', fontSize: 12}}>{vendor?.cuisine}</div>
        </div>
        <button onClick={logout} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13}}>Logout</button>
      </div>

      {/* STATS */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#f0f0f0'}}>
        {[
          { label: 'New', value: stats.new_orders, icon: '🆕', color: '#e53e3e' },
          { label: 'Preparing', value: stats.preparing, icon: '👨‍🍳', color: '#d69e2e' },
          { label: 'Orders', value: stats.today_orders, icon: '📋', color: '#2563eb' },
          { label: 'Revenue', value: `£${stats.today_revenue.toFixed(0)}`, icon: '💰', color: '#38a169' },
        ].map(stat => (
          <div key={stat.label} style={{background: 'white', padding: '14px 8px', textAlign: 'center'}}>
            <div style={{fontSize: 20, marginBottom: 4}}>{stat.icon}</div>
            <div style={{fontWeight: 800, fontSize: 18, color: stat.color}}>{stat.value}</div>
            <div style={{fontSize: 11, color: '#999', marginTop: 2}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{display: 'flex', background: 'white', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100}}>
        {[
          { key: 'orders', label: `Orders${stats.new_orders > 0 ? ` (${stats.new_orders})` : ''}` },
          { key: 'waiter', label: `Waiter${waiterRequests.length > 0 ? ` (${waiterRequests.length})` : ''}` },
          { key: 'menu', label: 'Menu' },
          { key: 'analytics', label: 'Analytics' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{flex: 1, padding: '14px 4px', background: 'none', border: 'none', borderBottom: `3px solid ${view === tab.key ? '#2563eb' : 'transparent'}`, fontWeight: 700, fontSize: 12, color: view === tab.key ? '#2563eb' : '#999', cursor: 'pointer'}}>
            {tab.label}
          </button>
        ))}
      </div>

      {message && <div style={{background: '#d4edda', color: '#155724', padding: '10px 20px', fontSize: 14, fontWeight: 600, textAlign: 'center'}}>{message}</div>}

      <div style={{padding: 16}}>

        {/* ORDERS */}
        {view === 'orders' && (
          <>
            <div style={{display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4}}>
              {['all', 'new', 'preparing', 'ready', 'delivered'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{padding: '6px 16px', borderRadius: 20, border: 'none', background: filterStatus === s ? '#2563eb' : '#f0f0f0', color: filterStatus === s ? 'white' : '#666', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'}}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {filteredOrders.length === 0 ? (
              <div style={{textAlign: 'center', padding: 40, color: '#999'}}>
                <div style={{fontSize: 40, marginBottom: 8}}>📋</div>
                <div style={{fontWeight: 700, fontSize: 16}}>No orders</div>
              </div>
            ) : filteredOrders.map(order => (
              <div key={order.id} style={{background: 'white', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <div style={{fontWeight: 800, fontSize: 16}}>Table {order.table_number}</div>
                  <div style={{...statusColor(order.status), padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700}}>
                    {order.status?.toUpperCase()}
                  </div>
                </div>
                <div style={{fontSize: 14, color: '#666', marginBottom: 4}}>{order.items_summary}</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div style={{fontWeight: 800, color: '#2563eb', fontSize: 16}}>£{Number(order.total).toFixed(2)}</div>
                  <div style={{fontSize: 12, color: '#999'}}>{new Date(order.created_at).toLocaleTimeString()}</div>
                </div>
                <div style={{display: 'flex', gap: 8}}>
                  {order.status === 'new' && (
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')}
                      style={{flex: 1, padding: '10px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13}}>
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'ready')}
                      style={{flex: 1, padding: '10px', background: 'linear-gradient(135deg, #f6ad55, #ed8936)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13}}>
                      Mark Ready ✓
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateOrderStatus(order.id, 'delivered')}
                      style={{flex: 1, padding: '10px', background: 'linear-gradient(135deg, #38a169, #2f855a)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13}}>
                      Mark Delivered 🎉
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <div style={{flex: 1, padding: '10px', background: '#f0f0f0', borderRadius: 10, fontWeight: 700, fontSize: 13, textAlign: 'center', color: '#999'}}>
                      Completed ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* WAITER REQUESTS */}
        {view === 'waiter' && (
          <>
            {waiterRequests.length === 0 ? (
              <div style={{textAlign: 'center', padding: 40, color: '#999'}}>
                <div style={{fontSize: 40, marginBottom: 8}}>👋</div>
                <div style={{fontWeight: 700, fontSize: 16}}>No waiter requests</div>
                <div style={{fontSize: 13, marginTop: 4}}>All clear!</div>
              </div>
            ) : waiterRequests.map(req => (
              <div key={req.id} style={{background: 'white', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16}}>
                <div style={{width: 48, height: 48, borderRadius: 24, background: '#fff3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0}}>👋</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 800, fontSize: 16}}>Table {req.table_number}</div>
                  <div style={{fontSize: 13, color: '#999'}}>Needs assistance · {new Date(req.created_at).toLocaleTimeString()}</div>
                </div>
                <button onClick={() => dismissWaiter(req.id)}
                  style={{padding: '8px 16px', background: 'linear-gradient(135deg, #38a169, #2f855a)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13}}>
                  Done ✓
                </button>
              </div>
            ))}
          </>
        )}

        {/* MENU */}
        {view === 'menu' && (
          <>
            <div style={{background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight: 800, fontSize: 16, marginBottom: 14}}>➕ Add New Item</div>
              <input placeholder="Item name *" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                style={{width: '100%', padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14, marginBottom: 8, boxSizing: 'border-box'}} />
              <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}
                style={{width: '100%', padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14, marginBottom: 8, boxSizing: 'border-box'}} />
              <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                <input placeholder="Price £ *" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})}
                  style={{flex: 1, padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14}} />
                <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                  style={{flex: 1, padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14}} />
              </div>
              <div style={{marginBottom: 12}}>
                <label style={{fontSize: 13, color: '#999', marginBottom: 4, display: 'block'}}>Item photo (optional)</label>
                <input type="file" accept="image/*" onChange={e => setNewItem({...newItem, image: e.target.files[0]})} style={{fontSize: 13}} />
              </div>
              <button onClick={addMenuItem}
                style={{width: '100%', padding: 12, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14}}>
                Add to Menu
              </button>
            </div>

            {menuItems.map(item => (
              <div key={item.id} style={{background: 'white', borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 60, height: 60, borderRadius: 12, overflow: 'hidden', background: '#f0f0f0', flexShrink: 0}}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>🍽️</div>
                  )}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontWeight: 700, fontSize: 14}}>{item.name}</div>
                  <div style={{fontSize: 12, color: '#999', marginBottom: 2}}>{item.category}</div>
                  <div style={{fontWeight: 800, color: '#2563eb'}}>£{Number(item.price).toFixed(2)}</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end'}}>
                  <div style={{background: item.is_available ? '#d4edda' : '#f8d7da', color: item.is_available ? '#155724' : '#721c24', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700}}>
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </div>
                  <button onClick={() => deleteMenuItem(item.id)}
                    style={{padding: '4px 12px', background: '#fff3f3', border: 'none', borderRadius: 8, color: '#e53e3e', fontWeight: 700, cursor: 'pointer', fontSize: 12}}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ANALYTICS */}
        {view === 'analytics' && (
          <>
            <div style={{background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight: 800, fontSize: 16, marginBottom: 16}}>📊 Today's Summary</div>
              {[
                { label: 'Total Orders', value: stats.today_orders, color: '#2563eb' },
                { label: 'Total Revenue', value: `£${stats.today_revenue.toFixed(2)}`, color: '#38a169' },
                { label: 'Avg Order Value', value: `£${stats.today_orders > 0 ? (stats.today_revenue / stats.today_orders).toFixed(2) : '0.00'}`, color: '#d69e2e' },
                { label: 'Pending Orders', value: stats.new_orders + stats.preparing, color: '#e53e3e' },
              ].map(item => (
                <div key={item.label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5'}}>
                  <span style={{fontSize: 14, color: '#666'}}>{item.label}</span>
                  <span style={{fontWeight: 800, fontSize: 16, color: item.color}}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{background: 'white', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight: 800, fontSize: 16, marginBottom: 16}}>🔥 Popular Items</div>
              {[
                { name: 'Classic Burger', orders: 24, revenue: '£239.76' },
                { name: 'Double Smash', orders: 18, revenue: '£233.82' },
                { name: 'Cheese Fries', orders: 31, revenue: '£154.69' },
                { name: 'Chocolate Shake', orders: 15, revenue: '£89.85' },
              ].map((item, idx) => (
                <div key={item.name} style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx < 3 ? '1px solid #f5f5f5' : 'none'}}>
                  <div style={{width: 28, height: 28, borderRadius: 14, background: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: idx < 3 ? 'white' : '#999'}}>
                    {idx + 1}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 700, fontSize: 14}}>{item.name}</div>
                    <div style={{fontSize: 12, color: '#999'}}>{item.orders} orders</div>
                  </div>
                  <div style={{fontWeight: 800, color: '#38a169'}}>{item.revenue}</div>
                </div>
              ))}
            </div>

            <div style={{background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight: 800, fontSize: 16, marginBottom: 16}}>⏰ Peak Hours</div>
              {[
                { time: '12:00 - 13:00', orders: 18, pct: 90 },
                { time: '13:00 - 14:00', orders: 15, pct: 75 },
                { time: '18:00 - 19:00', orders: 20, pct: 100 },
                { time: '19:00 - 20:00', orders: 16, pct: 80 },
                { time: '20:00 - 21:00', orders: 12, pct: 60 },
              ].map(hour => (
                <div key={hour.time} style={{marginBottom: 12}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                    <span style={{fontSize: 13, color: '#666'}}>{hour.time}</span>
                    <span style={{fontSize: 13, fontWeight: 700}}>{hour.orders} orders</span>
                  </div>
                  <div style={{height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${hour.pct}%`, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', borderRadius: 4}} />
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