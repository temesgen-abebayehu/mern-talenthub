import { body, param, query } from 'express-validator';

export const validateJob = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array'),
    body('skills').isArray().withMessage('Skills must be an array'),
    body('type').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type'),
    body('experience').notEmpty().withMessage('Experience is required'),
];

export const validateJobUpdate = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type'),
    body('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
];

export const validateJobId = [
    param('id').isMongoId().withMessage('Invalid job ID'),
];

export const validateJobSearch = [
    query('title').optional().isString(),
    query('location').optional().isString(),
    query('skills').optional().isString(),
];
