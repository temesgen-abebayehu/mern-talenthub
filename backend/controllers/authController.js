import * as authService from '../services/authService.js';
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
        res.json({ user });
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


// Email verification
export const verifyEmail = async (req, res, next) => {
    try {
        // Accept token from query (?token=...) or body
        const token = req.query.token || req.body.token;
        if (!token) return res.status(400).json({ message: 'Verification token is required.' });
        const result = await authService.verifyEmail(token);
        res.json(result);
    } catch (err) { next(err); }
};

// Admin: approve company
export const approveCompany = async (req, res, next) => {
    try {
        const { companyId, adminId } = req.body;
        const result = await authService.approveCompany(companyId, adminId);
        res.json(result);
    } catch (err) { next(err); }
};

// Admin: reject company
export const rejectCompany = async (req, res, next) => {
    try {
        const { companyId, adminId, reason } = req.body;
        const result = await authService.rejectCompany(companyId, adminId, reason);
        res.json(result);
    } catch (err) { next(err); }
};
