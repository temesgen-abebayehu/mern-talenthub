import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// GET /api/users/ - Get all users (Admin only)
router.get('/', auth, userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', auth, userController.getUserById);

// PUT /api/users/:id - Update user profile
router.put('/:id', auth, userController.updateUserProfile);

// PUT /api/users/:id/password - Change password
router.put('/:id/password', auth, userController.changePassword);

// DELETE /api/users/:id - Delete user account
router.delete('/:id', auth, userController.deleteUserAccount);

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', auth, userController.getUserStats);

// POST /api/users/:id/upload-avatar - Upload profile picture
router.post('/:id/upload-avatar', auth, userController.uploadAvatar);

export default router;
