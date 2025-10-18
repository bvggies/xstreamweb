import express from 'express';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    
    const isActive = user.subscription.plan === 'premium' && 
                     user.subscription.expiresAt > new Date();

    res.json({
      subscription: {
        plan: user.subscription.plan,
        expiresAt: user.subscription.expiresAt,
        isActive,
        daysRemaining: isActive ? 
          Math.ceil((user.subscription.expiresAt - new Date()) / (1000 * 60 * 60 * 24)) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get subscription status' });
  }
});

// Get subscription history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get subscription history' });
  }
});

// Manual renewal (if needed)
router.post('/renew', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.subscription.plan === 'premium' && user.subscription.expiresAt > new Date()) {
      return res.status(400).json({ message: 'Subscription is still active' });
    }

    // Extend subscription by 30 days
    const newExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': 'premium',
      'subscription.expiresAt': newExpiryDate
    });

    res.json({
      message: 'Subscription renewed successfully',
      subscription: {
        plan: 'premium',
        expiresAt: newExpiryDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to renew subscription' });
  }
});

export default router;
