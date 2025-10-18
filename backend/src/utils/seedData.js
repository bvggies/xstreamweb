import User from '../models/User.js';
import Match from '../models/Match.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@xstream.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@xstream.com',
        password: hashedPassword,
        role: 'admin',
        subscription: {
          plan: 'premium',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create test user
    const userExists = await User.findOne({ email: 'user@xstream.com' });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      const user = new User({
        name: 'Test User',
        email: 'user@xstream.com',
        password: hashedPassword,
        role: 'user',
        subscription: {
          plan: 'free'
        }
      });
      await user.save();
      console.log('✅ Test user created');
    }

    // Create sample matches
    const matchCount = await Match.countDocuments();
    if (matchCount === 0) {
      const sampleMatches = [
        {
          title: 'Manchester United vs Liverpool',
          league: 'Premier League',
          kickoff_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
          stream_links: [
            'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
          ],
          status: 'upcoming',
          home_team: 'Manchester United',
          away_team: 'Liverpool',
          score: { home: 0, away: 0 }
        },
        {
          title: 'Barcelona vs Real Madrid',
          league: 'La Liga',
          kickoff_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
          stream_links: [
            'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
          ],
          status: 'upcoming',
          home_team: 'Barcelona',
          away_team: 'Real Madrid',
          score: { home: 0, away: 0 }
        },
        {
          title: 'Chelsea vs Arsenal',
          league: 'Premier League',
          kickoff_time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
          stream_links: [
            'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
          ],
          status: 'live',
          home_team: 'Chelsea',
          away_team: 'Arsenal',
          score: { home: 2, away: 1 }
        },
        {
          title: 'PSG vs Bayern Munich',
          league: 'Champions League',
          kickoff_time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
          stream_links: [
            'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
            'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
          ],
          status: 'ended',
          home_team: 'PSG',
          away_team: 'Bayern Munich',
          score: { home: 1, away: 3 }
        }
      ];

      for (const matchData of sampleMatches) {
        const match = new Match(matchData);
        await match.save();
      }
      console.log('✅ Sample matches created');
    }

    console.log('🎉 Database seeding completed!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@xstream.com / admin123');
    console.log('User: user@xstream.com / user123');
    console.log('\n🔗 Test Stream URLs are included in sample matches');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
