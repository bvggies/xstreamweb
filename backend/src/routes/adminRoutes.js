import express from 'express';
import Match from '../models/Match.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Create match
router.post('/matches', async (req, res) => {
  try {
    const {
      title,
      league,
      kickoff_time,
      thumbnail,
      stream_links,
      home_team,
      away_team,
      apiFootballId
    } = req.body;

    const match = new Match({
      title,
      league,
      kickoff_time: new Date(kickoff_time),
      thumbnail,
      stream_links,
      home_team,
      away_team,
      apiFootballId
    });

    await match.save();

    res.status(201).json({
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create match', error: error.message });
  }
});

// Update match
router.put('/matches/:id', async (req, res) => {
  try {
    const {
      title,
      league,
      kickoff_time,
      thumbnail,
      stream_links,
      home_team,
      away_team,
      status,
      score
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (league) updateData.league = league;
    if (kickoff_time) updateData.kickoff_time = new Date(kickoff_time);
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (stream_links) updateData.stream_links = stream_links;
    if (home_team) updateData.home_team = home_team;
    if (away_team) updateData.away_team = away_team;
    if (status) updateData.status = status;
    if (score) updateData.score = score;

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({
      message: 'Match updated successfully',
      match
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update match', error: error.message });
  }
});

// Delete match
router.delete('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete match', error: error.message });
  }
});

// Get all matches for admin
router.get('/matches', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
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

// Get single match for admin
router.get('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch match', error: error.message });
  }
});

export default router;
