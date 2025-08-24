import * as companyService from '../services/companyService.js';
import Company from '../models/Company.js';

// Admin: approve or deny a company
export const reviewCompany = async (req, res, next) => {
    try {
        const { companyId, status, reason } = req.body;
        const adminId = req.user.id;
        const result = await companyService.reviewCompany(companyId, adminId, status, reason);
        res.json(result);
    } catch (err) { next(err); }
};

// List all companies owned by the logged-in companyOwner
export const getMyCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find({ owner: req.user.id });
        res.json(companies);
    } catch (err) { next(err); }
};

// Update a company (only by owner)
export const updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true }
        );
        if (!company) return res.status(404).json({ message: 'Company not found or not authorized' });
        res.json(company);
    } catch (err) { next(err); }
};

// Delete a company (only by owner)
export const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!company) return res.status(404).json({ message: 'Company not found or not authorized' });
        res.json({ message: 'Company deleted' });
    } catch (err) { next(err); }
};

export const registerCompany = async (req, res, next) => {
    try {
        const company = await companyService.registerCompany(req.user.id, req.body);
        res.status(201).json(company);
    } catch (err) { next(err); }
};
