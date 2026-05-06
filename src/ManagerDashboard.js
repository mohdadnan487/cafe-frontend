import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function ManagerDashboard({ onBack }) {
  const [currentView, setCurrentView] = useState('menu');
  const [stats, setStats] = useState({ pending: 0, completed_today: 0, avg_rating: 0 });
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, revRes, reqRes] = await Promise.all([
        fetch(`${API_URL}/api/stats`),
        fetch(`${API_URL}/api/reviews`),
        fetch(`${API_URL}/api/pending-requests`)
      ]);
      setStats(await statsRes.json());
      setReviews(await revRes.json());
      setRequests(await reqRes.json());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await fetch(`${API_URL}/api/upload-menu`, { method: 'POST', body: formData });
      setMessage(res.ok ? 'Menu PDF uploaded successfully!' : 'Failed to upload PDF');
    } catch (err) {
      setMessage('Upload error: ' + err.message);
    }
    setUploading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const avgRating = (stats.avg_rating || 0).toFixed(1);

  return (
    <div className="waiter-dashboard">
      <div className="waiter-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <div className="waiter-info">
          <div className="waiter-name">Manager Dashboard</div>
          <div className="waiter-subtitle">Cafe Management</div>
        </div>
        <div style={{width: 44}} />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completed_today}</div>
          <div className="stat-label">Done Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{avgRating}</div>
          <div className="stat-label">Rating</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-btn ${currentView === 'menu' ? 'active' : ''}`} onClick={() => setCurrentView('menu')}>Menu Upload</button>
        <button className={`tab-btn ${currentView === 'reviews' ? 'active' : ''}`} onClick={() => setCurrentView('reviews')}>Reviews ({reviews.length})</button>
        <button className={`tab-btn ${currentView === 'requests' ? 'active' : ''}`} onClick={() => setCurrentView('requests')}>Requests ({requests.length})</button>
      </div>

      {message && (
        <div className="message-alert success" style={{margin: '12px 16px'}}>
          {message}
        </div>
      )}

      <div className="dashboard-content">

        {currentView === 'menu' && (
          <div>
            <div className="request-card" style={{marginBottom: 16}}>
              <h2 style={{fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)'}}>Upload Menu PDF</h2>
              <p style={{color: 'var(--text-light)', fontSize: 14, marginBottom: 20}}>Replace your cafe menu with a new PDF file</p>
              <div style={{border: '2px dashed var(--border)', borderRadius: 12, padding: 32, textAlign: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%)', marginBottom: 16}}>
                <div style={{fontSize: 48, marginBottom: 12}}>📑</div>
                <label style={{cursor: 'pointer'}}>
                  <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={uploading} style={{display: 'none'}} />
                  <div style={{padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)', color: 'white', borderRadius: 8, fontWeight: 700, display: 'inline-block', marginBottom: 8}}>
                    {uploading ? 'Uploading...' : 'Choose PDF File'}
                  </div>
                </label>
                <p style={{color: 'var(--text-light)', fontSize: 13, marginTop: 8}}>Click to upload or drag PDF here</p>
              </div>
            </div>
            <div className="request-card" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: 'none'}}>
              <div style={{fontWeight: 700, marginBottom: 8, color: '#92400e', fontSize: 15}}>How Customers See It:</div>
              <p style={{fontSize: 14, color: '#78350f', marginBottom: 8}}>When customers click Menu in the app they will see your PDF menu.</p>
              <div style={{fontSize: 13, color: '#92400e', lineHeight: 2}}>
                Works on mobile and desktop<br/>
                Customers can zoom and search<br/>
                No ordering through app
              </div>
            </div>
          </div>
        )}

        {currentView === 'reviews' && (
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⭐</span>
                <div className="empty-text">No reviews yet</div>
                <div className="empty-subtext">Customer reviews will appear here</div>
              </div>
            ) : reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <span className="review-table">Table {review.table_number}</span>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.comment && <div className="review-comment">{review.comment}</div>}
                <div style={{fontSize: 12, color: 'var(--text-light)', marginTop: 8}}>
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'requests' && (
          <div className="requests-list">
            {requests.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <div className="empty-text">No pending requests</div>
                <div className="empty-subtext">Service requests will appear here</div>
              </div>
            ) : requests.map((req) => (
              <div key={req.id} className="request-card">
                <div className="request-header">
                  <span className="request-table">Table {req.table_number}</span>
                  <span className="request-time">{req.created_at ? new Date(req.created_at).toLocaleTimeString() : ''}</span>
                </div>
                <div className="request-type">{req.request_type}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}