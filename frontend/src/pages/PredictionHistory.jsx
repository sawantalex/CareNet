import React, { useState, useEffect } from 'react';
import { History, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  const limit = 10;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionApi.getHistory({
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
  }, [page, moduleFilter]);

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
            <p>Access your past AI assessment records and input parameters.</p>
          </div>

          {/* Filter Bar */}
          <div className="history-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter by Module:</span>
            </div>

            <div className="segmented-control" style={{ maxWidth: '420px' }}>
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
