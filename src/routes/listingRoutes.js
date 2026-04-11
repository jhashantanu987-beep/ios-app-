const express = require('express');
const listingController = require('../controllers/listingController');
const { authMiddleware } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { createListingValidation } = require('../utils/validators');

const router = express.Router();

/**
 * Listing Routes
 */

router.post(
  '/',
  authMiddleware,
  createListingValidation,
  validateRequest,
  listingController.createListing
);

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListing);

module.exports = router;
