import connectDB from './db.js';

export const initDatabase = async () => {
  try {
    const pool = await connectDB();
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        subscription_plan VARCHAR(50) DEFAULT 'free',
        subscription_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create matches table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        league VARCHAR(255),
        kickoff_time TIMESTAMP NOT NULL,
        thumbnail TEXT,
        stream_links TEXT[],
        status VARCHAR(50) DEFAULT 'upcoming',
        api_football_id INTEGER,
        home_team VARCHAR(255),
        away_team VARCHAR(255),
        score_home INTEGER DEFAULT 0,
        score_away INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(50) NOT NULL,
        reference VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};
