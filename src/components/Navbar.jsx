import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🔍 Findly</Link>
      <ul className="navbar-links">
        <li><Link to="/search">Browse Items</Link></li>
        {user ? (
          <>
            <li><Link to="/report-lost">Report Lost</Link></li>
            <li><Link to="/report-found">Report Found</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                Logout ({user.name.split(' ')[0]})
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="btn btn-outline btn-sm">Login</Link></li>
            <li><Link to="/register" className="btn btn-primary btn-sm">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
