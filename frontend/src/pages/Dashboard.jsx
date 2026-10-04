import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Stethoscope, Activity, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { predictionApi } from '../services/predictionApi';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import ThreeBackground from '../components/ThreeBackground';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await predictionApi.getHistory({ limit: 10 });
        setHistory(data.predictions || []);
      } catch (err) {
        console.error("Failed to load dashboard history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const heartCount = history.filter(p => p.module === 'heart_disease').length;
  const medicalCount = history.filter(p => p.module === 'medical_diagnostics').length;

  const chartData = [
    { name: 'Heart Risk AI', count: heartCount, color: '#0ea5e9' },
    { name: 'Medical Diagnostics', count: medicalCount, color: '#10b981' }
  ];

  return (
    <div className="dashboard-layout" style={{ position: 'relative' }}>
      <ThreeBackground />
      <Sidebar />
      
      <main className="dashboard-content">
        <div className="welcome-header">
          <h1>Welcome back, <span className="gradient-text">{user?.name && !user.name.includes('Mercer') ? user.name : 'Dr. Alex Sawant'}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select an AI module below or view your prediction analytics.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-info">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Assessments</span>
              <div className="stat-value">{history.length}</div>
            </div>
            <div className="stat-icon">
              <Activity size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Heart Risk Scans</span>
              <div className="stat-value">{heartCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary-cyan)' }}>
              <HeartPulse size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Diagnostic Queries</span>
              <div className="stat-value">{medicalCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(216, 180, 114, 0.15)', color: 'var(--primary-gold)' }}>
              <Stethoscope size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Security Status</span>
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--primary-gold-light)', marginTop: '10px' }}>Active JWT</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(216, 180, 114, 0.15)', color: 'var(--primary-gold)' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* AI Launch Modules */}
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Specialized AI Diagnostics</h2>
        <div className="modules-grid">
          <div className="glass-card module-card">
            <div>
              <div className="module-header" style={{ marginBottom: '16px' }}>
                <div className="module-header-icon">
                  <HeartPulse size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Heart Disease Risk</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-gold-light)' }}>20 Clinical Metrics</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Predict cardiovascular risk probability using biometric & metabolic markers.
              </p>
            </div>
            <Link to="/heart-prediction" className="btn btn-primary" style={{ width: '100%' }}>
              Launch Heart AI <ArrowRight size={16} />
            </Link>
          </div>

          <div className="glass-card module-card medical">
            <div>
              <div className="module-header" style={{ marginBottom: '16px' }}>
                <div className="module-header-icon">
                  <Stethoscope size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Medical Symptom Diagnostics</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-gold-light)' }}>NLP Symptom Matcher</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Analyze symptom descriptions against 22 medical conditions using NLP.
              </p>
            </div>
            <Link to="/medical-diagnosis" className="btn btn-primary" style={{ width: '100%' }}>
              Launch Diagnostic AI <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Analytics & Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Recent Activity List */}
          <div className="glass-card recent-activity">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Recent Activity</h3>
              <Link to="/prediction-history" style={{ fontSize: '0.85rem', color: 'var(--primary-gold-light)' }}>View All</Link>
            </div>

            {loading ? (
              <Loading text="Loading activity..." />
            ) : history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '20px' }}>
                No predictions recorded yet. Launch a module above to get started!
              </p>
            ) : (
              <div className="activity-list">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="activity-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.module === 'heart_disease' ? (
                        <HeartPulse size={18} color="var(--primary-gold)" />
                      ) : (
                        <Stethoscope size={18} color="var(--primary-gold)" />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.prediction}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Module Distribution Visualizer Chart */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Diagnostic Module Usage</h3>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '20px' }}>
                Perform assessments to view diagnostic charts.
              </p>
            ) : (
              <div style={{ width: '100%', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
