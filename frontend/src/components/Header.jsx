import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className="app-header">
      <div>
        <p className="app-header-greeting">Welcome back, {user?.name || 'there'}</p>
      </div>
      <div className="app-header-avatar" aria-hidden="true">
        {initial}
      </div>
    </header>
  );
}
