import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function CustomerApp({ tableNumber }) {
  const [view, setView] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [orderStatus, setOrderStatus] = useState('preparing');
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/vendors`)
      .then(r => r.json())
      .then(setVendors)
      .catch(() => setVendors([
        { id: 1, name: 'Burger Bros', cuisine: 'American', description: 'Juicy handcrafted burgers', logo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
        { id: 2, name: 'Sushi Sato', cuisine: 'Japanese', description: 'Authentic Japanese sushi', logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
        { id: 3, name: 'Pizza Palace', cuisine: 'Italian', description: 'Wood fired Neapolitan pizza', logo_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' }
      ]));
  }, []);

  const selectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setCart([]);
    fetch(`${API_URL}/api/vendors/${vendor.id}/menu`)
      .then(r => r.json())
      .then(items => setMenuItems(items.length ? items : getDummyMenu(vendor.id)))
      .catch(() => setMenuItems(getDummyMenu(vendor.id)));
    setView('menu');
  };

  const getDummyMenu = (vendorId) => {
    const menus = {
      1: [
        { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 9.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
        { id: 2, name: 'Double Smash', description: 'Double beef smash patty with special sauce', price: 12.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
        { id: 3, name: 'Chicken Burger', description: 'Crispy fried chicken with coleslaw', price: 10.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
        { id: 4, name: 'Cheese Fries', description: 'Crispy fries with melted cheese sauce', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
        { id: 5, name: 'Onion Rings', description: 'Golden crispy onion rings', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
        { id: 6, name: 'Chocolate Shake', description: 'Thick creamy chocolate milkshake', price: 5.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
      ],
      2: [
        { id: 7, name: 'Salmon Nigiri', description: 'Fresh Atlantic salmon on seasoned rice', price: 8.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400' },
        { id: 8, name: 'Tuna Nigiri', description: 'Premium bluefin tuna on seasoned rice', price: 9.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400' },
        { id: 9, name: 'Dragon Roll', description: 'Shrimp tempura, avocado, cucumber', price: 13.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
        { id: 10, name: 'Rainbow Roll', description: 'California roll topped with assorted fish', price: 15.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400' },
        { id: 11, name: 'Miso Soup', description: 'Traditional Japanese miso with tofu', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
      ],
      3: [
        { id: 12, name: 'Margherita', description: 'San Marzano tomato, mozzarella, fresh basil', price: 11.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
        { id: 13, name: 'Pepperoni', description: 'Spicy pepperoni with mozzarella', price: 13.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
        { id: 14, name: 'Truffle Mushroom', description: 'Wild mushrooms with truffle oil', price: 14.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
        { id: 15, name: 'Garlic Bread', description: 'Toasted sourdough with garlic butter', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400' },
        { id: 16, name: 'Tiramisu', description: 'Classic Italian tiramisu dessert', price: 5.99, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
      ]
    };
    return menus[vendorId] || [];
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
        body: JSON.stringify({ vendor_id: selectedVendor.id, table_number: tableNumber, items: cart, total: cartTotal })
      });
      const data = await res.json();
      setOrderPlaced(data.order_id || Math.floor(Math.random() * 9000 + 1000));
      setCart([]);
      setOrderStatus('preparing');
      setView('tracking');
      // Simulate order status updates
      setTimeout(() => setOrderStatus('ready'), 8000);
    } catch (err) {
      setOrderPlaced(Math.floor(Math.random() * 9000 + 1000));
      setView('tracking');
      setTimeout(() => setOrderStatus('ready'), 8000);
    }
  };

  const callWaiter = async () => {
    try {
      await fetch(`${API_URL}/api/waiter-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, vendor_id: selectedVendor?.id })
      });
    } catch (err) {}
    setMessage('👋 Waiter called! Someone will be with you shortly.');
    setTimeout(() => setMessage(''), 4000);
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const s = {
    container: { minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 480, margin: '0 auto' },
    header: { background: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 },
    backBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#333', padding: '4px 8px', borderRadius: 8 },
    headerTitle: { fontWeight: 800, fontSize: 17, color: '#1a1a1a', textAlign: 'center' },
    headerSub: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 1 },
    waiterBtn: { background: '#fff3f3', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#e53e3e', cursor: 'pointer' },
  };

  return (
    <div style={s.container}>

      {/* HEADER */}
      <div style={s.header}>
        {view !== 'vendors' ? (
          <button style={s.backBtn} onClick={() => {
            if (view === 'cart') setView('menu');
            else if (view === 'checkout') setView('cart');
            else { setView('vendors'); setSelectedVendor(null); }
          }}>←</button>
        ) : <div style={{width: 36}} />}
        <div>
          <div style={s.headerTitle}>{view === 'vendors' ? '🍽️ The Food Quarter' : view === 'tracking' ? 'Order Tracking' : view === 'checkout' ? 'Checkout' : view === 'cart' ? 'Your Cart' : selectedVendor?.name}</div>
          <div style={s.headerSub}>Table {tableNumber}</div>
        </div>
        {view === 'menu' ? (
          <button style={s.waiterBtn} onClick={callWaiter}>👋 Waiter</button>
        ) : <div style={{width: 36}} />}
      </div>

      {message && <div style={{background: '#d4edda', color: '#155724', padding: '12px 20px', fontSize: 14, fontWeight: 600, textAlign: 'center'}}>{message}</div>}

      {/* VENDORS */}
      {view === 'vendors' && (
        <div style={{padding: '20px 16px'}}>
          <p style={{color: '#999', fontSize: 13, marginBottom: 20, textAlign: 'center'}}>Choose where to order from</p>
          {vendors.map(vendor => (
            <div key={vendor.id} onClick={() => selectVendor(vendor)}
              style={{background: 'white', borderRadius: 20, marginBottom: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', cursor: 'pointer'}}>
              <div style={{height: 160, background: 'linear-gradient(135deg, #667eea, #764ba2)', position: 'relative', overflow: 'hidden'}}>
                {vendor.logo_url && <img src={vendor.logo_url} alt={vendor.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'}} />
                <div style={{position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                  <div>
                    <div style={{color: 'white', fontWeight: 800, fontSize: 20}}>{vendor.name}</div>
                    <div style={{color: 'rgba(255,255,255,0.85)', fontSize: 13}}>{vendor.description}</div>
                  </div>
                  <div style={{background: 'white', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#333'}}>{vendor.cuisine}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MENU */}
      {view === 'menu' && (
        <div style={{paddingBottom: cartCount > 0 ? 100 : 20}}>
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <div style={{padding: '16px 20px 8px', fontWeight: 800, fontSize: 15, color: '#1a1a1a', background: '#f8f9fa', borderBottom: '1px solid #eee'}}>{category}</div>
              {items.map(item => {
                const cartItem = cart.find(i => i.id === item.id);
                return (
                  <div key={item.id} style={{background: 'white', padding: '14px 20px', display: 'flex', gap: 14, alignItems: 'center', borderBottom: '1px solid #f5f5f5'}}>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontWeight: 700, fontSize: 15, marginBottom: 3, color: '#1a1a1a'}}>{item.name}</div>
                      {item.description && <div style={{fontSize: 12, color: '#999', marginBottom: 6, lineHeight: 1.4}}>{item.description}</div>}
                      <div style={{fontWeight: 800, fontSize: 16, color: '#2563eb'}}>£{Number(item.price).toFixed(2)}</div>
                    </div>
                    <div style={{position: 'relative', flexShrink: 0}}>
                      <div style={{width: 88, height: 88, borderRadius: 14, overflow: 'hidden', background: '#f0f0f0'}}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30}}>🍽️</div>
                        )}
                      </div>
                      {cartItem ? (
                        <div style={{position: 'absolute', bottom: -10, right: -10, display: 'flex', alignItems: 'center', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', padding: '3px 6px', gap: 4}}>
                          <button onClick={() => removeFromCart(item.id)} style={{width: 26, height: 26, borderRadius: 13, border: 'none', background: '#f0f0f0', fontWeight: 800, fontSize: 14, cursor: 'pointer'}}>−</button>
                          <span style={{fontWeight: 800, minWidth: 20, textAlign: 'center', fontSize: 13}}>{cartItem.quantity}</span>
                          <button onClick={() => addToCart(item)} style={{width: 26, height: 26, borderRadius: 13, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer'}}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{position: 'absolute', bottom: -10, right: -10, width: 30, height: 30, borderRadius: 15, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* CART */}
      {view === 'cart' && (
        <div style={{padding: 20}}>
          <div style={{background: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            {cart.map((item, idx) => (
              <div key={item.id} style={{padding: '16px 20px', borderBottom: idx < cart.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 700, fontSize: 15, marginBottom: 2}}>{item.name}</div>
                  <div style={{fontSize: 13, color: '#999'}}>£{Number(item.price).toFixed(2)} each</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <button onClick={() => removeFromCart(item.id)} style={{width: 30, height: 30, borderRadius: 15, border: '2px solid #eee', background: 'white', fontWeight: 800, cursor: 'pointer'}}>−</button>
                  <span style={{fontWeight: 800, minWidth: 20, textAlign: 'center'}}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={{width: 30, height: 30, borderRadius: 15, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, cursor: 'pointer'}}>+</button>
                </div>
                <span style={{fontWeight: 800, color: '#2563eb', minWidth: 56, textAlign: 'right'}}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{background: 'white', borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#999'}}><span>Subtotal</span><span>£{cartTotal.toFixed(2)}</span></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#999'}}><span>Service fee</span><span>£0.00</span></div>
            <div style={{height: 1, background: '#f0f0f0', margin: '12px 0'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18}}><span>Total</span><span style={{color: '#2563eb'}}>£{cartTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={() => setView('checkout')} style={{width: '100%', padding: 18, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 17, cursor: 'pointer', marginBottom: 12}}>
            Proceed to Payment →
          </button>
          <button onClick={() => setView('menu')} style={{width: '100%', padding: 16, background: 'white', border: '2px solid #eee', borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#999'}}>
            ← Add More Items
          </button>
        </div>
      )}

      {/* CHECKOUT */}
      {view === 'checkout' && (
        <div style={{padding: 20}}>
          <div style={{background: 'white', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            <div style={{fontWeight: 800, fontSize: 16, marginBottom: 16}}>Payment Method</div>
            {[
              { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
              { id: 'apple', icon: '🍎', label: 'Apple Pay' },
              { id: 'google', icon: 'G', label: 'Google Pay' },
            ].map(method => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `2px solid ${paymentMethod === method.id ? '#2563eb' : '#f0f0f0'}`, marginBottom: 10, cursor: 'pointer', background: paymentMethod === method.id ? '#f0f4ff' : 'white'}}>
                <div style={{width: 40, height: 40, borderRadius: 10, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800}}>{method.icon}</div>
                <div style={{fontWeight: 600, fontSize: 15}}>{method.label}</div>
                {paymentMethod === method.id && <div style={{marginLeft: 'auto', color: '#2563eb', fontWeight: 800}}>✓</div>}
              </div>
            ))}
          </div>

          {paymentMethod === 'card' && (
            <div style={{background: 'white', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
              <div style={{fontWeight: 800, fontSize: 16, marginBottom: 16}}>Card Details</div>
              <input placeholder="Card number" style={{width: '100%', padding: 14, border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15, marginBottom: 12, boxSizing: 'border-box'}} defaultValue="4242 4242 4242 4242" />
              <div style={{display: 'flex', gap: 12}}>
                <input placeholder="MM/YY" style={{flex: 1, padding: 14, border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15}} defaultValue="12/27" />
                <input placeholder="CVV" style={{flex: 1, padding: 14, border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 15}} defaultValue="123" />
              </div>
            </div>
          )}

          <div style={{background: 'white', borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18}}><span>Total to pay</span><span style={{color: '#2563eb'}}>£{cartTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={placeOrder} disabled={!paymentMethod}
            style={{width: '100%', padding: 18, background: paymentMethod ? 'linear-gradient(135deg, #2563eb, #8b5cf6)' : '#ccc', color: 'white', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 17, cursor: paymentMethod ? 'pointer' : 'not-allowed', marginBottom: 12}}>
            {paymentMethod ? `Pay £${cartTotal.toFixed(2)}` : 'Select Payment Method'}
          </button>
        </div>
      )}

      {/* ORDER TRACKING */}
      {view === 'tracking' && (
        <div style={{padding: 24}}>
          <div style={{background: 'white', borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            <div style={{fontSize: 60, marginBottom: 12}}>{orderStatus === 'ready' ? '✅' : '👨‍🍳'}</div>
            <div style={{fontWeight: 800, fontSize: 22, marginBottom: 4}}>{orderStatus === 'ready' ? 'Order Ready!' : 'Being Prepared'}</div>
            <div style={{color: '#999', fontSize: 14, marginBottom: 16}}>{orderStatus === 'ready' ? 'Your food is on its way to your table!' : 'Your order is being freshly prepared...'}</div>
            <div style={{background: '#f0f4ff', borderRadius: 12, padding: '10px 20px', display: 'inline-block'}}>
              <span style={{fontWeight: 800, color: '#2563eb', fontSize: 18}}>Order #{orderPlaced}</span>
            </div>
          </div>

          <div style={{background: 'white', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'}}>
            <div style={{fontWeight: 800, fontSize: 15, marginBottom: 16}}>Order Status</div>
            {[
              { status: 'confirmed', label: 'Order Confirmed', icon: '✓', done: true },
              { status: 'preparing', label: 'Being Prepared', icon: '👨‍🍳', done: true },
              { status: 'ready', label: 'Ready for Delivery', icon: '🍽️', done: orderStatus === 'ready' },
              { status: 'delivered', label: 'Delivered to Table', icon: '🎉', done: false },
            ].map((step, idx) => (
              <div key={step.status} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: idx < 3 ? 16 : 0}}>
                <div style={{width: 36, height: 36, borderRadius: 18, background: step.done ? '#2563eb' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: step.done ? 14 : 16, color: step.done ? 'white' : '#ccc', flexShrink: 0}}>
                  {step.done ? '✓' : step.icon}
                </div>
                <div style={{fontWeight: step.done ? 700 : 500, color: step.done ? '#1a1a1a' : '#ccc'}}>{step.label}</div>
                {step.status === 'preparing' && !orderStatus !== 'ready' && (
                  <div style={{marginLeft: 'auto', fontSize: 12, color: '#2563eb', fontWeight: 700}}>~15 min</div>
                )}
              </div>
            ))}
          </div>

          <button onClick={callWaiter} style={{width: '100%', padding: 16, background: '#fff3f3', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#e53e3e', marginBottom: 12}}>
            👋 Call Waiter
          </button>
          <button onClick={() => { setView('vendors'); setSelectedVendor(null); setOrderStatus('preparing'); }}
            style={{width: '100%', padding: 16, background: 'white', border: '2px solid #eee', borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#999'}}>
            Order from Another Vendor
          </button>
        </div>
      )}

      {/* FLOATING CART */}
      {view === 'menu' && cartCount > 0 && (
        <div style={{position: 'fixed', bottom: 24, left: 16, right: 16, zIndex: 200}}>
          <button onClick={() => setView('cart')}
            style={{width: '100%', padding: '16px 20px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 24px rgba(37,99,235,0.4)'}}>
            <div style={{background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '4px 10px'}}>{cartCount} items</div>
            <span>View Cart</span>
            <span>£{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

    </div>
  );
}