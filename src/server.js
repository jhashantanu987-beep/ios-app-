import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    console.log('Loaded environment variables:');
    console.log('MONGO_URI exists:', Boolean(process.env.MONGO_URI));

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.success('Server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        apiBaseUrl: `/api`,
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`✗ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', () => {
      console.log('✓ SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`✗ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
