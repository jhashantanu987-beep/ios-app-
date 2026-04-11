import express from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import validateRequest from "../middleware/validation.js";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
} from "../utils/validators.js";

const router = express.Router();

/**
 * Auth Routes
 */

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'auth route working' });
});

// Public routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put(
  '/profile',
  authMiddleware,
  updateProfileValidation,
  validateRequest,
  authController.updateProfile
);
router.post(
  '/change-password',
  authMiddleware,
  changePasswordValidation,
  validateRequest,
  authController.changePassword
);

export default router;
