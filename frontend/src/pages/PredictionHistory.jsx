import React, { useState, useEffect } from 'react';
import { History, Filter, ChevronLeft, ChevronRight, User, Search, RotateCcw } from 'lucide-react';
import { predictionApi } from '../services/predictionApi';
import Sidebar from '../components/Sidebar';
import PredictionCard from '../components/PredictionCard';
import Loading from '../components/Loading';
import '../styles/prediction.css';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState(() => localStorage.getItem('carenet_user_name') || '');
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('carenet_user_name') || '');
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionApi.getHistory({
        name: nameFilter.trim() || undefined,
        module: moduleFilter === 'all' ? undefined : moduleFilter,
        page,
        limit
      });
      setPredictions(data.predictions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load prediction history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, moduleFilter, nameFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setNameFilter(searchQuery);
    setPage(1);
  };

  const handleClearName = () => {
    setSearchQuery('');
    setNameFilter('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="prediction-container">
          <div className="prediction-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History size={28} color="var(--primary-cyan)" />
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Prediction <span className="gradient-text">History</span></h1>
            </div>
            <p>Access past AI assessments and biomarker logs preserved by patient name.</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by patient name (e.g. Alex)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px', margin: 0, fontSize: '0.9rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Filter
              </button>
              {nameFilter && (
                <button type="button" onClick={handleClearName} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                  <RotateCcw size={14} /> Show All Patients
                </button>
              )}
            </form>

            {/* Module Filter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {nameFilter ? `Showing records for: ` : 'Showing records for: '}
                  <strong style={{ color: 'var(--primary-gold-light)' }}>{nameFilter || 'All Patients'}</strong>
                </span>
              </div>

              <div className="segmented-control" style={{ maxWidth: '380px', margin: 0 }}>
                <button
                  className={`segmented-btn ${moduleFilter === 'all' ? 'active' : ''}`}
                  onClick={() => { setModuleFilter('all'); setPage(1); }}
                >
                  All ({total})
                </button>
                <button
                  className={`segmented-btn ${moduleFilter === 'heart_disease' ? 'active' : ''}`}
                  onClick={() => { setModuleFilter('heart_disease'); setPage(1); }}
                >
                  Heart AI
                </button>
                <button
                  className={`segmented-btn ${moduleFilter === 'medical_diagnostics' ? 'active' : ''}`}
                  onClick={() => { setModuleFilter('medical_diagnostics'); setPage(1); }}
                >
                  Diagnostics
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading text="Retrieving prediction logs..." />
          ) : predictions.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <History size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <h3>No Prediction History Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                You haven't generated any assessments under this filter option yet.
              </p>
            </div>
          ) : (
            <div>
              {predictions.map((item) => (
                <PredictionCard key={item.id} item={item} />
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`btn btn-secondary ${page === 1 ? 'btn-disabled' : ''}`}
                    style={{ padding: '8px 14px' }}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`btn btn-secondary ${page === totalPages ? 'btn-disabled' : ''}`}
                    style={{ padding: '8px 14px' }}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PredictionHistory;
