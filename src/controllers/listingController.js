const Listing = require('../models/Listing');
const { formatResponse, isOwner } = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Create Listing
 * POST /api/listings
 * Requires authentication
 */
exports.createListing = async (req, res, next) => {
  try {
    const { title, description, price, images, location } = req.body;

    const listing = await Listing.create({
      title,
      description,
      price,
      images,
      location,
      userId: req.user.id,
    });

    await listing.populate('userId', 'name email');

    return res.status(HTTP_STATUS.CREATED).json(
      formatResponse(true, 'Listing created successfully', { listing })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Listings
 * GET /api/listings
 */
exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .populate('userId', 'name email')
      .sort('-createdAt');

    return res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Listings retrieved successfully', { listings })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Listing by ID
 * GET /api/listings/:id
 */
exports.getListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate('userId', 'name email');

    if (!listing) {
      return next(
        Object.assign(new Error('Listing not found'), { statusCode: HTTP_STATUS.NOT_FOUND })
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Listing retrieved successfully', { listing })
    );
  } catch (error) {
    next(error);
  }
};

// Ownership helper reserved for future update/delete authorization checks
const checkListingOwnership = (resourceOwnerId, userId) => {
  return isOwner(resourceOwnerId, userId);
};

