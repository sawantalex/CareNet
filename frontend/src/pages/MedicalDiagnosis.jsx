import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope, AlertCircle, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import { medicalApi } from '../services/medicalApi';
import Sidebar from '../components/Sidebar';
import Disclaimer from '../components/Disclaimer';
import Loading from '../components/Loading';
import medicalHero from '../assets/medical_hero.png';
import '../styles/prediction.css';

const SAMPLE_SYMPTOMS = [
  { label: 'Flu & Fever', text: 'I have high fever, continuous sneezing, chills, body pain and headache.' },
  { label: 'Fungal Infection', text: 'Itching on skin, skin rash, nodal skin eruptions and discolored patches.' },
  { label: 'Jaundice / Liver', text: 'Itching, vomiting, yellowish skin and eyes, fatigue, dark urine and pale stool.' },
  { label: 'Migraine', text: 'Severe headache on one side, visual disturbance, nausea and sensitivity to light.' }
];

const MedicalDiagnosis = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [result]);

  const handleSample = (text) => {
    setSymptoms(text);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
    setSymptoms('');
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!symptoms.trim()) {
      setError('Please enter your symptoms.');
      return;
    }

    setLoading(true);

    try {
      const res = await medicalApi.predict({ symptoms: symptoms });
      setResult(res);
    } catch (err) {
      console.error("Medical diagnosis error:", err);
      const msg = err.response?.data?.detail || 'Failed to generate symptom diagnosis.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="prediction-container">
          <div className="prediction-header">
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(216, 180, 114, 0.15)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary-gold)'
            }}>
              <Stethoscope size={32} />
            </div>
            <h1>Medical Symptom <span className="gradient-text">Diagnostics</span></h1>
            <p>Describe your symptoms in natural language for AI-assisted classification.</p>
          </div>

          {/* Medical AI Diagnostics Hero Illustration */}
          <div className="glass-card" style={{ 
            marginBottom: '24px', 
            padding: '0', 
            overflow: 'hidden', 
            borderRadius: '20px', 
            border: '1px solid var(--border-gold)',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <img 
              src={medicalHero} 
              alt="AI Medical Diagnostics Workstation" 
              style={{ 
                width: '100%', 
                maxHeight: '280px', 
                objectFit: 'cover', 
                display: 'block' 
              }} 
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(13, 17, 23, 0.95), transparent)',
              padding: '16px 24px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--primary-gold)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                ✦ CARENET CLINICAL AI SUITE
              </span>
              <span style={{ background: 'rgba(216, 180, 114, 0.2)', color: 'var(--primary-gold-light)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid var(--border-gold)' }}>
                NLP Symptom Classifier
              </span>
            </div>
          </div>

          {error && (
            <div className="error-banner" style={{ marginBottom: '24px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-section">
            <div className="form-section-title">
              <Sparkles size={18} color="var(--primary-gold)" /> Quick-Fill Sample Symptom Patterns
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {SAMPLE_SYMPTOMS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSample(sample.text)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  <Sparkles size={14} color="var(--primary-gold)" /> {sample.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '1rem', color: '#ffffff' }}>Describe Your Symptoms</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{symptoms.length} / 2000 characters</span>
              </div>
              
              <textarea
                className="form-control"
                placeholder="Example: I have high fever, continuous sneezing, chills, body pain and headache..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                maxLength={2000}
                rows={6}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                disabled={loading}
                style={{ flex: 1, padding: '14px' }}
              >
                {loading ? 'Analyzing Symptoms with NLP...' : 'Diagnose Symptoms'}
              </button>

              {symptoms && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary"
                  style={{ padding: '14px 20px' }}
                >
                  <Trash2 size={18} /> Clear
                </button>
              )}
            </div>
          </form>

          {loading && <Loading text="Processing text via TfidfVectorizer + LinearSVC Pipeline..." />}

          {/* Diagnosis Result Card */}
          {result && (
            <div ref={resultRef} className="glass-card result-card" style={{ borderColor: 'var(--border-gold)', marginTop: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Diagnostic Match Result</h2>
              <div className="risk-badge risk-low" style={{ background: 'rgba(216, 180, 114, 0.15)', color: 'var(--primary-gold)' }}>
                <CheckCircle2 size={22} /> Condition Identified
              </div>

              <h3 style={{ fontSize: '2.2rem', color: 'var(--primary-gold-light)', margin: '16px 0', textTransform: 'capitalize' }}>
                {result.prediction}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 16px' }}>
                {result.message}
              </p>

              <Disclaimer text={result.disclaimer} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalDiagnosis;
