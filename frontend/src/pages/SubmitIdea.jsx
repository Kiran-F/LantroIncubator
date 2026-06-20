import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitIdea } from '../services/ideas.service';
import toast from 'react-hot-toast';
import './SubmitIdea.css';

const CATEGORIES = ['Automation', 'Customer Experience', 'Internal Tooling', 'Product', 'Infrastructure', 'HR & Culture', 'Marketing', 'Other'];
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

const EMPTY_FORM = {
  title: '', description: '', budget: '', teamSize: '',
  impact: '', category: 'Automation', tags: '', priority: 'MEDIUM',
};

const STEPS = ['Basic Info', 'Details & Budget', 'Tags & Submit'];

export default function SubmitIdea() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  function nextStep(e) {
    e.preventDefault();
    if (step === 0 && (!form.title.trim() || !form.description.trim())) {
      setError('Please fill in the title and description.');
      return;
    }
    if (step === 1 && (!form.budget || !form.teamSize || !form.impact)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tagsArray = form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const ideaId = await submitIdea(
        {
          title: form.title.trim(),
          description: form.description.trim(),
          budget: parseFloat(form.budget),
          teamSize: parseInt(form.teamSize),
          impact: form.impact.trim(),
          category: form.category,
          tags: tagsArray,
          priority: form.priority,
        },
        file,
        user
      );

      toast.success('🎉 Idea submitted successfully!');
      navigate('/ideas');
    } catch (err) {
      setError('Failed to submit idea. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container submit-idea-page">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Submit a New Idea</h1>
          <p className="page-subtitle">Share your innovation with the Lantrotech team</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((label, i) => (
            <div key={i} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="submit-card glass animate-scale-in">
          {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <form onSubmit={nextStep} className="submit-form">
              <h2 className="submit-step-title">Basic Information</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-title">Idea Title *</label>
                <input id="idea-title" type="text" name="title" className="form-input"
                  placeholder="Give your idea a compelling title..."
                  value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-description">Short Pitch / Description *</label>
                <textarea id="idea-description" name="description" className="form-textarea"
                  placeholder="Describe your idea in a few sentences. What problem does it solve? What value does it create?"
                  value={form.description} onChange={handleChange} rows={5} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-category">Category *</label>
                <select id="idea-category" name="category" className="form-select"
                  value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-priority">Priority Level *</label>
                <select id="idea-priority" name="priority" className="form-select"
                  value={form.priority} onChange={handleChange}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div className="submit-actions">
                <span />
                <button id="step1-next-btn" type="submit" className="btn btn-primary">Next: Details →</button>
              </div>
            </form>
          )}

          {/* Step 1: Details & Budget */}
          {step === 1 && (
            <form onSubmit={nextStep} className="submit-form">
              <h2 className="submit-step-title">Details & Budget</h2>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="idea-budget">Estimated Budget (USD) *</label>
                  <input id="idea-budget" type="number" name="budget" className="form-input"
                    placeholder="e.g. 50000" value={form.budget} onChange={handleChange}
                    min="0" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="idea-teamsize">Required Team Size *</label>
                  <input id="idea-teamsize" type="number" name="teamSize" className="form-input"
                    placeholder="e.g. 5" value={form.teamSize} onChange={handleChange}
                    min="1" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-impact">Expected Impact / Benefits *</label>
                <textarea id="idea-impact" name="impact" className="form-textarea"
                  placeholder="What outcomes will this idea deliver? E.g. 20% reduction in support tickets, $500k annual savings, improved employee satisfaction..."
                  value={form.impact} onChange={handleChange} rows={4} required />
              </div>

              <div className="submit-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button id="step2-next-btn" type="submit" className="btn btn-primary">Next: Tags →</button>
              </div>
            </form>
          )}

          {/* Step 2: Tags & Submit */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="submit-form">
              <h2 className="submit-step-title">Tags & Attachment</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-tags">Tags (comma-separated)</label>
                <input id="idea-tags" type="text" name="tags" className="form-input"
                  placeholder="e.g. AI, automation, cost-savings, mobile"
                  value={form.tags} onChange={handleChange} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  These help others discover your idea
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="idea-attachment">Attachment (optional)</label>
                <label htmlFor="idea-attachment" className="file-upload-area">
                  <span className="file-upload-icon">📎</span>
                  <span className="file-upload-text">
                    {file ? file.name : 'Click to upload a file'}
                  </span>
                  <span className="file-upload-hint">PDF, DOCX, PPTX, PNG up to 10MB</span>
                  <input id="idea-attachment" type="file" className="file-input-hidden"
                    accept=".pdf,.doc,.docx,.pptx,.png,.jpg"
                    onChange={(e) => setFile(e.target.files[0] || null)} />
                </label>
              </div>

              {/* Summary preview */}
              <div className="idea-preview">
                <h4 className="idea-preview-title">📋 Summary Preview</h4>
                <div className="idea-preview-grid">
                  <div><span>Title</span><strong>{form.title}</strong></div>
                  <div><span>Category</span><strong>{form.category}</strong></div>
                  <div><span>Priority</span><strong>{form.priority}</strong></div>
                  <div><span>Budget</span><strong>${Number(form.budget || 0).toLocaleString()}</strong></div>
                  <div><span>Team Size</span><strong>{form.teamSize} people</strong></div>
                </div>
              </div>

              <div className="submit-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button id="submit-idea-final-btn" type="submit" className="btn btn-primary" disabled={loading}>
                  {loading
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting...</>
                    : '🚀 Submit Idea'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
