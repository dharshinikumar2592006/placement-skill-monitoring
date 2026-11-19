const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Targets database: placementDB
 */
const connectDB = async () => {
  let rawURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementDB';

  // Sanitize URI: Trim whitespace and strip any accidental outer quotes
  let mongoURI = rawURI.trim();
  if (
    (mongoURI.startsWith('"') && mongoURI.endsWith('"')) ||
    (mongoURI.startsWith("'") && mongoURI.endsWith("'"))
  ) {
    mongoURI = mongoURI.slice(1, -1).trim();
  }

  // Validate scheme
  const isValidScheme =
    mongoURI.startsWith('mongodb://') || mongoURI.startsWith('mongodb+srv://');

  if (!isValidScheme) {
    console.error('====================================================');
    console.error('[MongoDB Configuration Error]:');
    console.error(`Received MONGODB_URI: "${rawURI}"`);
    console.error('The connection string MUST start with either:');
    console.error('  - "mongodb+srv://" (MongoDB Atlas Cloud)');
    console.error('  - "mongodb://" (Local or direct MongoDB server)');
    console.error('');
    console.error('If deploying on Render, please go to your Render Web Service ->');
    console.error('"Environment" tab and set MONGODB_URI to your actual MongoDB Atlas connection string:');
    console.error('Example: mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/placementDB?retryWrites=true&w=majority');
    console.error('====================================================');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'placementDB', // Explicitly connects to placementDB
      serverSelectionTimeoutMS: 8000 // 8 second timeout before failing gracefully
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('====================================================');
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error('Common causes:');
    console.error(' 1. Incorrect password or username in MONGODB_URI');
    console.error(' 2. Network Access in MongoDB Atlas not allowing IP 0.0.0.0/0 (Allow Access from Anywhere)');
    console.error(' 3. Cluster is paused or database user has insufficient privileges');
    console.error('====================================================');
    process.exit(1);
  }
};

module.exports = connectDB;
