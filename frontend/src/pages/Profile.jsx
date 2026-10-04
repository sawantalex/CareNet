import React, { useState } from 'react';
import { User, Mail, Calendar, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/authApi';
import Sidebar from '../components/Sidebar';
import '../styles/auth.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!name.trim()) {
      setError('Name cannot be blank.');
      return;
    }

    setLoading(true);

    try {
      const updated = await authApi.updateProfile({ name });
      updateUser({ name: updated.name });
      setSuccess('Profile details updated successfully!');
    } catch (err) {
      console.error("Profile update failed:", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="prediction-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={28} color="var(--primary-cyan)" />
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Account <span className="gradient-text">Profile</span></h1>
            </div>
            <p>Manage your account settings and profile details.</p>
          </div>

          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="error-banner" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="glass-card" style={{ padding: '32px' }}>
            <form onSubmit={handleUpdate} className="auth-form">
              <div className="form-group">
                <label>Full Display Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '42px', width: '100%' }}
                    required
                  />
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address (Read-only)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                    style={{ paddingLeft: '42px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Account Created Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    disabled
                    style={{ paddingLeft: '42px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              >
                <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
