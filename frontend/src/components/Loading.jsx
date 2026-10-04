import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ text = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '12px',
      color: 'var(--text-secondary)'
    }}>
      <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={36} color="var(--primary-cyan)" />
      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{text}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
