import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function VendorApp({ onLogout }) {
  const [token, setToken] = useState(localStorage.getItem('vendor_token'));
  const [vendor, setVendor] = useState(null);
  const [view, setView] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [waiterRequests, setWaiterRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', cuisine: '', description: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: null });

  useEffect(() => {
    if (token) {
      fetchAll();
      const interval = setInterval(fetchAll, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [vendorRes, ordersRes, menuRes, waiterRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/vendor/me`, { headers }),
        fetch(`${API_URL}/api/vendor/orders`, { headers }),
        fetch(`${API_URL}/api/vendor/menu`, { headers }),
        fetch(`${API_URL}/api/vendor/waiter-requests`, { headers }),
        fetch(`${API_URL}/api/vendor/stats`, { headers })
      ]);
      if (vendorRes.status === 401) { logout(); return; }
      setVendor(await vendorRes.json());
      setOrders(await ordersRes.json());
      setMenuItems(await menuRes.json());
      setWaiterRequests(await waiterRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    }
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
        localStorage.setItem('vendor_token', data.token);
        setToken(data.token);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Login failed');
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
        localStorage.setItem('vendor_token', data.token);
        setToken(data.token);
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('vendor_token');
    setToken(null);
    setVendor(null);
    onLogout();
  };

  const addMenuItem = async () => {
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    if (newItem.image) formData.append('image', newItem.image);
    try {
      await fetch(`${API_URL}/api/vendor/menu`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      setNewItem({ name: '', description: '', price: '', category: '', image: null });
      setMessage('Item added!');
      fetchAll();
    } catch (err) {
      setMessage('Failed to add item');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteMenuItem = async (id) => {
    await fetch(`${API_URL}/api/vendor/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  const updateOrderStatus = async (id, status) => {
    await fetch(`${API_URL}/api/vendor/orders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const dismissWaiter = async (id) => {
    await fetch(`${API_URL}/api/vendor/waiter-requests/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  // LOGIN / REGISTER
  if (!token) {
    return (
      <div className="customer-app">
        <div className="customer-header">
          <div style={{width: 44}} />
          <h1>🍽️ Vendor Portal</h1>
          <div style={{width: 44}} />
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <div style={{width: '100%', maxWidth: 360, background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)'}}>
            {message && <div className="message-alert" style={{marginBottom: 16}}>{message}</div>}
            {!showRegister ? (
              <>
                <h2 style={{fontSize: 22, fontWeight: 700, marginBottom: 4, textAlign: 'center'}}>Welcome Back</h2>
                <p style={{color: 'var(--text-light)', fontSize: 14, marginBottom: 24, textAlign: 'center'}}>Sign in to your vendor account</p>
                <input type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}} />
                <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} onKeyPress={e => e.key === 'Enter' && login()} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 16}} />
                <button className="submit-btn" onClick={login}>Sign In</button>
                <p style={{textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-light)'}}>New vendor? <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 700}} onClick={() => setShowRegister(true)}>Register here</span></p>
              </>
            ) : (
              <>
                <h2 style={{fontSize: 22, fontWeight: 700, marginBottom: 4, textAlign: 'center'}}>Register Your Store</h2>
                <p style={{color: 'var(--text-light)', fontSize: 14, marginBottom: 24, textAlign: 'center'}}>Join The Food Quarter</p>
                <input placeholder="Store Name" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}} />
                <input type="email" placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}} />
                <input type="password" placeholder="Password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}} />
                <input placeholder="Cuisine Type (e.g. Italian, Sushi)" value={registerForm.cuisine} onChange={e => setRegisterForm({...registerForm, cuisine: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 12}} />
                <input placeholder="Short description" value={registerForm.description} onChange={e => setRegisterForm({...registerForm, description: e.target.value})} style={{width: '100%', padding: 12, border: '2px solid var(--border)', borderRadius: 10, fontSize: 14, marginBottom: 16}} />
                <button className="submit-btn" onClick={register}>Create Account</button>
                <p style={{textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-light)'}}>Already registered? <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 700}} onClick={() => setShowRegister(false)}>Sign in</span></p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // VENDOR DASHBOARD
  return (
    <div className="waiter-dashboard">
      <div className="waiter-header">
        <div style={{width: 44}} />
        <div className="waiter-info">
          <div className="waiter-name">🍽️ {vendor?.name}</div>
          <div className="waiter-subtitle">{vendor?.cuisine}</div>
        </div>
        <button onClick={logout} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13}}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-value">{stats.new_orders || 0}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🍳</div>
          <div className="stat-value">{stats.preparing || 0}</div>
          <div className="stat-label">Preparing</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">£{(stats.today_revenue || 0).toFixed(0)}</div>
          <div className="stat-label">Today</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-btn ${view === 'orders' ? 'active' : ''}`} onClick={() => setView('orders')}>Orders ({stats.new_orders || 0})</button>
        <button className={`tab-btn ${view === 'waiter' ? 'active' : ''}`} onClick={() => setView('waiter')}>Waiter ({waiterRequests.length})</button>
        <button className={`tab-btn ${view === 'menu' ? 'active' : ''}`} onClick={() => setView('menu')}>Menu</button>
      </div>

      {message && <div className="message-alert success" style={{margin: '12px 16px'}}>{message}</div>}

      <div className="dashboard-content">

        {/* ORDERS */}
        {view === 'orders' && (
          <div className="requests-list">
            {orders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <div className="empty-text">No orders yet</div>
                <div className="empty-subtext">Orders will appear here in real time</div>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="request-card">
                <div className="request-header">
                  <span className="request-table">Table {order.table_number}</span>
                  <span style={{fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: order.status === 'new' ? '#fee2e2' : order.status === 'preparing' ? '#fef3c7' : '#dcfce7', color: order.status === 'new' ? '#991b1b' : order.status === 'preparing' ? '#92400e' : '#166534'}}>
                    {order.status?.toUpperCase()}
                  </span>
                  <span className="request-time">{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <div style={{fontSize: 14, color: 'var(--text)', marginBottom: 8}}>{order.items_summary}</div>
                <div style={{fontWeight: 700, color: 'var(--primary)', marginBottom: 12}}>£{Number(order.total).toFixed(2)}</div>
                <div style={{display: 'flex', gap: 8}}>
                  {order.status === 'new' && <button className="complete-btn" onClick={() => updateOrderStatus(order.id, 'preparing')}>Start Preparing</button>}
                  {order.status === 'preparing' && <button className="complete-btn" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark Ready</button>}
                  {order.status === 'ready' && <button className="complete-btn" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}} onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WAITER REQUESTS */}
        {view === 'waiter' && (
          <div className="requests-list">
            {waiterRequests.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">👋</span>
                <div className="empty-text">No waiter requests</div>
                <div className="empty-subtext">Customer requests will appear here</div>
              </div>
            ) : waiterRequests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-header">
                  <span className="request-table">Table {req.table_number}</span>
                  <span className="request-time">{new Date(req.created_at).toLocaleTimeString()}</span>
                </div>
                <div style={{fontSize: 14, marginBottom: 12}}>Customer needs assistance</div>
                <button className="complete-btn" onClick={() => dismissWaiter(req.id)}>✓ Done</button>
              </div>
            ))}
          </div>
        )}

        {/* MENU MANAGEMENT */}
        {view === 'menu' && (
          <div>
            <div className="request-card" style={{marginBottom: 16}}>
              <h3 style={{fontWeight: 700, marginBottom: 12}}>Add New Item</h3>
              <input placeholder="Item name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{width: '100%', padding: 10, border: '2px solid var(--border)', borderRadius: 8, fontSize: 14, marginBottom: 8}} />
              <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} style={{width: '100%', padding: 10, border: '2px solid var(--border)', borderRadius: 8, fontSize: 14, marginBottom: 8}} />
              <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                <input placeholder="Price (£)" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} style={{flex: 1, padding: 10, border: '2px solid var(--border)', borderRadius: 8, fontSize: 14}} />
                <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={{flex: 1, padding: 10, border: '2px solid var(--border)', borderRadius: 8, fontSize: 14}} />
              </div>
              <input type="file" accept="image/*" onChange={e => setNewItem({...newItem, image: e.target.files[0]})} style={{marginBottom: 12, fontSize: 13}} />
              <button className="complete-btn" onClick={addMenuItem}>+ Add Item</button>
            </div>

            {menuItems.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🍽️</span>
                <div className="empty-text">No menu items yet</div>
                <div className="empty-subtext">Add your first item above</div>
              </div>
            ) : menuItems.map(item => (
              <div key={item.id} className="request-card" style={{marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12}}>
                {item.image_url && <img src={item.image_url} alt={item.name} style={{width: 56, height: 56, borderRadius: 8, objectFit: 'cover'}} />}
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: 14}}>{item.name}</div>
                  <div style={{fontSize: 12, color: 'var(--text-light)'}}>{item.category} · £{Number(item.price).toFixed(2)}</div>
                  <div style={{fontSize: 12, color: 'var(--text-light)'}}>{item.description}</div>
                </div>
                <button onClick={() => deleteMenuItem(item.id)} style={{padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: 8, color: '#991b1b', fontWeight: 700, cursor: 'pointer', fontSize: 13}}>Delete</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}