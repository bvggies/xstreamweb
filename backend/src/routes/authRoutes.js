import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'xstream_super_secret_jwt_key_for_development',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.toJSON()
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
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'xstream_super_secret_jwt_key_for_development',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user data' });
  }
});

// Test endpoint to check database and users
router.get('/test', async (req, res) => {
  try {
    const userCount = await User.count();
    const users = await User.findAll();
    
    res.json({
      message: 'Database connection working',
      userCount,
      users: users.map(user => user.toJSON())
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
    const existingAdmin = await User.findByEmail('admin@xstream.com');
    const existingUser = await User.findByEmail('user@xstream.com');
    
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
      await User.create({
        name: 'Admin User',
        email: 'admin@xstream.com',
        password: 'admin123',
        role: 'admin',
        subscription_plan: 'premium',
        subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });
    }
    
    // Create test user
    if (!existingUser) {
      await User.create({
        name: 'Test User',
        email: 'user@xstream.com',
        password: 'user123',
        role: 'user',
        subscription_plan: 'free'
      });
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