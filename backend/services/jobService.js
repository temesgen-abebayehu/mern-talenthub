import Job from '../models/Job.js';
import Application from '../models/Application.js';

const jobService = {
    async getAllJobs(query) {
        // Implement pagination, search, filters
        return Job.find({});
    },
    async getFeaturedJobs(query) {
        // Return featured jobs (e.g., by flag or sort)
        return Job.find({}).limit(query.limit || 5);
    },
    async getJobsByEmployer(employerId) {
        return Job.find({ createdBy: employerId });
    },
    async searchJobs(query) {
        // Implement full-text search and filters
        return Job.find({});
    },
    async getJobById(id) {
        return Job.findById(id);
    },
    async createJob(data, userId) {
        return Job.create({ ...data, createdBy: userId });
    },
    async updateJob(id, data, userId) {
        return Job.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
    },
    async deleteJob(id, userId) {
        return Job.findOneAndDelete({ _id: id, createdBy: userId });
    },
    async getJobApplications(jobId, userId) {
        // Only employer who created the job can view
        return Application.find({ jobId });
    },
    async getJobAnalytics(jobId, userId) {
        // Return analytics (e.g., application count)
        const count = await Application.countDocuments({ jobId });
        return { applicationCount: count };
    }
};

export default jobService;
