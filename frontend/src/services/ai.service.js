import { getAllIdeasForAI } from './ideas.service';

// The backend Express server URL — Gemini API key lives there, not in the browser
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ── Generate AI Insights ──────────────────────────────────────────────────────
export async function generateInsights() {
  // 1. Fetch all ideas + recent comments from Firestore
  const ideas = await getAllIdeasForAI();

  if (ideas.length === 0) {
    throw new Error('No ideas found. Submit some ideas first!');
  }

  // 2. Send to our backend — Gemini API key stays server-side
  const response = await fetch(`${BACKEND_URL}/api/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ideas }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Backend error: ${response.status}`);
  }

  return response.json();
}
