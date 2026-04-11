/**
 * Application Constants
 */

// Categories
exports.LISTING_CATEGORIES = [
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
exports.LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  INACTIVE: 'inactive',
};

// Item Condition
exports.ITEM_CONDITION = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
};

// User Roles
exports.USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// HTTP Status Codes
exports.HTTP_STATUS = {
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
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 12;
exports.MAX_LIMIT = 100;

// Password Requirements
exports.PASSWORD_RULES = {
  MIN_LENGTH: 6,
  PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
};

// Token Expiry
exports.TOKEN_EXPIRY = {
  SHORT: '1h',
  STANDARD: '7d',
  LONG: '30d',
};

// File Upload
exports.UPLOAD_LIMITS = {
  IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// String Limits
exports.STRING_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000,
  BIO_MAX: 500,
};

// API Messages
exports.MESSAGES = {
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
