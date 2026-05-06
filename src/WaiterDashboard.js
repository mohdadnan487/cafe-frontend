import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function WaiterDashboard({ waiterName, onBack }) {
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [currentTab, setCurrentTab] = useState('requests');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [reqRes, revRes, statRes] = await Promise.all([
        fetch(`${API_URL}/api/pending-requests`),
        fetch(`${API_URL}/api/reviews`),
        fetch(`${API_URL}/api/stats`)
      ]);

      const reqData = await reqRes.json();
      const revData = await revRes.json();
      const statData = await statRes.json();

      setRequests(reqData);
      setReviews(revData);
      setStats(statData);
      setRefreshing(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const completeRequest = async (id) => {
    try {
      await fetch(`${API_URL}/api/complete-request/${id}`, { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error('Error completing request:', err);
    }
  };

  return (
    <div className="waiter-dashboard">
      <div className="waiter-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="waiter-info">
          <div className="waiter-name">👨‍🍳 {waiterName}</div>
          <div className="waiter-subtitle">Service Dashboard</div>
        </div>
        <button className="refresh-btn" onClick={fetchData} disabled={refreshing}>
          {refreshing ? '⟳' : '↻'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{stats.pending_count || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-value">{stats.completed_today || 0}</div>
          <div className="stat-label">Done Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{(stats.avg_rating || 0).toFixed(1)}</div>
          <div className="stat-label">Rating</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${currentTab === 'requests' ? 'active' : ''}`}
          onClick={() => setCurrentTab('requests')}
        >
          🔔 Requests ({requests.length})
        </button>
        <button
          className={`tab-btn ${currentTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setCurrentTab('reviews')}
        >
          ⭐ Reviews ({reviews.length})
        </button>
      </div>

      <div className="dashboard-content">
        {currentTab === 'requests' && (
          <div className="requests-list">
            {requests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✨</div>
                <div className="empty-text">All caught up!</div>
                <div className="empty-subtext">No pending requests</div>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="request-header">
                    <div className="request-table">Table {req.table_number}</div>
                    <div className="request-time">{new Date(req.created_at).toLocaleTimeString()}</div>
                  </div>
                  <div className="request-type">{req.request_type}</div>
                  <button
                    className="complete-btn"
                    onClick={() => completeRequest(req.id)}
                  >
                    ✓ Mark Done
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {currentTab === 'reviews' && (
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💭</div>
                <div className="empty-text">No reviews yet</div>
                <div className="empty-subtext">Waiting for feedback</div>
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <div className="review-table">Table {rev.table_number}</div>
                    <div className="review-rating">{'⭐'.repeat(rev.rating)}</div>
                  </div>
                  {rev.comment && (
                    <div className="review-comment">{rev.comment}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
