import React, { useState } from 'react';
import './App.css';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  const [view, setView] = useState(tableFromUrl ? 'customer' : 'vendor-login');

  if (view === 'customer') return <CustomerApp tableNumber={tableFromUrl || '1'} />;
  if (view === 'vendor') return <VendorApp onLogout={() => setView('vendor')} />;

  return <VendorApp onLogout={() => {}} />;