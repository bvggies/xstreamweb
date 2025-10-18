import connectDB from '../backend/src/config/db.js';
import pkg from 'pg';
const { Pool } = pkg;

export default async function handler(req, res) {
  try {
    // Test database connection
    await connectDB();
    
    res.status(200).json({ 
      message: 'Backend is working!',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      database: 'PostgreSQL'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Backend error',
      database: 'Failed to connect',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}