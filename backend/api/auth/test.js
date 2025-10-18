import connectDB from '../../src/config/db.js';
import User from '../../src/models/User.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
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
}
