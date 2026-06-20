import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToIdeas, updateIdea } from '../services/ideas.service';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const STATUSES = ['REVIEWING', 'APPROVED', 'FUNDING_ALLOCATED', 'ARCHIVED'];
const STATUS_LABELS = {
  REVIEWING: 'Reviewing',
  APPROVED: 'Approved',
  FUNDING_ALLOCATED: 'Funding Allocated',
  ARCHIVED: 'Archived',
};
const STATUS_COLORS = {
  REVIEWING: 'var(--status-reviewing)',
  APPROVED: 'var(--status-approved)',
  FUNDING_ALLOCATED: 'var(--status-funding)',
  ARCHIVED: 'var(--status-archived)',
};

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToIdeas((data) => {
      setIdeas(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function moveStatus(idea, newStatus) {
    try {
      await updateIdea(idea.id, { status: newStatus });
      toast.success(`"${idea.title}" moved to ${STATUS_LABELS[newStatus]}`);
    } catch {
      toast.error('Failed to update status.');
    }
  }

  // Group by status
  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = ideas.filter((i) => i.status === s);
    return acc;
  }, {});

  // Metrics
  const totalVotes = ideas.reduce((sum, i) => sum + (i.voteCount || 0), 0);
  const totalComments = ideas.reduce((sum, i) => sum + (i.commentCount || 0), 0);
  const trending = [...ideas].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0)).slice(0, 3);

  return (
    <div className="page-wrapper">
      <div className="container admin-page">
        {/* Header */}
        <div className="page-header admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage the innovation pipeline across Lantrotech</p>
          </div>
          <Link to="/admin/insights" className="btn btn-primary" id="go-to-insights-btn">
            ✨ Generate AI Insights
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="admin-metrics">
          <div className="metric-card glass">
            <div className="metric-icon">💡</div>
            <div className="metric-value">{ideas.length}</div>
            <div className="metric-label">Total Ideas</div>
          </div>
          <div className="metric-card glass">
            <div className="metric-icon">🚀</div>
            <div className="metric-value">{totalVotes}</div>
            <div className="metric-label">Total Backs</div>
          </div>
          <div className="metric-card glass">
            <div className="metric-icon">💬</div>
            <div className="metric-value">{totalComments}</div>
            <div className="metric-label">Total Comments</div>
          </div>
          <div className="metric-card glass">
            <div className="metric-icon">✅</div>
            <div className="metric-value">{grouped.APPROVED?.length || 0}</div>
            <div className="metric-label">Approved Ideas</div>
          </div>
        </div>

        {/* Trending Section */}
        {trending.length > 0 && (
          <div className="trending-section">
            <h2 className="section-title">🔥 Trending Ideas</h2>
            <div className="trending-grid">
              {trending.map((idea, i) => (
                <Link key={idea.id} to={`/ideas/${idea.id}`} className="trending-card glass" id={`trending-idea-${i + 1}`}>
                  <div className="trending-rank">#{i + 1}</div>
                  <div className="trending-info">
                    <div className="trending-title">{idea.title}</div>
                    <div className="trending-stats">
                      🚀 {idea.voteCount || 0} backs · 💬 {idea.commentCount || 0} comments
                    </div>
                  </div>
                  <span className="badge badge-category">{idea.category}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Kanban Pipeline */}
        <div>
          <h2 className="section-title">📋 Innovation Pipeline</h2>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="kanban-board">
              {STATUSES.map((status) => (
                <div key={status} className="kanban-column">
                  {/* Column Header */}
                  <div className="kanban-header">
                    <div className="kanban-dot" style={{ background: STATUS_COLORS[status] }} />
                    <span className="kanban-title">{STATUS_LABELS[status]}</span>
                    <span className="kanban-count">{grouped[status]?.length || 0}</span>
                  </div>

                  {/* Cards */}
                  <div className="kanban-cards">
                    {grouped[status]?.length === 0 ? (
                      <div className="kanban-empty">No ideas here</div>
                    ) : (
                      grouped[status].map((idea) => (
                        <div key={idea.id} className="kanban-card glass" id={`kanban-card-${idea.id}`}>
                          <div className="kanban-card-top">
                            <span className="badge badge-category" style={{ fontSize: 11 }}>{idea.category}</span>
                            <span className={`badge badge-${idea.priority?.toLowerCase()}`} style={{ fontSize: 11 }}>{idea.priority}</span>
                          </div>
                          <Link to={`/ideas/${idea.id}`} className="kanban-card-title">
                            {idea.title}
                          </Link>
                          <div className="kanban-card-stats">
                            <span>🚀 {idea.voteCount || 0}</span>
                            <span>💬 {idea.commentCount || 0}</span>
                          </div>

                          {/* Move buttons */}
                          <div className="kanban-actions">
                            {STATUSES.filter((s) => s !== status).map((s) => (
                              <button
                                key={s}
                                id={`move-${idea.id}-to-${s.toLowerCase()}`}
                                className="kanban-move-btn"
                                onClick={() => moveStatus(idea, s)}
                                title={`Move to ${STATUS_LABELS[s]}`}
                              >
                                → {STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
