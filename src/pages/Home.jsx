import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, recovered: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          api.get('/items/lost?limit=4'),
          api.get('/items/found?limit=4'),
        ]);
        setLostItems(lostRes.data.slice(0, 4));
        setFoundItems(foundRes.data.slice(0, 4));
        setStats({
          totalLost: lostRes.data.length,
          totalFound: foundRes.data.length,
          recovered: lostRes.data.filter(i => i.status === 'found').length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>🔍 Lost Something?</h1>
        <p>
          Findly connects people who lost items with those who found them.
          Smart, fast, and community-driven recovery platform.
        </p>
        <div className="hero-buttons">
          <Link to="/report-lost" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Report Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Report Found Item
          </Link>
          <Link to="/search" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 2rem', borderColor: 'white', color: 'white' }}>
            Browse All Items
          </Link>
        </div>
      </section>

      <div className="container">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{stats.totalLost}</div>
            <div className="stat-label">Items Reported Lost</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalFound}</div>
            <div className="stat-label">Items Reported Found</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#10b981' }}>{stats.recovered}</div>
            <div className="stat-label">Items Recovered</div>
          </div>
        </div>

        {/* How it works */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>How Findly Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { icon: '📝', step: '1', title: 'Report', desc: 'Report your lost item with description and location' },
              { icon: '🔎', step: '2', title: 'Search', desc: 'Browse found items or let our system match them' },
              { icon: '💬', step: '3', title: 'Connect', desc: 'Contact the finder directly through the platform' },
              { icon: '🎉', step: '4', title: 'Recover', desc: 'Arrange pickup and get your item back!' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', margin: '0 auto 0.5rem' }}>{step}</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Lost Items */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 800 }}>Recently Lost</h2>
            <Link to="/search?tab=lost" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {lostItems.length > 0 ? (
            <div className="grid-4">
              {lostItems.map(item => <ItemCard key={item._id} item={item} type="lost" />)}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-icon">📭</div><p>No lost items reported yet.</p></div>
          )}
        </div>

        {/* Recent Found Items */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 800 }}>Recently Found</h2>
            <Link to="/search?tab=found" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {foundItems.length > 0 ? (
            <div className="grid-4">
              {foundItems.map(item => <ItemCard key={item._id} item={item} type="found" />)}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-icon">📭</div><p>No found items reported yet.</p></div>
          )}
        </div>
      </div>
    </>
  );
}
