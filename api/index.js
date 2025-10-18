import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Connect to database when the serverless function starts
connectDB().catch(console.error);

export default app;
