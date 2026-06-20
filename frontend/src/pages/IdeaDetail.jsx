import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdeaById, toggleVote, hasUserVoted, subscribeToComments, addComment, updateIdea, deleteIdea } from '../services/ideas.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './IdeaDetail.css';

const STATUS_OPTIONS = ['REVIEWING', 'APPROVED', 'FUNDING_ALLOCATED', 'ARCHIVED'];
const STATUS_LABELS = { REVIEWING: 'Reviewing', APPROVED: 'Approved', FUNDING_ALLOCATED: 'Funding Allocated', ARCHIVED: 'Archived' };

export default function IdeaDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Load idea
  useEffect(() => {
    async function load() {
      try {
        const data = await getIdeaById(id);
        if (!data) { navigate('/ideas'); return; }
        setIdea(data);
        const v = await hasUserVoted(id, user.uid);
        setVoted(v);
      } catch (err) {
        console.error("Failed to load idea detail:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user.uid]);

  // Real-time comments
  useEffect(() => {
    const unsub = subscribeToComments(id, setComments);
    return unsub;
  }, [id]);

  async function handleVote() {
    if (voteLoading) return;
    setVoteLoading(true);
    try {
      const nowVoted = await toggleVote(id, user.uid);
      setVoted(nowVoted);
      setIdea((prev) => ({
        ...prev,
        voteCount: (prev.voteCount || 0) + (nowVoted ? 1 : -1),
      }));
      toast.success(nowVoted ? '🚀 You backed this idea!' : 'Vote removed');
    } catch {
      toast.error('Failed to vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await addComment(id, comment.trim(), user);
      setComment('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment.');
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    setStatusLoading(true);
    try {
      await updateIdea(id, { status: newStatus });
      setIdea((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this idea? This cannot be undone.')) return;
    try {
      await deleteIdea(id);
      toast.success('Idea deleted.');
      navigate('/ideas');
    } catch {
      toast.error('Failed to delete idea.');
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!idea) return null;

  const createdDate = idea.createdAt?.toDate
    ? idea.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div className="page-wrapper">
      <div className="container idea-detail-page">
        <div className="idea-detail-layout">
          {/* Main Content */}
          <div className="idea-detail-main animate-fade-in">
            {/* Back link */}
            <button className="back-link" onClick={() => navigate('/ideas')}>← Back to Ideas</button>

            {/* Header */}
            <div className="idea-detail-header">
              <div className="idea-detail-meta">
                <span className="badge badge-category">🏷 {idea.category}</span>
                <span className={`badge badge-${idea.priority?.toLowerCase()}`}>{idea.priority}</span>
                <span className={`badge badge-${idea.status?.toLowerCase().replace('_', '-')}`}>
                  {STATUS_LABELS[idea.status]}
                </span>
              </div>
              <h1 className="idea-detail-title">{idea.title}</h1>
              <div className="idea-detail-author">
                <div className="idea-card-avatar">{idea.authorName?.[0]?.toUpperCase()}</div>
                <div>
                  <span className="idea-author-name">{idea.authorName}</span>
                  <span className="idea-date">{createdDate}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="idea-section">
              <h2 className="idea-section-title">💡 Pitch</h2>
              <p className="idea-section-body">{idea.description}</p>
            </div>

            {/* Impact */}
            <div className="idea-section">
              <h2 className="idea-section-title">🎯 Expected Impact</h2>
              <p className="idea-section-body">{idea.impact}</p>
            </div>

            {/* Tags */}
            {idea.tags?.length > 0 && (
              <div className="idea-section">
                <h2 className="idea-section-title">🏷 Tags</h2>
                <div className="idea-tags">
                  {idea.tags.map((tag) => (
                    <span key={tag} className="idea-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Attachment */}
            {idea.attachmentUrl && (
              <div className="idea-section">
                <h2 className="idea-section-title">📎 Attachment</h2>
                <a href={idea.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  View Attachment ↗
                </a>
              </div>
            )}

            {/* Comments */}
            <div className="idea-section">
              <h2 className="idea-section-title">💬 Comments ({comments.length})</h2>

              <form onSubmit={handleComment} className="comment-form">
                <div className="comment-input-row">
                  <div className="idea-card-avatar">{user.displayName?.[0]?.toUpperCase()}</div>
                  <textarea
                    id="comment-input"
                    className="form-textarea comment-textarea"
                    placeholder="Share your thoughts, feedback, or suggestions..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button id="post-comment-btn" type="submit" className="btn btn-primary btn-sm" disabled={commentLoading}>
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              {comments.length === 0 ? (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="empty-icon">💬</div>
                  <p>No comments yet. Be the first to share feedback!</p>
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map((c) => (
                    <div key={c.id} className="comment-item animate-fade-in">
                      <div className="idea-card-avatar">{c.authorName?.[0]?.toUpperCase()}</div>
                      <div className="comment-body">
                        <div className="comment-meta">
                          <span className="comment-author">{c.authorName}</span>
                          <span className="comment-date">
                            {c.createdAt?.toDate
                              ? c.createdAt.toDate().toLocaleString()
                              : 'Just now'}
                          </span>
                        </div>
                        <p className="comment-text">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="idea-detail-sidebar">
            {/* Vote Button */}
            <div className="glass sidebar-card">
              <button
                id="vote-btn"
                className={`vote-btn ${voted ? 'voted' : ''}`}
                onClick={handleVote}
                disabled={voteLoading}
              >
                <span className="vote-icon">{voted ? '🚀' : '🚀'}</span>
                <span className="vote-label">{voted ? 'Backed!' : 'Back this Idea'}</span>
                <span className="vote-count">{idea.voteCount || 0} backs</span>
              </button>
            </div>

            {/* Stats */}
            <div className="glass sidebar-card sidebar-stats">
              <h3 className="sidebar-card-title">📊 Stats</h3>
              <div className="stat-row">
                <span>💰 Budget</span>
                <strong>${Number(idea.budget || 0).toLocaleString()}</strong>
              </div>
              <div className="stat-row">
                <span>👥 Team Size</span>
                <strong>{idea.teamSize} people</strong>
              </div>
              <div className="stat-row">
                <span>🚀 Backs</span>
                <strong>{idea.voteCount || 0}</strong>
              </div>
              <div className="stat-row">
                <span>💬 Comments</span>
                <strong>{comments.length}</strong>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="glass sidebar-card">
                <h3 className="sidebar-card-title">⚙️ Admin Controls</h3>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select
                    id="admin-status-select"
                    className="form-select"
                    value={idea.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusLoading}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <button
                  id="delete-idea-btn"
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                  onClick={handleDelete}
                >
                  🗑 Delete Idea
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
