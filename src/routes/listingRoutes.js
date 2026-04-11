import express from 'express';
import * as listingController from '../controllers/listingController.js';
import { authMiddleware } from '../middleware/auth.js';
import validateRequest from '../middleware/validation.js';
import { createListingValidation } from '../utils/validators.js';

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

export default router;
