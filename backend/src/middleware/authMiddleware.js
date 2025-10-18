import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xstream_super_secret_jwt_key_for_development');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.subscription.plan === 'premium' && user.subscription.expiresAt > new Date()) {
      return next();
    }
    
    return res.status(403).json({ 
      message: 'Premium subscription required',
      subscription: {
        plan: user.subscription.plan,
        expiresAt: user.subscription.expiresAt
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Subscription check failed' });
  }
};
