import mongoose from 'mongoose';

// Cache the connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      console.log('✅ Using existing MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      // Use environment variable or fallback to a test database
      const mongoURI = process.env.MONGO_URI || 'mongodb+srv://techarenagroupe_db_user:wY6hgZ7JSKBOvBzc@xstream.yej6c4l.mongodb.net/?retryWrites=true&w=majority&appName=xstream';
      
      console.log('Connecting to MongoDB...');
      
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Make sure to set MONGO_URI in your .env file');
    throw error;
  }
};

export default connectDB;
