import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const WS_URL = API_URL.replace('https', 'wss').replace('http', 'ws');

const Icons = {
  back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  ),
  waiter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  diet: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l4.5 4.5"/><path d="M22 2L12 12"/>
    </svg>
  ),
  users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  split: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  fire: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C9.5 6 10 8 8 10c-.5-2-2-3-2-5C3.5 7 2 10 2 13c0 5.5 4.5 9 10 9s10-3.5 10-9c0-4-2-7-4-9-1 2-2 3-2 5-1-2-2-4-4-7z"/>
    </svg>
  ),
  leaf: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4 1-1.5 1.5-3 1.5-5 0-3-1-6-3-8 5 0 9 2 11 5 1 1.5 1.5 3.5 1.5 5.5 0 2-.5 4-1.5 5.5S12 23 10 23"/>
      <line x1="2" y1="22" x2="12" y2="12"/>
    </svg>
  ),
};

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'nut_free', label: 'Nut Free' },
];

const DUMMY_VENDORS = [
  { id: 1, name: 'Burger Bros', cuisine: 'American', description: 'Juicy handcrafted burgers', logo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', is_open: true, wait_time: 12 },
  { id: 2, name: 'Sushi Sato', cuisine: 'Japanese', description: 'Authentic Japanese sushi', logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', is_open: true, wait_time: 18 },
  { id: 3, name: 'Pizza Palace', cuisine: 'Italian', description: 'Wood fired Neapolitan pizza', logo_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', is_open: true, wait_time: 20 },
  { id: 4, name: 'Green Bowl', cuisine: 'Healthy', description: 'Fresh salads and grain bowls', logo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', is_open: true, wait_time: 8 },
];

const DUMMY_MENUS = {
  1: [
    { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, aged cheddar', price: 9.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', tags: ['halal'], is_popular: true },
    { id: 2, name: 'Double Smash', description: 'Double smash patty, special sauce, pickles', price: 12.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300', tags: ['halal'], is_popular: true },
    { id: 3, name: 'Chicken Burger', description: 'Crispy fried chicken, coleslaw, sriracha mayo', price: 10.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300', tags: ['halal'] },
    { id: 4, name: 'Veggie Burger', description: 'Plant-based patty, avocado, sun-dried tomato', price: 9.49, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300', tags: ['vegan', 'vegetarian'] },
    { id: 5, name: 'Cheese Fries', description: 'Hand-cut fries, aged cheddar sauce', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', tags: ['vegetarian'], is_popular: true },
    { id: 6, name: 'Onion Rings', description: 'Beer-battered golden onion rings', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300', tags: ['vegan'] },
    { id: 7, name: 'Chocolate Shake', description: 'Thick Belgian chocolate milkshake', price: 5.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', tags: ['vegetarian'] },
    { id: 8, name: 'Lemonade', description: 'House-pressed lemonade, fresh mint', price: 3.49, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300', tags: ['vegan', 'gluten_free'] },
  ],
  2: [
    { id: 9, name: 'Salmon Nigiri', description: 'Hand-pressed sushi rice, fresh Atlantic salmon', price: 8.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300', tags: ['gluten_free'], is_popular: true },
    { id: 10, name: 'Tuna Nigiri', description: 'Premium bluefin tuna, wasabi', price: 9.99, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300', tags: ['gluten_free'] },
    { id: 11, name: 'Dragon Roll', description: 'Shrimp tempura, avocado, cucumber', price: 13.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300', tags: [], is_popular: true },
    { id: 12, name: 'Rainbow Roll', description: 'California roll, assorted sashimi topping', price: 15.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=300', tags: [] },
    { id: 13, name: 'Veggie Roll', description: 'Avocado, cucumber, carrot, pickled radish', price: 9.99, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=300', tags: ['vegan', 'gluten_free'] },
    { id: 14, name: 'Miso Soup', description: 'Traditional white miso, silken tofu, wakame', price: 3.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', tags: ['vegan'] },
  ],
  3: [
    { id: 15, name: 'Margherita', description: 'San Marzano tomato, fior di latte, fresh basil', price: 11.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', tags: ['vegetarian'], is_popular: true },
    { id: 16, name: 'Pepperoni', description: 'Spicy Calabrian pepperoni, smoked mozzarella', price: 13.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', tags: [], is_popular: true },
    { id: 17, name: 'Truffle Mushroom', description: 'Wild mushrooms, black truffle oil, parmesan', price: 14.99, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', tags: ['vegan'] },
    { id: 18, name: 'Garlic Bread', description: 'Sourdough, cultured butter, roasted garlic', price: 4.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300', tags: ['vegetarian'] },
    { id: 19, name: 'Tiramisu', description: 'Mascarpone, espresso-soaked ladyfingers', price: 5.99, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300', tags: ['vegetarian'] },
  ],
  4: [
    { id: 20, name: 'Quinoa Buddha Bowl', description: 'Tri-colour quinoa, roasted veg, tahini dressing', price: 12.99, category: 'Bowls', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300', tags: ['vegan', 'gluten_free'], is_popular: true },
    { id: 21, name: 'Falafel Wrap', description: 'Crispy falafel, hummus, pickled cabbage', price: 9.99, category: 'Wraps', image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300', tags: ['vegan'] },
    { id: 22, name: 'Acai Bowl', description: 'Wild acai, granola, fresh seasonal fruit', price: 10.99, category: 'Bowls', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', tags: ['vegan', 'gluten_free'] },
    { id: 23, name: 'Green Smoothie', description: 'Spinach, banana, almond milk, medjool dates', price: 6.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300', tags: ['vegan', 'gluten_free'] },
  ],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAF9; color: #1A1A1A; }
  ::-webkit-scrollbar { display: none; }
  input { font-family: 'DM Sans', sans-serif; }
  button { font-family: 'DM Sans', sans-serif; }
`;

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
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [myName, setMyName] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupCodeInput, setGroupCodeInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/vendors`)
      .then(r => r.json())
      .then(data => { if (data.length) setVendors(data.map(v => ({...v, is_open: true, wait_time: v.wait_time || 15}))); })
      .catch(() => {});
  }, []);

  const connectWebSocket = (id, name) => {
    try {
      const ws = new WebSocket(`${WS_URL}?groupId=${id}&name=${encodeURIComponent(name)}`);
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'cart_updated' && data.updatedBy !== name) setCart(data.cart);
        if (['member_joined', 'member_left', 'init'].includes(data.type)) setGroupMembers(data.members || []);
        if (data.type === 'init' && data.cart?.length) setCart(data.cart);
      };
      setSocket(ws);
      return ws;
    } catch (err) { return null; }
  };

  const startGroupOrder = () => {
    const name = groupNameInput.trim();
    if (!name) return;
    const id = Math.random().toString(36).substr(2, 6).toUpperCase();
    setGroupId(id); setMyName(name); setGroupMembers([name]);
    connectWebSocket(id, name);
    setShowGroupModal(false); setGroupNameInput('');
  };

  const joinGroupOrder = () => {
    const name = groupNameInput.trim();
    const code = groupCodeInput.trim().toUpperCase();
    if (!name || !code) return;
    setGroupId(code); setMyName(name);
    connectWebSocket(code, name);
    setShowGroupModal(false); setGroupNameInput(''); setGroupCodeInput('');
  };

  const syncCart = (newCart) => {
    if (socket && socket.readyState === 1) socket.send(JSON.stringify({ type: 'update_cart', cart: newCart }));
  };

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
      const newCart = existing
        ? prev.map(i => i.id === item.id && i.vendorId === selectedVendor.id ? {...i, quantity: i.quantity + 1} : i)
        : [...prev, {...item, vendorId: selectedVendor.id, vendorName: selectedVendor.name, quantity: 1}];
      syncCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId, vendorId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId && i.vendorId === vendorId);
      const newCart = existing?.quantity === 1
        ? prev.filter(i => !(i.id === itemId && i.vendorId === vendorId))
        : prev.map(i => i.id === itemId && i.vendorId === vendorId ? {...i, quantity: i.quantity - 1} : i);
      syncCart(newCart);
      return newCart;
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
    const newOrder = { id: Math.floor(Math.random() * 9000 + 1000), items: [...cart], total: cartTotal };
    setOrderHistory(prev => [newOrder, ...prev]);
    setOrderPlaced(newOrder.id);
    setCart([]);
    setOrderStatus('confirmed');
    setOrderProgress(25);
    setView('tracking');
    setTimeout(() => { setOrderStatus('preparing'); setOrderProgress(50); }, 3000);
    setTimeout(() => setOrderProgress(75), 8000);
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
    setMessage('Waiter notified — someone will be with you shortly');
    setTimeout(() => setMessage(''), 4000);
  };

  const filteredMenu = menuItems.filter(item => {
    if (activeFilter === 'all') return dietaryProfile.length === 0 || dietaryProfile.every(d => item.tags?.includes(d));
    return item.tags?.includes(activeFilter);
  });

  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const T = {
    page: { minHeight: '100vh', background: '#FAFAF9', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    header: { background: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EFED', position: 'sticky', top: 0, zIndex: 100 },
    pill: (active) => ({ padding: '7px 16px', borderRadius: 100, border: `1.5px solid ${active ? '#1A1A1A' : '#E8E6E3'}`, background: active ? '#1A1A1A' : '#fff', color: active ? '#fff' : '#6B6560', fontWeight: 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: 0.1 }),
    card: { background: '#fff', borderRadius: 16, border: '1px solid #F0EFED' },
    primaryBtn: { width: '100%', padding: '16px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 600, fontSize: 15, cursor: 'pointer', letterSpacing: 0.2 },
    ghostBtn: { width: '100%', padding: '15px', background: '#fff', color: '#1A1A1A', border: '1.5px solid #E8E6E3', borderRadius: 14, fontWeight: 500, fontSize: 14, cursor: 'pointer' },
    input: { width: '100%', padding: '14px 16px', border: '1.5px solid #E8E6E3', borderRadius: 12, fontSize: 14, background: '#FAFAF9', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' },
  };

  const Modal = ({ children, onClose }) => (
    <div onClick={onClose} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)'}}>
      <div onClick={e => e.stopPropagation()} style={{background: '#fff', borderRadius: '24px 24px 0 0', padding: '8px 0 40px', width: '100%', maxWidth: 480, margin: '0 auto'}}>
        <div style={{width: 36, height: 4, background: '#E8E6E3', borderRadius: 2, margin: '12px auto 24px'}} />
        <div style={{padding: '0 24px'}}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={T.page}>

      {/* HEADER */}
      <div style={T.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          {view !== 'vendors' && (
            <button onClick={() => {
              if (view === 'cart') setView('menu');
              else if (view === 'checkout') setView('cart');
              else { setView('vendors'); setSelectedVendor(null); }
            }} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', color: '#1A1A1A', display: 'flex', alignItems: 'center'}}>
              <Icons.back />
            </button>
          )}
          <div>
            <div style={{fontWeight: 600, fontSize: 15, color: '#1A1A1A', letterSpacing: -0.2}}>
              {view === 'vendors' ? 'The Food Quarter' : view === 'tracking' ? 'Order Tracking' : view === 'checkout' ? 'Checkout' : view === 'cart' ? 'Your Order' : selectedVendor?.name}
            </div>
            <div style={{fontSize: 11, color: '#9B9590', marginTop: 1, letterSpacing: 0.2}}>TABLE {tableNumber}</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          {view === 'menu' && (
            <button onClick={callWaiter} style={{background: '#FFF5F5', border: '1.5px solid #FFE4E4', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', color: '#E53E3E', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5}}>
              <Icons.waiter /> Waiter
            </button>
          )}
          {view === 'vendors' && (
            <button onClick={() => setShowDietaryModal(true)} style={{background: '#F5F4F2', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#1A1A1A', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5}}>
              <Icons.diet /> Diet
            </button>
          )}
        </div>
      </div>

      {message && (
        <div style={{background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '12px 20px', fontSize: 13, color: '#166534', fontWeight: 500, textAlign: 'center'}}>
          {message}
        </div>
      )}

      {/* DIETARY MODAL */}
      {showDietaryModal && (
        <Modal onClose={() => setShowDietaryModal(false)}>
          <div style={{fontWeight: 700, fontSize: 18, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>Dietary Preferences</div>
          <div style={{color: '#9B9590', fontSize: 13, marginBottom: 20}}>Menu filters automatically to match</div>
          {DIETARY_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setDietaryProfile(prev => prev.includes(opt.id) ? prev.filter(d => d !== opt.id) : [...prev, opt.id])}
              style={{...T.ghostBtn, marginBottom: 8, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1.5px solid ${dietaryProfile.includes(opt.id) ? '#1A1A1A' : '#E8E6E3'}`, background: dietaryProfile.includes(opt.id) ? '#F5F4F2' : '#fff'}}>
              <span style={{fontWeight: dietaryProfile.includes(opt.id) ? 600 : 400}}>{opt.label}</span>
              {dietaryProfile.includes(opt.id) && <div style={{width: 20, height: 20, borderRadius: 10, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icons.check /></div>}
            </button>
          ))}
          <button onClick={() => setShowDietaryModal(false)} style={{...T.primaryBtn, marginTop: 8}}>Done</button>
        </Modal>
      )}

      {/* GROUP ORDER MODAL */}
      {showGroupModal && (
        <Modal onClose={() => setShowGroupModal(false)}>
          <div style={{fontWeight: 700, fontSize: 18, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>Group Order</div>
          <div style={{color: '#9B9590', fontSize: 13, marginBottom: 20}}>Everyone adds items, one checkout</div>
          <div style={{fontSize: 12, fontWeight: 600, color: '#6B6560', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase'}}>Your name</div>
          <input style={{...T.input, marginBottom: 16}} placeholder="Enter your name" value={groupNameInput} onChange={e => setGroupNameInput(e.target.value)} />
          <button onClick={startGroupOrder} style={{...T.primaryBtn, marginBottom: 20}}>Start Group Order</button>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
            <div style={{flex: 1, height: 1, background: '#E8E6E3'}} />
            <span style={{fontSize: 12, color: '#9B9590'}}>or join existing</span>
            <div style={{flex: 1, height: 1, background: '#E8E6E3'}} />
          </div>
          <div style={{fontSize: 12, fontWeight: 600, color: '#6B6560', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase'}}>Group code</div>
          <input style={{...T.input, marginBottom: 12, letterSpacing: 3, fontWeight: 600, fontSize: 16}} placeholder="ABC123" value={groupCodeInput} onChange={e => setGroupCodeInput(e.target.value.toUpperCase())} maxLength={6} />
          <button onClick={joinGroupOrder} style={{...T.ghostBtn, marginBottom: 0}}>Join Group</button>
        </Modal>
      )}

      {/* VENDORS */}
      {view === 'vendors' && (
        <div style={{padding: '20px 16px'}}>

          {/* GROUP ORDER */}
          <div style={{...T.card, padding: 16, marginBottom: 16}}>
            {!groupId ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 14, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6}}><Icons.users /> Group Order</div>
                  <div style={{fontSize: 12, color: '#9B9590'}}>Order together, one checkout</div>
                </div>
                <button onClick={() => setShowGroupModal(true)} style={{padding: '9px 18px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'}}>Start</button>
              </div>
            ) : (
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <div style={{fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6}}><Icons.users /> Group Active</div>
                  <div style={{background: '#F5F4F2', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#1A1A1A'}}>{groupId}</div>
                </div>
                <div style={{fontSize: 12, color: '#9B9590', marginBottom: 8}}>Share this code with friends at your table</div>
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                  {groupMembers.map((m, i) => (
                    <div key={i} style={{background: m === myName ? '#1A1A1A' : '#F5F4F2', color: m === myName ? '#fff' : '#1A1A1A', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500}}>
                      {m}{m === myName ? ' · you' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ORDER AGAIN */}
          {orderHistory.length > 0 && (
            <div style={{...T.card, padding: 16, marginBottom: 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 13, marginBottom: 3, color: '#9B9590', letterSpacing: 0.3, textTransform: 'uppercase', fontSize: 11}}>Order Again</div>
                  <div style={{fontSize: 13, color: '#1A1A1A', fontWeight: 500}}>{orderHistory[0].items.slice(0,2).map(i => i.name).join(', ')}{orderHistory[0].items.length > 2 ? ` +${orderHistory[0].items.length - 2}` : ''}</div>
                </div>
                <button onClick={() => { setCart(orderHistory[0].items); setView('cart'); }}
                  style={{padding: '9px 18px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer'}}>
                  Reorder
                </button>
              </div>
            </div>
          )}

          {dietaryProfile.length > 0 && (
            <div style={{background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: 13, color: '#166534', fontWeight: 500}}>Filtering: {dietaryProfile.join(', ')}</span>
              <button onClick={() => setDietaryProfile([])} style={{background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: 18, lineHeight: 1}}>×</button>
            </div>
          )}

          <div style={{fontSize: 11, fontWeight: 600, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12}}>Vendors</div>

          {vendors.map(vendor => (
            <div key={vendor.id} onClick={() => selectVendor(vendor)}
              style={{...T.card, marginBottom: 12, overflow: 'hidden', cursor: 'pointer', opacity: vendor.is_open ? 1 : 0.5}}>
              <div style={{height: 180, position: 'relative', overflow: 'hidden', background: '#F5F4F2'}}>
                {vendor.logo_url && <img src={vendor.logo_url} alt={vendor.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)'}} />
                <div style={{position: 'absolute', top: 12, right: 12, background: vendor.is_open ? '#ECFDF5' : '#FEF2F2', color: vendor.is_open ? '#059669' : '#DC2626', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3}}>
                  {vendor.is_open ? 'Open' : 'Closed'}
                </div>
                <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px'}}>
                  <div style={{color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: -0.3, marginBottom: 4, fontFamily: "'DM Serif Display', serif"}}>{vendor.name}</div>
                  <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <span style={{color: 'rgba(255,255,255,0.7)', fontSize: 12}}>{vendor.cuisine}</span>
                    <span style={{color: 'rgba(255,255,255,0.4)', fontSize: 10}}>·</span>
                    <span style={{color: 'rgba(255,255,255,0.7)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4}}><Icons.clock /> {vendor.wait_time} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MENU */}
      {view === 'menu' && (
        <div style={{paddingBottom: cartCount > 0 ? 100 : 24}}>
          <div style={{background: '#fff', borderBottom: '1px solid #F0EFED', padding: '12px 16px', overflowX: 'auto', display: 'flex', gap: 8}}>
            {[{ id: 'all', label: 'All' }, ...DIETARY_OPTIONS].map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)} style={T.pill(activeFilter === f.id)}>{f.label}</button>
            ))}
          </div>
          {groupId && (
            <div style={{background: '#F5F4F2', padding: '10px 16px', fontSize: 12, color: '#6B6560', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
              <Icons.users /> Group order · {groupMembers.join(', ')}
            </div>
          )}
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <div style={{padding: '16px 16px 8px', fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase'}}>{category}</div>
              {items.map(item => {
                const cartItem = cart.find(i => i.id === item.id && i.vendorId === selectedVendor.id);
                return (
                  <div key={item.id} style={{background: '#fff', padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', borderBottom: '1px solid #F5F4F2'}}>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3}}>
                        <div style={{fontWeight: 600, fontSize: 14, color: '#1A1A1A'}}>{item.name}</div>
                        {item.is_popular && (
                          <div style={{display: 'flex', alignItems: 'center', gap: 3, background: '#FFF7ED', color: '#C2410C', padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600}}>
                            <Icons.fire /> Popular
                          </div>
                        )}
                      </div>
                      {item.description && <div style={{fontSize: 12, color: '#9B9590', marginBottom: 6, lineHeight: 1.5}}>{item.description}</div>}
                      {item.tags?.length > 0 && (
                        <div style={{display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap'}}>
                          {item.tags.map(tag => (
                            <div key={tag} style={{display: 'flex', alignItems: 'center', gap: 3, background: '#F0FDF4', color: '#059669', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500}}>
                              <Icons.leaf /> {DIETARY_OPTIONS.find(d => d.id === tag)?.label}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{fontWeight: 700, fontSize: 15, color: '#1A1A1A'}}>£{Number(item.price).toFixed(2)}</div>
                    </div>
                    <div style={{position: 'relative', flexShrink: 0}}>
                      <div style={{width: 84, height: 84, borderRadius: 12, overflow: 'hidden', background: '#F5F4F2'}}>
                        {item.image_url ? <img src={item.image_url} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4BFB8', fontSize: 24}}>🍽</div>}
                      </div>
                      {cartItem ? (
                        <div style={{position: 'absolute', bottom: -10, right: -8, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', padding: '4px 6px', gap: 4, border: '1px solid #F0EFED'}}>
                          <button onClick={() => removeFromCart(item.id, selectedVendor.id)} style={{width: 24, height: 24, borderRadius: 12, border: 'none', background: '#F5F4F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A'}}><Icons.minus /></button>
                          <span style={{fontWeight: 700, minWidth: 16, textAlign: 'center', fontSize: 13}}>{cartItem.quantity}</span>
                          <button onClick={() => addToCart(item)} style={{width: 24, height: 24, borderRadius: 12, border: 'none', background: '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}><Icons.plus /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{position: 'absolute', bottom: -10, right: -8, width: 28, height: 28, borderRadius: 14, border: 'none', background: '#1A1A1A', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}><Icons.plus /></button>
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
          {groupId && (
            <div style={{background: '#F5F4F2', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#6B6560', display: 'flex', alignItems: 'center', gap: 6}}>
              <Icons.users /> Group · {groupMembers.length} people · Code: <strong>{groupId}</strong>
            </div>
          )}
          {Object.entries(cartByVendor).map(([vendorId, { vendorName, items }]) => (
            <div key={vendorId} style={{...T.card, marginBottom: 12, overflow: 'hidden'}}>
              <div style={{padding: '12px 16px', borderBottom: '1px solid #F5F4F2'}}>
                <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase'}}>{vendorName}</div>
              </div>
              {items.map((item, idx) => (
                <div key={item.id} style={{padding: '14px 16px', borderBottom: idx < items.length - 1 ? '1px solid #F5F4F2' : 'none', display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 14, marginBottom: 2}}>{item.name}</div>
                    <div style={{fontSize: 12, color: '#9B9590'}}>£{Number(item.price).toFixed(2)} each</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <button onClick={() => removeFromCart(item.id, parseInt(vendorId))} style={{width: 28, height: 28, borderRadius: 14, border: '1.5px solid #E8E6E3', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icons.minus /></button>
                    <span style={{fontWeight: 700, minWidth: 16, textAlign: 'center', fontSize: 14}}>{item.quantity}</span>
                    <button onClick={() => { setSelectedVendor(vendors.find(v => v.id === parseInt(vendorId))); addToCart(item); }} style={{width: 28, height: 28, borderRadius: 14, border: 'none', background: '#1A1A1A', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icons.plus /></button>
                  </div>
                  <div style={{fontWeight: 700, fontSize: 14, minWidth: 54, textAlign: 'right'}}>£{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ))}

          <div style={{...T.card, padding: 16, marginBottom: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#9B9590'}}><span>Subtotal</span><span>£{cartTotal.toFixed(2)}</span></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#9B9590'}}><span>Service</span><span>£0.00</span></div>
            <div style={{height: 1, background: '#F0EFED', marginBottom: 12}} />
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17}}><span>Total</span><span>£{cartTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={() => setShowSplit(!showSplit)} style={{...T.ghostBtn, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            <Icons.split /> Split Bill
          </button>

          {showSplit && (
            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontWeight: 600, fontSize: 14, marginBottom: 14}}>Split between</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14}}>
                <button onClick={() => setSplitPeople(Math.max(2, splitPeople - 1))} style={{width: 40, height: 40, borderRadius: 20, border: '1.5px solid #E8E6E3', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icons.minus /></button>
                <span style={{fontWeight: 700, fontSize: 28, flex: 1, textAlign: 'center'}}>{splitPeople}</span>
                <button onClick={() => setSplitPeople(splitPeople + 1)} style={{width: 40, height: 40, borderRadius: 20, border: '1.5px solid #E8E6E3', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icons.plus /></button>
              </div>
              <div style={{background: '#F5F4F2', borderRadius: 12, padding: '14px', textAlign: 'center'}}>
                <div style={{fontWeight: 700, fontSize: 24}}>£{(cartTotal / splitPeople).toFixed(2)}</div>
                <div style={{fontSize: 12, color: '#9B9590', marginTop: 2}}>per person</div>
              </div>
            </div>
          )}

          <button onClick={() => setView('checkout')} style={{...T.primaryBtn, marginBottom: 10}}>Continue to Payment</button>
          <button onClick={() => setView('vendors')} style={T.ghostBtn}>Add from Another Vendor</button>
        </div>
      )}

      {/* CHECKOUT */}
      {view === 'checkout' && (
        <div style={{padding: 16}}>
          <div style={{...T.card, padding: 16, marginBottom: 12}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14}}>Payment Method</div>
            {[
              { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
              { id: 'apple', label: 'Apple Pay', sub: 'Touch or Face ID' },
              { id: 'google', label: 'Google Pay', sub: 'Pay with Google' },
              { id: 'cash', label: 'Pay at Counter', sub: 'Cash or card at vendor' },
            ].map(method => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                style={{display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${paymentMethod === method.id ? '#1A1A1A' : '#E8E6E3'}`, marginBottom: 8, cursor: 'pointer', background: paymentMethod === method.id ? '#F5F4F2' : '#fff', transition: 'all 0.15s'}}>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 600, fontSize: 14}}>{method.label}</div>
                  <div style={{fontSize: 11, color: '#9B9590', marginTop: 1}}>{method.sub}</div>
                </div>
                <div style={{width: 20, height: 20, borderRadius: 10, border: `2px solid ${paymentMethod === method.id ? '#1A1A1A' : '#E8E6E3'}`, background: paymentMethod === method.id ? '#1A1A1A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {paymentMethod === method.id && <div style={{width: 8, height: 8, borderRadius: 4, background: '#fff'}} />}
                </div>
              </div>
            ))}
          </div>

          {paymentMethod === 'card' && (
            <div style={{...T.card, padding: 16, marginBottom: 12}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9B9590', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14}}>Card Details</div>
              <input style={{...T.input, marginBottom: 10}} placeholder="Card number" defaultValue="4242 4242 4242 4242" />
              <div style={{display: 'flex', gap: 10}}>
                <input style={{...T.input, flex: 1}} placeholder="MM / YY" defaultValue="12/27" />
                <input style={{...T.input, flex: 1}} placeholder="CVV" defaultValue="123" />
              </div>
            </div>
          )}

          <div style={{...T.card, padding: 16, marginBottom: 16}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17}}><span>Total</span><span>£{cartTotal.toFixed(2)}</span></div>
          </div>

          <button onClick={placeOrder} disabled={!paymentMethod}
            style={{...T.primaryBtn, background: paymentMethod ? '#1A1A1A' : '#E8E6E3', color: paymentMethod ? '#fff' : '#9B9590', cursor: paymentMethod ? 'pointer' : 'not-allowed', marginBottom: 10}}>
            {paymentMethod ? `Pay £${cartTotal.toFixed(2)}` : 'Select a payment method'}
          </button>
        </div>
      )}

      {/* TRACKING */}
      {view === 'tracking' && (
        <div style={{padding: 16}}>
          <div style={{...T.card, padding: 28, textAlign: 'center', marginBottom: 12}}>
            <div style={{width: 64, height: 64, borderRadius: 32, background: orderStatus === 'ready' ? '#F0FDF4' : '#F5F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28}}>
              {orderStatus === 'ready' ? '✓' : '⋯'}
            </div>
            <div style={{fontWeight: 700, fontSize: 22, marginBottom: 6, fontFamily: "'DM Serif Display', serif"}}>
              {orderStatus === 'ready' ? 'Order Ready' : 'Being Prepared'}
            </div>
            <div style={{color: '#9B9590', fontSize: 13, marginBottom: 16, lineHeight: 1.5}}>
              {orderStatus === 'ready' ? 'Your food is on its way to the table' : 'Your order is being freshly prepared'}
            </div>
            <div style={{background: '#F5F4F2', borderRadius: 10, padding: '8px 20px', display: 'inline-block', fontWeight: 700, fontSize: 14, letterSpacing: 0.5}}>
              #{orderPlaced}
            </div>
          </div>

          <div style={{...T.card, padding: 20, marginBottom: 12}}>
            <div style={{height: 4, background: '#F0EFED', borderRadius: 2, overflow: 'hidden', marginBottom: 20}}>
              <div style={{height: '100%', width: `${orderProgress}%`, background: '#1A1A1A', borderRadius: 2, transition: 'width 1s ease'}} />
            </div>
            {[
              { label: 'Order confirmed', done: true },
              { label: 'Being prepared', done: ['preparing', 'ready', 'delivered'].includes(orderStatus) },
              { label: 'Ready for collection', done: ['ready', 'delivered'].includes(orderStatus) },
              { label: 'Delivered', done: orderStatus === 'delivered' },
            ].map((step, idx) => (
              <div key={idx} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: idx < 3 ? 14 : 0}}>
                <div style={{width: 28, height: 28, borderRadius: 14, background: step.done ? '#1A1A1A' : '#F0EFED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.5s'}}>
                  {step.done && <Icons.check />}
                </div>
                <div style={{fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? '#1A1A1A' : '#C4BFB8'}}>{step.label}</div>
              </div>
            ))}
          </div>

          <button onClick={callWaiter} style={{...T.ghostBtn, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
            <Icons.waiter /> Call Waiter
          </button>
          <button onClick={() => { setView('vendors'); setSelectedVendor(null); setOrderStatus('confirmed'); setOrderProgress(0); }} style={T.ghostBtn}>
            Order from Another Vendor
          </button>
        </div>
      )}

      {/* FLOATING CART */}
      {(view === 'menu' || view === 'vendors') && cartCount > 0 && (
        <div style={{position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 200, maxWidth: 448, margin: '0 auto'}}>
          <button onClick={() => setView('cart')}
            style={{width: '100%', padding: '16px 20px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'}}>
            <div style={{background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700}}>{cartCount}</div>
            <span style={{display: 'flex', alignItems: 'center', gap: 8}}><Icons.cart /> View Order</span>
            <span style={{fontWeight: 700}}>£{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

    </div>
  );
}