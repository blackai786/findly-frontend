import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [tab, setTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, lostRes, foundRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/lost'),
          api.get('/admin/found'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setLostItems(lostRes.data);
        setFoundItems(foundRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const deleteItem = async (type, id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/admin/items/${type}/${id}`);
    if (type === 'lost') setLostItems(prev => prev.filter(i => i._id !== id));
    else setFoundItems(prev => prev.filter(i => i._id !== id));
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Manage users, items, and platform activity.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Users', value: stats.totalUsers, color: 'var(--primary)' },
          { label: 'Lost Reports', value: stats.totalLost, color: 'var(--danger)' },
          { label: 'Found Reports', value: stats.totalFound, color: 'var(--secondary)' },
          { label: 'Recovered', value: stats.recovered, color: '#7c3aed' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-number" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['stats', 'users', 'lost', 'found'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ stats: '📊 Overview', users: `👥 Users (${users.length})`, lost: `🔴 Lost (${lostItems.length})`, found: `🟢 Found (${foundItems.length})` }[t]}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'stats' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Platform Summary</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            The platform currently has <strong>{stats.totalUsers}</strong> registered users, <strong>{stats.totalLost}</strong> lost item reports,
            and <strong>{stats.totalFound}</strong> found item reports. <strong>{stats.recovered}</strong> items have been successfully recovered.
          </p>
          <div style={{ marginTop: '1.5rem', background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--secondary)' }}>Recovery Rate:</strong>{' '}
            <span>{stats.totalLost ? Math.round((stats.recovered / stats.totalLost) * 100) : 0}%</span>
          </div>
        </div>
      )}

      {/* Users Table */}
      {tab === 'users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Registered Users</h3>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => deleteUser(u._id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Lost Items Table */}
      {tab === 'lost' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>All Lost Item Reports</h3>
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Location</th><th>Status</th><th>Reporter</th><th>Action</th></tr>
            </thead>
            <tbody>
              {lostItems.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                  <td>{item.owner?.name}</td>
                  <td><button onClick={() => deleteItem('lost', item._id)} className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Found Items Table */}
      {tab === 'found' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>All Found Item Reports</h3>
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Location</th><th>Status</th><th>Finder</th><th>Action</th></tr>
            </thead>
            <tbody>
              {foundItems.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                  <td>{item.finder?.name}</td>
                  <td><button onClick={() => deleteItem('found', item._id)} className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
