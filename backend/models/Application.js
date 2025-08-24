import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    content: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: Date
});

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['applied', 'reviewed', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
    resume: String,
    coverLetter: String,
    education: String,
    gender: { type: String, enum: ['male', 'female'] },
    notes: [noteSchema],
    rating: Number,
    feedback: String,
    interviewDate: Date
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
