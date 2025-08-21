import { body } from 'express-validator';

export const registerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('role').isIn(['applicant', 'employer', 'admin']).withMessage('Invalid role')
];

export const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

export const resetPasswordValidator = [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password min 6 chars')
];
