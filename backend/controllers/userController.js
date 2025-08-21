import userService from '../services/userService.js';

const userController = {
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers(req.user, req.query);
            res.json(users);
        } catch (err) { next(err); }
    },
    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id, req.user);
            res.json(user);
        } catch (err) { next(err); }
    },
    async updateUserProfile(req, res, next) {
        try {
            const user = await userService.updateUserProfile(req.params.id, req.body, req.user);
            res.json(user);
        } catch (err) { next(err); }
    },
    async changePassword(req, res, next) {
        try {
            await userService.changePassword(req.params.id, req.body, req.user);
            res.json({ message: 'Password changed' });
        } catch (err) { next(err); }
    },
    async deleteUserAccount(req, res, next) {
        try {
            await userService.deleteUserAccount(req.params.id, req.user);
            res.json({ message: 'User deleted' });
        } catch (err) { next(err); }
    },
    async getUserStats(req, res, next) {
        try {
            const stats = await userService.getUserStats(req.params.id, req.user);
            res.json(stats);
        } catch (err) { next(err); }
    },
    async uploadAvatar(req, res, next) {
        try {
            const user = await userService.uploadAvatar(req.params.id, req, req.user);
            res.json(user);
        } catch (err) { next(err); }
    }
};

export default userController;
