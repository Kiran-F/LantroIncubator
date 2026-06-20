import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <span>✨</span> Internal Innovation Platform
          </div>

          <h1 className="hero-title animate-fade-in">
            Where Great Ideas
            <br />
            <span className="hero-title-accent">Become Reality</span>
          </h1>

          <p className="hero-subtitle animate-fade-in">
            LantroSpark empowers every employee to pitch ideas, collaborate with peers,
            and get leadership buy-in — all in one structured innovation hub.
          </p>

          <div className="hero-ctas animate-fade-in">
            {user ? (
              <>
                <Link to="/ideas" className="btn btn-primary btn-lg">Browse Ideas →</Link>
                <Link to="/ideas/new" className="btn btn-secondary btn-lg">Submit an Idea</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fade-in">
            <div className="hero-stat">
              <span className="hero-stat-value">100+</span>
              <span className="hero-stat-label">Ideas Submitted</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">AI</span>
              <span className="hero-stat-label">Powered Insights</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">4</span>
              <span className="hero-stat-label">Pipeline Stages</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features container">
        <h2 className="features-title">Everything You Need to Innovate</h2>
        <p className="features-subtitle">From idea submission to funding — all in one place</p>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="pipeline-section container">
        <h2 className="features-title">Structured Innovation Pipeline</h2>
        <p className="features-subtitle">Every idea follows a clear path from submission to execution</p>
        <div className="pipeline-steps">
          {PIPELINE.map((step, i) => (
            <div key={i} className="pipeline-step">
              <div className="pipeline-step-dot" style={{ background: step.color }} />
              <div className="pipeline-step-label">{step.label}</div>
              {i < PIPELINE.length - 1 && <div className="pipeline-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section container">
        <div className="cta-card glass-strong">
          <h2 className="cta-title">Ready to Share Your Next Big Idea?</h2>
          <p className="cta-subtitle">Join your colleagues and start driving innovation today.</p>
          {user ? (
            <Link to="/ideas/new" className="btn btn-primary btn-lg">Submit Your Idea 🚀</Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">Join LantroSpark 🚀</Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <span>💡 LantroSpark — Lantrotech Internal Innovation Platform</span>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: '💡', title: 'Idea Submission', desc: 'Submit detailed project proposals with budget estimates, team requirements, and expected business impact.' },
  { icon: '🚀', title: 'Community Backing', desc: 'Vote on ideas you believe in. The most-backed ideas rise to the top and get leadership attention.' },
  { icon: '💬', title: 'Collaborative Feedback', desc: 'Comment on ideas, provide suggestions, and help refine proposals before they reach decision makers.' },
  { icon: '📊', title: 'Admin Pipeline', desc: 'Leadership manages ideas through a structured Kanban pipeline from review to funding allocation.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Gemini AI analyzes all ideas to generate feasibility scores, theme clusters, and resource recommendations.' },
  { icon: '🔒', title: 'Role-Based Access', desc: 'Employees collaborate while admins manage the pipeline — clean separation of concerns.' },
];

const PIPELINE = [
  { label: 'Submitted', color: 'rgba(7, 163, 137, 0.4)' },
  { label: 'Reviewing', color: '#dbdb35' },
  { label: 'Approved', color: '#07a389' },
  { label: 'Funding Allocated', color: 'rgba(7, 163, 137, 0.8)' },
  { label: 'Archived', color: 'rgba(7, 163, 137, 0.2)' },
];
