import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(9, 13, 22, 0.95)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 24px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ maxWidth: '360px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary-gradient)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Activity size={20} />
            </div>
            <span>Care<span className="gradient-text">Net</span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Intelligent AI-Powered Health Risk & Medical Diagnostics Platform. Empowering individuals with evidence-backed ML insights.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>AI Modules</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>Heart Disease Risk Prediction</li>
            <li>Medical Symptom Diagnostics</li>
            <li>Predictive Risk Analytics</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Security & Compliance</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#10b981' }}>
            <ShieldCheck size={18} />
            <span>JWT Encrypted & Password Hashed</span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <p>© {new Date().getFullYear()} CareNet AI Health Platform. For educational and research demonstration purposes only.</p>
      </div>
    </footer>
  );
};

export default Footer;
