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

import cloudinary from '../config/cloudinary.js';

export const registerCompany = async (userId, data, files) => {
    const user = await User.findById(userId);
    if (!user || user.role !== 'companyOwner') throw new Error('Only company owners can register companies');

    const { name, legalDetails } = data;
    if (!name || !legalDetails) {
        throw new Error('Company name and legal details are required');
    }

    // Handle document uploads
    let documentUrls = [];
    if (files && files.documents) {
        const docs = Array.isArray(files.documents) ? files.documents : [files.documents];
        for (const doc of docs) {
            // Extract original filename and extension
            const originalName = doc.name || doc.originalname || 'document';
            const ext = originalName.split('.').pop();
            const publicId = `company_documents/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const uploadResult = await cloudinary.uploader.upload(doc.tempFilePath || doc.path, {
                folder: 'company_documents',
                resource_type: 'raw',
                public_id: publicId,
                use_filename: true,
                unique_filename: false,
            });
            documentUrls.push(uploadResult.secure_url);
        }
    }

    if (documentUrls.length === 0) {
        throw new Error('At least one legal document must be uploaded');
    }

    const company = await Company.create({
        name,
        owner: user._id,
        legalDetails,
        documents: documentUrls,
        status: 'pending',
        isActive: false
    });

    // Optionally notify admin or user
    // await sendCompanyApprovalEmail(user.email, false, 'Pending approval');

    return company;
};
