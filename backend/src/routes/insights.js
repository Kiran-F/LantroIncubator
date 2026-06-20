import { Router } from 'express';
import { callGemini } from '../services/gemini.service.js';

const router = Router();

/**
 * POST /api/insights
 * Body: { ideas: Array of idea objects with votes and recent comments }
 * Returns: { roiScores, themeClusters, resourceSuggestions }
 */
router.post('/insights', async (req, res) => {
  try {
    const { ideas } = req.body;

    if (!ideas || !Array.isArray(ideas)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request body must contain an "ideas" array',
      });
    }

    if (ideas.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No ideas provided. Submit some ideas first!',
      });
    }

    console.log(`[Insights] Analyzing ${ideas.length} ideas via Gemini...`);
    const insights = await callGemini(ideas);
    console.log(`[Insights] Done — ${insights.roiScores?.length} scores, ${insights.themeClusters?.length} clusters`);

    return res.json(insights);
  } catch (err) {
    console.error('[Insights] Error:', err.message);
    return res.status(500).json({
      error: 'AI Analysis Failed',
      message: err.message,
    });
  }
});

export default router;
