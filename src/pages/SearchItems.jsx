import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['Electronics', 'Wallet', 'Keys', 'Bag', 'Documents', 'Jewellery', 'Clothing', 'Other'];

export default function SearchItems() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'lost');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      const { data } = await api.get(`/items/${tab}?${params.toString()}`);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setSearch(''); setCategory(''); setLocation('');
    setTimeout(fetchItems, 100);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>🔎 Browse Items</h1>
        <p>Search through lost and found items in your area</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'lost' ? 'active' : ''}`} onClick={() => setTab('lost')}>
          🔴 Lost Items ({tab === 'lost' ? items.length : '?'})
        </button>
        <button className={`tab-btn ${tab === 'found' ? 'active' : ''}`} onClick={() => setTab('found')}>
          🟢 Found Items ({tab === 'found' ? items.length : '?'})
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch}>
        <div className="search-bar">
          <input
            className="form-control"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" style={{ maxWidth: '180px' }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className="form-control"
            style={{ maxWidth: '200px' }}
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="loading">⏳ Searching...</div>
      ) : items.length > 0 ? (
        <>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Showing {items.length} {tab} item{items.length !== 1 ? 's' : ''}
          </p>
          <div className="grid-4">
            {items.map(item => <ItemCard key={item._id} item={item} type={tab} />)}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🕵️</div>
          <p>No {tab} items found matching your search.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try different keywords or reset filters.</p>
        </div>
      )}
    </div>
  );
}
