import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'xstream_super_secret_jwt_key_for_development',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'xstream_super_secret_jwt_key_for_development',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        subscription: req.user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user data' });
  }
});

// Test endpoint to check database and users
router.get('/test', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find({}, 'name email role subscription.plan');
    
    res.json({
      message: 'Database connection working',
      userCount,
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.subscription?.plan || 'free'
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Manual seed endpoint to create test users
router.post('/seed', async (req, res) => {
  try {
    // Check if users already exist
    const existingAdmin = await User.findOne({ email: 'admin@xstream.com' });
    const existingUser = await User.findOne({ email: 'user@xstream.com' });
    
    if (existingAdmin && existingUser) {
      return res.json({
        message: 'Test users already exist',
        users: [
          { email: 'admin@xstream.com', password: 'admin123', role: 'admin' },
          { email: 'user@xstream.com', password: 'user123', role: 'user' }
        ]
      });
    }
    
    // Create admin user
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@xstream.com',
        password: hashedAdminPassword,
        role: 'admin',
        subscription: {
          plan: 'premium',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      });
      await admin.save();
    }
    
    // Create test user
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('user123', 12);
      const user = new User({
        name: 'Test User',
        email: 'user@xstream.com',
        password: hashedUserPassword,
        role: 'user',
        subscription: {
          plan: 'free'
        }
      });
      await user.save();
    }
    
    res.json({
      message: 'Test users created successfully',
      users: [
        { email: 'admin@xstream.com', password: 'admin123', role: 'admin' },
        { email: 'user@xstream.com', password: 'user123', role: 'user' }
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create test users', 
      error: error.message 
    });
  }
});

export default router;
