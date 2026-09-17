import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/userApi';
import Logo3D from '../components/Logo3D';
import { formatDate } from '../utils/formatDate';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      const res = await userApi.updateProfile({ name });
      setUser(res.data);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Profile</h1>
      <div className="profile-card">
        <Logo3D size={48} />
        <form onSubmit={handleSubmit} className="auth-form">
          {message && <p className="form-success">{message}</p>}
          {error && <p className="form-error form-error--top">{error}</p>}

          <div className="form-field">
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="profile-email">Email</label>
            <input id="profile-email" type="email" value={user?.email || ''} disabled />
            <span className="form-hint">Email can&apos;t be changed.</span>
          </div>

          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update profile'}
          </button>
        </form>

        <div className="profile-meta">
          <p>Account information</p>
          <p className="profile-meta-item">Member since {formatDate(user?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
