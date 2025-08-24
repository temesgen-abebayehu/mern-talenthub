import Application from '../models/Application.js';

const applicationService = {
    async getAllApplications(user, query) {
        if (user.role !== 'admin') throw new Error('Not authorized');
        return Application.find({});
    },
    async getUserApplications(userId, user) {
        if (user.role !== 'admin' && user.id !== userId) throw new Error('Not authorized');
        return Application.find({ userId });
    },
    async getJobApplicationsForJob(jobId, user) {
        // Only company owner for their job or admin
        const job = await (await import('../models/Job.js')).default.findById(jobId);
        if (!job) throw new Error('Job not found');
        if (user.role !== 'admin' && !(user.role === 'companyOwner' && job.createdBy.toString() === user.id)) {
            throw new Error('Not authorized');
        }
        return Application.find({ jobId });
    },
    async getApplicationById(id, user) {
        const app = await Application.findById(id);
        if (!app) throw new Error('Application not found');
        if (user.role === 'admin' || app.userId.toString() === user.id) return app;
        // Check if user is company owner for the job
        const job = await (await import('../models/Job.js')).default.findById(app.jobId);
        if (user.role === 'companyOwner' && job && job.createdBy.toString() === user.id) return app;
        throw new Error('Not authorized');
    },
    async applyForJob(data, user) {
        // Prevent duplicate applications
        const existing = await Application.findOne({ jobId: data.jobId, userId: user.id });
        if (existing) throw new Error('You have already applied for this job');
        // Only allow application to active jobs
        const job = await (await import('../models/Job.js')).default.findById(data.jobId);
        if (!job || job.status !== 'active') throw new Error('Job is not open for applications');
        return Application.create({ ...data, userId: user.id });
    },
    async updateApplicationStatus(id, status, user) {
        const app = await Application.findById(id);
        if (!app) throw new Error('Application not found');
        const job = await (await import('../models/Job.js')).default.findById(app.jobId);
        if (!job) throw new Error('Job not found');
        // Only company owner for their job or admin can update
        if (user.role !== 'admin' && !(user.role === 'companyOwner' && job.createdBy.toString() === user.id)) {
            throw new Error('Not authorized');
        }
        app.status = status;
        await app.save();
        return app;
    },
    async withdrawApplication(id, user) {
        return Application.findOneAndDelete({ _id: id, userId: user.id });
    },
    async addNoteToApplication(id, note, user) {
        return Application.findByIdAndUpdate(
            id,
            { $push: { notes: { content: note, addedBy: user.id, addedAt: new Date() } } },
            { new: true }
        );
    }
};

export default applicationService;
