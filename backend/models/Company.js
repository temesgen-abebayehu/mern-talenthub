import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    legalDetails: { type: String, required: true }, // e.g., registration number
    documents: [String], // file paths or URLs
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'deactivated'], default: 'pending' },
    isActive: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Company = mongoose.model('Company', companySchema);
export default Company;
