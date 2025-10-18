import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or fallback to a test database
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://xstream:xstream123@cluster0.mongodb.net/xstream?retryWrites=true&w=majority';
    
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
