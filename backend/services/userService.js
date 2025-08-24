import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

const userService = {
    async getAllUsers(user, query) {
        // Only admin
        return User.find({});
    },
    async getUserById(id, user) {
        return User.findById(id);
    },
    async updateUserProfile(id, data, user) {
        return User.findByIdAndUpdate(id, data, { new: true });
    },
    async changePassword(id, data, user) {
        // Implement password change logic
        return true;
    },
    async deleteUserAccount(id, user) {
        return User.findByIdAndDelete(id);
    },
    async getUserStats(id, user) {
        // Return user stats (stub)
        return { jobsApplied: 0, jobsPosted: 0 };
    },
    async uploadAvatar(id, req, user) {
        // Check if file is present
        if (!req.files || !req.files.avatar) {
            throw new Error('No avatar file uploaded');
        }
        const file = req.files.avatar;
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
            folder: 'avatars',
            public_id: `user_${id}`,
            overwrite: true,
            resource_type: 'image',
        });
        // Update user avatar URL
        const userDoc = await User.findByIdAndUpdate(
            id,
            { avatar: result.secure_url },
            { new: true }
        );
        return { ...userDoc.toObject(), avatarUrl: result.secure_url };
    }
};

export default userService;
