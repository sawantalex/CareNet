import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', textAlign: 'center', padding: '24px' }}>
      <div className="glass-card" style={{ padding: '48px 32px', maxWidth: '480px', width: '100%' }}>
        <AlertCircle size={64} color="var(--primary-cyan)" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>404</h1>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
          <Home size={18} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
