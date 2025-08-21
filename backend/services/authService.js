import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../config/constants.js';
import { sendResetPasswordEmail } from './emailService.js';
import { generateTokens, generateResetToken, verifyResetToken } from '../utils/helpers.js';

export const register = async ({ name, email, password, role }) => {
    let user = await User.findOne({ email });
    if (user) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword, role });
    const tokens = generateTokens(user);
    return { user, ...tokens };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const tokens = generateTokens(user);
    return { user, ...tokens };
};

export const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const logout = async (userId) => {
    // For stateless JWT, logout is handled on client. Optionally, implement token blacklist.
    return true;
};

export const refreshToken = async (refreshToken) => {
    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);
        if (!user) throw new Error('User not found');
        const tokens = generateTokens(user);
        return { user, ...tokens };
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const resetToken = generateResetToken(user);
    await sendResetPasswordEmail(user.email, resetToken);
    return true;
};

export const resetPassword = async (token, newPassword) => {
    const payload = verifyResetToken(token);
    const user = await User.findById(payload.id);
    if (!user) throw new Error('Invalid or expired token');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
};
