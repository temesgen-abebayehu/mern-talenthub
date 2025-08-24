import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validation.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// @route   POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// @route   POST /api/auth/logout
router.post('/logout', auth, authController.logout);

// @route   POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);

// @route   POST /api/auth/reset-password
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// @route   POST /api/auth/verify-email
router.get('/verify-email', authController.verifyEmail);

// Admin: approve/reject company (should be protected by admin middleware in real use)
router.post('/approve-company', authController.approveCompany);
router.post('/reject-company', authController.rejectCompany);

export default router;
