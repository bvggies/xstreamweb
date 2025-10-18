import pkg from 'pg';
const { Pool } = pkg;

// Cache the connection to avoid multiple connections in serverless
let cached = global.pg;

if (!cached) {
  cached = global.pg = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      console.log('✅ Using existing PostgreSQL connection');
      return cached.conn;
    }

    if (!cached.promise) {
      // Use environment variable or fallback to Neon database
      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require';
      
      console.log('Connecting to PostgreSQL...');
      
      const pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      cached.promise = pool.connect().then((client) => {
        console.log('✅ PostgreSQL Connected');
        return pool;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Make sure to set DATABASE_URL in your .env file');
    throw error;
  }
};

export default connectDB;