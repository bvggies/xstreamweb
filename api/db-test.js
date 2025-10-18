import connectDB from '../backend/src/config/db.js';

export default async function handler(req, res) {
  try {
    // Test database connection
    await connectDB();
    
    res.status(200).json({ 
      message: 'Database connection successful!',
      database: 'PostgreSQL (Neon)',
      timestamp: new Date().toISOString(),
      status: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
