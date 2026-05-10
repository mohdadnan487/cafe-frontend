import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function CustomerApp({ tableNumber }) {
  const [view, setView] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/vendors`)
      .then(r => r.json())
      .then(setVendors)
      .catch(console.error);
  }, []);

  const selectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setCart([]);
    fetch(`${API_URL}/api/vendors/${vendor.id}/menu`)
      .then(r => r.json())
      .then(setMenuItems)
      .catch(console.error);
    setView('menu');
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, {...item, quantity: 1}];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing?.quantity === 1) return prev.filter(i => i.id !== itemId);
      return prev.map(i => i.id === itemId ? {...i, quantity: i.quantity - 1} : i);
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: selectedVendor.id,
          table_number: tableNumber,
          items: cart,
          total: cartTotal
        })
      });
      const data = await res.json();
      setOrderPlaced(data.order_id);
      setCart([]);
      setView('confirmation');
    } catch (err) {
      setMessage('Failed to place order');
    }
  };

  const callWaiter = async () => {
    try {
      await fetch(`${API_URL}/api/waiter-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, vendor_id: selectedVendor?.id })
      });
      setMessage('Waiter called! Someone will be with you shortly.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to call waiter');
    }
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="customer-app">
      <div className="customer-header">
        {view !== 'vendors' && (
          <button className="back-btn" onClick={() => { setView(view === 'cart' || view === 'menu' ? 'vendors' : 'vendors'); setSelectedVendor(null); }}>← Back</button>
        )}
        {view === 'vendors' && <div style={{width: 44}} />}
        <h1>{view === 'vendors' ? '🍽️ The Food Quarter' : `${selectedVendor?.name || ''}`}</h1>
        <div className="table-info">Table {tableNumber}</div>
      </div>

      {message && <div className="message-alert success">{message}</div>}

      {/* VENDORS LIST */}
      {view === 'vendors' && (
        <div style={{padding: 16}}>
          <p style={{color: 'var(--text-light)', fontSize: 14, marginBottom: 16, textAlign: 'center'}}>Choose a vendor to order from</p>
          {vendors.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <div className="empty-text">No vendors yet</div>
              <div className="empty-subtext">Check back soon!</div>
            </div>
          ) : vendors.map(vendor => (
            <div key={vendor.id} className="request-card" style={{marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16}} onClick={() => selectVendor(vendor)}>
              {vendor.logo_url ? (
                <img src={vendor.logo_url} alt={vendor.name} style={{width: 64, height: 64, borderRadius: 12, objectFit: 'cover'}} />
              ) : (
                <div style={{width: 64, height: 64, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28}}>🍽️</div>
              )}
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 4}}>{vendor.name}</div>
                <div style={{fontSize: 13, color: 'var(--text-light)'}}>{vendor.cuisine}</div>
                <div style={{fontSize: 12, color: 'var(--text-light)', marginTop: 2}}>{vendor.description}</div>
              </div>
              <div style={{fontSize: 20}}>→</div>
            </div>
          ))}
        </div>
      )}

      {/* MENU */}
      {view === 'menu' && (
        <div>
          <div style={{padding: '8px 16px', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <button onClick={callWaiter} style={{padding: '8px 16px', background: 'linear-gradient(135deg, #fecaca, #fca5a5)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', color: '#7f1d1d'}}>👋 Call Waiter</button>
            {cartCount > 0 && (
              <button onClick={() => setView('cart')} style={{padding: '8px 16px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', color: 'white'}}>
                🛒 Cart ({cartCount}) · £{cartTotal.toFixed(2)}
              </button>
            )}
          </div>
          <div style={{padding: 16}}>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} style={{marginBottom: 24}}>
                <h2 className="section-title">{category}</h2>
                {items.map(item => {
                  const cartItem = cart.find(i => i.id === item.id);
                  return (
                    <div key={item.id} style={{display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'center'}}>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} style={{width: 72, height: 72, borderRadius: 10, objectFit: 'cover'}} />
                      )}
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: 600, fontSize: 15, marginBottom: 2}}>{item.name}</div>
                        {item.description && <div style={{fontSize: 12, color: 'var(--text-light)', marginBottom: 4}}>{item.description}</div>}
                        <div style={{fontWeight: 700, color: 'var(--primary)'}}>£{Number(item.price).toFixed(2)}</div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        {cartItem ? (
                          <>
                            <button onClick={() => removeFromCart(item.id)} style={{width: 32, height: 32, borderRadius: 8, border: '2px solid var(--border)', background: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>−</button>
                            <span style={{fontWeight: 700, minWidth: 20, textAlign: 'center'}}>{cartItem.quantity}</span>
                            <button onClick={() => addToCart(item)} style={{width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>+</button>
                          </>
                        ) : (
                          <button onClick={() => addToCart(item)} style={{width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>+</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART */}
      {view === 'cart' && (
        <div style={{padding: 16}}>
          <h2 style={{fontSize: 20, fontWeight: 700, marginBottom: 16}}>Your Order</h2>
          {cart.map(item => (
            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)'}}>
              <div>
                <div style={{fontWeight: 600}}>{item.name}</div>
                <div style={{fontSize: 13, color: 'var(--text-light)'}}>£{Number(item.price).toFixed(2)} each</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <button onClick={() => removeFromCart(item.id)} style={{width: 32, height: 32, borderRadius: 8, border: '2px solid var(--border)', background: 'white', fontWeight: 700, cursor: 'pointer'}}>−</button>
                <span style={{fontWeight: 700, minWidth: 20, textAlign: 'center'}}>{item.quantity}</span>
                <button onClick={() => addToCart(item)} style={{width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer'}}>+</button>
                <span style={{fontWeight: 700, color: 'var(--primary)', minWidth: 60, textAlign: 'right'}}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 700, fontSize: 18}}>
            <span>Total</span>
            <span style={{color: 'var(--primary)'}}>£{cartTotal.toFixed(2)}</span>
          </div>
          <button className="submit-btn" onClick={placeOrder}>Place Order · £{cartTotal.toFixed(2)}</button>
          <button onClick={() => setView('menu')} style={{width: '100%', padding: 12, marginTop: 8, background: 'none', border: '2px solid var(--border)', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--text-light)'}}>Add More Items</button>
        </div>
      )}

      {/* CONFIRMATION */}
      {view === 'confirmation' && (
        <div style={{padding: 32, textAlign: 'center'}}>
          <div style={{fontSize: 72, marginBottom: 16}}>✅</div>
          <h2 style={{fontSize: 24, fontWeight: 700, marginBottom: 8}}>Order Placed!</h2>
          <p style={{color: 'var(--text-light)', marginBottom: 8}}>Order #{orderPlaced}</p>
          <p style={{color: 'var(--text-light)', marginBottom: 32}}>Your food is being prepared. We'll bring it to Table {tableNumber}.</p>
          <button className="submit-btn" onClick={() => { setView('vendors'); setSelectedVendor(null); }}>Order from Another Vendor</button>
          <button onClick={callWaiter} style={{width: '100%', padding: 12, marginTop: 8, background: 'linear-gradient(135deg, #fecaca, #fca5a5)', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', color: '#7f1d1d'}}>👋 Call Waiter</button>
        </div>
      )}
    </div>
  );
}