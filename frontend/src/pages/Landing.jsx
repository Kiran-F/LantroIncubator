import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user, isAdmin } = useAuth();
  const [activeStage, setActiveStage] = useState(0);
  const [mockVotes, setMockVotes] = useState(42);
  const [hasVotedMock, setHasVotedMock] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);

  function handleMockVote() {
    if (!hasVotedMock) {
      setCelebrationKey((prev) => prev + 1);
    }
    setHasVotedMock(!hasVotedMock);
    setMockVotes((prev) => (hasVotedMock ? prev - 1 : prev + 1));
  }

  const currentStageInfo = PIPELINE_STAGES[activeStage];

  return (
    <div className="landing">
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-container">
          {/* Left Column: Headline & CTAs */}
          <div className="hero-content">

            <h1 className="hero-title animate-fade-in">
              Where Great Ideas
              <br />
              <span className="hero-title-accent">Become Reality</span>
            </h1>

            <p className="hero-subtitle animate-fade-in">
              LantroSpark empowers every employee at Lantrotech to pitch transformative ideas,
              gather peer backing, and leverage Gemini AI to accelerate executive decision-making.
            </p>

            <div className="hero-ctas animate-fade-in">
              {user ? (
                <>
                  <Link to="/ideas" className="btn btn-primary btn-lg">Browse Ideas Feed →</Link>
                  {!isAdmin && (
                    <Link to="/ideas/new" className="btn btn-secondary btn-lg">+ Submit Your Idea</Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
                </>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="hero-stats animate-fade-in">
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Transparent</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">Gemini</span>
                <span className="hero-stat-label">AI Analysis</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">5-Stage</span>
                <span className="hero-stat-label">Pipeline</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview Card */}
          <div className="hero-preview-wrapper animate-scale-in">
            <div className="preview-floating-card glass">
              <div className="preview-card-header">
                <div className="preview-card-tags">
                  <span className="badge badge-category">🏷 Automation</span>
                  <span className="badge badge-medium">MEDIUM</span>
                </div>
                <span className="badge badge-approved">● Approved</span>
              </div>

              <h3 className="preview-card-title">Automated Customer Inquiry Routing & Triage</h3>
              <p className="preview-card-desc">
                Deploy lightweight Gemini models to categorize incoming tier-1 support tickets and route them directly to specialized pods, reducing resolution time by 35%.
              </p>

              {/* AI Feasibility Pill */}
              <div className="preview-ai-badge">
                <span className="ai-badge-icon">🤖</span>
                <div className="ai-badge-content">
                  <strong>AI Feasibility Score: 94/100</strong>
                  <span>High ROI • 3x Efficiency in 6 Months</span>
                </div>
              </div>

              {/* Card Footer with interactive vote button */}
              <div className="preview-card-footer">
                <div className="preview-author">
                  <div className="preview-avatar">K</div>
                  <div>
                    <span className="preview-name">Klara</span>
                    <span className="preview-date">AI Innovation Lead</span>
                  </div>
                </div>

                <div className="preview-vote-wrapper">
                  <button
                    className={`preview-vote-btn ${hasVotedMock ? 'voted' : ''}`}
                    onClick={handleMockVote}
                    title="Click to test live voting!"
                  >
                    <span className="btn-icon-rocket">📈</span>
                    <span>{hasVotedMock ? 'Backed!' : 'Back Idea'}</span>
                    <strong>{mockVotes}</strong>
                  </button>

                  {celebrationKey > 0 && (
                    <div key={celebrationKey} className="celebration-burst" aria-hidden="true">
                      {/* Radial firework sparks */}
                      <span className="firework-spark spark-1" />
                      <span className="firework-spark spark-2" />
                      <span className="firework-spark spark-3" />
                      <span className="firework-spark spark-4" />
                      <span className="firework-spark spark-5" />
                      <span className="firework-spark spark-6" />
                      <span className="firework-spark spark-7" />
                      <span className="firework-spark spark-8" />

                      {/* Floating celebratory sparkles & badges */}
                      <span className="celebration-float float-1">✨</span>
                      <span className="celebration-float float-2">⭐</span>
                      <span className="celebration-float float-3">🎉</span>
                      <span className="celebration-float float-badge">+1</span>

                      {/* Shockwave ring */}
                      <div className="celebration-ring" />
                    </div>
                  )}
                </div>
              </div>

              {/* Live interaction hint */}
              <div className="preview-hint">
                <span className="pulse-dot" /> Click <strong>Back Idea</strong> to test live interaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Pipeline Flow Section ── */}
      <section className="pipeline-section container">
        <div className="section-header">
          <h2 className="features-title">Interactive Innovation Pipeline</h2>
          <p className="features-subtitle">
            Click on any stage below to explore how ideas progress from raw concept to funded execution
          </p>
        </div>

        {/* Interactive Stage Stepper */}
        <div className="interactive-pipeline-stepper">
          <div className="stepper-track-bg">
            <div
              className="stepper-track-fill"
              style={{ width: `${(activeStage / (PIPELINE_STAGES.length - 1)) * 100}%` }}
            />
          </div>

          <div className="stepper-steps">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isPast = idx < activeStage;
              return (
                <button
                  key={stage.id}
                  className={`stepper-node ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                  onClick={() => setActiveStage(idx)}
                >
                  <div className="node-circle">
                    <span className="node-icon">{stage.icon}</span>
                  </div>
                  <span className="node-label">{stage.label}</span>
                  <span className="node-step-num">Stage {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Minimal Stage Preview Box */}
        <div className="minimal-stage-card glass animate-fade-in" key={currentStageInfo.id}>
          <div className="minimal-stage-top">
            <div className="minimal-stage-title-group">
              <span className="minimal-stage-icon">{currentStageInfo.icon}</span>
              <div>
                <div className="minimal-stage-pill-row">
                  <span className="badge badge-category">Stage {activeStage + 1}</span>
                  <span className="badge badge-approved">{currentStageInfo.label}</span>
                </div>
                <h3 className="minimal-stage-headline">{currentStageInfo.tagline}</h3>
              </div>
            </div>

            <div className="minimal-role-badge">
              <span className="role-label">Lead Role</span>
              <span className="role-val">{currentStageInfo.owner}</span>
            </div>
          </div>

          <p className="minimal-stage-summary">
            {currentStageInfo.summary}
          </p>

          <div className="minimal-stage-bottom">
            <span className="minimal-stage-keypoint">
              <span className="keypoint-dot" /> {currentStageInfo.highlight}
            </span>
          </div>
        </div>
      </section>

      {/* ── Key Platform Features ── */}
      <section className="features container">
        <div className="section-header">
          <h2 className="features-title">Everything You Need to Innovate</h2>
          <p className="features-subtitle">From structured employee pitches to AI-driven resource modeling</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card glass" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon-wrapper">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="cta-section container">
        <div className="cta-card glass-strong">
          <h2 className="cta-title">Ready to Share Your Next Breakthrough?</h2>
          <p className="cta-subtitle">
            Join your fellow engineers and colleagues across Lantrotech. Pitch your idea, gather peer backing, and turn visionary proposals into company milestones.
          </p>
          <div className="cta-buttons">
            {user ? (
              !isAdmin ? (
                <Link to="/ideas/new" className="btn btn-primary btn-lg">Submit Your Idea Now 🚀</Link>
              ) : (
                <Link to="/ideas" className="btn btn-primary btn-lg">Explore Ideas Feed →</Link>
              )
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Join LantroSpark Free →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign In with Existing Account</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <span className="footer-logo">Lantro<span>Spark</span></span>
            <p className="footer-tagline">Lantrotech Internal Innovation & Proposal Incubator</p>
          </div>
          <div className="footer-meta">
            <span>Powered by Google Gemini 1.5 & Cloud Firestore</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const PIPELINE_STAGES = [
  {
    id: 'submitted',
    label: 'Submitted',
    icon: '📝',
    owner: 'All Employees',
    accentColor: 'var(--teal)',
    accentBg: 'rgba(7, 163, 137, 0.12)',
    borderColor: 'rgba(7, 163, 137, 0.35)',
    headline: 'Idea Pitch & Community Backing Begins',
    description: 'Any employee can submit proposals with budget estimates, team size requirements, and expected impact metrics. Peers can immediately review and back the proposal.',
    activities: [
      'Submit structured pitch with budget & impact targets',
      'Community discussion, peer feedback & voting begins',
      'Real-time indexing in the company-wide Idea Feed',
    ],
    simulationOutcome: 'The proposal is live in the feed. Peers have cast 38 backing votes, pushing the idea up the leaderboard.',
  },
  {
    id: 'reviewing',
    label: 'Reviewing',
    icon: '🔍',
    owner: 'Leadership & AI',
    accentColor: 'var(--yellow)',
    accentBg: 'rgba(219, 219, 53, 0.12)',
    borderColor: 'rgba(219, 219, 53, 0.35)',
    headline: 'Executive Evaluation & AI Feasibility Scoring',
    description: 'Leadership conducts strategic reviews while Google Gemini AI analyzes cost feasibility, calculates ROI scores, and identifies theme clusters across departments.',
    activities: [
      'Gemini AI generates 0-100 Feasibility & ROI scores',
      'Cross-departmental theme clustering & synergy checks',
      'Admins review comments, votes, and business alignment',
    ],
    simulationOutcome: 'Gemini scored this idea 94/100 for high ROI feasibility. Leadership moved it to active review.',
  },
  {
    id: 'approved',
    label: 'Approved',
    icon: '✅',
    owner: 'Admin Committee',
    accentColor: 'var(--teal)',
    accentBg: 'rgba(7, 163, 137, 0.15)',
    borderColor: 'rgba(7, 163, 137, 0.45)',
    headline: 'Greenlit for Resource & Team Allocation',
    description: 'The proposal has met all strategic criteria and gained leadership approval. The project plan moves into team allocation and budget planning.',
    activities: [
      'Formal executive sign-off and committee approval',
      'Gemini recommends optimal team composition & skill sets',
      'Project timeline and milestone roadmapping initialized',
    ],
    simulationOutcome: 'Approved by executive committee. Assigned to Platform Engineering sprint for prototype delivery.',
  },
  {
    id: 'funding',
    label: 'Funding Allocated',
    icon: '💰',
    owner: 'Finance & Project Leads',
    accentColor: 'var(--teal)',
    accentBg: 'rgba(7, 163, 137, 0.2)',
    borderColor: 'rgba(7, 163, 137, 0.55)',
    headline: 'Budget Disbursed & Sprint Execution Active',
    description: 'Required financial budget and team members are assigned. The initiative transitions from incubation into active development and deployment.',
    activities: [
      'Project budget released and sprint resources unlocked',
      'Cross-functional team onboarded for build phase',
      'Milestone tracking integrated with delivery metrics',
    ],
    simulationOutcome: '$15,000 budget unlocked. Development started with 2 assigned engineers and targeted Q4 launch.',
  },
  {
    id: 'archived',
    label: 'Archived',
    icon: '📦',
    owner: 'System / Admins',
    accentColor: 'var(--text-muted)',
    accentBg: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'var(--border)',
    headline: 'Completed or Preserved for Future Reference',
    description: 'Completed projects or proposals deferred for future quarters are archived. Full history, comments, and AI analysis remain searchable for company knowledge.',
    activities: [
      'Preserved in company knowledge base with full logs',
      'Retrospectives and post-launch learnings recorded',
      'Available for future revival as technology evolves',
    ],
    simulationOutcome: 'Archived into company innovation repository for historical reference and future iterations.',
  },
];

const FEATURES = [
  {
    icon: '💡',
    title: 'Structured Proposal Pitches',
    desc: 'Pitch ideas with clear problem statements, financial budget estimates, team size requirements, and quantifiable business outcomes.',
  },
  {
    icon: '🚀',
    title: 'Democratized Peer Voting',
    desc: 'Empower everyone in the organization to back proposals they believe in. High-conviction ideas rise naturally to leadership attention.',
  },
  {
    icon: '💬',
    title: 'Collaborative Threaded Feedback',
    desc: 'Engage in thoughtful discussions, share suggestions, and refine proposals together in real-time before reaching decision makers.',
  },
  {
    icon: '📊',
    title: 'Visual Kanban Pipeline',
    desc: 'Admins and managers easily drag, drop, and transition proposals across structured stages from submission to budget disbursement.',
  },
  {
    icon: '🤖',
    title: 'Gemini AI Strategic Insights',
    desc: 'Harness Google Gemini 1.5 to automatically score idea feasibility, cluster strategic themes, and generate tailored team recommendations.',
  },
  {
    icon: '🔒',
    title: 'Role-Based Governance',
    desc: 'Clean separation between Employee collaboration and Admin management ensures security, integrity, and streamlined execution.',
  },
];
