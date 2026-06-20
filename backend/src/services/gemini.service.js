import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── Build the structured prompt sent to Gemini ────────────────────────────────
function buildPrompt(ideas) {
  const ideasJson = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    description: idea.description,
    category: idea.category,
    tags: idea.tags,
    budget: idea.budget,
    teamSize: idea.teamSize,
    impact: idea.impact,
    priority: idea.priority,
    voteCount: idea.voteCount || 0,
    commentCount: idea.commentCount || 0,
    recentComments: idea.recentComments || [],
  }));

  return `You are an innovation analyst for Lantrotech, a growing tech company.
Analyze the following employee-submitted ideas and return ONLY valid JSON — no markdown, no explanation, just raw JSON.

IDEAS DATA:
${JSON.stringify(ideasJson, null, 2)}

Return this EXACT JSON structure:
{
  "roiScores": [
    {
      "ideaId": "string",
      "title": "string",
      "score": number (0-100),
      "complexity": "LOW" | "MEDIUM" | "HIGH",
      "rationale": "2-3 sentence explanation of the score",
      "estimatedROI": "string (e.g. '3x in 18 months')"
    }
  ],
  "themeClusters": [
    {
      "theme": "string (e.g. 'Process Automation')",
      "color": "string (a hex color code)",
      "ideaIds": ["string"],
      "description": "1-2 sentence description of this innovation theme"
    }
  ],
  "resourceSuggestions": [
    {
      "ideaId": "string",
      "title": "string",
      "skills": ["string"],
      "teamComposition": "string (e.g. '2 Backend Devs, 1 Designer, 1 PM')",
      "estimatedDuration": "string (e.g. '3-6 months')",
      "recommendation": "1 sentence strategic recommendation"
    }
  ]
}

Rules:
- roiScores: include ALL ideas, sorted by score descending
- themeClusters: group into 3-6 meaningful themes
- resourceSuggestions: only include top 5 ideas by score
- Higher votes = higher score influence
- Lower budget with high impact = higher score`;
}

// ── Call Gemini and return parsed JSON ────────────────────────────────────────
export async function callGemini(ideas) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured in backend/.env');
  }

  const prompt = buildPrompt(ideas);

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error('Empty response from Gemini API');

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse Gemini response as JSON. Raw: ' + cleaned.slice(0, 200));
  }
}
