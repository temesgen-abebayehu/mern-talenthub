import authService from '../services/authService.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.json(user);
    } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.json({ message: 'Logged out successfully' });
    } catch (err) { next(err); }
};

export const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.body.refreshToken);
        res.json(result);
    } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        await authService.forgotPassword(req.body.email);
        res.json({ message: 'Password reset email sent' });
    } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        await authService.resetPassword(req.body.token, req.body.newPassword);
        res.json({ message: 'Password reset successful' });
    } catch (err) { next(err); }
};
