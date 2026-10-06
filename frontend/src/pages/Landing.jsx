import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Stethoscope, ArrowUpRight, ArrowDown, Phone, MessageSquare, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import Disclaimer from '../components/Disclaimer';
import Footer from '../components/Footer';
import ThreeBackground from '../components/ThreeBackground';
import home3d from '../assets/home_3d.png';

const Landing = () => {
  return (
    <div className="main-content" style={{ position: 'relative' }}>
      <ThreeBackground />

      {/* Hero Section (IndoGlobal Dark Gold Luxury Style) */}
      <section style={{
        padding: '90px 24px 70px',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Top Capsule Pill Badge */}
        <div className="pill-badge">
          <span className="pill-badge-dot"></span>
          BEYOND DIAGNOSTICS. BUILT FOR PRECISION.
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '4rem',
          lineHeight: 1.08,
          marginBottom: '28px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)'
        }}>
          The AI Healthcare <br />
          <span className="gradient-text">Diagnostic Engine.</span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '780px',
          margin: '0 auto 42px',
          lineHeight: 1.65,
          fontWeight: 400
        }}>
          We partner with clinical researchers and healthcare providers to transform complex medical metrics and symptom patterns into actionable, high-performing diagnostic momentum.
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#modules" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
            EXPLORE MODULES <ArrowDown size={20} />
          </a>
        </div>

        {/* 3D Healthcare Showcase Hero Card */}
        <div className="glass-card" style={{
          marginTop: '48px',
          padding: '0',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(216, 180, 114, 0.2)',
          position: 'relative'
        }}>
          <img 
            src={home3d} 
            alt="3D Holographic AI Healthcare DNA Analysis" 
            style={{
              width: '100%',
              maxHeight: '420px',
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
            padding: '24px 32px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                ✦ CARENET 3D BIOMARKER ENGINE
              </span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Real-time multi-dimensional neural diagnostic analysis
              </p>
            </div>
            <span style={{ 
              background: 'rgba(216, 180, 114, 0.2)', 
              color: 'var(--primary-gold-light)', 
              padding: '6px 16px', 
              borderRadius: '16px', 
              fontSize: '0.85rem',
              border: '1px solid var(--border-gold)' 
            }}>
              High-Precision 3D Diagnostics
            </span>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" style={{ padding: '60px 24px 80px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="pill-badge" style={{ marginBottom: '16px' }}>
            <span className="pill-badge-dot"></span> CLASSIFICATION PIPELINES
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Dual Specialized AI Modules</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>
            Engineered with scikit-learn ML pipelines for robust cardiovascular risk calculation and NLP symptom matching.
          </p>
        </div>

        <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {/* Module 1: Heart Disease */}
          <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(216, 180, 114, 0.15)',
                  color: 'var(--primary-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-gold)'
                }}>
                  <HeartPulse size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>Heart Disease Risk</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-gold-light)', fontWeight: 600 }}>20 Clinical Metrics</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Multi-feature Machine Learning Pipeline evaluating lipid panels, blood pressure, fasting sugar, BMI, and lifestyle biomarkers.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary-gold)" /> Automated Imputation & Standard Scaling
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary-gold)" /> Risk Level Stratification & Confidence
                </li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
              RUN HEART ASSESSMENT <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* Module 2: Medical Symptoms */}
          <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(216, 180, 114, 0.15)',
                  color: 'var(--primary-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-gold)'
                }}>
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>Medical Diagnostics</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-gold-light)', fontWeight: 600 }}>NLP Symptom Classifier</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Processes free-text symptom descriptions using TF-IDF feature extraction and Linear Support Vector Classification across 22 conditions.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary-gold)" /> 22 Diagnostic Condition Classes
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--primary-gold)" /> Natural Language Free-Text Processing
                </li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
              RUN DIAGNOSTIC NLP <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Global Medical Disclaimer */}
        <Disclaimer />
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
