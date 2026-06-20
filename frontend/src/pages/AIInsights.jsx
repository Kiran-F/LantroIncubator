import { useState } from 'react';
import { generateInsights } from '../services/ai.service';
import './AIInsights.css';

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    setInsights(null);
    try {
      const data = await generateInsights();
      setInsights(data);
    } catch (err) {
      setError(err.message || 'Failed to generate insights. Check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container insights-page">
        {/* Header */}
        <div className="page-header insights-header">
          <div>
            <h1 className="page-title">✨ AI Insights</h1>
            <p className="page-subtitle">
              Powered by Google Gemini — real-time analysis of all ideas, votes, and comments
            </p>
          </div>
          <button
            id="generate-insights-btn"
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing...</>
              : '✨ Generate Insights'}
          </button>
        </div>

        {/* Idle State */}
        {!insights && !loading && !error && (
          <div className="insights-idle glass">
            <div className="insights-idle-icon">🤖</div>
            <h2>Ready to Analyze Your Ideas</h2>
            <p>
              Click <strong>"Generate Insights"</strong> to let Gemini AI analyze all submitted ideas
              and produce feasibility scores, theme clusters, and resource recommendations.
            </p>
            <div className="insights-idle-features">
              {[
                { icon: '📊', title: 'Feasibility & ROI Scoring', desc: 'Each idea scored 0-100 based on impact, budget, votes, and complexity' },
                { icon: '🗂', title: 'Theme Clustering', desc: 'Ideas grouped into meaningful innovation themes by Gemini' },
                { icon: '👥', title: 'Resource Suggestions', desc: 'Team composition and skill recommendations for top ideas' },
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
            <h2>Gemini is analyzing your ideas...</h2>
            <p>This may take 15-30 seconds. Gemini is reading all ideas, votes, and comments.</p>
            <div className="insights-steps">
              {['Reading all ideas from Firestore', 'Sending data to Gemini 1.5 Flash', 'Generating feasibility scores', 'Clustering themes', 'Building resource recommendations'].map((step, i) => (
                <div key={i} className="insights-step" style={{ animationDelay: `${i * 0.8}s` }}>
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
            <small>Make sure your <code>VITE_GEMINI_API_KEY</code> is set correctly in your <code>.env</code> file and restart the dev server.</small>
          </div>
        )}

        {/* Results */}
        {insights && (
          <div className="insights-results animate-fade-in">
            {/* ROI Scores */}
            <section className="insights-section" id="roi-scores-section">
              <h2 className="insights-section-title">📊 Feasibility & ROI Scores</h2>
              <p className="insights-section-subtitle">Ideas ranked by expected business value vs implementation complexity</p>
              <div className="roi-table">
                {insights.roiScores?.map((item, i) => (
                  <div key={item.ideaId} className="roi-row glass animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="roi-rank">#{i + 1}</div>
                    <div className="roi-info">
                      <div className="roi-title">{item.title}</div>
                      <div className="roi-rationale">{item.rationale}</div>
                      {item.estimatedROI && (
                        <div className="roi-estimate">📈 {item.estimatedROI}</div>
                      )}
                    </div>
                    <div className="roi-right">
                      <div className="roi-score-bar-wrap">
                        <div
                          className="roi-score-bar"
                          style={{ width: `${item.score}%`, background: getScoreColor(item.score) }}
                        />
                      </div>
                      <div className="roi-score-number" style={{ color: getScoreColor(item.score) }}>
                        {item.score}/100
                      </div>
                      <span className={`badge complexity-${item.complexity?.toLowerCase()}`}>
                        {item.complexity} complexity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Theme Clusters */}
            <section className="insights-section" id="theme-clusters-section">
              <h2 className="insights-section-title">🗂 Theme Clusters</h2>
              <p className="insights-section-subtitle">Gemini grouped your ideas into innovation themes</p>
              <div className="clusters-grid">
                {insights.themeClusters?.map((cluster, i) => (
                  <div key={i} className="cluster-card glass animate-scale-in" style={{ animationDelay: `${i * 0.1}s`, borderColor: cluster.color + '44' }}>
                    <div className="cluster-header">
                      <div className="cluster-dot" style={{ background: cluster.color, boxShadow: `0 0 12px ${cluster.color}88` }} />
                      <h3 className="cluster-name">{cluster.theme}</h3>
                      <span className="cluster-count">{cluster.ideaIds?.length || 0} ideas</span>
                    </div>
                    <p className="cluster-desc">{cluster.description}</p>
                    <div className="cluster-ideas">
                      {insights.roiScores
                        ?.filter((r) => cluster.ideaIds?.includes(r.ideaId))
                        .map((r) => (
                          <span key={r.ideaId} className="cluster-idea-tag" style={{ borderColor: cluster.color + '66', color: cluster.color }}>
                            {r.title}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resource Suggestions */}
            <section className="insights-section" id="resource-suggestions-section">
              <h2 className="insights-section-title">👥 Resource Allocation Suggestions</h2>
              <p className="insights-section-subtitle">Recommended team composition for top-ranked ideas</p>
              <div className="resources-grid">
                {insights.resourceSuggestions?.map((item, i) => (
                  <div key={item.ideaId} className="resource-card glass animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="resource-rank">Top #{i + 1}</div>
                    <h3 className="resource-title">{item.title}</h3>
                    <div className="resource-composition">
                      <span className="resource-label">👥 Team</span>
                      <span className="resource-value">{item.teamComposition}</span>
                    </div>
                    <div className="resource-composition">
                      <span className="resource-label">⏱ Duration</span>
                      <span className="resource-value">{item.estimatedDuration}</span>
                    </div>
                    <div className="resource-skills">
                      {item.skills?.map((skill) => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                    {item.recommendation && (
                      <p className="resource-recommendation">💡 {item.recommendation}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 70) return '#07a389';
  return '#dbdb35';
}
