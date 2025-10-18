import app from './app.js';
import connectDB from './config/db.js';
import cron from 'node-cron';
import { updateLiveScores, updateUpcomingFixtures } from './services/apiFootballService.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
  // Seed database with sample data
  seedDatabase();
}).catch((error) => {
  console.log('⚠️  Database connection failed, but server will continue...');
  console.log('💡 You can still test the frontend, but some features may not work');
});

// Schedule live score updates every 30 seconds
cron.schedule('*/30 * * * * *', updateLiveScores);

// Schedule fixture updates every hour
cron.schedule('0 * * * *', updateUpcomingFixtures);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Xstream Server running on port ${PORT}`);
  console.log(`📊 Live scores updating every 30 seconds`);
  console.log(`📅 Fixtures updating every hour`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
