import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [tab, setTab] = useState('lost');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes] = await Promise.all([
          api.get('/items/lost/my'),
          api.get('/items/found/my'),
        ]);
        setLostItems(lostRes.data);
        setFoundItems(foundRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/items/lost/${id}`, { status: newStatus });
      setLostItems(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>👤 My Dashboard</h1>
        <p>Welcome back, <strong>{user.name}</strong>! Manage your lost and found reports here.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--danger)' }}>{lostItems.length}</div>
          <div className="stat-label">Items I Reported Lost</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--secondary)' }}>{foundItems.length}</div>
          <div className="stat-label">Items I Reported Found</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--primary)' }}>
            {lostItems.filter(i => i.status === 'found').length}
          </div>
          <div className="stat-label">Items Recovered</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to="/report-lost" className="btn btn-danger">🔴 Report Lost Item</Link>
        <Link to="/report-found" className="btn btn-secondary">🟢 Report Found Item</Link>
        <Link to="/search" className="btn btn-outline">🔎 Browse All Items</Link>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'lost' ? 'active' : ''}`} onClick={() => setTab('lost')}>
          🔴 My Lost Items ({lostItems.length})
        </button>
        <button className={`tab-btn ${tab === 'found' ? 'active' : ''}`} onClick={() => setTab('found')}>
          🟢 My Found Reports ({foundItems.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading your items...</div>
      ) : tab === 'lost' ? (
        lostItems.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>
              Tip: Click "Mark as Found" when your item is recovered.
            </p>
            <div className="grid-4">
              {lostItems.map(item => (
                <div key={item._id}>
                  <ItemCard item={item} type="lost" />
                  {item.status === 'lost' && (
                    <button
                      onClick={() => updateStatus(item._id, 'found')}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                      ✅ Mark as Found
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>You haven't reported any lost items yet.</p>
            <Link to="/report-lost" className="btn btn-danger" style={{ marginTop: '1rem' }}>Report a Lost Item</Link>
          </div>
        )
      ) : (
        foundItems.length > 0 ? (
          <div className="grid-4">
            {foundItems.map(item => <ItemCard key={item._id} item={item} type="found" />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🤲</div>
            <p>You haven't reported any found items yet.</p>
            <Link to="/report-found" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Report a Found Item</Link>
          </div>
        )
      )}
    </div>
  );
}
