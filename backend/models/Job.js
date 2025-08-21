import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    skills: [String],
    location: String,
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'] },
    category: String,
    experience: String,
    salary: Number,
    salaryType: { type: String, enum: ['hourly', 'monthly', 'yearly'] },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    applicationCount: Number,
    isActive: { type: Boolean, default: true },
    isRemote: Boolean,
    applicationDeadline: Date
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
