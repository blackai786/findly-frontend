import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  Electronics: '💻', Wallet: '👛', Keys: '🔑', Bag: '🎒',
  Documents: '📄', Jewellery: '💍', Clothing: '👕', Other: '📦',
};

export default function ItemDetail() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${type}/${id}`);
        setItem(data);
      } catch (err) {
        setError('Item not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, type]);

  if (loading) return <div className="loading">Loading item details...</div>;
  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!item) return null;

  const icon = CATEGORY_ICONS[item.category] || '📦';
  const owner = item.owner || item.finder;
  const date = type === 'lost'
    ? new Date(item.dateLost).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(item.dateFound).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to="/search" style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Search
      </Link>

      <div className="card">
        {/* Image */}
        {item.image ? (
          <img
            src={`/uploads/${item.image}`}
            alt={item.title}
            style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}
          />
        ) : (
          <div style={{ textAlign: 'center', fontSize: '5rem', padding: '2rem 0', background: '#f1f5f9', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            {icon}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>{item.title}</h1>
            <span className={`badge badge-${type}`} style={{ marginTop: '0.4rem' }}>
              {type === 'lost' ? '🔴 Lost Item' : '🟢 Found Item'}
            </span>
          </div>
          <span className={`badge badge-${item.status}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
            Status: {item.status}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: '📂 Category', value: item.category },
            { label: '📍 Location', value: item.location },
            { label: `📅 Date ${type === 'lost' ? 'Lost' : 'Found'}`, value: date },
            { label: '👤 Reported by', value: owner?.name || 'Anonymous' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.description}</p>
        </div>

        {/* Contact Info */}
        {item.contactInfo && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.3rem' }}>📞 Contact Information</h4>
            <p style={{ fontWeight: 600 }}>{item.contactInfo}</p>
          </div>
        )}

        {/* If logged in user owns this item */}
        {user && owner?._id === user._id && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <p style={{ color: '#166534', fontWeight: 600 }}>✅ This is your listing. Manage it from your Dashboard.</p>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Login to contact the reporter</p>
            <Link to="/login" className="btn btn-primary">Login to Connect</Link>
          </div>
        )}
      </div>
    </div>
  );
}
