/**
 * Utility Helper Functions
 */

/**
 * Generate pagination object
 */
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

/**
 * Build filter object based on query params
 */
export const buildFilter = (queryParams) => {
  const filter = {};

  if (queryParams.category && queryParams.category !== 'all') {
    filter.category = queryParams.category;
  }

  if (queryParams.status) {
    filter.status = queryParams.status;
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    filter.price = {};
    if (queryParams.minPrice) {
      filter.price.$gte = Number(queryParams.minPrice);
    }
    if (queryParams.maxPrice) {
      filter.price.$lte = Number(queryParams.maxPrice);
    }
  }

  if (queryParams.city) {
    filter['location.city'] = { $regex: queryParams.city, $options: 'i' };
  }

  return filter;
};

/**
 * Check if user is authorized
 */
export const isOwner = (resourceOwnerId, userId) => {
  return resourceOwnerId.toString() === userId;
};

/**
 * Format response object
 */
export const formatResponse = (success, message, data = null, errors = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  if (errors) {
    response.errors = errors;
  }

  return response;
};

/**
 * Calculate rating average
 */
export const calculateRatingAverage = (ratings) => {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  return (total / ratings.length).toFixed(1);
};

/**
 * Sanitize user object
 */
export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

/**
 * Parse sort string (e.g., "-createdAt" -> {createdAt: -1})
 */
export const parseSortString = (sortString) => {
  const sortObj = {};

  if (!sortString) return { createdAt: -1 };

  const sortFields = sortString.split(',');
  sortFields.forEach((field) => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });

  return sortObj;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};
