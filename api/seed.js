import connectDB from '../backend/src/config/db.js';
import { User } from '../backend/src/models/User.js';
import { initDatabase } from '../backend/src/config/initDB.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await initDatabase();
    
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
}
