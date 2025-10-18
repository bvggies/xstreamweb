import connectDB from '../../src/config/db.js';
import { User } from '../../src/models/User.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
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
}
