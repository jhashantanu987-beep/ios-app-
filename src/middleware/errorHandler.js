import logger from '../utils/logger.js';
import { HTTP_STATUS, MESSAGES } from '../utils/constants.js';

/**
 * Global Error Handler Middleware
 * Catches and formats all errors
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled exception caught in middleware', err);

  // Default error response
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  let message = err.message || MESSAGES.ERROR;
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    errors = [
      {
        field,
        message: `${field} already exists`,
      },
    ];
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.INVALID_TOKEN;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_EXPIRED;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
