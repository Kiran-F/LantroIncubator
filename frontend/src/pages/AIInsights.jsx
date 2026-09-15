import { useState } from 'react';
import { generateInsights } from '../services/ai.service';
import './AIInsights.css';

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    setInsights(null);
    try {
      const data = await generateInsights();
      setInsights(data);
    } catch (err) {
      setError(err.message || 'Failed to generate insights. Check your API key.');
    } finally {
      setLoading(false);
    }
  }

  // Filter ideaAnalyses for the deep-dive section
  const analyses = insights?.ideaAnalyses || [];
  const categories = ['All', ...new Set(analyses.map((a) => a.category).filter(Boolean))];
  
  const filteredAnalyses = analyses.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = search === '' || 
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.techStack?.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      item.strengths?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="container insights-page">
        {/* Header */}
        <div className="page-header insights-header">
          <div>
            <h1 className="page-title">AI Innovation Intelligence</h1>
            <p className="page-subtitle">
              Executive AI evaluation: Strengths, Weaknesses, Tech Stacks & Top Monetization Picks
            </p>
          </div>
          <button
            id="generate-insights-btn"
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing Proposals...</>
              : '⚡ Generate AI Insights'}
          </button>
        </div>

        {/* Idle State */}
        {!insights && !loading && !error && (
          <div className="insights-idle glass">
            <div className="insights-idle-icon">🤖</div>
            <h2>Comprehensive AI Pipeline Analysis</h2>
            <p>
              Click <strong>"Generate AI Insights"</strong> to let AI inspect every submitted proposal, 
              assess technical feasibility, diagnose strengths and risks, recommend tech stacks, and rank top monetization opportunities.
            </p>
            <div className="insights-idle-features">
              {[
                { icon: '🏆', title: 'Top 3 Monetization & Innovation Picks', desc: 'Identifies high-impact ideas with strong future revenue potential and minimal resource overhead.' },
                { icon: '⚖️', title: 'Strengths & Weaknesses Analysis', desc: 'Honest diagnostic breakdown of pros and bottlenecks for every single idea on the platform.' },
                { icon: '🛠️', title: 'Recommended Tech Stacks', desc: 'Tailored architectural stack suggestions (languages, frameworks, DBs, cloud services).' },
              ].map((f, i) => (
                <div key={i} className="insights-idle-feature">
                  <span className="insights-idle-feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="insights-loading glass">
            <div className="insights-loading-animation">
              <div className="ai-orb" />
            </div>
            <h2>AI is conducting multi-factor analysis...</h2>
            <p>Evaluating innovation score, commercial upside, tech stack requirements, and resource estimates.</p>
            <div className="insights-steps">
              {[
                'Ingesting all employee proposals and peer votes from Firestore',
                'Scoring feasibility, commercial potential & resource efficiency',
                'Diagnosing strengths, bottlenecks & risks per idea',
                'Architecting recommended engineering tech stacks',
                'Selecting Top 3 high-monetization innovation winners'
              ].map((step, i) => (
                <div key={i} className="insights-step" style={{ animationDelay: `${i * 0.7}s` }}>
                  <span className="insights-step-dot" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-msg insights-error">
            <strong>⚠️ Error:</strong> {error}
            <br /><br />
            <small>Make sure your <code>GEMINI_API_KEY</code> or <code>GROQ_API_KEY</code> is set in <code>backend/.env</code>.</small>
          </div>
        )}

        {/* Results */}
        {insights && (
          <div className="insights-results animate-fade-in">
            {/* ── SECTION 1: Top 3 Strategic Monetization & Innovation Picks ── */}
            {insights.topThreeIdeas && insights.topThreeIdeas.length > 0 && (
              <section className="insights-section" id="top-three-section">
                <div className="section-title-row">
                  <div>
                    <span className="section-mini-tag">🏆 EXECUTIVE SPOTLIGHT</span>
                    <h2 className="insights-section-title">Top 3 Innovation & Monetization Picks</h2>
                    <p className="insights-section-subtitle">
                      Curated by AI based on maximum innovation, future revenue/savings potential, and lean resource requirements.
                    </p>
                  </div>
                </div>

                <div className="top-three-grid">
                  {insights.topThreeIdeas.map((topIdea, i) => (
                    <div 
                      key={topIdea.ideaId || i} 
                      className={`top-idea-card glass animate-scale-in rank-card-${topIdea.rank || i + 1}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="top-idea-header">
                        <div className="rank-medal">
                          {topIdea.rank === 1 ? '🥇' : topIdea.rank === 2 ? '🥈' : '🥉'}
                          <span>RANK #{topIdea.rank || i + 1}</span>
                        </div>
                        <span className="badge badge-top-highlight">{topIdea.badge}</span>
                      </div>

                      <h3 className="top-idea-title">{topIdea.title}</h3>
                      <p className="top-idea-why">{topIdea.whySelected}</p>

                      {/* Key Metric Pills */}
                      <div className="top-idea-metrics">
                        <div className="top-metric-box">
                          <span className="top-metric-lbl">💰 Commercial Upside</span>
                          <span className="top-metric-val">{topIdea.commercialPotential}</span>
                        </div>
                        <div className="top-metric-box">
                          <span className="top-metric-lbl">⚡ Resource Lean-ness</span>
                          <span className="top-metric-val">{topIdea.resourceEfficiency}</span>
                        </div>
                      </div>

                      {/* Recommended Tech Stack */}
                      {topIdea.techStack && topIdea.techStack.length > 0 && (
                        <div className="top-tech-section">
                          <span className="top-tech-lbl">🛠️ Recommended Tech Stack:</span>
                          <div className="top-tech-tags">
                            {topIdea.techStack.map((tech, idx) => (
                              <span key={idx} className="tech-badge">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Plan */}
                      {topIdea.actionPlan && (
                        <div className="top-action-plan">
                          <span className="action-icon">🚀</span>
                          <div>
                            <strong>Execution Roadmap:</strong>
                            <p>{topIdea.actionPlan}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── SECTION 2: Comprehensive Idea-by-Idea Analysis (All Proposals) ── */}
            <section className="insights-section" id="all-ideas-analysis-section">
              <div className="section-title-row">
                <div>
                  <span className="section-mini-tag">🔍 DEEP DIVE</span>
                  <h2 className="insights-section-title">Proposal-by-Proposal Diagnostic</h2>
                  <p className="insights-section-subtitle">
                    In-depth breakdown of strong points, weaknesses/risks, and recommended tech stack for all submitted ideas.
                  </p>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="analysis-toolbar glass">
                <input
                  type="text"
                  className="form-input analysis-search"
                  placeholder="🔍 Search analyses by title, strength, or tech stack..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="analysis-category-pills">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idea Diagnostic Cards Grid */}
              <div className="idea-analyses-list">
                {filteredAnalyses.length === 0 ? (
                  <div className="empty-analysis glass">
                    <p>No proposals matched your search criteria.</p>
                  </div>
                ) : (
                  filteredAnalyses.map((item, i) => (
                    <div 
                      key={item.ideaId || i} 
                      className="analysis-card glass animate-fade-in" 
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="analysis-card-top">
                        <div className="analysis-title-group">
                          <span className="badge badge-category">{item.category || 'Initiative'}</span>
                          <h3 className="analysis-title">{item.title}</h3>
                        </div>

                        <div className="analysis-score-pill" style={{ borderColor: getScoreColor(item.score) }}>
                          <span className="score-num" style={{ color: getScoreColor(item.score) }}>
                            {item.score || 85}
                          </span>
                          <span className="score-lbl">Score</span>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses 2-Column Split */}
                      <div className="analysis-pros-cons-grid">
                        {/* Strengths */}
                        <div className="pros-column">
                          <h4 className="column-title pros-title">
                            <span>✅</span> Strong Points & Strategic Value
                          </h4>
                          <ul className="points-list">
                            {item.strengths?.map((str, idx) => (
                              <li key={idx} className="pro-item">
                                <span className="bullet-pro">✓</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses / Risks */}
                        <div className="cons-column">
                          <h4 className="column-title cons-title">
                            <span>⚠️</span> Potential Weaknesses & Risk Factors
                          </h4>
                          <ul className="points-list">
                            {item.weaknesses?.map((weak, idx) => (
                              <li key={idx} className="con-item">
                                <span className="bullet-con">!</span>
                                <span>{weak}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Tech Stack & Monetization Footer */}
                      <div className="analysis-card-footer">
                        <div className="footer-tech-group">
                          <span className="footer-tech-lbl">🛠️ Recommended Tech Stack:</span>
                          <div className="footer-tech-tags">
                            {item.techStack?.map((tech, idx) => (
                              <span key={idx} className="tech-badge-sm">{tech}</span>
                            ))}
                          </div>
                        </div>

                        <div className="footer-meta-stats">
                          {item.monetizationPotential && (
                            <div className="footer-meta-item">
                              <strong>📈 Monetization:</strong> {item.monetizationPotential}
                            </div>
                          )}
                          {item.resourceEstimate && (
                            <div className="footer-meta-item">
                              <strong>⏱ Resources:</strong> {item.resourceEstimate}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ── SECTION 3: Strategic Theme Clusters ── */}
            {insights.themeClusters && insights.themeClusters.length > 0 && (
              <section className="insights-section" id="theme-clusters-section">
                <div className="section-title-row">
                  <div>
                    <span className="section-mini-tag">🗂 SYNERGY</span>
                    <h2 className="insights-section-title">Strategic Theme Clusters</h2>
                    <p className="insights-section-subtitle">Cross-departmental thematic alignments identified by AI</p>
                  </div>
                </div>

                <div className="clusters-grid">
                  {insights.themeClusters.map((cluster, i) => (
                    <div 
                      key={i} 
                      className="cluster-card glass animate-scale-in" 
                      style={{ animationDelay: `${i * 0.08}s`, borderColor: cluster.color + '44' }}
                    >
                      <div className="cluster-header">
                        <div className="cluster-dot" style={{ background: cluster.color, boxShadow: `0 0 12px ${cluster.color}88` }} />
                        <h3 className="cluster-name">{cluster.theme}</h3>
                        <span className="cluster-count">{cluster.ideaIds?.length || 0} ideas</span>
                      </div>
                      <p className="cluster-desc">{cluster.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 85) return '#07a389';
  if (score >= 70) return '#dbdb35';
  return '#f59e0b';
}

