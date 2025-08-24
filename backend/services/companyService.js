import Company from '../models/Company.js';
import User from '../models/User.js';
import { sendCompanyApprovalEmail } from './emailService.js';

// Admin: approve or deny a company
export const reviewCompany = async (companyId, adminId, status, reason = '') => {
    if (!['approved', 'rejected'].includes(status)) throw new Error('Invalid status');
    const company = await Company.findById(companyId);
    if (!company) throw new Error('Company not found');
    if (company.status !== 'pending') throw new Error('Company already processed');

    company.status = status;
    company.isActive = status === 'approved';

    if (status === 'approved') {
        company.approvedBy = adminId;
        company.approvedAt = new Date();
    } else {
        company.rejectedAt = new Date();
        company.rejectionReason = reason;
    }

    await company.save();

    // Notify owner
    const user = await User.findById(company.owner);
    if (user) {
        await sendCompanyApprovalEmail(user.email, status === 'approved', reason);
    }

    return { message: `Company ${status}.` };
};

export const registerCompany = async (userId, data) => {
    const user = await User.findById(userId);
    if (!user || user.role !== 'companyOwner') throw new Error('Only company owners can register companies');

    const { name, legalDetails, documents } = data;
    if (!name || !legalDetails || !documents || !Array.isArray(documents) || documents.length === 0) {
        throw new Error('Company name, legal details, and documents are required');
    }

    const company = await Company.create({
        name,
        owner: user._id,
        legalDetails,
        documents,
        status: 'pending',
        isActive: false
    });

    // Optionally notify admin or user
    // await sendCompanyApprovalEmail(user.email, false, 'Pending approval');

    return company;
};
