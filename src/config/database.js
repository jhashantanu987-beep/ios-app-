const mongoose = require('mongoose');
const dns = require('dns');

// Ensure Node uses reliable DNS servers for MongoDB Atlas SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB database
 * Handles connection events and error management
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('MONGO_URI:', process.env.MONGO_URI);

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('✗ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`✗ MongoDB connection error: ${error.message}`);
});

module.exports = connectDB;
