import React, { useState, useEffect } from 'react';
import './CustomerApp-Simple.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function CustomerApp({ onBack }) {
  const [tableNumber, setTableNumber] = useState(
    new URLSearchParams(window.location.search).get('table') || '7'
  );
  const [menu, setMenu] = useState(null);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'service', 'review'
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/api/menu`);
      const data = await res.json();
      setMenu(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load menu:', err);
      setLoading(false);
    }
  };

  const submitServiceRequest = async (type) => {
    try {
      await fetch(`${API_URL}/api/service-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_number: tableNumber, request_type: type })
      });
      showMessage(`${type} requested! Waiter will be right with you.`);
    } catch (err) {
      showMessage('Error submitting request');
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      showMessage('Please select a rating');
      return;
    }
    try {
      await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNumber,
          rating: rating,
          comment: reviewComment
        })
      });
      showMessage('Thank you for your feedback!');
      setRating(0);
      setReviewComment('');
      setTimeout(() => setCurrentView('menu'), 2000);
    } catch (err) {
      showMessage('Error submitting review');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="customer-app loading">Loading menu...</div>;
  }

  return (
    <div className="customer-app">
      {/* Header */}
      <div className="customer-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>☕ The Blue Cup Cafe</h1>
        <div className="table-info">Table {tableNumber}</div>
      </div>

      {/* Message Alert */}
      {message && <div className="message-alert">{message}</div>}

      {/* Navigation */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${currentView === 'menu' ? 'active' : ''}`}
          onClick={() => setCurrentView('menu')}
        >
          📋 Menu
        </button>
        <button
          className={`nav-tab ${currentView === 'service' ? 'active' : ''}`}
          onClick={() => setCurrentView('service')}
        >
          🆘 Help
        </button>
        <button
          className={`nav-tab ${currentView === 'review' ? 'active' : ''}`}
          onClick={() => setCurrentView('review')}
        >
          ⭐ Review
        </button>
      </div>

      {/* Content */}
      <div className="customer-content">
        {/* MENU VIEW */}
        {currentView === 'menu' && menu && (
          <div className="menu-view">
            {Object.entries(menu.categories).map(([category, items]) => (
              <div key={category} className="menu-section">
                <h2 className="section-title">{category}</h2>
                {items.map((item, idx) => (
                  <div key={idx} className="menu-item">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            ))}
            <div className="menu-note">
              📄 Download full menu or order at counter
            </div>
          </div>
        )}

        {/* SERVICE VIEW */}
        {currentView === 'service' && (
          <div className="service-view">
            <h2>How can we help?</h2>
            <div className="service-buttons">
              <button
                className="service-btn help-btn"
                onClick={() => submitServiceRequest('Help Needed')}
              >
                <span className="service-icon">🆘</span>
                <span>Need Help</span>
              </button>
              <button
                className="service-btn water-btn"
                onClick={() => submitServiceRequest('Refill Water')}
              >
                <span className="service-icon">💧</span>
                <span>Refill Water</span>
              </button>
              <button
                className="service-btn bill-btn"
                onClick={() => submitServiceRequest('Bill Please')}
              >
                <span className="service-icon">📝</span>
                <span>Bill Please</span>
              </button>
              <button
                className="service-btn special-btn"
                onClick={() => submitServiceRequest('Special Request')}
              >
                <span className="service-icon">💬</span>
                <span>Special Request</span>
              </button>
            </div>
            <p className="service-note">A waiter will respond shortly</p>
          </div>
        )}

        {/* REVIEW VIEW */}
        {currentView === 'review' && (
          <div className="review-view">
            <h2>Rate Your Visit</h2>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star ${rating >= star ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-text">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </div>
            )}
            <textarea
              className="review-textarea"
              placeholder="Share your feedback... (optional)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <button
              className="submit-btn"
              onClick={submitReview}
              disabled={rating === 0}
            >
              Submit Review
            </button>
            <div className="review-note">
              Your feedback helps us improve! 💙
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
