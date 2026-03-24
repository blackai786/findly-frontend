import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Wallet', 'Keys', 'Bag', 'Documents', 'Jewellery', 'Clothing', 'Other'];

export default function ReportLost() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', dateLost: '', contactInfo: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append('image', image);
      await api.post('/items/lost', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Lost item reported successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <h1>🔴 Report Lost Item</h1>
        <p>Provide as much detail as possible to help recover your item.</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input name="title" className="form-control" placeholder="e.g., Black Samsung Galaxy S23" value={form.title} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Lost *</label>
              <input name="dateLost" type="date" className="form-control" value={form.dateLost} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Last Seen Location *</label>
            <input name="location" className="form-control" placeholder="e.g., Ahmedabad Railway Station, Platform 2" value={form.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-control" rows="4" placeholder="Describe your item in detail (color, brand, serial number, special marks...)" value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Info</label>
            <input name="contactInfo" className="form-control" placeholder="Phone number or email for finder to contact you" value={form.contactInfo} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image (optional)</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
            {preview && (
              <img src={preview} alt="Preview" style={{ marginTop: '0.75rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            )}
          </div>

          <button type="submit" className="btn btn-danger" disabled={loading} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
            {loading ? 'Submitting...' : '🔴 Submit Lost Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
