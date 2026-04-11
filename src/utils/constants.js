/**
 * Application Constants
 */

// Categories
export const LISTING_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Furniture',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Other',
];

// Listing Status
export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  INACTIVE: 'inactive',
};

// Item Condition
export const ITEM_CONDITION = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const MAX_LIMIT = 100;

// Password Requirements
export const PASSWORD_RULES = {
  MIN_LENGTH: 6,
  PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
};

// Token Expiry
export const TOKEN_EXPIRY = {
  SHORT: '1h',
  STANDARD: '7d',
  LONG: '30d',
};

// File Upload
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// String Limits
export const STRING_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000,
  BIO_MAX: 500,
};

// API Messages
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Something went wrong',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input data',
  DUPLICATE_EMAIL: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
};
