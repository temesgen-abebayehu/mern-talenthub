import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../config/constants.js';
import { sendResetPasswordEmail } from './emailService.js';
import Company from '../models/Company.js';
import { sendVerificationEmail, sendCompanyApprovalEmail } from './emailService.js';
import { generateTokens, generateResetToken, verifyResetToken, generateVerificationToken, verifyVerificationToken } from '../utils/helpers.js';

export const register = async (data) => {
    const { name, email, password, role } = data;
    let user = await User.findOne({ email });
    if (user) throw new Error('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    let userData = { name, email, password: hashedPassword, role, isVerified: false };
    user = await User.create(userData);
    const verificationToken = generateVerificationToken(user);
    await sendVerificationEmail(user.email, verificationToken);
    return { message: 'Registration successful. Please verify your email.' };
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Please verify your email before logging in.');
    // Company approval is now per company, not per user
    const tokens = generateTokens(user);
    return { user, ...tokens };
};

export const verifyEmail = async (token) => {
    // Use JWT to verify token and extract user ID
    let payload;
    try {
        payload = verifyVerificationToken(token);
    } catch (err) {
        throw new Error('Invalid or expired verification token');
    }
    const user = await User.findById(payload.id);
    if (!user) throw new Error('User not found');
    if (user.isVerified) return { message: 'Email already verified.' };
    user.isVerified = true;
    await user.save();
    return { message: 'Email verified successfully.' };
};

export const approveCompany = async (companyId, adminId) => {
    const company = await Company.findById(companyId);
    if (!company) throw new Error('Company not found');
    if (company.status !== 'pending') throw new Error('Company already processed');
    company.status = 'approved';
    company.isActive = true;
    company.approvedBy = adminId;
    company.approvedAt = new Date();
    await company.save();
    const user = await User.findOne({ company: company._id });
    if (user) {
        user.isCompanyApproved = true;
        await user.save();
        await sendCompanyApprovalEmail(user.email, true);
    }
    return { message: 'Company approved.' };
};

export const rejectCompany = async (companyId, adminId, reason) => {
    const company = await Company.findById(companyId);
    if (!company) throw new Error('Company not found');
    if (company.status !== 'pending') throw new Error('Company already processed');
    company.status = 'rejected';
    company.isActive = false;
    company.rejectedAt = new Date();
    company.rejectionReason = reason;
    await company.save();
    const user = await User.findOne({ company: company._id });
    if (user) {
        user.isCompanyApproved = false;
        await user.save();
        await sendCompanyApprovalEmail(user.email, false, reason);
    }
    return { message: 'Company rejected.' };
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
