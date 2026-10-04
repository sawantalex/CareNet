import React, { useState } from 'react';
import { HeartPulse, Stethoscope, ChevronDown, ChevronUp, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import Disclaimer from './Disclaimer';

const PredictionCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const isHeart = item.module === 'heart_disease';
  const formattedDate = new Date(item.created_at).toLocaleString();

  const getRiskClass = (pred) => {
    if (!pred) return 'risk-low';
    const lower = pred.toLowerCase();
    if (lower.includes('high') || lower.includes('severe') || lower.includes('positive')) return 'risk-high';
    if (lower.includes('moderate')) return 'risk-moderate';
    return 'risk-low';
  };

  return (
    <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(216, 180, 114, 0.15)',
            color: 'var(--primary-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isHeart ? <HeartPulse size={24} /> : <Stethoscope size={24} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
              {isHeart ? 'Heart Disease Risk Assessment' : 'Medical Symptom Diagnostics'}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={`risk-badge ${getRiskClass(item.prediction)}`} style={{ margin: 0, fontSize: '0.9rem', padding: '6px 14px' }}>
            {item.prediction}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{expanded ? 'Hide Details' : 'View Inputs'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h5 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>Input Parameters</h5>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            {Object.entries(item.input_data || {}).map(([key, val]) => (
              <div key={key} style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>{key.replace(/_/g, ' ')}:</span>
                <strong style={{ color: '#ffffff' }}>{String(val)}</strong>
              </div>
            ))}
          </div>

          {item.confidence && (
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Model Confidence Score: <strong style={{ color: 'var(--primary-cyan)' }}>{(item.confidence * 100).toFixed(1)}%</strong>
            </div>
          )}

          <Disclaimer />
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
