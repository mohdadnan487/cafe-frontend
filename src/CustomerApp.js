import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function CustomerApp({ onBack }) {
  const [tableNumber] = useState(
    new URLSearchParams(window.location.search).get('table') || '7'
  );
  const [currentView, setCurrentView] = useState('service');
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [message, setMessage] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/menu-pdf-url`)
      .then(r => r.json())
      .then(d => { if (d.url) setPdfUrl(d.url); })
      .catch(() => {});
  }, []);

  const submitServiceRequest = async (type) => {
    try {
      await fetch(`${API_URL}/api/service-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, request_type: type })
      });
      setRequestSubmitted(true);
      showMessage(`Request sent! Waiter coming soon.`);
      setTimeout(() => setRequestSubmitted(false), 3000);
    } catch (err) {
      showMessage('Error submitting request');
    }
  };

  const submitReview = async () => {
    if (rating === 0) { showMessage('Please select a rating'); return; }
    try {
      await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, rating, comment: reviewComment })
      });
      showMessage('Thank you for your feedback!');
      setRating(0);
      setReviewComment('');
      setTimeout(() => setCurrentView('service'), 2000);
    } catch (err) {
      showMessage('Error submitting review');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="customer-app">
      <div className="customer-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>☕ The Blue Cup Cafe</h1>
        <div className="table-info">Table {tableNumber}</div>
      </div>

      {message && <div className="message-alert success">{message}</div>}

      <div className="nav-tabs-clean">
        <button className={`nav-tab-clean ${currentView === 'menu' ? 'active' : ''}`} onClick={() => setCurrentView('menu')}>Menu</button>
        <button className={`nav-tab-clean ${currentView === 'service' ? 'active' : ''}`} onClick={() => setCurrentView('service')}>Call Waiter</button>
        <button className={`nav-tab-clean ${currentView === 'review' ? 'active' : ''}`} onClick={() => setCurrentView('review')}>Review</button>
      </div>

      <div className="customer-content">

        {currentView === 'menu' && (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                style={{flex: 1, width: '100%', minHeight: '80vh', border: 'none'}}
                title="Menu"
              />
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <div className="empty-text">Menu coming soon</div>
                <div className="empty-subtext">The manager hasn't uploaded the menu yet</div>
              </div>
            )}
          </div>
        )}

        {currentView === 'service' && (
          <div className="service-view-clean">
            <div className="service-header-clean">
              <h2>How can we help?</h2>
              <p>Select what you need</p>
            </div>
            <div className="service-buttons-clean">
              <button className="service-btn-clean" onClick={() => submitServiceRequest('Help Needed')} disabled={requestSubmitted}>
                <div className="btn-icon">👋</div>
                <div className="btn-label">Call Waiter</div>
              </button>
              <button className="service-btn-clean" onClick={() => submitServiceRequest('Refill Water')} disabled={requestSubmitted}>
                <div className="btn-icon">💧</div>
                <div className="btn-label">Water</div>
              </button>
              <button className="service-btn-clean" onClick={() => submitServiceRequest('Bill Please')} disabled={requestSubmitted}>
                <div className="btn-icon">📝</div>
                <div className="btn-label">Bill</div>
              </button>
              <button className="service-btn-clean" onClick={() => submitServiceRequest('Ready to be Served')} disabled={requestSubmitted}>
                <div className="btn-icon">✓</div>
                <div className="btn-label">Ready to be Served</div>
              </button>
            </div>
            {requestSubmitted && <div className="success-message-clean">✓ Request sent! Your waiter will be with you shortly.</div>}
          </div>
        )}

        {currentView === 'review' && (
          <div className="review-view">
            <h2>Rate Your Visit</h2>
            <div className="rating-container">
              {[1,2,3,4,5].map((star) => (
                <button key={star} className={`star ${rating >= star ? 'filled' : ''}`} onClick={() => setRating(star)}>⭐</button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-text">
                {['','Poor','Fair','Good','Very Good','Excellent!'][rating]}
              </div>
            )}
            <textarea className="review-textarea" placeholder="Share your feedback... (optional)" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
            <button className="submit-btn" onClick={submitReview} disabled={rating === 0}>Submit Review</button>
          </div>
        )}

      </div>
    </div>
  );
}