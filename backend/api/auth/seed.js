import connectDB from '../../src/config/db.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    await connectDB();
    
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
}
