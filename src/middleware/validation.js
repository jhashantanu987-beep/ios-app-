import { validationResult } from 'express-validator';

const createValidationError = (errors) => {
  const error = new Error('Validation Error');
  error.statusCode = 400;
  error.errors = errors;
  return error;
};

/**
 * Validation Error Handler Middleware
 * Captures validation errors from express-validator
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return next(createValidationError(formattedErrors));
  }

  next();
};

export default validateRequest;
