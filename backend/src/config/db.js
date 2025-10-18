import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or fallback to a test database
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://techarenagroupe_db_user:wY6hgZ7JSKBOvBzc@xstream.yej6c4l.mongodb.net/?retryWrites=true&w=majority&appName=xstream';
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Make sure to set MONGO_URI in your .env file');
    throw error; // Let the caller handle the error
  }
};

export default connectDB;
