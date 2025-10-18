// Simple in-memory database for testing
let users = [];
let matches = [];
let subscriptions = [];

// Mock database functions
export const mockDB = {
  users: {
    findOne: (query) => {
      if (query.email) {
        return users.find(u => u.email === query.email);
      }
      if (query._id) {
        return users.find(u => u._id === query._id);
      }
      return null;
    },
    findById: (id) => {
      return users.find(u => u._id === id);
    },
    create: (userData) => {
      const user = {
        _id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
      };
      users.push(user);
      return user;
    },
    findByIdAndUpdate: (id, update) => {
      const userIndex = users.findIndex(u => u._id === id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...update };
        return users[userIndex];
      }
      return null;
    }
  },
  matches: {
    find: (query = {}) => {
      if (query.status) {
        return matches.filter(m => m.status === query.status);
      }
      return matches;
    },
    findById: (id) => {
      return matches.find(m => m._id === id);
    },
    create: (matchData) => {
      const match = {
        _id: Date.now().toString(),
        ...matchData,
        createdAt: new Date()
      };
      matches.push(match);
      return match;
    },
    findByIdAndUpdate: (id, update) => {
      const matchIndex = matches.findIndex(m => m._id === id);
      if (matchIndex !== -1) {
        matches[matchIndex] = { ...matches[matchIndex], ...update };
        return matches[matchIndex];
      }
      return null;
    },
    findByIdAndDelete: (id) => {
      const matchIndex = matches.findIndex(m => m._id === id);
      if (matchIndex !== -1) {
        return matches.splice(matchIndex, 1)[0];
      }
      return null;
    },
    countDocuments: (query = {}) => {
      if (query.status) {
        return matches.filter(m => m.status === query.status).length;
      }
      return matches.length;
    }
  },
  subscriptions: {
    find: (query = {}) => {
      if (query.userId) {
        return subscriptions.filter(s => s.userId === query.userId);
      }
      return subscriptions;
    },
    findOne: (query) => {
      if (query.reference) {
        return subscriptions.find(s => s.reference === query.reference);
      }
      return null;
    },
    create: (subData) => {
      const sub = {
        _id: Date.now().toString(),
        ...subData,
        createdAt: new Date()
      };
      subscriptions.push(sub);
      return sub;
    }
  }
};

// Initialize with sample data
export const initializeMockDB = () => {
  // Sample users
  users = [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@xstream.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // admin123
      role: 'admin',
      subscription: {
        plan: 'premium',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Test User',
      email: 'user@xstream.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // user123
      role: 'user',
      subscription: {
        plan: 'free'
      },
      createdAt: new Date()
    }
  ];

  // Sample matches
  matches = [
    {
      _id: '1',
      title: 'Manchester United vs Liverpool',
      league: 'Premier League',
      kickoff_time: new Date(Date.now() + 2 * 60 * 60 * 1000),
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
      stream_links: [
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
      ],
      status: 'upcoming',
      home_team: 'Manchester United',
      away_team: 'Liverpool',
      score: { home: 0, away: 0 },
      createdAt: new Date()
    },
    {
      _id: '2',
      title: 'Chelsea vs Arsenal',
      league: 'Premier League',
      kickoff_time: new Date(Date.now() - 1 * 60 * 60 * 1000),
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
      stream_links: [
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
      ],
      status: 'live',
      home_team: 'Chelsea',
      away_team: 'Arsenal',
      score: { home: 2, away: 1 },
      createdAt: new Date()
    }
  ];

  console.log('✅ Mock database initialized with sample data');
};

export default mockDB;
