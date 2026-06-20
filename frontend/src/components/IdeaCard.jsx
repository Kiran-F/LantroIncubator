import { Link } from 'react-router-dom';
import './IdeaCard.css';

const STATUS_LABELS = {
  REVIEWING: 'Reviewing',
  APPROVED: 'Approved',
  FUNDING_ALLOCATED: 'Funding Allocated',
  ARCHIVED: 'Archived',
};

const STATUS_CLASS = {
  REVIEWING: 'badge-reviewing',
  APPROVED: 'badge-approved',
  FUNDING_ALLOCATED: 'badge-funding',
  ARCHIVED: 'badge-archived',
};

const PRIORITY_CLASS = {
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
};

export default function IdeaCard({ idea }) {
  const createdDate = idea.createdAt?.toDate
    ? idea.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <Link to={`/ideas/${idea.id}`} className="idea-card" id={`idea-card-${idea.id}`}>
      {/* Top Row: Category + Status + Priority */}
      <div className="idea-card-top">
        <span className="badge badge-category">🏷 {idea.category}</span>
        <div className="idea-card-badges">
          <span className={`badge ${PRIORITY_CLASS[idea.priority] || 'badge-medium'}`}>
            {idea.priority}
          </span>
          <span className={`badge ${STATUS_CLASS[idea.status] || 'badge-reviewing'}`}>
            {STATUS_LABELS[idea.status] || idea.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="idea-card-title">{idea.title}</h3>

      {/* Description preview */}
      <p className="idea-card-desc">{idea.description}</p>

      {/* Tags */}
      {idea.tags?.length > 0 && (
        <div className="idea-card-tags">
          {idea.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="idea-tag">#{tag}</span>
          ))}
          {idea.tags.length > 3 && (
            <span className="idea-tag idea-tag-more">+{idea.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="idea-card-divider" />

      {/* Footer */}
      <div className="idea-card-footer">
        <div className="idea-card-author">
          <div className="idea-card-avatar">
            {idea.authorName?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="idea-card-author-name">{idea.authorName}</div>
            <div className="idea-card-date">{createdDate}</div>
          </div>
        </div>

        <div className="idea-card-stats">
          <span className="idea-stat" title="Votes">
            🚀 {idea.voteCount || 0}
          </span>
          <span className="idea-stat" title="Comments">
            💬 {idea.commentCount || 0}
          </span>
          {idea.budget && (
            <span className="idea-stat" title="Budget">
              💰 ${Number(idea.budget).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
