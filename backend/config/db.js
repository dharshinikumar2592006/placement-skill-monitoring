const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Targets database: placementDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementDB';
    
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'placementDB', // Explicitly connects to placementDB
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error('Please verify your MONGODB_URI in backend/.env file.');
    // Exit process with failure if DB connection cannot be established
    process.exit(1);
  }
};

module.exports = connectDB;
