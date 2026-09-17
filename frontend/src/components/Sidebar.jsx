import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo3D from './Logo3D';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/transactions/add', label: 'Add transaction' },
  { to: '/profile', label: 'Profile' },
  { to: '/help', label: 'Help' },
  { to: '/feedback', label: 'Feedback' }
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo3D size={36} />
        <span>Expense Tracker</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/transactions'}
            className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        Log out
      </button>
    </aside>
  );
}
