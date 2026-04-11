import express from "express";
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  updateProfileValidation,
} = require('../utils/validators');

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
