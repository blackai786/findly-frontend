import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  Electronics: '💻', Wallet: '👛', Keys: '🔑', Bag: '🎒',
  Documents: '📄', Jewellery: '💍', Clothing: '👕', Other: '📦',
};

export default function ItemCard({ item, type }) {
  const icon = CATEGORY_ICONS[item.category] || '📦';
  const date = type === 'lost'
    ? new Date(item.dateLost).toLocaleDateString()
    : new Date(item.dateFound).toLocaleDateString();

  return (
    <Link to={`/items/${type}/${item._id}`} className="item-card">
      {item.image ? (
        <img
          src={`/uploads/${item.image}`}
          alt={item.title}
          className="item-card-img"
          style={{ display: 'block' }}
        />
      ) : (
        <div className="item-card-img">{icon}</div>
      )}
      <div className="item-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <h3 className="item-card-title">{item.title}</h3>
          <span className={`badge badge-${item.status || type}`}>
            {item.status || type}
          </span>
        </div>
        <p className="item-card-text">📂 {item.category}</p>
        <p className="item-card-text">📍 {item.location}</p>
        <p className="item-card-text">📅 {date}</p>
        <p className="item-card-text" style={{ marginTop: '0.5rem' }}>
          {item.description.substring(0, 70)}{item.description.length > 70 ? '...' : ''}
        </p>
      </div>
    </Link>
  );
}
