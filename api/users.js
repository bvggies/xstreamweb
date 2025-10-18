import connectDB from '../backend/src/config/db.js';
import { User } from '../backend/src/models/User.js';
import { initDatabase } from '../backend/src/config/initDB.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    await initDatabase();
    
    const userCount = await User.count();
    const users = await User.findAll();
    
    res.json({
      message: 'Users endpoint working',
      userCount,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Users endpoint failed', 
      error: error.message 
    });
  }
}
