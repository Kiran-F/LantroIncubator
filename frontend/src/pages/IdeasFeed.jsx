import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToIdeas } from '../services/ideas.service';
import IdeaCard from '../components/IdeaCard';
import './IdeasFeed.css';

const CATEGORIES = ['All', 'Automation', 'Customer Experience', 'Internal Tooling', 'Product', 'Infrastructure', 'HR & Culture', 'Marketing', 'Other'];
const STATUSES = ['ALL', 'REVIEWING', 'APPROVED', 'FUNDING_ALLOCATED', 'ARCHIVED'];
const PRIORITIES = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export default function IdeasFeed() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const unsub = subscribeToIdeas((data) => {
      setIdeas(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Filter + search + sort
  const filtered = ideas
    .filter((idea) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        idea.title?.toLowerCase().includes(q) ||
        idea.description?.toLowerCase().includes(q) ||
        idea.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCategory = category === 'All' || idea.category === category;
      const matchStatus = status === 'ALL' || idea.status === status;
      const matchPriority = priority === 'ALL' || idea.priority === priority;
      return matchSearch && matchCategory && matchStatus && matchPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      if (sortBy === 'most-voted') return (b.voteCount || 0) - (a.voteCount || 0);
      if (sortBy === 'most-commented') return (b.commentCount || 0) - (a.commentCount || 0);
      return 0;
    });

  return (
    <div className="page-wrapper">
      <div className="container ideas-feed-page">
        {/* Header */}
        <div className="page-header ideas-header">
          <div>
            <h1 className="page-title">Idea Feed</h1>
            <p className="page-subtitle">Explore and back ideas from across the organization</p>
          </div>
          <Link to="/ideas/new" className="btn btn-primary" id="submit-idea-btn">
            + Submit New Idea
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="ideas-filters glass">
          <input
            id="ideas-search-input"
            type="text"
            className="form-input ideas-search"
            placeholder="🔍  Search ideas by title, description, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="ideas-filter-row">
            {/* Category pills */}
            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`category-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="ideas-selects">
              <select
                id="filter-status-select"
                className="form-select filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}
                  </option>
                ))}
              </select>

              <select
                id="filter-priority-select"
                className="form-select filter-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>
                ))}
              </select>

              <select
                id="filter-sort-select"
                className="form-select filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-voted">Most Backed</option>
                <option value="most-commented">Most Discussed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="ideas-count">
            Showing <strong>{filtered.length}</strong> of {ideas.length} ideas
          </div>
        )}

        {/* Ideas Grid */}
        {loading ? (
          <div className="ideas-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="idea-card-skeleton">
                <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 24, width: '80%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 48, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 16, width: '60%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h3>No ideas found</h3>
            <p>Try adjusting your filters, or be the first to submit an idea!</p>
            <Link to="/ideas/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              Submit the First Idea
            </Link>
          </div>
        ) : (
          <div className="ideas-grid">
            {filtered.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
