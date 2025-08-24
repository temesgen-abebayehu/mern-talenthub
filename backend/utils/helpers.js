import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../config/constants.js';

export const generateTokens = (user) => {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    return { token, refreshToken };
};

export const generateResetToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyResetToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

// Email verification token (valid for 24h)
export const generateVerificationToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyVerificationToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
