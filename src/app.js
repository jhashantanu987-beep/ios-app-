import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";

const app = express();

/**
 * Middleware Configuration
 */

// CORS configuration
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Root Test Route
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API running',
  });
});

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
console.log('Loading API routes...');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes mounted at /api/auth');
app.use('/api/listings', listingRoutes);
console.log('✓ Listing routes mounted at /api/listings');

/**
 * 404 Handler
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * Global Error Handler Middleware
 * Must be last
 */
app.use(errorHandler);

export default app;
