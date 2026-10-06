import React, { useState, useRef, useEffect } from 'react';
import { HeartPulse, Activity, AlertCircle, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { heartApi } from '../services/heartApi';
import Sidebar from '../components/Sidebar';
import Disclaimer from '../components/Disclaimer';
import Loading from '../components/Loading';
import heartHero from '../assets/heart_hero.png';
import '../styles/prediction.css';

const DEFAULT_FORM = {
  Age: 50,
  Gender: 'Male',
  'Blood Pressure': 130,
  'Cholesterol Level': 210,
  BMI: 26.2,
  'Sleep Hours': 7.0,
  'Triglyceride Level': 160,
  'Fasting Blood Sugar': 105,
  'CRP Level': 2.1,
  'Homocysteine Level': 11.5,
  'Exercise Habits': 'Medium',
  Smoking: 'No',
  'Family Heart Disease': 'Yes',
  Diabetes: 'No',
  'High Blood Pressure': 'No',
  'Low HDL Cholesterol': 'No',
  'High LDL Cholesterol': 'Yes',
  'Alcohol Consumption': 'Low',
  'Stress Level': 'Medium',
  'Sugar Consumption': 'Medium'
};

const SAMPLE_HIGH_RISK = {
  Age: 62,
  Gender: 'Male',
  'Blood Pressure': 160,
  'Cholesterol Level': 290,
  BMI: 32.5,
  'Sleep Hours': 5.0,
  'Triglyceride Level': 310,
  'Fasting Blood Sugar': 165,
  'CRP Level': 4.8,
  'Homocysteine Level': 18.2,
  'Exercise Habits': 'Low',
  Smoking: 'Yes',
  'Family Heart Disease': 'Yes',
  Diabetes: 'Yes',
  'High Blood Pressure': 'Yes',
  'Low HDL Cholesterol': 'Yes',
  'High LDL Cholesterol': 'Yes',
  'Alcohol Consumption': 'High',
  'Stress Level': 'High',
  'Sugar Consumption': 'High'
};

const HeartPrediction = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [result]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePrefill = (sample) => {
    setFormData(sample);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await heartApi.predict(formData);
      setResult(res);
    } catch (err) {
      console.error("Heart prediction error:", err);
      const msg = err.response?.data?.detail || 'Failed to generate heart disease risk prediction.';
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
              background: 'rgba(14, 165, 233, 0.15)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary-cyan)'
            }}>
              <HeartPulse size={32} />
            </div>
            <h1>Heart Disease <span className="gradient-text">Risk Prediction</span></h1>
            <p>Input your health metrics below for an AI-calculated cardiovascular risk analysis.</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => handlePrefill(DEFAULT_FORM)} 
                className="btn btn-secondary" 
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                <Sparkles size={14} color="var(--primary-cyan)" /> Sample Normal Baseline
              </button>
              <button 
                type="button" 
                onClick={() => handlePrefill(SAMPLE_HIGH_RISK)} 
                className="btn btn-secondary" 
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                <Sparkles size={14} color="#f43f5e" /> Sample High Risk Profile
              </button>
            </div>
          </div>

          {/* Heart AI Cardiovascular Risk Hero Illustration */}
          <div className="glass-card" style={{ 
            marginBottom: '24px', 
            padding: '0', 
            overflow: 'hidden', 
            borderRadius: '20px', 
            border: '1px solid rgba(14, 165, 233, 0.4)',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <img 
              src={heartHero} 
              alt="3D Holographic Heart Risk Telemetry Scan" 
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
              <span style={{ color: 'var(--primary-cyan)', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                ✦ CARENET CARDIAC AI TELEMETRY
              </span>
              <span style={{ background: 'rgba(14, 165, 233, 0.2)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
                ColumnTransformer + SVC Model
              </span>
            </div>
          </div>

          {error && (
            <div className="error-banner" style={{ marginBottom: '24px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section 1: Biometric & General Info */}
            <div className="form-section">
              <div className="form-section-title">
                <Activity size={18} /> Biometrics & Demographic Info
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="120"
                    value={formData.Age}
                    onChange={(e) => handleChange('Age', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={formData.Gender}
                    onChange={(e) => handleChange('Gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Blood Pressure (mmHg)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="60"
                    max="240"
                    value={formData['Blood Pressure']}
                    onChange={(e) => handleChange('Blood Pressure', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>BMI (Body Mass Index)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    min="10"
                    max="60"
                    value={formData.BMI}
                    onChange={(e) => handleChange('BMI', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sleep Hours / Night</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    min="1"
                    max="16"
                    value={formData['Sleep Hours']}
                    onChange={(e) => handleChange('Sleep Hours', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Biomarkers */}
            <div className="form-section">
              <div className="form-section-title">
                <HeartPulse size={18} /> Clinical Biomarkers & Lipid Panel
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Cholesterol Level (mg/dL)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData['Cholesterol Level']}
                    onChange={(e) => handleChange('Cholesterol Level', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Triglyceride Level (mg/dL)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData['Triglyceride Level']}
                    onChange={(e) => handleChange('Triglyceride Level', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fasting Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData['Fasting Blood Sugar']}
                    onChange={(e) => handleChange('Fasting Blood Sugar', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CRP Level (mg/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData['CRP Level']}
                    onChange={(e) => handleChange('CRP Level', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Homocysteine Level (µmol/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData['Homocysteine Level']}
                    onChange={(e) => handleChange('Homocysteine Level', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle & Categorical Risk Factors */}
            <div className="form-section">
              <div className="form-section-title">
                <Sparkles size={18} /> Lifestyle & Medical Conditions
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Exercise Habits</label>
                  <select className="form-control" value={formData['Exercise Habits']} onChange={(e) => handleChange('Exercise Habits', e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Smoking Status</label>
                  <select className="form-control" value={formData.Smoking} onChange={(e) => handleChange('Smoking', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Family Heart Disease History</label>
                  <select className="form-control" value={formData['Family Heart Disease']} onChange={(e) => handleChange('Family Heart Disease', e.target.value)}>
                    <option value="No">No History</option>
                    <option value="Yes">Family History</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Diabetes</label>
                  <select className="form-control" value={formData.Diabetes} onChange={(e) => handleChange('Diabetes', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>High Blood Pressure History</label>
                  <select className="form-control" value={formData['High Blood Pressure']} onChange={(e) => handleChange('High Blood Pressure', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Low HDL Cholesterol</label>
                  <select className="form-control" value={formData['Low HDL Cholesterol']} onChange={(e) => handleChange('Low HDL Cholesterol', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>High LDL Cholesterol</label>
                  <select className="form-control" value={formData['High LDL Cholesterol']} onChange={(e) => handleChange('High LDL Cholesterol', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Alcohol Consumption</label>
                  <select className="form-control" value={formData['Alcohol Consumption']} onChange={(e) => handleChange('Alcohol Consumption', e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stress Level</label>
                  <select className="form-control" value={formData['Stress Level']} onChange={(e) => handleChange('Stress Level', e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sugar Consumption</label>
                  <select className="form-control" value={formData['Sugar Consumption']} onChange={(e) => handleChange('Sugar Consumption', e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '12px' }}
            >
              {loading ? 'Evaluating Model Predictions...' : 'Calculate Heart Risk'}
            </button>
          </form>

          {loading && <Loading text="Running Machine Learning Pipeline (ColumnTransformer + SVC)..." />}

          {/* Prediction Result Display */}
          {result && (
            <div ref={resultRef} className="glass-card result-card" style={{ marginTop: '24px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Assessment Result</h2>
              <div className={`risk-badge risk-${result.risk_level.toLowerCase()}`}>
                <CheckCircle2 size={22} /> Risk Level: {result.risk_level}
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-cyan)', margin: '12px 0' }}>
                {result.prediction}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 16px' }}>
                {result.message}
              </p>

              {result.confidence && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Model Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
              )}

              <Disclaimer text={result.disclaimer} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HeartPrediction;
