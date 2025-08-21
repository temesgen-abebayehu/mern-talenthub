import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['applicant', 'employer', 'admin'] },
    avatar: String,
    bio: String,
    skills: [String],
    resume: String,
    company: String,
    website: String,
    location: String,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
