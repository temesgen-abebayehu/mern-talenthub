import Job from '../models/Job.js';
import Application from '../models/Application.js';

const jobService = {
    async getAllJobs(query) {
        // Pagination
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        // Filters
        const filter = {};
        if (query.type) filter.type = query.type;
        if (query.location) filter.location = query.location;
        if (query.status) filter.status = query.status;
        if (query.company) filter.company = query.company;
        if (query.keywords) {
            filter.$or = [
                { title: { $regex: query.keywords, $options: 'i' } },
                { description: { $regex: query.keywords, $options: 'i' } }
            ];
        }
        const jobs = await Job.find(filter).skip(skip).limit(limit).populate('company');
        const total = await Job.countDocuments(filter);
        return { jobs, total, page, limit };
    },
    async getFeaturedJobs(query) {
        // Return featured jobs (e.g., by flag or sort)
        return Job.find({}).limit(query.limit || 5);
    },
    async getJobsByEmployer(employerId) {
        return Job.find({ createdBy: employerId });
    },
    async searchJobs(query) {
        // Reuse getAllJobs logic for search
        return this.getAllJobs(query);
    },
    async getJobById(id) {
        return Job.findById(id);
    },
    async createJob(data, userId) {
        // Find user and their company
        const user = await (await import('../models/User.js')).default.findById(userId).populate('company');
        if (!user || user.role !== 'companyOwner' || !user.isCompanyApproved) {
            throw new Error('Only approved company owners can create jobs');
        }
        if (!user.company) throw new Error('Company not found for user');
        return Job.create({ ...data, createdBy: userId, company: user.company._id });
    },
    async updateJob(id, data, userId) {
        // Find user
        const user = await (await import('../models/User.js')).default.findById(userId);
        const job = await Job.findById(id);
        if (!job) throw new Error('Job not found');
        // Only company owner who created the job or admin can update
        if (user.role === 'admin' || (user.role === 'companyOwner' && job.createdBy.toString() === userId)) {
            // Only allow status update to allowed values
            if (data.status && !['active', 'closed', 'hired'].includes(data.status)) {
                throw new Error('Invalid job status');
            }
            Object.assign(job, data);
            await job.save();
            return job;
        }
        throw new Error('Not authorized to update this job');
    },
    async deleteJob(id, userId) {
        const user = await (await import('../models/User.js')).default.findById(userId);
        const job = await Job.findById(id);
        if (!job) throw new Error('Job not found');
        if (user.role === 'admin' || (user.role === 'companyOwner' && job.createdBy.toString() === userId)) {
            await job.deleteOne();
            return true;
        }
        throw new Error('Not authorized to delete this job');
    },
    async getJobApplications(jobId, userId) {
        const user = await (await import('../models/User.js')).default.findById(userId);
        const job = await Job.findById(jobId);
        if (!job) throw new Error('Job not found');
        // Only company owner who created the job or admin can view
        if (user.role === 'admin' || (user.role === 'companyOwner' && job.createdBy.toString() === userId)) {
            return Application.find({ jobId });
        }
        throw new Error('Not authorized to view applications for this job');
    },
    async getJobAnalytics(jobId, userId) {
        // Return analytics (e.g., application count)
        const count = await Application.countDocuments({ jobId });
        return { applicationCount: count };
    }
};

export default jobService;
