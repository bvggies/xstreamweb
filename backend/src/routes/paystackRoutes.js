import express from 'express';
import { initializePaystack, verifyPaystack, verifyWebhookSignature } from '../utils/paystack.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize payment
router.post('/initialize', authenticateToken, async (req, res) => {
  try {
    const { email, amount = 5000 } = req.body; // Default 5000 kobo = 50 NGN

    const callback_url = `${process.env.FRONTEND_URL}/subscription/success`;

    const response = await initializePaystack(email, amount, callback_url);

    // Create subscription record
    const subscription = new Subscription({
      userId: req.user._id,
      plan: 'premium',
      reference: response.data.reference,
      amount: amount,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    await subscription.save();

    res.json({
      message: 'Payment initialized successfully',
      authorization_url: response.data.authorization_url,
      reference: response.data.reference
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Payment initialization failed', 
      error: error.message 
    });
  }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, process.env.PAYSTACK_SECRET_KEY)) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, customer } = event.data;

      // Find subscription
      const subscription = await Subscription.findOne({ reference });
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      // Update subscription status
      subscription.status = 'success';
      await subscription.save();

      // Update user subscription
      await User.findByIdAndUpdate(subscription.userId, {
        'subscription.plan': 'premium',
        'subscription.expiresAt': subscription.expiresAt
      });

      console.log(`Payment successful for user ${subscription.userId}, reference: ${reference}`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Verify payment manually
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.body;

    const response = await verifyPaystack(reference);

    if (response.data.status === 'success') {
      // Find subscription
      const subscription = await Subscription.findOne({ reference });
      if (subscription) {
        subscription.status = 'success';
        await subscription.save();

        // Update user subscription
        await User.findByIdAndUpdate(subscription.userId, {
          'subscription.plan': 'premium',
          'subscription.expiresAt': subscription.expiresAt
        });

        res.json({
          message: 'Payment verified successfully',
          subscription: {
            plan: 'premium',
            expiresAt: subscription.expiresAt
          }
        });
      } else {
        res.status(404).json({ message: 'Subscription not found' });
      }
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.message 
    });
  }
});

export default router;
