import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Electronics', 'Wallet', 'Keys', 'Bag', 'Documents', 'Jewellery', 'Clothing', 'Other'];

export default function ReportFound() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', dateFound: '', contactInfo: '',
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
      await api.post('/items/found', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Found item reported successfully! You are helping someone today 🎉');
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
        <h1>🟢 Report Found Item</h1>
        <p>Help return this item to its rightful owner. Every detail matters!</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input name="title" className="form-control" placeholder="e.g., Blue Leather Wallet" value={form.title} onChange={handleChange} required />
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
              <label className="form-label">Date Found *</label>
              <input name="dateFound" type="date" className="form-control" value={form.dateFound} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Found Location *</label>
            <input name="location" className="form-control" placeholder="e.g., Near Manek Chowk, Ahmedabad" value={form.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-control" rows="4" placeholder="Describe the item in detail to help the owner verify it..." value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Info</label>
            <input name="contactInfo" className="form-control" placeholder="How should the owner contact you?" value={form.contactInfo} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image (optional)</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
            {preview && (
              <img src={preview} alt="Preview" style={{ marginTop: '0.75rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            )}
          </div>

          <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
            {loading ? 'Submitting...' : '🟢 Submit Found Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
