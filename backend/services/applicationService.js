import Application from '../models/Application.js';

const applicationService = {
    async getAllApplications(user, query) {
        // Only admin
        return Application.find({});
    },
    async getUserApplications(userId, user) {
        // Only owner/applicant
        return Application.find({ userId });
    },
    async getJobApplicationsForJob(jobId, user) {
        // Only employer
        return Application.find({ jobId });
    },
    async getApplicationById(id, user) {
        return Application.findById(id);
    },
    async applyForJob(data, user) {
        return Application.create({ ...data, userId: user.id });
    },
    async updateApplicationStatus(id, status, user) {
        return Application.findByIdAndUpdate(id, { status }, { new: true });
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
