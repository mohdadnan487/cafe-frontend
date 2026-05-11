import React from 'react';
import CustomerApp from './CustomerApp';
import VendorApp from './VendorApp';

export default function App() {
  const tableFromUrl = new URLSearchParams(window.location.search).get('table');
  
  if (tableFromUrl) return <CustomerApp tableNumber={tableFromUrl} />;
  
  return <VendorApp onLogout={() => {}} />;
}