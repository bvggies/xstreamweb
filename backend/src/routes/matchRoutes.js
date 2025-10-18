import express from 'express';
import Match from '../models/Match.js';
import { authenticateToken, checkSubscription } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all matches (public)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const matches = await Match.find(query)
      .sort({ kickoff_time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);

    res.json({
      matches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
});

// Get single match (protected for stream links)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if user has premium subscription
    const hasSubscription = req.user.subscription.plan === 'premium' && 
                           req.user.subscription.expiresAt > new Date();

    const matchData = {
      ...match.toObject(),
      stream_links: hasSubscription ? match.stream_links : []
    };

    res.json(matchData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match', error: error.message });
  }
});

// Get live matches
router.get('/live/current', async (req, res) => {
  try {
    const liveMatches = await Match.find({ status: 'live' })
      .sort({ kickoff_time: -1 });

    res.json({ matches: liveMatches });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch live matches', error: error.message });
  }
});

// Get upcoming matches
router.get('/upcoming/list', async (req, res) => {
  try {
    const upcomingMatches = await Match.find({ 
      status: 'upcoming',
      kickoff_time: { $gte: new Date() }
    })
    .sort({ kickoff_time: 1 })
    .limit(10);

    res.json({ matches: upcomingMatches });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming matches', error: error.message });
  }
});

export default router;
