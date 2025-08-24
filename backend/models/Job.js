import mongoose from 'mongoose';


const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    skills: [String],
    location: { type: String, enum: ['remote', 'on-site', 'hybrid'], required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'contract'], required: true },
    status: { type: String, enum: ['active', 'closed', 'hired'], default: 'active' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicationCount: { type: Number, default: 0 },
    applicationDeadline: Date,
    isActive: { type: Boolean, default: true },
    // Optional fields
    category: String,
    experience: String,
    salary: Number,
    salaryType: { type: String, enum: ['hourly', 'monthly', 'yearly'] },
    tags: [String]
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
