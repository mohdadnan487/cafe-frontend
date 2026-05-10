import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const DIETARY_OPTIONS = [
  { id: 'vegan', label: '🌱 Vegan' },
  { id: 'vegetarian', label: '🥗 Vegetarian' },
  { id: 'gluten_free', label: '🌾 Gluten Free' },
  { id: 'halal', label: '☪️ Halal' },
  { id: 'nut_free', label: '🥜 Nut Free' },
];

const DUMMY_VENDORS = [
  { id: 1, name: 'Burger Bros', cuisine: 'American', description: 'Juicy handcrafted burgers', logo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', is_open: true, wait_time: 12, tags: ['halal'] },
  { id: 2, name: 'Sushi Sato', cuisine: 'Japanese', description: 'Authentic Japanese sushi', logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', is_open: true, wait_time: 18, tags: ['gluten_free'] },
  { id: 3, name: 'Pizza Palace', cuisine: 'Italian', description: 'Wood fired Neapolitan pizza', logo_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', is_open: true, wait_time: 20, tags: ['vegetarian'] },
  { id: 4, name: 'Green Bowl', cuisine: 'Healthy', description: 'Fresh salads and grain bowls', logo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', is_open: true, wait_time: 8, tags: ['vegan', 'gluten_free'] },
];

const DUMMY_MENUS = {
  1: [
    { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 9.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', tags: ['halal'], is_popular: true },
    { id: 2, name: 'Double Smash', description: 'Double beef smash patty with special sauce', price: 12.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', tags: ['halal'], is_popular: true },
    { id: 3, name: 'Chicken Burger', description: 'Crispy fried chicken with coleslaw', price: 10.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', tags: ['halal'] },
    { id: 4, name: 'Veggie Burger', description: 'Plant-based patty with avocado', price: 9.49, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', tags: ['vegan', 'vegetarian'] },
    { id: 5, name: 'Cheese Fries', description: 'Crispy fries with melted cheese sauce', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', tags: ['vegetarian'], is_popular: true },
    { id: 6, name: 'Onion Rings', description: 'Golden crispy onion rings', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', tags: ['vegan'] },
    { id: 7, name: 'Chocolate Shake', description: 'Thick creamy chocolate milkshake', price: 5.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', tags: ['vegetarian'] },
    { id: 8, name: 'Lemonade', description: 'Fresh squeezed lemonade', price: 3.49, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', tags: ['vegan', 'gluten_free'] },
  ],
  2: [
    { id: 9, name: 'Salmon Nigiri', description: 'Fresh Atlantic salmon on seasoned rice', price: 8.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', tags: ['gluten_free'], is_popular: true },
    { id: 10, name: 'Tuna Nigiri', description: 'Premium bluefin tuna on rice', price: 9.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', tags: ['gluten_free'] },
    { id: 11, name: 'Dragon Roll', description: 'Shrimp tempura, avocado, cucumber', price: 13.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', tags: [], is_popular: true },
    { id: 12, name: 'Rainbow Roll', description: 'California roll topped with assorted fish', price: 15.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400', tags: [] },
    { id: 13, name: 'Veggie Roll', description: 'Avocado, cucumber, carrot, pickled radish', price: 9.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400', tags: ['vegan', 'gluten_free'] },
    { id: 14, name: 'Miso Soup', description: 'Traditional Japanese miso with tofu', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', tags: ['vegan'] },
  ],
  3: [
    { id: 15, name: 'Margherita', description: 'San Marzano tomato, mozzarella, fresh basil', price: 11.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', tags: ['vegetarian'], is_popular: true },
    { id: 16, name: 'Pepperoni', description: 'Spicy pepperoni with mozzarella', price: 13.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', tags: [], is_popular: true },
    { id: 17, name: 'Truffle Mushroom', description: 'Wild mushrooms with truffle oil', price: 14.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', tags: ['vegan'] },
    { id: 18, name: 'Garlic Bread', description: 'Toasted sourdough with garlic butter', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', tags: ['vegetarian'] },
    { id: 19, name: 'Tiramisu', description: 'Classic Italian tiramisu dessert', price: 5.99, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', tags: ['vegetarian'] },
  ],
  4: [
    { id: 20, name: 'Quinoa Buddha Bowl', description: 'Quinoa, roasted veg, tahini dressing', price: 12.99, category: 'Bowls', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', tags: ['vegan', 'gluten_free'], is_popular: true },
    { id: 21, name: 'Falafel Wrap', description: 'Crispy falafel, hummus, fresh salad', price: 9.99, category: 'Wraps', image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', tags: ['vegan'] },
    { id: 22, name: 'Acai Bowl', description: 'Acai blend, granola, fresh fruit', price: 10.99, category: 'Bowls', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', tags: ['vegan', 'gluten_free'] },
    { id: 23, name: 'Green Smoothie', description: 'Spinach, banana, almond milk, dates', price: 6.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400', tags: ['vegan', 'gluten_free'] },
  ],
};

export default function CustomerApp({ tableNumber }) {
  const [view, setView] = useState('vendors');
  const [vendors, setVendors] = useState(DUMMY_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [orderProgress, setOrderProgress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [dietaryProfile, setDietaryProfile] = useState([]);
  const [showDietaryModal, setShowDietaryModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [splitPeople, setSplitPeople] = useState(2);
  const [showSplit, setShowSplit] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/vendors`)
      .then(r => r.json())
      .then(data => { if (data.length) setVendors(data); })
      .catch(() => {});
  }, []);

  const selectVendor = (vendor) => {
    if (!vendor.is_open) return;
    setSelectedVendor(vendor);
    const items = DUMMY_MENUS[vendor.id] || [];
    fetch(`${API_URL}/api/vendors/${vendor.id}/menu`)
      .then(r => r.json())
      .then(data => setMenuItems(data.length ? data : items))
      .catch(() => setMenuItems(items));
    setActiveFilter('all');
    setView('menu');
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.vendorId === selectedVendor.id);
      if (existing) return prev.map(i => i.id === item.id && i.vendorId === selectedVendor.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, {...item, vendorId: selectedVendor.id, vendorName: selectedVendor.name, quantity: 1}];
    });
  };

  const removeFromCart = (itemId, vendorId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId && i.vendorId === vendorId);
      if (existing?.quantity === 1) return prev.filter(i => !(i.id === itemId && i.vendorId === vendorId));
      return prev.map(i => i.id === itemId && i.vendorId === vendorId ? {...i, quantity: i.quantity - 1} : i);
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const cartByVendor = cart.reduce((acc, item) => {
    if (!acc[item.vendorId]) acc[item.vendorId] = { vendorName: item.vendorName, items: [] };
    acc[item.vendorId].items.push(item);
    return acc;
  }, {});

  const placeOrder = async () => {
    const newOrder = { id: Math.floor(Math.random() * 9000 + 1000), items: [...cart], total: cartTotal, time: new Date() };
    setOrderHistory(prev => [newOrder, ...prev]);
    setOrderPlaced(newOrder.id);
    setCart([]);
    setOrderStatus('confirmed');
    setOrderProgress(25);
    setView('tracking');
    setTimeout(() => { setOrderStatus('preparing'); setOrderProgress(50); }, 3000);
    setTimeout(() => { setOrderProgress(75); }, 8000);
    setTimeout(() => { setOrderStatus('ready'); setOrderProgress(100); }, 12000);
    try {
      await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_id: selectedVendor?.id, table_number: tableNumber, items: cart, total: cartTotal })
      });
    } catch (err) {}
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

  const filteredMenu = menuItems.filter(item => {
    if (activeFilter === 'all') {
      if (dietaryProfile.length === 0) return true;
      return dietaryProfile.every(d => item.tags?.includes(d));
    }
    return item.tags?.includes(activeFilter);
  });

  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const s = {
    page: { minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 480, margin: '0 auto' },
    header: { background: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 },
    card: { background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    primaryBtn: { width: '100%', padding: 18, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 17, cursor: 'pointer' },
    secondaryBtn: { width: '100%', padding: 16, background: 'white', border: '2px solid #eee', borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#999' },
  };

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          {view !== 'vendors' && (
            <button style={{background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '4px 8px'}} onClick={() => {
              if (view === 'cart') setView('menu');
              else if (view === 'checkout') setView('cart');
              else { setView('vendors'); setSelectedVendor(null); }
            }}>←</button>
          )}
          <div>
            <div style={{fontWeight: 800, fontSize: 16, color: '#1a1a1a'}}>
              {view === 'vendors' ? '🍽️ The Food Quarter' : view === 'tracking' ? 'Order Tracking' : view === 'checkout' ? 'Checkout' : view === 'cart' ? 'Your Cart' : selectedVendor?.name}
            </div>
            <div style={{fontSize: 11, color: '#999'}}>Table {tableNumber}</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          {view === 'menu' && (
            <button style={{background: '#fff3f3', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#e53e3e', cursor: 'pointer'}} onClick={callWaiter}>👋 Waiter</button>
          )}
          {view === 'vendors' && (
            <button style={{background: '#f0f4ff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#2563eb', cursor: 'pointer'}} onClick={() => setShowDietaryModal(true)}>🌱 Diet</button>
          )}
        </div>
      </div>

      {message && <div style={{background: '#d4edda', color: '#155724', padding: '10px 16px', fontSize: 14, fontWeight: 600, textAlign: 'center'}}>{message}</div>}

      {/* DIETARY MODAL */}
      {showDietaryModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end'}}>
          <div style={{background: 'white', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 480, margin: '0 auto'}}>
            <div style={{fontWeight: 800, fontSize: 18, marginBottom: 4, textAlign: 'center'}}>🌱 Dietary Profile</div>
            <div style={{color: '#999', fontSize: 13, marginBottom: 20, textAlign: 'center'}}>Menu will auto-filter based on your preferences</div>
            {DIETARY_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setDietaryProfile(prev => prev.includes(opt.id) ? prev.filter(d => d !== opt.id) : [...prev, opt.id])}
                style={{width: '100%', padding: '14px', background: dietaryProfile.includes(opt.id) ? '#f0f4ff' : 'white', border: `2px solid ${dietaryProfile.includes(opt.id) ? '#2563eb' : '#f0f0f0'}`, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 8, textAlign: 'left', color: dietaryProfile.includes(opt.id) ? '#2563eb' : '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {opt.label}
                {dietaryProfile.includes(opt.id) && <span>✓</span>}
              </button>
            ))}
            <button onClick={() => setShowDietaryModal(false)} style={{...s.primaryBtn, marginTop: 8}}>Save Preferences</button>
          </div>
        </div>
      )}

      {/* VENDORS */}
      {view === 'vendors' && (
        <div style={{padding: 16}}>
          {dietaryProfile.length > 0 && (
            <div style={{background: '#f0f4ff', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#2563eb', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>🌱 Filtering: {dietaryProfile.join(', ')}</span>
              <button onClick={() => setDietaryProfile([])} style={{background: 'none', border: 'none', color: '#2563eb', fontWeight: 800, cursor: 'pointer', fontSize: 16}}>×</button>
            </div>
          )}
          {orderHistory.length > 0 && (
            <div style={{...s.card, padding: 16, marginBottom: 16}}>
              <div style={{fontWeight: 800, fontSize: 14, marginBottom: 8}}>🕐 Order Again?</div>
              <div style={{fontSize: 13, color: '#666', marginBottom: 8}}>{orderHistory[0].items.map(i => i.name).join(', ')}</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 800, color: '#2563eb'}}>£{orderHistory[0].total.toFixed(2)}</span>
                <button onClick={() => { setCart(orderHistory[0].items); setView('cart'); }}
                  style={{padding: '8px 16px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13}}>
                  Reorder
                </button>
              </div>
            </div>
          )}
          <p style={{color: '#999', fontSize: 13, marginBottom: 16, textAlign: 'center'}}>Choose where to order from</p>
          {vendors.map(vendor => (
            <div key={vendor.id} onClick={() => selectVendor(vendor)}
              style={{...s.card, marginBottom: 16, overflow: 'hidden', cursor: vendor.is_open ? 'pointer' : 'default', opacity: vendor.is_open ? 1 : 0.7}}>
              <div style={{height: 150, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                {vendor.logo_url && <img src={vendor.logo_url} alt={vendor.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'}} />
                <div style={{position: 'absolute', top: 12, right: 12}}>
                  <div style={{background: vendor.is_open ? '#38a169' : '#e53e3e', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700}}>
                    {vendor.is_open ? 'Open' : 'Closed'}
                  </div>
                </div>
                <div style={{position: 'absolute', bottom: 12, left: 16, right: 16}}>
                  <div style={{color: 'white', fontWeight: 800, fontSize: 20}}>{vendor.name}</div>
                  <div style={{display: 'flex', gap: 8, marginTop: 4, alignItems: 'center'}}>
                    <div style={{background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: 10, fontSize: 12}}>{vendor.cuisine}</div>
                    {vendor.is_open && <div style={{color: 'rgba(255,255,255,0.9)', fontSize: 12}}>⏱ {vendor.wait_time} min wait</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MENU */}
      {view === 'menu' && (
        <div style={{paddingBottom: cartCount > 0 ? 100 : 20}}>
          <div style={{background: 'white', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontSize: 13, color: '#666'}}>⏱ ~{selectedVendor?.wait_time} min wait</div>
            <div style={{fontSize: 13, color: '#38a169', fontWeight: 700}}>● Open</div>
          </div>
          <div style={{background: 'white', borderBottom: '1px solid #f0f0f0', padding: '10px 16px', overflowX: 'auto', display: 'flex', gap: 8, whiteSpace: 'nowrap'}}>
            {[{ id: 'all', label: 'All Items' }, ...DIETARY_OPTIONS].map(filter => (
              <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
                style={{padding: '6px 14px', borderRadius: 20, border: 'none', background: activeFilter === filter.id ? '#2563eb' : '#f0f0f0', color: activeFilter === filter.id ? 'white' : '#666', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0}}>
                {filter.label}
              </button>
            ))}
          </div>
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <div style={{padding: '14px 16px 8px', fontWeight: 800, fontSize: 14, color: '#1a1a1a', background: '#f8f9fa', borderBottom: '1px solid #eee'}}>{category}</div>
              {items.map(item => {
                const cartItem = cart.find(i => i.id === item.id && i.vendorId === selectedVendor.id);
                return (
                  <div key={item.id} style={{background: 'white', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: '1px solid #f5f5f5'}}>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap'}}>
                        <div style={{fontWeight: 700, fontSize: 15, color: '#1a1a1a'}}>{item.name}</div>
                        {item.is_popular && <div style={{background: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700}}>🔥 Most Ordered</div>}
                      </div>
                      {item.description && <div style={{fontSize: 12, color: '#999', marginBottom: 6, lineHeight: 1.4}}>{item.description}</div>}
                      <div style={{display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap'}}>
                        {item.tags?.map(tag => (
                          <div key={tag} style={{background: '#f0f9f0', color: '#38a169', padding: '2px 6px', borderRadius: 6, fontSize: 10, fontWeight: 700}}>
                            {DIETARY_OPTIONS.find(d => d.id === tag)?.label}
                          </div>
                        ))}
                      </div>
                      <div style={{fontWeight: 800, fontSize: 16, color: '#2563eb'}}>£{Number(item.price).toFixed(2)}</div>
                    </div>
                    <div style={{position: 'relative', flexShrink: 0}}>
                      <div style={{width: 88, height: 88, borderRadius: 12, overflow: 'hidden', background: '#f0f0f0'}}>
                        {item.image_url ? <img src={item.image_url} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28}}>🍽️</div>}
                      </div>
                      {cartItem ? (
                        <div style={{position: 'absolute', bottom: -10, right: -8, display: 'flex', alignItems: 'center', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', padding: '3px 5px', gap: 3}}>
                          <button onClick={() => removeFromCart(item.id, selectedVendor.id)} style={{width: 26, height: 26, borderRadius: 13, border: 'none', background: '#f0f0f0', fontWeight: 800, fontSize: 14, cursor: 'pointer'}}>−</button>
                          <span style={{fontWeight: 800, minWidth: 18, textAlign: 'center', fontSize: 13}}>{cartItem.quantity}</span>
                          <button onClick={() => addToCart(item)} style={{width: 26, height: 26, borderRadius: 13, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer'}}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{position: 'absolute', bottom: -10, right: -8, width: 30, height: 30, borderRadius: 15, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: 20, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+</button>
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
        <div style={{padding: 16}}>
          {Object.entries(cartByVendor).map(([vendorId, { vendorName, items }]) => (
            <div key={vendorId} style={{...s.card, marginBottom: 16, overflow: 'hidden'}}>
              <div style={{padding: '12px 16px', background: '#f8f9fa', borderBottom: '1px solid #f0f0f0', fontWeight: 800, fontSize: 14, color: '#2563eb'}}>🍽️ {vendorName}</div>
              {items.map((item, idx) => (
                <div key={item.id} style={{padding: '14px 16px', borderBottom: idx < items.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 700, fontSize: 14, marginBottom: 2}}>{item.name}</div>
                    <div style={{fontSize: 12, color: '#999'}}>£{Number(item.price).toFixed(2)} each</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <button onClick={() => removeFromCart(item.id, parseInt(vendorId))} style={{width: 28, height: 28, borderRadius: 14, border: '2px solid #eee', background: 'white', fontWeight: 800, cursor: 'pointer', fontSize: 14}}>−</button>
                    <span style={{fontWeight: 800, minWidth: 18, textAlign: 'center'}}>{item.quantity}</span>
                    <button onClick={() => { setSelectedVendor(vendors.find(v => v.id === parseInt(vendorId))); addToCart(item); }} style={{width: 28, height: 28, borderRadius: 14, border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: 14}}>+</button>
                  </div>
                  <span style={{fontWeight: 800, color: '#2563eb', minWidth: 54, textAlign: 'right', fontSize: 14}}>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{...s.card, padding: 16, marginBottom: 16}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#999'}}><span>Subtotal</span><span>£{cartTotal.toFixed(2)}</span></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#999'}}><span>Service fee</span><span>£0.00</span></div>
            <div style={{height: 1, background: '#f0f0f0', margin: '12px 0'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18}}><span>Total</span><span style={{color: '#2563eb'}}>£{cartTotal.toFixed(2)}</span></div>
          </div>
          <button onClick={() => setShowSplit(!showSplit)} style={{width: '100%', padding: 14, background: '#f0f9f0', border: '2px solid #c6f6d5', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#38a169', marginBottom: 12}}>
            💳 Split Bill
          </button>
          {showSplit && (
            <div style={{...s.card, padding: 16, marginBottom: 16}}>
              <div style={{fontWeight: 800, fontSize: 15, marginBottom: 12}}>Split between {splitPeople} people</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
                <button onClick={() => setSplitPeople(Math.max(2, splitPeople - 1))} style={{width: 36, height: 36, borderRadius: 18, border: '2px solid #eee', background: 'white', fontWeight: 800, fontSize: 18, cursor: 'pointer'}}>−</button>
                <span style={{fontWeight: 800, fontSize: 24, flex: 1, textAlign: 'center'}}>{splitPeople}</span>
                <button onClick={() => setSplitPeople(splitPeople + 1)} style={{width: 36, height: 36, borderRadius: 18, border: '2px solid #eee', background: 'white', fontWeight: 800, fontSize: 18, cursor: 'pointer'}}>+</button>
              </div>
              <div style={{background: '#f0f4ff', borderRadius: 12, padding: '12px 16px', textAlign: 'center'}}>
                <div style={{fontWeight: 800, fontSize: 22, color: '#2563eb'}}>£{(cartTotal / splitPeople).toFixed(2)}</div>
                <div style={{fontSize: 13, color: '#666', marginTop: 2}}>per person</div>
              </div>
            </div>
          )}
          <button onClick={() => setView('checkout')} style={{...s.primaryBtn, marginBottom: 10}}>Proceed to Payment →</button>
          <button onClick={() => setView('vendors')} style={s.secondaryBtn}>+ Order from another vendor</button>
        </div>
      )}

      {/* CHECKOUT */}
      {view === 'checkout' && (
        <div style={{padding: 16}}>
          <div style={{...s.card, padding: 16, marginBottom: 16}}>
            <div style={{fontWeight: 800, fontSize: 16, marginBottom: 14}}>Payment Method</div>
            {[
              { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
              { id: 'apple', icon: '🍎', label: 'Apple Pay' },
              { id: 'google', icon: 'G', label: 'Google Pay' },
              { id: 'cash', icon: '💵', label: 'Pay at Counter' },
            ].map(method => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `2px solid ${paymentMethod === method.id ? '#2563eb' : '#f0f0f0'}`, marginBottom: 10, cursor: 'pointer', background: paymentMethod === method.id ? '#f0f4ff' : 'white'}}>
                <div style={{width: 40, height: 40, borderRadius: 10, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800}}>{method.icon}</div>
                <div style={{fontWeight: 600, fontSize: 15, flex: 1}}>{method.label}</div>
                {paymentMethod === method.id && <span style={{color: '#2563eb', fontWeight: 800}}>✓</span>}
              </div>
            ))}
          </div>
          {paymentMethod === 'card' && (
            <div style={{...s.card, padding: 16, marginBottom: 16}}>
              <div style={{fontWeight: 800, fontSize: 15, marginBottom: 14}}>Card Details</div>
              <input placeholder="Card number" style={{width: '100%', padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14, marginBottom: 10, boxSizing: 'border-box'}} defaultValue="4242 4242 4242 4242" />
              <div style={{display: 'flex', gap: 10}}>
                <input placeholder="MM/YY" style={{flex: 1, padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14}} defaultValue="12/27" />
                <input placeholder="CVV" style={{flex: 1, padding: '12px 14px', border: '2px solid #f0f0f0', borderRadius: 10, fontSize: 14}} defaultValue="123" />
              </div>
            </div>
          )}
          <div style={{...s.card, padding: 16, marginBottom: 16}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18}}><span>Total</span><span style={{color: '#2563eb'}}>£{cartTotal.toFixed(2)}</span></div>
          </div>
          <button onClick={placeOrder} disabled={!paymentMethod}
            style={{...s.primaryBtn, background: paymentMethod ? 'linear-gradient(135deg, #2563eb, #8b5cf6)' : '#ccc', marginBottom: 10, cursor: paymentMethod ? 'pointer' : 'not-allowed'}}>
            {paymentMethod ? `Pay £${cartTotal.toFixed(2)}` : 'Select Payment Method'}
          </button>
        </div>
      )}

      {/* ORDER TRACKING */}
      {view === 'tracking' && (
        <div style={{padding: 16}}>
          <div style={{...s.card, padding: 24, textAlign: 'center', marginBottom: 16}}>
            <div style={{fontSize: 56, marginBottom: 12}}>{orderStatus === 'ready' ? '✅' : '👨‍🍳'}</div>
            <div style={{fontWeight: 800, fontSize: 22, marginBottom: 4}}>{orderStatus === 'ready' ? 'Order Ready!' : 'Being Prepared'}</div>
            <div style={{color: '#999', fontSize: 14, marginBottom: 16}}>{orderStatus === 'ready' ? 'Your food is on its way to your table!' : 'Freshly preparing your order...'}</div>
            <div style={{background: '#f0f4ff', borderRadius: 12, padding: '8px 20px', display: 'inline-block'}}>
              <span style={{fontWeight: 800, color: '#2563eb', fontSize: 18}}>Order #{orderPlaced}</span>
            </div>
          </div>
          <div style={{...s.card, padding: 20, marginBottom: 16}}>
            <div style={{height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 20}}>
              <div style={{height: '100%', width: `${orderProgress}%`, background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', borderRadius: 4, transition: 'width 1s ease'}} />
            </div>
            {[
              { key: 'confirmed', label: 'Order Confirmed', done: true },
              { key: 'preparing', label: 'Being Prepared', done: ['preparing', 'ready', 'delivered'].includes(orderStatus) },
              { key: 'ready', label: 'Ready for Delivery', done: ['ready', 'delivered'].includes(orderStatus) },
              { key: 'delivered', label: 'Delivered to Table', done: orderStatus === 'delivered' },
            ].map((step, idx) => (
              <div key={step.key} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: idx < 3 ? 16 : 0}}>
                <div style={{width: 36, height: 36, borderRadius: 18, background: step.done ? '#2563eb' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: step.done ? 'white' : '#ccc', flexShrink: 0, transition: 'background 0.5s'}}>
                  {step.done ? '✓' : '○'}
                </div>
                <div style={{fontWeight: step.done ? 700 : 500, color: step.done ? '#1a1a1a' : '#ccc'}}>{step.label}</div>
              </div>
            ))}
          </div>
          <button onClick={callWaiter} style={{width: '100%', padding: 16, background: '#fff3f3', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#e53e3e', marginBottom: 10}}>
            👋 Call Waiter
          </button>
          <button onClick={() => { setView('vendors'); setSelectedVendor(null); setOrderStatus('confirmed'); setOrderProgress(0); }} style={s.secondaryBtn}>
            Order from Another Vendor
          </button>
        </div>
      )}

      {/* FLOATING CART */}
      {(view === 'menu' || view === 'vendors') && cartCount > 0 && (
        <div style={{position: 'fixed', bottom: 24, left: 16, right: 16, zIndex: 200, maxWidth: 448, margin: '0 auto'}}>
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